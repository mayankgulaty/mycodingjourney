# Building Real-time Data Pipelines at Scale: Lessons from Processing 10 Billion Records Daily

After spending over 8 years building data infrastructure at scale, including leading the migration of legacy data warehouses to modern cloud architectures at Citi, I've learned that building real-time data pipelines isn't just about choosing the right tools—it's about understanding the trade-offs and designing for failure.

In this post, I'll share practical lessons from building systems that process over 10 billion records daily, including architecture patterns, common pitfalls, and optimization techniques that actually work in production.

## The Challenge: Why Real-time Data Processing is Hard

When we talk about "real-time" data processing, we're really talking about three different things:

1. **True real-time** (sub-second latency): Event streaming with immediate processing
2. **Near real-time** (seconds to minutes): Micro-batch processing
3. **Operational real-time** (minutes to hours): Frequent batch updates

Most organizations don't need true real-time—and building for it when you don't need it creates unnecessary complexity and cost.

> **Info:** Before designing your pipeline, ask yourself: "What's the actual business requirement for data freshness?" The answer will dramatically simplify your architecture.

## Architecture Pattern: The Lambda Architecture Evolution

The classic Lambda architecture (batch + speed layers) has evolved. Here's what a modern real-time pipeline looks like:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Sources   │────▶│ Apache Kafka │────▶│ Spark       │
│ (Apps, DBs) │     │  (Ingestion) │     │ Streaming   │
└─────────────┘     └──────────────┘     └─────┬───────┘
                                               │
                    ┌──────────────────────────┴──────────┐
                    │                                     │
                    ▼                                     ▼
            ┌──────────────┐                    ┌──────────────┐
            │ Hot Storage  │                    │ Cold Storage │
            │  (Redis/     │                    │  (S3/Delta   │
            │   Druid)     │                    │   Lake)      │
            └──────────────┘                    └──────────────┘
```

### Key Components Explained

**1. Apache Kafka as the Central Nervous System**

Kafka isn't just a message queue—it's an immutable log that becomes your source of truth. This pattern enables:

- Replay of events when bugs are discovered
- Multiple consumers processing the same data differently
- Decoupling of producers and consumers

```python
# Example: Kafka producer with idempotent writes
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['kafka-1:9092', 'kafka-2:9092'],
    enable_idempotence=True,  # Exactly-once semantics
    acks='all',               # Wait for all replicas
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def publish_event(topic: str, event: dict, key: str):
    future = producer.send(
        topic,
        key=key.encode('utf-8'),
        value=event
    )
    # Block until sent (for critical events)
    future.get(timeout=10)
```

**2. Spark Structured Streaming for Processing**

Spark Structured Streaming provides exactly-once guarantees with checkpointing:

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

spark = SparkSession.builder \
    .appName("RealTimePipeline") \
    .config("spark.sql.streaming.checkpointLocation", "s3://bucket/checkpoints") \
    .getOrCreate()

# Define schema for incoming events
event_schema = StructType([
    StructField("event_id", StringType(), False),
    StructField("user_id", StringType(), False),
    StructField("event_type", StringType(), False),
    StructField("timestamp", TimestampType(), False),
    StructField("properties", MapType(StringType(), StringType()), True)
])

# Read from Kafka
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "user_events") \
    .option("startingOffsets", "latest") \
    .load()

# Parse and transform
events = df \
    .select(from_json(col("value").cast("string"), event_schema).alias("data")) \
    .select("data.*") \
    .withWatermark("timestamp", "10 minutes")  # Handle late data

# Aggregate by window
aggregated = events \
    .groupBy(
        window("timestamp", "5 minutes", "1 minute"),
        "event_type"
    ) \
    .agg(
        count("*").alias("event_count"),
        countDistinct("user_id").alias("unique_users")
    )

# Write to sink
query = aggregated \
    .writeStream \
    .outputMode("update") \
    .format("delta") \
    .option("checkpointLocation", "s3://bucket/checkpoints/aggregates") \
    .start("s3://bucket/aggregates")
```

## Production Lessons: What They Don't Tell You

### 1. Backpressure Will Happen—Plan for It

When downstream systems can't keep up, you have three options:

- **Drop messages** (not usually acceptable)
- **Buffer indefinitely** (you'll run out of memory)
- **Apply backpressure** (pause producers)

> **Warning:** Always set explicit rate limits and monitor queue depths. A 10x traffic spike shouldn't bring down your entire pipeline.

```python
# Spark Streaming rate limiting
spark.conf.set("spark.streaming.kafka.maxRatePerPartition", "10000")
spark.conf.set("spark.streaming.backpressure.enabled", "true")
```

### 2. Schema Evolution is Inevitable

Your data schema will change. Plan for it from day one:

- Use schema registry (Confluent or AWS Glue)
- Design schemas that are backward AND forward compatible
- Never remove required fields—deprecate them first

```python
# Example: Avro schema with backward compatibility
{
    "type": "record",
    "name": "UserEvent",
    "fields": [
        {"name": "event_id", "type": "string"},
        {"name": "user_id", "type": "string"},
        {"name": "event_type", "type": "string"},
        {"name": "timestamp", "type": "long"},
        # New optional field - backward compatible
        {"name": "session_id", "type": ["null", "string"], "default": null}
    ]
}
```

### 3. Monitoring is Not Optional

You need visibility into:

- **Lag**: How far behind is your consumer?
- **Throughput**: Events processed per second
- **Error rate**: Failed transformations/writes
- **Processing time**: P50, P95, P99 latencies

```python
# Custom metrics with Prometheus
from prometheus_client import Counter, Histogram, Gauge

events_processed = Counter(
    'pipeline_events_processed_total',
    'Total events processed',
    ['event_type', 'status']
)

processing_time = Histogram(
    'pipeline_processing_seconds',
    'Time spent processing events',
    buckets=[.001, .005, .01, .05, .1, .5, 1, 5]
)

consumer_lag = Gauge(
    'pipeline_consumer_lag',
    'Kafka consumer lag',
    ['partition']
)
```

## Optimization Techniques That Actually Work

### 1. Partition Strategy Matters

Poor partitioning is the #1 cause of pipeline performance issues:

```python
# Bad: All data goes to one partition
producer.send(topic, value=event)

# Good: Partition by business key for ordering guarantees
producer.send(topic, key=user_id.encode(), value=event)

# Better: Custom partitioner for hot key handling
class SkewAwarePartitioner:
    def __call__(self, key, all_partitions, available_partitions):
        # Route hot keys to dedicated partitions
        if key in hot_keys:
            return hash(key) % len(hot_partitions)
        return hash(key) % len(all_partitions)
```

### 2. Batch Wisely

Micro-batching reduces overhead but increases latency. Find your sweet spot:

```python
# Spark trigger options
.trigger(processingTime='10 seconds')  # Fixed interval
.trigger(once=True)                     # Process all available, then stop
.trigger(continuous='1 second')         # Experimental low-latency mode
```

### 3. Use Delta Lake for ACID Guarantees

Delta Lake gives you:
- ACID transactions on data lakes
- Schema enforcement and evolution
- Time travel for debugging
- Efficient upserts (MERGE)

```python
# Upsert pattern with Delta Lake
from delta.tables import DeltaTable

deltaTable = DeltaTable.forPath(spark, "s3://bucket/users")

deltaTable.alias("target").merge(
    updates.alias("source"),
    "target.user_id = source.user_id"
).whenMatchedUpdate(set={
    "last_active": "source.timestamp",
    "event_count": "target.event_count + 1"
}).whenNotMatchedInsert(values={
    "user_id": "source.user_id",
    "first_seen": "source.timestamp",
    "last_active": "source.timestamp",
    "event_count": "1"
}).execute()
```

## Cost Optimization: Because Budget Matters

At scale, small inefficiencies become expensive. Here's what worked for us:

1. **Right-size your Spark executors**: More small executors often outperform fewer large ones
2. **Use spot instances**: 70-90% cost savings for stateless processing
3. **Implement data lifecycle**: Move cold data to cheaper storage tiers
4. **Compress aggressively**: Snappy for speed, Zstd for size

```python
# Cost-optimized Spark configuration
spark.conf.set("spark.sql.files.maxPartitionBytes", "128m")
spark.conf.set("spark.sql.shuffle.partitions", "200")
spark.conf.set("spark.sql.parquet.compression.codec", "zstd")
```

## Conclusion: Start Simple, Iterate Fast

The best data pipeline is one that:

1. **Solves the actual business problem** (not a hypothetical future problem)
2. **Is observable** (you know when it breaks)
3. **Is evolvable** (you can change it without fear)

Don't start with the most complex architecture. Start with the simplest thing that works, measure everything, and optimize based on real data.

---

*Have questions about building data pipelines? Feel free to [reach out](/contact) or connect with me on [LinkedIn](https://linkedin.com/in/mayankgulaty).*

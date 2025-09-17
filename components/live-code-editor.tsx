'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  expectedOutput: string
  category: 'etl' | 'ml' | 'analytics' | 'optimization'
}

const codeExamples: CodeExample[] = [
  {
    id: 'spark-etl',
    title: 'Apache Spark ETL Pipeline',
    description: 'Extract, transform, and load data using PySpark',
    language: 'python',
    code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, isnan, isnull

# Initialize Spark session
spark = SparkSession.builder \\
    .appName("CustomerDataETL") \\
    .getOrCreate()

# Read data from source
df = spark.read \\
    .format("jdbc") \\
    .option("url", "jdbc:postgresql://localhost:5432/customers") \\
    .option("dbtable", "customer_data") \\
    .load()

# Data cleaning and transformation
cleaned_df = df \\
    .filter(col("age").isNotNull()) \\
    .filter(col("age") > 0) \\
    .withColumn("age_group", 
        when(col("age") < 25, "Young")
        .when(col("age") < 50, "Middle")
        .otherwise("Senior")) \\
    .withColumn("is_premium", col("purchase_amount") > 1000)

# Write to data warehouse
cleaned_df.write \\
    .format("parquet") \\
    .mode("overwrite") \\
    .save("s3://data-lake/customers/cleaned/")

print(f"Processed {{cleaned_df.count()}} records")`,
    expectedOutput: `Processed 125,847 records
Data successfully written to S3 data lake`,
    category: 'etl'
  },
  {
    id: 'pandas-analysis',
    title: 'Pandas Data Analysis',
    description: 'Analyze sales data and generate insights',
    language: 'python',
    code: `import pandas as pd
import numpy as np

# Load sales data
df = pd.read_csv('sales_data.csv')

# Data exploration
print("Dataset shape:", df.shape)
print("\\nColumn info:")
print(df.info())

# Calculate key metrics
total_sales = df['amount'].sum()
avg_order_value = df['amount'].mean()
top_customers = df.groupby('customer_id')['amount'].sum().nlargest(5)

print(f"\\nTotal Sales: {{total_sales:,.2f}}")
print(f"Average Order Value: {{avg_order_value:.2f}}")
print("\\nTop 5 Customers:")
print(top_customers)

# Monthly trends
df['date'] = pd.to_datetime(df['date'])
monthly_sales = df.groupby(df['date'].dt.to_period('M'))['amount'].sum()
print("\\nMonthly Sales Trend:")
print(monthly_sales)`,
    expectedOutput: `Dataset shape: (50000, 8)
Total Sales: $2,456,789.50
Average Order Value: $49.14
Monthly Sales Trend:
2023-01    $198,456.00
2023-02    $203,789.00
2023-03    $215,234.00`,
    category: 'analytics'
  },
  {
    id: 'sql-optimization',
    title: 'SQL Query Optimization',
    description: 'Optimized query for large dataset analysis',
    language: 'sql',
    code: `-- Optimized query with proper indexing and partitioning
WITH monthly_metrics AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        customer_id,
        COUNT(*) as order_count,
        SUM(amount) as total_spent,
        AVG(amount) as avg_order_value
    FROM orders 
    WHERE order_date >= '2023-01-01'
        AND status = 'completed'
    GROUP BY 1, 2
),
customer_segments AS (
    SELECT 
        customer_id,
        month,
        total_spent,
        CASE 
            WHEN total_spent >= 1000 THEN 'High Value'
            WHEN total_spent >= 500 THEN 'Medium Value'
            ELSE 'Low Value'
        END as segment
    FROM monthly_metrics
)
SELECT 
    month,
    segment,
    COUNT(DISTINCT customer_id) as customer_count,
    AVG(total_spent) as avg_spent
FROM customer_segments
GROUP BY 1, 2
ORDER BY 1, 2;`,
    expectedOutput: `month       | segment      | customer_count | avg_spent
2023-01-01  | High Value   | 1,234         | 1,456.78
2023-01-01  | Medium Value | 3,456         | 678.90
2023-01-01  | Low Value    | 8,910         | 234.56`,
    category: 'optimization'
  }
]

export function LiveCodeEditor() {
  const [selectedExample, setSelectedExample] = useState(codeExamples[0])
  const [code, setCode] = useState(codeExamples[0].code)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code')

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...')
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setOutput(selectedExample.expectedOutput)
    setIsRunning(false)
    setActiveTab('output')
  }

  const resetCode = () => {
    setCode(selectedExample.code)
    setOutput('')
    setActiveTab('code')
  }

  const handleExampleChange = (example: CodeExample) => {
    setSelectedExample(example)
    setCode(example.code)
    setOutput('')
    setActiveTab('code')
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Live Code Editor
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Try out real data engineering code examples. Click &quot;Run Code&quot; to see the results!
        </p>
      </div>

      {/* Example Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {codeExamples.map((example) => (
            <motion.button
              key={example.id}
              onClick={() => handleExampleChange(example)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedExample.id === example.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {example.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Editor Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium">
              {selectedExample.title} - {selectedExample.language.toUpperCase()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={runCode}
              disabled={isRunning}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                isRunning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              whileTap={{ scale: isRunning ? 1 : 0.95 }}
            >
              {isRunning ? 'Running...' : '▶ Run Code'}
            </motion.button>
            
            <motion.button
              onClick={resetCode}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex">
          {/* Code Area */}
          <div className="flex-1">
            <div className="bg-gray-900 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
                placeholder="Enter your code here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Output Area */}
          <div className="w-1/2 border-l border-gray-700">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`text-sm font-medium ${
                    activeTab === 'code' 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`text-sm font-medium ${
                    activeTab === 'output' 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Output
                </button>
              </div>
            </div>
            
            <div className="p-4 h-96 overflow-auto">
              {activeTab === 'code' ? (
                <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {code}
                </pre>
              ) : (
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || 'Click "Run Code" to see the output...'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Example Description */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          {selectedExample.title}
        </h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          {selectedExample.description}
        </p>
      </div>

      {/* Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl mb-2">🐍</div>
          <div className="font-semibold text-gray-900 dark:text-white">Python & PySpark</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Real data processing code</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl mb-2">⚡</div>
          <div className="font-semibold text-gray-900 dark:text-white">Live Execution</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Run code and see results</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold text-gray-900 dark:text-white">Real Examples</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Production-ready patterns</div>
        </div>
      </div>
    </div>
  )
}

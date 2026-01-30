/**
 * Script to publish blog posts via the admin API
 * Run with: node scripts/publish-blogs.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3003/api/articles';
const ADMIN_PASSWORD = 'MyCodingJourney2026!';

const blogPosts = [
  {
    file: 'building-realtime-data-pipelines-at-scale.md',
    title: 'Building Real-time Data Pipelines at Scale: Lessons from Processing 10 Billion Records Daily',
    slug: 'building-realtime-data-pipelines',
    excerpt: 'Practical lessons from building systems that process over 10 billion records daily, including architecture patterns, common pitfalls, and optimization techniques.',
    tags: ['Data Engineering', 'Apache Spark', 'System Design', 'Python'],
    featured: true
  },
  {
    file: 'dublin-bus-realtime-pipeline.md',
    title: 'Building a Real-Time Transit Data Pipeline: Dublin Bus Analytics',
    slug: 'dublin-bus-realtime-pipeline',
    excerpt: 'How I built a complete data pipeline that tracks 680+ buses in real-time across Dublin, from API ingestion to interactive dashboards.',
    tags: ['Data Engineering', 'Python', 'GTFS', 'Transit Data'],
    featured: true
  },
  {
    file: 'ml-transit-delay-prediction.md',
    title: 'Predicting Bus Delays with Machine Learning: A Practical Guide',
    slug: 'ml-transit-delay-prediction',
    excerpt: 'Building an ML model that forecasts Dublin bus delays 15 minutes in advance with 87% accuracy. Complete guide with code.',
    tags: ['Machine Learning', 'Python', 'XGBoost', 'Transit Data'],
    featured: false
  },
  {
    file: 'dublin-bus-route-analysis.md',
    title: 'Which Dublin Bus Routes Are Actually Reliable? A Data-Driven Analysis',
    slug: 'dublin-bus-route-analysis',
    excerpt: 'Analysis of 198 bus routes across Dublin to find out which ones you can trust—and which ones to avoid.',
    tags: ['Data Analysis', 'Python', 'Transit Data', 'Dublin'],
    featured: false
  },
  {
    file: 'dublin-bus-peak-hours.md',
    title: 'When Should You Catch the Bus in Dublin? A Time-Based Analysis',
    slug: 'dublin-bus-peak-hours',
    excerpt: 'Analysis of 100,000+ delay records to find the best and worst times to travel in Dublin.',
    tags: ['Data Analysis', 'Time Series', 'Transit Data', 'Dublin'],
    featured: false
  }
];

async function publishPost(post) {
  const contentPath = path.join(__dirname, '..', 'content', 'blog', post.file);
  
  if (!fs.existsSync(contentPath)) {
    console.log(`⚠️ File not found: ${post.file}`);
    return null;
  }
  
  const content = fs.readFileSync(contentPath, 'utf8');
  
  const payload = {
    title: post.title,
    slug: post.slug,
    content: content,
    excerpt: post.excerpt,
    tags: post.tags,
    published: true,
    featured: post.featured
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSWORD}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Published: ${post.title}`);
      return data;
    } else {
      console.log(`❌ Failed to publish ${post.title}: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error publishing ${post.title}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('📝 Publishing blog posts to CMS...\n');
  
  let published = 0;
  let failed = 0;
  
  for (const post of blogPosts) {
    const result = await publishPost(post);
    if (result) {
      published++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n✨ Done! Published: ${published}, Failed: ${failed}`);
}

main();

/**
 * Script to update blog post cover images via the admin API
 * Run with: node scripts/update-covers.js
 */

const API_URL = 'http://localhost:3003/api/articles';
const ADMIN_PASSWORD = 'MyCodingJourney2026!';

const coverImages = {
  'building-realtime-data-pipelines': '/blog-realtime-pipelines.png',
  'dublin-bus-realtime-pipeline': '/blog-dublin-bus-pipeline.png',
  'ml-transit-delay-prediction': '/blog-ml-delay-prediction.png',
  'dublin-bus-route-analysis': '/blog-route-analysis.png',
  'dublin-bus-peak-hours': '/blog-peak-hours.png'
};

async function getArticles() {
  const response = await fetch(`${API_URL}?all=true`, {
    headers: {
      'Authorization': `Bearer ${ADMIN_PASSWORD}`
    }
  });
  const data = await response.json();
  return data.data || [];
}

async function updateArticle(id, coverImage) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_PASSWORD}`
    },
    body: JSON.stringify({ cover_image: coverImage })
  });
  return response.ok;
}

async function main() {
  console.log('🖼️  Updating article cover images...\n');
  
  const articles = await getArticles();
  let updated = 0;
  
  for (const article of articles) {
    const coverImage = coverImages[article.slug];
    if (coverImage) {
      const success = await updateArticle(article.id, coverImage);
      if (success) {
        console.log(`✅ Updated: ${article.title}`);
        updated++;
      } else {
        console.log(`❌ Failed: ${article.title}`);
      }
    }
  }
  
  console.log(`\n✨ Done! Updated ${updated} articles with cover images.`);
}

main();

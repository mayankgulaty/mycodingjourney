/**
 * Script to fix MDX-incompatible content in blog articles
 * Fixes smart quotes, admonitions, and other problematic content
 */

const API_URL = 'http://localhost:3003/api/articles';
const ADMIN_PASSWORD = 'MyCodingJourney2026!';

function fixContent(content) {
  let fixed = content;
  
  // Replace smart quotes with straight quotes
  fixed = fixed.replace(/'/g, "'");  // Right single quote
  fixed = fixed.replace(/'/g, "'");  // Left single quote
  fixed = fixed.replace(/"/g, '"');  // Left double quote
  fixed = fixed.replace(/"/g, '"');  // Right double quote
  
  // Replace MDX admonitions with blockquotes
  fixed = fixed.replace(/:::info\n([\s\S]*?):::/g, (match, content) => {
    return `> **Info:** ${content.trim()}`;
  });
  
  fixed = fixed.replace(/:::warning\n([\s\S]*?):::/g, (match, content) => {
    return `> **Warning:** ${content.trim()}`;
  });
  
  fixed = fixed.replace(/:::tip\n([\s\S]*?):::/g, (match, content) => {
    return `> **Tip:** ${content.trim()}`;
  });
  
  fixed = fixed.replace(/:::note\n([\s\S]*?):::/g, (match, content) => {
    return `> **Note:** ${content.trim()}`;
  });
  
  // Replace em-dashes with regular dashes if they cause issues
  // fixed = fixed.replace(/—/g, '-');
  
  return fixed;
}

async function getArticles() {
  const response = await fetch(`${API_URL}?all=true`, {
    headers: {
      'Authorization': `Bearer ${ADMIN_PASSWORD}`
    }
  });
  const data = await response.json();
  return data.data || [];
}

async function updateArticle(id, content) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_PASSWORD}`
    },
    body: JSON.stringify({ content })
  });
  return response.ok;
}

async function main() {
  console.log('🔧 Fixing MDX-incompatible content in articles...\n');
  
  const articles = await getArticles();
  let fixed = 0;
  
  for (const article of articles) {
    const originalContent = article.content;
    const fixedContent = fixContent(originalContent);
    
    if (originalContent !== fixedContent) {
      const success = await updateArticle(article.id, fixedContent);
      if (success) {
        console.log(`✅ Fixed: ${article.title}`);
        fixed++;
      } else {
        console.log(`❌ Failed: ${article.title}`);
      }
    } else {
      console.log(`⏭️  No changes needed: ${article.title}`);
    }
  }
  
  console.log(`\n✨ Done! Fixed ${fixed} articles.`);
}

main();

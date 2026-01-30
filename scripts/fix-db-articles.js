/**
 * Script to fix MDX-incompatible content directly in Supabase database
 * Run with: node scripts/fix-db-articles.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function fixContent(content) {
  let fixed = content;
  
  // Replace smart quotes with straight quotes
  fixed = fixed.replace(/'/g, "'");
  fixed = fixed.replace(/'/g, "'");
  fixed = fixed.replace(/"/g, '"');
  fixed = fixed.replace(/"/g, '"');
  
  // Replace MDX admonitions with blockquotes
  fixed = fixed.replace(/:::info\n([\s\S]*?):::/g, (match, content) => {
    return `> **Info:** ${content.trim()}`;
  });
  fixed = fixed.replace(/:::warning\n([\s\S]*?):::/g, (match, content) => {
    return `> **Warning:** ${content.trim()}`;
  });
  
  // Fix angle brackets that MDX interprets as JSX
  // These patterns appear OUTSIDE of code blocks
  fixed = fixed.replace(/\(<(\d+)%\)/g, '(less than $1%)');
  fixed = fixed.replace(/\(>(\d+)%\)/g, '(over $1%)');
  fixed = fixed.replace(/\(>(\d+) min\)/g, '(over $1 min)');
  fixed = fixed.replace(/\(<(\d+) min\)/g, '(under $1 min)');
  
  // Fix patterns in tables and regular text (not in code blocks)
  // Match > or < followed by space and number, but not inside backticks
  fixed = fixed.replace(/\| > (\d+)/g, '| over $1');
  fixed = fixed.replace(/\| < (\d+)/g, '| under $1');
  fixed = fixed.replace(/> (\d+) min(?!\s*\|)/g, 'over $1 min');
  fixed = fixed.replace(/< (\d+) min(?!\s*\|)/g, 'under $1 min');
  
  // Specifically fix the problematic pattern: (<5%) or similar
  fixed = fixed.replace(/\(<(\d+)/g, '(less than $1');
  fixed = fixed.replace(/\(>(\d+)/g, '(over $1');
  
  return fixed;
}

async function main() {
  console.log('🔧 Fixing MDX content in Supabase database...\n');
  
  // Fetch all articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*');
  
  if (error) {
    console.error('Error fetching articles:', error);
    process.exit(1);
  }
  
  console.log(`Found ${articles.length} articles\n`);
  
  let fixed = 0;
  
  for (const article of articles) {
    const originalContent = article.content;
    const fixedContent = fixContent(originalContent);
    
    if (originalContent !== fixedContent) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ content: fixedContent })
        .eq('id', article.id);
      
      if (updateError) {
        console.log(`❌ Failed to fix: ${article.title}`);
        console.error(updateError);
      } else {
        console.log(`✅ Fixed: ${article.title}`);
        fixed++;
      }
    } else {
      console.log(`⏭️  No changes needed: ${article.title}`);
    }
  }
  
  console.log(`\n✨ Done! Fixed ${fixed} articles.`);
}

main();

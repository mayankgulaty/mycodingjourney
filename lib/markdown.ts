export function parseMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 text-foreground">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-8 text-foreground">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-foreground">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold mb-2 mt-4 text-foreground">$1</h4>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside mb-4"><li class="text-muted-foreground">$1</li></ul>')
    .replace(/^- (.*$)/gim, '<ul class="list-disc list-inside mb-4"><li class="text-muted-foreground">$1</li></ul>')
    .replace(/^\d+\. (.*$)/gim, '<ol class="list-decimal list-inside mb-4"><li class="text-muted-foreground">$1</li></ol>')
    
    // Code blocks
    .replace(/^```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-muted px-2 py-1 rounded text-sm text-primary">$1</code>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg mb-4 italic text-muted-foreground">$1</blockquote>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
    .replace(/^(?!<[h|u|o|p|b|p|d])/gim, '<p class="mb-4 text-muted-foreground leading-relaxed">')
    
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 text-muted-foreground leading-relaxed"><\/p>/gim, '')
    
    // Clean up duplicate list items
    .replace(/(<ul class="list-disc list-inside mb-4"><li class="text-muted-foreground">.*?<\/li><\/ul>)\s*\1/gim, '$1')
    .replace(/(<ol class="list-decimal list-inside mb-4"><li class="text-muted-foreground">.*?<\/li><\/ol>)\s*\1/gim, '$1')
}


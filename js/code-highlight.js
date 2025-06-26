// code-highlight.js
document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize highlight.js
    if (typeof hljs !== 'undefined') {
        // Apply syntax highlighting to all code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        
        // Add line numbers to code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            const lines = block.innerHTML.split('\n');
            if (lines.length > 1) {
                block.innerHTML = lines.map((line, i) => 
                    `<span class="line-number">${i + 1}</span>${line}`
                ).join('\n');
            }
        });
    }
});

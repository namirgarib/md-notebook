const textarea = document.getElementById('markdown');
const preview = document.getElementById('preview');
const marked = require('marked');

textarea.addEventListener('input', (e) => {
    const markdownText = e.target.value;
    preview.innerHTML = marked.parse(markdownText);
});

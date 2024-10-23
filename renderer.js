const { ipcRenderer } = require('electron');
const fs = require('fs');
const textarea = document.getElementById('markdown');
const preview = document.getElementById('preview');
const marked = require('marked');

textarea.addEventListener('input', (e) => {
    const markdownText = e.target.value;
    preview.innerHTML = marked.parse(markdownText);
});

ipcRenderer.on('request-file-save', (event, filePath) => {
    fs.writeFile(filePath, textarea.innerHTML, (err) => {
        if (err) {
          return;
        }
    });
});

ipcRenderer.on('file-opened', (event, data) => {
    textarea.value = data;
    textarea.dispatchEvent(new Event('input'));
});
  

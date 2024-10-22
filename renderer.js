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
    textarea.innerText = filePath;
    fs.writeFile(filePath, textarea.innerText, (err) => {
        if (err) {
          return;
        }
    });
});

ipcRenderer.on('file-opened', (event, data) => {
    textarea.innerHTML = data;
    textarea.dispatchEvent(new Event('input'));
});
  

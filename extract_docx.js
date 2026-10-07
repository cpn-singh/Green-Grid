const fs = require('fs');
const xml = fs.readFileSync('frontend/public/word/document.xml', 'utf8');
const text = xml
  .replace(/<\/w:p>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'");

fs.writeFileSync('docx_extracted_text.txt', text);
console.log('Text extracted, length:', text.length);

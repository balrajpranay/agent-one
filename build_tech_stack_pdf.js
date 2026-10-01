const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const url = require('url');

const mdPath = path.resolve('TECH_STACK.md');
const htmlPath = path.resolve('TECH_STACK.html');
const pdfPath = path.resolve('TECH_STACK.pdf');

const md = fs.readFileSync(mdPath, 'utf8');

// Basic Markdown to HTML converter for presentation
function mdToHtml(markdown) {
  let html = markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) continue; // separator
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        tableHtml = '<table><thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        result.push(tableHtml);
      }
      if (line.length > 0) {
        if (!line.startsWith('<h') && !line.startsWith('<blockquote') && !line.startsWith('---') && !line.startsWith('```')) {
          result.push(`<p>${line}</p>`);
        } else if (line.startsWith('---')) {
          result.push('<hr />');
        } else {
          result.push(line);
        }
      }
    }
  }
  if (inTable) {
    result.push(tableHtml + '</tbody></table>');
  }

  return result.join('\n');
}

const bodyHtml = mdToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Agent One — Technical Stack Documentation</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 10pt;
    padding: 10px;
  }
  h1 { font-size: 20pt; color: #0f172a; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
  h2 { font-size: 13pt; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px; margin-bottom: 8px; }
  h3 { font-size: 11pt; color: #059669; margin-top: 14px; margin-bottom: 6px; }
  p { margin-bottom: 8px; }
  blockquote { border-left: 3.5px solid #059669; background: #f8fafc; padding: 6px 12px; color: #475569; margin: 10px 0; font-size: 9.5pt; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 8.5pt; page-break-inside: avoid; }
  th, td { border: 1px solid #cbd5e1; padding: 6px 9px; text-align: left; }
  th { background: #f1f5f9; color: #0f172a; font-weight: 700; }
  tr:nth-child(even) { background: #fafafa; }
  code { background: #f1f5f9; color: #0f172a; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 8.5pt; }
  a { color: #059669; text-decoration: none; font-weight: 600; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 18px 0; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('HTML generated at:', htmlPath);

const fileUrl = url.pathToFileURL(htmlPath).href;
try {
  cp.execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless',
    '--disable-gpu',
    '--print-to-pdf=' + pdfPath,
    '--no-pdf-header-footer',
    fileUrl
  ]);
  console.log('PDF generated at:', pdfPath, 'Size:', fs.statSync(pdfPath).size);
} catch (err) {
  console.error('Error generating PDF:', err);
}

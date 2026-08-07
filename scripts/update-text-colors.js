const fs = require('fs');
const path = require('path');

const DIRS = ['app', 'components'];

function walkAndReplace(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  let changedFiles = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      changedFiles += walkAndReplace(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Replace Tailwind classes
      content = content.replace(/text-\[\#155E78\]/g, 'text-text');
      // Replace inline styles
      content = content.replace(/color:\s*['"]#155E78['"]/g, "color: 'var(--color-text)'");
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        changedFiles++;
      }
    }
  }
  return changedFiles;
}

console.log('Starting color replacement...');
let totalChanged = 0;
DIRS.forEach(dir => {
  const targetDir = path.join(__dirname, '..', dir);
  totalChanged += walkAndReplace(targetDir);
});

console.log(`Successfully updated text colors in ${totalChanged} files!`);

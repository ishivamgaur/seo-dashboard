const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix new ApiResponse(200, data, 'message') -> new ApiResponse(200, 'message', data)
  content = content.replace(/new ApiResponse\((\d+),\s*(.+?),\s*('[^']+')\)/g, 'new ApiResponse($1, $3, $2)');
  content = content.replace(/new ApiResponse\((\d+),\s*(.+?),\s*("[^"]+")\)/g, 'new ApiResponse($1, $3, $2)');
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed ApiResponse arguments');

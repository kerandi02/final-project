const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

const walk = (dir) => {
  const res = [];
  for (const file of fs.readdirSync(dir)) {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) res.push(...walk(fp));
    else res.push(fp);
  }
  return res;
};

const files = walk(root).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
const pageFiles = fs.readdirSync(path.join(root, 'pages'));

function normalize(r) { return r.replace(/\\/g, '/'); }

let ok = true;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const re = /from\s+['\"](\.\/pages\/[\w-_.]+)['\"]/g;
  let m;
  while ((m = re.exec(content))) {
    const imp = m[1];
    const impBase = imp.split('/').pop();
    // support .jsx omission
    const matches = pageFiles.filter(p => p.toLowerCase() === (impBase + '.jsx').toLowerCase() || p.toLowerCase() === (impBase + '.js').toLowerCase());
    if (matches.length === 0) {
      // no file found
      ok = false;
      console.log(`No page file for import ${imp} in ${normalize(file)}`);
      continue;
    }
    // check exact match
    if (impBase !== path.basename(matches[0], path.extname(matches[0]))) {
      ok = false;
      console.log(`Case mismatch in ${normalize(file)}: import ${imp}, actual page filename ${matches[0]}`);
    }
  }
}

if (ok) console.log('All page imports match case of page filenames.');
else process.exit(1);

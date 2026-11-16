import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),dist=path.join(root,'dist');
let html=await fs.readFile(path.join(dist,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)];
if(scripts.length!==1)throw new Error('Expected one bundled entrypoint.');
for(const match of scripts){
  const code=await fs.readFile(path.join(dist,match[1]),'utf8');
  // A callback preserves literal $&, $` and $' inside the bundled JavaScript.
  // A string replacement would interpret them and corrupt React's runtime.
  html=html.replace(match[0],()=>`<script type="module">${code.replace(/<\/script/gi,'<\\/script')}</script>`);
}
const styles=[...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for(const match of styles){
  const css=(await fs.readFile(path.join(dist,match[1]),'utf8')).replace(/@import\s+url\([^)]*\);?/g,'');
  html=html.replace(match[0],()=>`<style>${css}</style>`);
}
const favicon=await fs.readFile(path.join(dist,'favicon.svg'),'utf8');
html=html.replace(/href="\.\/favicon\.svg"/,`href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'<script></script>');
if(/<script[^>]+src=|<link[^>]+rel="stylesheet"/.test(markup))throw new Error('Portable output still has external assets.');
const output=path.resolve(process.argv[2]||'release/Crowdly_Trial.html');
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,html);
console.log(JSON.stringify({file:output,bytes:Buffer.byteLength(html),externalScriptOrStyleDependencies:0}));

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

test('portable build preserves replacement tokens and safely embeds script content', async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'crowdly-portable-'));
  try {
    await mkdir(path.join(root,'dist/assets'),{recursive:true});
    const code='const dollar = "$& $` $$ $\'"; const tag = "</script>";';
    await writeFile(path.join(root,'dist/index.html'),'<html><head><link rel="icon" href="./favicon.svg"><script type="module" src="./assets/entry.js"></script><link rel="stylesheet" href="./assets/site.css"></head><body><div id="root"></div></body></html>');
    await writeFile(path.join(root,'dist/assets/entry.js'),code);
    await writeFile(path.join(root,'dist/assets/site.css'),'body{--test:"$&";color:red}');
    await writeFile(path.join(root,'dist/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
    const script=fileURLToPath(new URL('../scripts/build-portable.mjs',import.meta.url));
    const built=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});
    assert.equal(built.status,0,built.stderr);
    const html=await readFile(path.join(root,'release/Crowdly_Trial.html'),'utf8');
    const scripts=[...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length,1);
    assert.equal(scripts[0][1],code.replace('</script>','<\\/script>'));
    assert.ok(html.includes('body{--test:"$&";color:red}'));
    assert.ok(html.includes('href="data:image/svg+xml,'));
    assert.equal(/(?:src|href)="\.\/assets\//.test(html),false);
    const syntax=spawnSync(process.execPath,['--check','--input-type=module'],{input:scripts[0][1],encoding:'utf8'});
    assert.equal(syntax.status,0,syntax.stderr);
  } finally { await rm(root,{recursive:true,force:true}); }
});

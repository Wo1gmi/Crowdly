import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {createSeed} from '../src/data/seed.js';
import {simulate} from '../src/domain/simulation.js';

// Compile the actual JSX through the project's existing Vite/esbuild dependency.
// This checks React's rendering boundary, rather than duplicating the type guard.
test('legacy report survives malformed optional notes and retains valid notes',async t=>{
 const directory=await mkdtemp(join(tmpdir(),'crowdly-report-test-'));
 t.after(()=>rm(directory,{recursive:true,force:true}));
 const output=join(directory,'report.cjs');
 const projectRoot=dirname(dirname(fileURLToPath(import.meta.url)));
 await build({
  stdin:{contents:"import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {Reports} from './src/pages/Reports.jsx';export function renderReport(project,result){return renderToStaticMarkup(React.createElement(Reports,{project,result,exportForecast:()=>{}}));}",resolveDir:projectRoot,sourcefile:'report-test-entry.jsx',loader:'jsx'},
  outfile:output,bundle:true,platform:'node',format:'cjs',logLevel:'silent',define:{'process.env.NODE_ENV':'"production"'},
 });
 const {renderReport}=createRequire(import.meta.url)(output);
 const project=createSeed().projects[0],result=simulate(project);
 for(const malformed of [{unexpected:'object'},[{unexpected:'array object'}]]){
  project.notes=malformed;
  const html=renderReport(project,result);
  assert.match(html,/Отчёт по проекту/);
  assert.doesNotMatch(html,/Заметки проекта/);
 }
 project.notes='Проверить аренду <до открытия>';
 const html=renderReport(project,result);
 assert.match(html,/Заметки проекта/);
 assert.match(html,/Проверить аренду &lt;до открытия&gt;/);
});

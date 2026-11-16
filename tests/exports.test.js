import test from 'node:test';
import assert from 'node:assert/strict';
import {toCSV,parseCSV} from '../src/services/csv.js';

test('spreadsheet exports neutralize formula-like text but preserve negative financial numbers',()=>{
 const values=['=1+1','+SUM(A1)','-HYPERLINK("https://example.test")','@SUM(A1)','  =1+1','\t+1'];
 const rows=parseCSV(toCSV(values.map(text=>({name:text,loss:-120.5,profit:3}))));
 for(let i=0;i<values.length;i++){
  assert.equal(rows[i].name,"'"+values[i]);
  assert.equal(rows[i].loss,'-120.5');
  assert.equal(rows[i].profit,'3');
 }
});

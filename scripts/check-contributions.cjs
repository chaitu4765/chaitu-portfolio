// Validate contribution math and API parsing without requiring a browser canvas.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
function compile(source) {
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const mod={exports:{}};new Function('exports','module','require',compiled)(mod.exports,mod,require);return mod.exports;
}
const source=fs.readFileSync('src/components/ui/contribution-skyline.tsx','utf8').split('// #endregion')[0].replace('import * as React from "react"','');
const {buildGrid,computeStats,dayMs,DAY_MS,riseAt,barHeight}=compile(source);
const {parseContributions}=compile(fs.readFileSync('src/lib/github.ts','utf8'));
const end=dayMs('2026-10-29');
const empty=buildGrid([],end);assert.equal(computeStats(empty.cells).total,0);assert.equal(empty.cells.at(-1).date,'2026-10-29');
const grid=buildGrid([{date:'2026-10-26',count:2},{date:'2026-10-26',count:3},{date:'2026-10-27',count:1},{date:'2026-10-28',count:4}],end);
const stats=computeStats(grid.cells);assert.equal(stats.total,10);assert.equal(stats.busiest.count,5);assert.equal(stats.longest.days,3);assert.equal(stats.current.days,3);
assert.equal(dayMs('2026-10-29')-dayMs('2026-10-28'),DAY_MS);
assert.equal(riseAt(0,0,53,0),0);assert.equal(riseAt(1,52,53,6),1);assert.equal(barHeight(0,0),0.2);
assert.throws(()=>parseContributions({contributions:[{date:'2026-10-29',count:-1}]}));
assert.throws(()=>parseContributions({contributions:[]}));
assert.throws(()=>parseContributions({contributions:[{date:'2026-10-29',count:2},{date:'2026-10-29',count:3}]}));
const real=parseContributions(JSON.parse(fs.readFileSync('public/github-contributions.json','utf8')));assert.ok(real.length>=365);assert.ok(computeStats(buildGrid(real,dayMs(real.at(-1).date)).cells).total>0);
console.log('PASS: date handling, empty activity, aggregation, streaks, morph boundaries, response validation, and real profile snapshot.');

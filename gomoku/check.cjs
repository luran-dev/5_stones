const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const stub=()=>({classList:{add(){},toggle(){}},setAttribute(){},addEventListener(){},appendChild(){},focus(){},showModal(){},close(){}});const els=new Map();const ctx={document:{getElementById(id){if(!els.has(id))els.set(id,stub());return els.get(id)},createElement:stub},setTimeout(fn){ctx.pending=fn;return 1},clearTimeout(){ctx.pending=null}};vm.createContext(ctx);const html=fs.readFileSync('dist/index.html','utf8');vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],ctx);const run=s=>vm.runInContext(s,ctx);
assert.equal(run('cells.length'),225);run('play(112)');assert.equal(run('history.length'),1);run('play(113)');assert.equal(run('history.length'),1);ctx.pending();assert.equal(run('history.length'),2);run("$('undo').onclick()");assert.equal(run('history.length'),0);
for(const [start,step] of [[30,1],[2,15],[0,16],[14,14]]){run('reset()');for(let n=0;n<5;n++)run(`grid[${start+n*step}]=1`);assert.equal(run(`winningLine(${start+4*step},1).length`),5)}
run('reset(); grid[105]=2; grid[106]=2; grid[107]=2; grid[108]=2');assert.equal(run("chooseMove('hard')"),109);
run('reset(); grid[105]=1; grid[106]=1; grid[107]=1; grid[108]=1');assert.equal(run("chooseMove('normal')"),109);
run('reset(); play(112); $("undo").onclick()');assert.equal(run('thinking'),false);assert.equal(run('history.length'),0);assert.equal(ctx.pending,null);
run('reset(); for(let i=0;i<4;i++)grid[i]=1; place(4,1)');assert.equal(run('finished'),true);run('play(50)');assert.equal(run('grid[50]'),0);
for(let game=0;game<3;game++){run('reset()');for(let n=0;n<225;n++){const done=run(`place(chooseMove('${['easy','normal','hard'][game]}'),${n%2+1})`);if(done)break;}assert.equal(run('finished'),true)}
console.log('PASS: board, turn locking, AI response, undo/cancellation, four win directions, win/block tactics, end-state lock, three complete games.');

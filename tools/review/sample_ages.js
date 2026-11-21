const fs=require('fs');const R=f=>fs.readFileSync('src/'+f,'utf8');
let code=['core.js','icons.js','icons2.js','cur_pt_nat.js','cur_fin.js','cur_fin_a.js','cur_read_y.js','cur_yarik.js','cur_anya.js','cur_more_y.js','cur_more_a.js','cur_ages.js'].map(R).join('\n');
code+='\n;globalThis.AGE_CUR=AGE_CUR;globalThis.U=U;globalThis.asChoice=asChoice;globalThis.Y_FIN=Y_FIN;globalThis.A_FIN=A_FIN;globalThis.Y_READL=Y_READL;';
new Function('var FAM=1;var document={getElementById(){return null},querySelector(){return null},createElement(){return {}},addEventListener(){}},window={},localStorage={getItem(){},setItem(){}};'+code)();
const ages=process.argv[2].split(',');const skip=new Set([...Y_FIN,...A_FIN,...Y_READL].map(u=>u.id));
let out='';const st=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
for(const age of ages){const cur=AGE_CUR[age];out+=`\n=== ${age} лет ===\n`;
for(const [sj,c] of Object.entries(cur)) for(const [nm,us] of [[c.name,c.units],[c.altName,c.alt||[]]]){ const list=us.filter(u=>!skip.has(u.id)); if(!list.length) continue; out+=`-- ${nm}\n`;
 for(const u of list){ out+=`[${u.id}] ${u.t}. Теория: ${st(u.th)}\n`; for(let s=1;s<=2;s++){const t=asChoice(u.g(U.rng(u.id+'q'+s)),s); out+=`  В: ${st(t.q)} | Ответ: ${st(t.a)} | Варианты: ${(t.opts||[t.a,...t.w]).map(st).join(' / ')}\n`;}}}}
fs.writeFileSync(process.argv[3],out);console.log(out.length);

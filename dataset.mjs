import {classify} from './engine.mjs';
export function generate(seed=2026,count=560){
 if(!Number.isInteger(seed)||!Number.isInteger(count)||count<1||count>5000)throw Error('Semilla entera y 1–5000 muestras');
 let state=seed>>>0;const rand=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296}, u=(a,b)=>a+(b-a)*rand(), round=(x,n=2)=>Number(x.toFixed(n));
 const projects=[],explorations=[],samples=[],tests=[],points=[];const types=['grava limpia','arena limpia','arena limosa','arena arcillosa','limo','arcilla baja plasticidad','arcilla alta plasticidad'];
 for(let i=0;i<count;i++){const p=Math.floor(i/28), j=Math.floor(i/4), k=i%4, pid='SYN-P'+String(p+1).padStart(3,'0'), eid='SYN-E'+String(j+1).padStart(4,'0'), id='SYN-M'+String(i+1).padStart(5,'0');
 if(i%28===0)projects.push({id:pid,name:['Edificación','Pavimento','Equipamiento','Vivienda'][p%4]+' demostrativo '+(p+1),location:'Escenario ficticio Áncash',origin:'synthetic',seed});
 if(k===0)explorations.push({id:eid,project_id:pid,type:'calicata simulada',depth_m:4,origin:'synthetic'});
 const t=(j+Math.floor(k/2))%7, fine=round(t<2?u(0.5,4.5):t<4?u(14,44):u(55,95)), gravel=round(t===0?u(55,85):u(0,Math.min(18,100-fine))), sand=round(100-fine-gravel), p4=round(100-gravel),p10=round(fine+sand*u(.68,.9)),p40=round(fine+(p10-fine)*u(.25,.65));
 const np=t<2;let ll=null,lp=null;if(!np){ll=round(t===6?u(52,75):t===4?u(22,43):u(28,44));const a=.73*(ll-20);const ip=t===2||t===4?u(1,Math.max(2,a-.5)):u(Math.max(8,a+1),ll-5);lp=round(ll-ip);}
 const knots=[[.075,fine],[.425,p40],[2,p10],[4.75,p4],[75,100]];const diameter=q=>{if(q<fine)return null;for(let z=1;z<knots.length;z++){const [a,y]=knots[z-1],[b,v]=knots[z];if(q<=v&&v>y)return Math.exp(Math.log(a)+(q-y)/(v-y)*Math.log(b/a));}return null};const d10=diameter(10),d30=diameter(30),d60=diameter(60);
 const gs=round(u(2.62,2.75)),e=u(t<2?.35:.5,t<2?.75:1.05),sr=u(.35,.95),rho_d=gs/(1+e),w=100*sr*e/gs;
 const x={p4,p10,p40,p200:fine,ll,lp,np,d10,d30,d60};const label=classify(x);
 const phi=round(u(t<2?32:t<4?27:20,t<2?40:t<4?35:30)),c=round(t<2?0:u(t===2||t===4?0:5,t===2||t===4?8:25));
 const specimen=id+'-CD';samples.push({id,project_id:pid,exploration_id:eid,depth_from_m:k,depth_to_m:k+.8,origin:'synthetic',family:types[t],...x,gravel,sand,fines:fine,gs,void_ratio:e,saturation_pct:sr*100,moisture_pct:w,dry_density_g_cm3:rho_d,natural_density_g_cm3:rho_d*(1+w/100),sucs:label.sucs,aashto:label.aashto,gi:label.gi});
 const ys=[50,100,150].map(s=>({normal_kpa:s,shear_kpa:round(c+s*Math.tan(phi*Math.PI/180)+u(-.3,.3))}));const slope=(ys[2].shear_kpa-ys[0].shear_kpa)/100, intercept=ys.reduce((a,b)=>a+b.shear_kpa,0)/3-100*slope;
 tests.push({id:specimen,sample_id:id,origin:'synthetic',type:'corte directo simulado',drainage:'drenado',stress:'efectivo',phi_deg:round(Math.atan(slope)*180/Math.PI),c_kpa:round(intercept),review_required:intercept<0,nominal_phi_deg:phi,nominal_c_kpa:c});ys.forEach((v,n)=>points.push({id:specimen+'-'+(n+1),test_id:specimen,...v}));
 }return {schema_version:1,generator_version:'2.2.0',seed,origin:'synthetic',projects,explorations,samples,tests,points};
}
export function audit(d){const p=new Set(d.projects.map(x=>x.id)),e=new Map(d.explorations.map(x=>[x.id,x.project_id])),s=new Set(d.samples.map(x=>x.id)),t=new Set(d.tests.map(x=>x.id));return {samples:d.samples.length,invalid:d.samples.filter(x=>!p.has(x.project_id)||e.get(x.exploration_id)!==x.project_id||Math.abs(x.gravel+x.sand+x.fines-100)>.011||x.saturation_pct>100||x.saturation_pct<0||x.depth_to_m>4).length,orphan_tests:d.tests.filter(x=>!s.has(x.sample_id)).length,orphan_points:d.points.filter(x=>!t.has(x.test_id)).length}}

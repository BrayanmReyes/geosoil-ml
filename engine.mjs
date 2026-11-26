export function classify(x){
 const {p4,p10,p40,p200,ll,lp,np,d10,d30,d60}=x;
 if(![p4,p10,p40,p200].every(v=>Number.isFinite(v)&&v>=0&&v<=100)||!(p4>=p10&&p10>=p40&&p40>=p200))throw Error('Revise los porcentajes pasantes y su orden.');
 if(!np&&(!Number.isFinite(ll)||!Number.isFinite(lp)||lp<0||ll<lp))throw Error('Límites de Atterberg inválidos.');
 const ip=np?0:ll-lp,L=np?0:ll,F=p200,clay=ip>=7&&ip>=.73*(L-20),silt=np||ip<4||ip<.73*(L-20),border=!clay&&!silt;
 let sucs,cu=null,cc=null;
 if(F>=50){sucs=L>=50?(clay?'CH':'MH'):(border?'CL-ML':clay?'CL':'ML');}
 else{const g=100-p4>(100-F)/2?'G':'S';const fine=clay?'C':silt?'M':null;if(F>12)sucs=fine?g+fine:g+'C-'+g+'M';else{if([d10,d30,d60].every(v=>Number.isFinite(v)&&v>0)&&d10<=d30&&d30<=d60){cu=d60/d10;cc=d30*d30/(d10*d60);const grade=g+(cu+1e-10>=(g==='G'?4:6)&&cc>=1&&cc<=3?'W':'P');sucs=F<5?grade:fine?grade+'-'+g+fine:'Revisión: finos limítrofes';}else sucs='Pendiente: D10, D30, D60';}}
 let a;if(F<=35){if(p10<=50&&p40<=30&&F<=15&&ip<=6)a='A-1-a';else if(p40<=50&&F<=25&&ip<=6)a='A-1-b';else if(p40>50&&F<=10&&np)a='A-3';else a='A-2-'+(L<=40?(ip<=10?4:6):(ip<=10?5:7));}else a=L<=40?(ip<=10?'A-4':'A-6'):ip<=10?'A-5':ip<=L-30?'A-7-5':'A-7-6';
 const second=.01*Math.max(0,F-15)*Math.max(0,ip-10);const gi=Math.max(0,Math.round(a==='A-2-6'||a==='A-2-7'?second:Math.max(0,F-35)*(.2+.005*(L-40))+second));
 return {sucs,aashto:a,gi,ip,gravel:100-p4,sand:p4-F,fines:F,cu,cc};
}
export function bearing({phi,c,gamma,b,df,fs}){if(![phi,c,gamma,b,df,fs].every(Number.isFinite)||phi<0||phi>45||c<0||gamma<=0||b<=0||df<0||fs<3)throw Error('Parámetros inválidos; FS ilustrativo mínimo 3.');const r=phi*Math.PI/180,t=Math.tan(r),nq=Math.exp(Math.PI*t)*Math.tan(Math.PI/4+r/2)**2,nc=phi===0?Math.PI+2:(nq-1)/t,ng=2*(nq+1)*t,q0=gamma*df,qu=c*nc+q0*nq+.5*gamma*b*ng;return {nc,nq,ng,qu,qa:q0+(qu-q0)/fs};}
const api = typeof browser === 'undefined' ? chrome : browser;
const status = document.getElementById('status'),setup=document.getElementById('setup');
document.getElementById('version').textContent=api.runtime.getManifest().version;
const isFirefox=typeof browser!=='undefined';
const install='--install-browser-host'+(isFirefox?'':' --chrome-extension-id '+api.runtime.id);
const platform=api.runtime.getPlatformInfo();
platform.then(info=>{const file=info.os==='win'?'.\\eyazisma-imza-windows-amd64.exe':info.os==='mac'?'./eyazisma-imza-macos-'+(['arm','arm64','aarch64'].includes(info.arch)?'arm64':'intel'):'./eyazisma-imza-linux-amd64';document.getElementById('command').textContent=file+' '+install;});
async function call(action,link){
 try{const result=await api.runtime.sendMessage({action,link});
 setup.hidden=!!result?.ok;status.textContent=result?.ok?(action==='status'?'Yerel imza uygulaması hazır ('+result.version+').':'Ekran yerel uygulamada açıldı.'):(result?.message||'Uygulamaya ulaşılamadı.');
 }catch{setup.hidden=false;status.textContent='Yerel uygulama bağlantısı kurulamadı.';}
}
document.getElementById('cards').addEventListener('click',()=>call('cards'));
document.getElementById('open').addEventListener('click',()=>{const input=document.getElementById('link');if(!validSigningLink(input.value)){status.textContent='Desteklenen portaldan geçerli bir imza bağlantısı girin.';return;}call('open',input.value);input.value='';});
call('status');

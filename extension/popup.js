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
document.getElementById('open').addEventListener('click',()=>{const input=document.getElementById('link');grantedPortals(api.permissions).then(added=>{if(!validSigningLink(input.value,null,added)){status.textContent='Eklenmiş bir portaldan geçerli imza bağlantısı girin.';return;}call('open',input.value);input.value='';});});
api.tabs.query({active:true,currentWindow:true}).then(async ([tab])=>{
 let origin;try{const url=new URL(tab.url);if(url.protocol!=='https:')return;origin=url.origin;}catch{return;}
 if(builtInPortal(origin)||(await grantedPortals(api.permissions)).includes(origin))return;
 document.getElementById('origin').textContent=origin;document.getElementById('portal').hidden=false;
 // The browser closes a Firefox popup for this prompt; the background registers the portal.
 document.getElementById('add').addEventListener('click',()=>api.permissions.request({origins:[origin+'/*']}).then(granted=>{status.textContent=granted?'Portal eklendi. Sayfayı yenileyin.':'Portal eklenmedi.';document.getElementById('portal').hidden=granted;}));
}).catch(()=>{});
// Firefox may leave built-in portal access off (for example after an update); without it the signing button does nothing.
const builtIn=[...new Set((api.runtime.getManifest().content_scripts||[]).flatMap(script=>script.matches))];
api.permissions.contains({origins:builtIn}).then(granted=>{if(granted)return;document.getElementById('builtin').hidden=false;
 document.getElementById('grant').addEventListener('click',()=>api.permissions.request({origins:builtIn}).then(ok=>{status.textContent=ok?'İzin verildi. Portal sayfasını yenileyin.':'İzin verilmedi.';document.getElementById('builtin').hidden=ok;}));
}).catch(()=>{});
call('status');

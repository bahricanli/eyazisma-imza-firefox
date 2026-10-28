(() => {
 const api = typeof browser === 'undefined' ? chrome : browser;
 const pendingKey = 'eyazisma-extension-pending';
 let ready = false;
 function notice(text) {
  let box = document.getElementById('eyazisma-extension-status');
  if (!box) {box=document.createElement('p');box.id='eyazisma-extension-status';box.setAttribute('role','status');
   const anchor=document.querySelector('[data-signing-link]') || document.getElementById('pdf-signing-form');
   if (!anchor) return; anchor.insertAdjacentElement('afterend',box);}
  box.textContent=text;
 }
 function launch(link) {
  return api.runtime.sendMessage({action:'open',link}).then(result => {
   notice(result && result.ok ? 'İmza ekranı açıldı. İmzalama bitince bu sayfayı yenileyin.' : (result?.message || 'İmza uygulaması açılamadı.'));
  }).catch(() => notice('Eklenti bağlantısı kesildi; sayfayı yenileyin.'));
 }
 document.addEventListener('submit',event => {
  const form=event.target;
  if (!event.isTrusted || !ready || form.id!=='pdf-signing-form' || form.querySelector('[name="signing_method"]:checked')?.value!=='application') return;
  // Keep the portal's CSRF-protected submission; receive its single-use link back here.
  if (!form.elements.launch_application) return;
  form.elements.launch_application.value='0';form.target='_self';
  try {sessionStorage.setItem(pendingKey,location.pathname);}catch {return;}
  event.stopImmediatePropagation();
 },true);
 document.addEventListener('click',event => {
  const anchor=event.target.closest?.('[data-signing-link]');
  if (!event.isTrusted || !ready || !anchor || !validSigningLink(anchor.dataset.signingLink,location.origin)) return;
  event.preventDefault();event.stopImmediatePropagation();launch(anchor.dataset.signingLink);
 },true);
 api.runtime.sendMessage({action:'status'}).then(result => {
  ready=!!result?.ok;if(!ready)return;
  notice('Tarayıcı eklentisi ve imza uygulaması hazır.');
  let pending;try {pending=sessionStorage.getItem(pendingKey);sessionStorage.removeItem(pendingKey);}catch {return;}
  if(pending!==location.pathname)return;
  const anchor=document.querySelector('[data-signing-link]');
  if(anchor && validSigningLink(anchor.dataset.signingLink,location.origin))launch(anchor.dataset.signingLink);
 }).catch(()=>{});
})();

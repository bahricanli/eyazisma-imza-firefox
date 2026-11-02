const api = typeof browser === 'undefined' ? chrome : browser;
async function syncPortals() {
 const portals = await grantedPortals(api.permissions);
 const id = origin => 'portal-' + new URL(origin).host;
 const registered = await api.scripting.getRegisteredContentScripts();
 const stale = registered.map(script => script.id).filter(script => !portals.some(origin => id(origin) === script));
 const fresh = portals.filter(origin => !registered.some(script => script.id === id(origin)));
 if (stale.length) await api.scripting.unregisterContentScripts({ids:stale});
 if (fresh.length) await api.scripting.registerContentScripts(fresh.map(origin => ({id:id(origin),matches:[origin+'/*'],js:['common.js','content.js'],runAt:'document_idle'})));
}
for (const event of [api.runtime.onInstalled,api.runtime.onStartup,api.permissions.onAdded,api.permissions.onRemoved]) event.addListener(() => {syncPortals().catch(() => {});});
async function handle(message, sender) {
 const origin = sender.tab ? (() => {try {return new URL(sender.url || sender.tab.url).origin;} catch {return '';}})() : null;
 const added = await grantedPortals(api.permissions);
 if (origin !== null && !builtInPortal(origin) && !added.includes(origin)) return {ok:false,message:'Bu portal eklenmemiş. Eklenti menüsünden ekleyin.'};
 if (!message || !['status','cards','open'].includes(message.action)) return {ok:false,message:'Geçersiz işlem.'};
 if (message.action === 'open' && !validSigningLink(message.link, origin, added)) return {ok:false,message:'İmza bağlantısı bu portala ait değil veya geçersiz.'};
 // A content script may launch a document, but only the extension UI opens diagnostics.
 if (origin !== null && message.action === 'cards') return {ok:false,message:'Kart kontrolünü eklenti menüsünden açın.'};
 const request = {action:message.action};
 if (message.action === 'open') request.link = message.link;
 return api.runtime.sendNativeMessage(EYAZISMA_HOST, request).catch(() => ({ok:false,message:'Yerel imza uygulamasına ulaşılamadı. Uygulamayı güncelleyip --install-browser-host ile tarayıcı bağlantısını kurun.'}));
}
api.runtime.onMessage.addListener((message, sender, reply) => {
 if (sender.id !== api.runtime.id) return false;
 handle(message, sender).then(reply);
 return true;
});

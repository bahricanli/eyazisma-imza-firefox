const api = typeof browser === 'undefined' ? chrome : browser;
api.runtime.onMessage.addListener((message, sender, reply) => {
 if (sender.id !== api.runtime.id) return false;
 const origin = sender.tab ? (() => {try {return new URL(sender.url || sender.tab.url).origin;} catch {return '';}})() : null;
 if (origin !== null && !EYAZISMA_PORTALS.includes(origin)) {reply({ok:false,message:'Bu portal desteklenmiyor.'});return false;}
 if (!message || !['status','cards','open'].includes(message.action)) {reply({ok:false,message:'Geçersiz işlem.'});return false;}
 if (message.action === 'open' && !validSigningLink(message.link, origin)) {reply({ok:false,message:'İmza bağlantısı bu portala ait değil veya geçersiz.'});return false;}
 // A content script may launch a document, but only the extension UI opens diagnostics.
 if (origin !== null && message.action === 'cards') {reply({ok:false,message:'Kart kontrolünü eklenti menüsünden açın.'});return false;}
 const request = {action:message.action};
 if (message.action === 'open') request.link = message.link;
 api.runtime.sendNativeMessage(EYAZISMA_HOST, request).then(reply).catch(() => reply({ok:false,message:'Yerel imza uygulamasına ulaşılamadı. Uygulamayı güncelleyip --install-browser-host ile tarayıcı bağlantısını kurun.'}));
 return true;
});

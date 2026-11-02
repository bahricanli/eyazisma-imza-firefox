const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.resolve(__dirname,'../extension');const {validSigningLink,builtInPortal,grantedPortals}=require(path.join(root,'common.js'));
const link='https://portal.lkd.org.tr/imza/abcdefghijklmnop1234';
test('Only exact portal signing links are accepted',()=>{
 assert.equal(validSigningLink(link),true);assert.equal(validSigningLink(link,'https://portal.pkd.org.tr'),false);
 for(const value of ['https://evil.example/imza/abcdefghijklmnop','http://portal.lkd.org.tr/imza/abcdefghijklmnop',link+'?token=other',link+'#x','https://user@portal.lkd.org.tr/imza/abcdefghijklmnop','https://portal.lkd.org.tr/imza/%61bcdefghijklmnop'])assert.equal(validSigningLink(value),false,value);
});
function background(origins=[]){let listener;const calls=[];const listeners=[],registered=[];const event={addListener(fn){listeners.push(fn)}};const chrome={permissions:{getAll:async()=>({origins}),onAdded:event,onRemoved:event},scripting:{getRegisteredContentScripts:async()=>registered.slice(),unregisterContentScripts:async({ids})=>{for(const id of ids)registered.splice(registered.findIndex(s=>s.id===id),1)},registerContentScripts:async scripts=>{registered.push(...scripts)}},runtime:{onInstalled:event,onStartup:event,id:'extension-id',onMessage:{addListener(fn){listener=fn}},sendNativeMessage:async(host,message)=>{calls.push({host,message});return{ok:true,version:'test'}}}};const ctx={chrome,URL};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'common.js'),'utf8')+fs.readFileSync(path.join(root,'background.js'),'utf8'),ctx);return{calls,listeners,registered,send:async(message,sender)=>new Promise(resolve=>{const asynchronous=listener(message,sender,resolve);if(asynchronous!==true)setImmediate(()=>resolve(undefined));})};}
test('Content callers cannot forge another portal or access card diagnostics',async()=>{
 const app=background(),sender={id:'extension-id',url:'https://portal.lkd.org.tr/admin/correspondence/1',tab:{url:'https://portal.lkd.org.tr/admin/correspondence/1'}};
 assert.equal((await app.send({action:'open',link},sender)).ok,true);assert.equal(app.calls.length,1);
 assert.equal((await app.send({action:'open',link:'https://portal.pkd.org.tr/imza/abcdefghijklmnop'},sender)).ok,false);
 assert.equal((await app.send({action:'cards'},sender)).ok,false);
 assert.equal((await app.send({action:'open',link}, {...sender,url:'https://evil.example'})).ok,false);
 assert.equal((await app.send({action:'sign',pin:'test'},sender)).ok,false);assert.equal(app.calls.length,1);
 assert.equal(await app.send({action:'open',link},{id:'other'}),undefined);
});
test('Only bounded action fields are passed to native host; popup diagnostics work',async()=>{
 const app=background();assert.equal((await app.send({action:'cards',pin:'test',unexpected:'ignored'},{id:'extension-id'})).ok,true);
 assert.deepEqual(JSON.parse(JSON.stringify(app.calls[0].message)),{action:'cards'});
});
test('Portal submit preserves CSRF submission and stores only path',async()=>{
 const events={},nodes={},storage=new Map(),messages=[];const form={id:'pdf-signing-form',elements:{launch_application:{value:'1'}},target:'_blank',querySelector:()=>({value:'application'}),insertAdjacentElement(){}};
 const anchor={dataset:{signingLink:link},insertAdjacentElement(){}};
 const chrome={runtime:{sendMessage:async(message)=>{messages.push(message);return{ok:true}}}};
 const doc={addEventListener:(type,fn)=>{events[type]=fn},getElementById:id=>nodes[id]||(id==='pdf-signing-form'?form:null),querySelector:()=>anchor,createElement:()=>({setAttribute(){},set id(id){nodes[id]=this},textContent:''})};
 const context={chrome,document:doc,location:{pathname:'/admin/correspondence/1',origin:'https://portal.lkd.org.tr'},sessionStorage:{getItem:key=>storage.get(key),removeItem:key=>storage.delete(key),setItem:(key,value)=>storage.set(key,value)},URL};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'common.js'),'utf8')+fs.readFileSync(path.join(root,'content.js'),'utf8'),context);await new Promise(setImmediate);
 let stopped=false;events.submit({target:form,isTrusted:true,stopImmediatePropagation(){stopped=true}});
 assert.equal(stopped,true);assert.equal(form.elements.launch_application.value,'0');assert.equal(form.target,'_self');assert.deepEqual([...storage.values()],['/admin/correspondence/1']);
 let prevented=false;events.click({target:{closest:()=>anchor},isTrusted:true,preventDefault(){prevented=true},stopImmediatePropagation(){}});await new Promise(setImmediate);assert.equal(prevented,true);assert.equal(messages.at(-1).link,link);
});
test('Built-in portals cover every eyazisma.com.tr host and nothing that imitates it',()=>{
 for(const origin of ['https://eyazisma.com.tr','https://www.eyazisma.com.tr','https://dernek.eyazisma.com.tr','https://portal.pkd.org.tr'])assert.equal(builtInPortal(origin),true,origin);
 for(const origin of ['http://www.eyazisma.com.tr','https://www.eyazisma.com.tr:8443','https://eyazisma.com.tr.evil.example','https://evileyazisma.com.tr','https://evil.example'])assert.equal(builtInPortal(origin),false,origin);
 assert.equal(validSigningLink('https://dernek.eyazisma.com.tr/imza/abcdefghijklmnop'),true);
});
test('Only exact user-granted https hosts count as added portals',async()=>{
 const permissions={getAll:async()=>({origins:['https://belge.dernek.org/*','https://*/*','https://*.eyazisma.com.tr/*','https://www.eyazisma.com.tr/*','http://acik.dernek.org/*','https://portal.lkd.org.tr/admin/correspondence/*']})};
 assert.deepEqual(await grantedPortals(permissions),['https://belge.dernek.org']);
});
test('An added portal may open its own links only, and is registered for content scripts',async()=>{
 const added='https://belge.dernek.org/imza/abcdefghijklmnop',url='https://belge.dernek.org/evrak/1',sender={id:'extension-id',url,tab:{url}};
 const app=background(['https://belge.dernek.org/*']);
 assert.equal((await app.send({action:'open',link:added},sender)).ok,true);
 assert.equal((await app.send({action:'open',link:added},{id:'extension-id'})).ok,true);
 assert.equal((await app.send({action:'open',link},sender)).ok,false);
 const other=background();assert.equal((await other.send({action:'open',link:added},sender)).ok,false);assert.equal((await other.send({action:'open',link:added},{id:'extension-id'})).ok,false);
 app.listeners[0]();await new Promise(setImmediate);await new Promise(setImmediate);
 assert.deepEqual(JSON.parse(JSON.stringify(app.registered.map(s=>[s.id,s.matches]))),[['portal-belge.dernek.org',['https://belge.dernek.org/*']]]);
});

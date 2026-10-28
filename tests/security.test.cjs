const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.resolve(__dirname,'../extension');const {validSigningLink}=require(path.join(root,'common.js'));
const link='https://portal.lkd.org.tr/imza/abcdefghijklmnop1234';
test('Only exact portal signing links are accepted',()=>{
 assert.equal(validSigningLink(link),true);assert.equal(validSigningLink(link,'https://portal.pkd.org.tr'),false);
 for(const value of ['https://evil.example/imza/abcdefghijklmnop','http://portal.lkd.org.tr/imza/abcdefghijklmnop',link+'?token=other',link+'#x','https://user@portal.lkd.org.tr/imza/abcdefghijklmnop','https://portal.lkd.org.tr/imza/%61bcdefghijklmnop'])assert.equal(validSigningLink(value),false,value);
});
function background(){let listener;const calls=[];const chrome={runtime:{id:'extension-id',onMessage:{addListener(fn){listener=fn}},sendNativeMessage:async(host,message)=>{calls.push({host,message});return{ok:true,version:'test'}}}};const ctx={chrome,URL};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'common.js'),'utf8')+fs.readFileSync(path.join(root,'background.js'),'utf8'),ctx);return{calls,send:async(message,sender)=>new Promise(resolve=>{const asynchronous=listener(message,sender,resolve);if(asynchronous!==true)setImmediate(()=>resolve(undefined));})};}
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

try{self["workbox:core:6.5.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:6.5.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}setCatchHandler(e){this.catchHandler=s(e)}}class i extends n{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class a{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:i,route:a}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let r=a&&a.handler;const o=e.method;if(!r&&this.i.has(o)&&(r=this.i.get(o)),!r)return;let c;try{c=r.handle({url:s,request:e,event:t,params:i})}catch(e){c=Promise.reject(e)}const l=a&&a.catchHandler;return c instanceof Promise&&(this.o||l)&&(c=c.catch((async n=>{if(l)try{return await l.handle({url:s,request:e,event:t,params:i})}catch(e){e instanceof Error&&(n=e)}if(this.o)return this.o.handle({url:s,request:e,event:t});throw n}))),c}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const i=this.t.get(s.method)||[];for(const a of i){let i;const r=a.match({url:e,sameOrigin:t,request:s,event:n});if(r)return i=r,(Array.isArray(i)&&0===i.length||r.constructor===Object&&0===Object.keys(r).length||"boolean"==typeof r)&&(i=void 0),{route:a,params:i}}return{}}setDefaultHandler(e,t="GET"){this.i.set(t,s(e))}setCatchHandler(e){this.o=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);function c(e,s,a){let r;if("string"==typeof e){const t=new URL(e,location.href);r=new n((({url:e})=>e.href===t.href),s,a)}else if(e instanceof RegExp)r=new i(e,s,a);else if("function"==typeof e)r=new n(e,s,a);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=e}return o().registerRoute(r),r}try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}const l={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null},h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},f=e=>[h.prefix,e,h.suffix].filter((e=>e&&e.length>0)).join("-"),u=e=>{(e=>{for(const t of Object.keys(h))e(t)})((t=>{"string"==typeof e[t]&&(h[t]=e[t])}))},d=e=>e||f(h.precache),p=e=>e||f(h.runtime);function w(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class g{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const b=new Set;function m(e){return"string"==typeof e?new Request(e):e}class v{constructor(e,t){this.l={},Object.assign(this,t),this.event=t.event,this.h=e,this.u=new g,this.p=[],this.g=[...e.plugins],this.m=new Map;for(const e of this.g)this.m.set(e,{});this.event.waitUntil(this.u.promise)}async fetch(e){const{event:s}=this;let n=m(e);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const i=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))n=await e({request:n.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const a=n.clone();try{let e;e=await fetch(n,"navigate"===n.mode?void 0:this.h.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:a,response:e});return e}catch(e){throw i&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:i.clone(),request:a.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=m(e);let s;const{cacheName:n,matchOptions:i}=this.h,a=await this.getCacheKey(t,"read"),r=Object.assign(Object.assign({},i),{cacheName:n});s=await caches.match(a,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:i,cachedResponse:s,request:a,event:this.event})||void 0;return s}async cachePut(e,s){const n=m(e);var i;await(i=0,new Promise((e=>setTimeout(e,i))));const a=await this.getCacheKey(n,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=a.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const o=await this.v(s);if(!o)return!1;const{cacheName:c,matchOptions:l}=this.h,h=await self.caches.open(c),f=this.hasCallback("cacheDidUpdate"),u=f?await async function(e,t,s,n){const i=w(t.url,s);if(t.url===i)return e.match(t,n);const a=Object.assign(Object.assign({},n),{ignoreSearch:!0}),r=await e.keys(t,a);for(const t of r)if(i===w(t.url,s))return e.match(t,n)}(h,a.clone(),["__WB_REVISION__"],l):null;try{await h.put(a,f?o.clone():o)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of b)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:u,newResponse:o.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this.l[s]){let n=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=m(await e({mode:t,request:n,event:this.event,params:this.params}));this.l[s]=n}return this.l[s]}hasCallback(e){for(const t of this.h.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this.h.plugins)if("function"==typeof t[e]){const s=this.m.get(t),n=n=>{const i=Object.assign(Object.assign({},n),{state:s});return t[e](i)};yield n}}waitUntil(e){return this.p.push(e),e}async doneWaiting(){let e;for(;e=this.p.shift();)await e}destroy(){this.u.resolve(null)}async v(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class y{constructor(e={}){this.cacheName=p(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,i=new v(this,{event:t,request:s,params:n}),a=this.R(i,s,t);return[a,this.q(a,i,s,t)]}async R(e,s,n){let i;await e.runCallbacks("handlerWillStart",{event:n,request:s});try{if(i=await this.U(s,e),!i||"error"===i.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const a of e.iterateCallbacks("handlerDidError"))if(i=await a({error:t,event:n,request:s}),i)break;if(!i)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))i=await t({event:n,request:s,response:i});return i}async q(e,t,s,n){let i,a;try{i=await e}catch(a){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:i}),await t.doneWaiting()}catch(e){e instanceof Error&&(a=e)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:i,error:a}),t.destroy(),a)throw a}}function x(e,t){const s=t();return e.waitUntil(s),s}try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}function R(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),a=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:a.href}}class q{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class U{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this.j.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this.j=e}}let j,L;async function E(e,s){let n=null;if(e.url){n=new URL(e.url).origin}if(n!==self.location.origin)throw new t("cross-origin-copy-response",{origin:n});const i=e.clone(),a={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},r=s?s(a):a,o=function(){if(void 0===j){const e=new Response("");if("body"in e)try{new Response(e.body),j=!0}catch(e){j=!1}j=!1}return j}()?i.body:await i.blob();return new Response(o,r)}class k extends y{constructor(e={}){e.cacheName=d(e.cacheName),super(e),this.L=!1!==e.fallbackToNetwork,this.plugins.push(k.copyRedirectedCacheableResponsesPlugin)}async U(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._(e,t):await this.k(e,t))}async k(e,s){let n;const i=s.params||{};if(!this.L)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const t=i.integrity,a=e.integrity,r=!a||a===t;n=await s.fetch(new Request(e,{integrity:"no-cors"!==e.mode?a||t:void 0})),t&&r&&"no-cors"!==e.mode&&(this.C(),await s.cachePut(e,n.clone()))}return n}async _(e,s){this.C();const n=await s.fetch(e);if(!await s.cachePut(e,n.clone()))throw new t("bad-precaching-response",{url:e.url,status:n.status});return n}C(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==k.copyRedirectedCacheableResponsesPlugin&&(n===k.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(k.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}k.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},k.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await E(e):e};class C{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this.O=new Map,this.N=new Map,this.P=new Map,this.h=new k({cacheName:d(e),plugins:[...t,new U({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.h}precache(e){this.addToCacheList(e),this.T||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.T=!0)}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=R(n),a="string"!=typeof n&&n.revision?"reload":"default";if(this.O.has(i)&&this.O.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.O.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.P.has(e)&&this.P.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.P.set(e,n.integrity)}if(this.O.set(i,e),this.N.set(i,a),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return x(e,(async()=>{const t=new q;this.strategy.plugins.push(t);for(const[t,s]of this.O){const n=this.P.get(s),i=this.N.get(t),a=new Request(t,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:a,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return x(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this.O.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.O}getCachedURLs(){return[...this.O.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.O.get(t.href)}getIntegrityForCacheKey(e){return this.P.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}const O=()=>(L||(L=new C),L);class N extends n{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const i of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const a=new URL(e,location.href);a.hash="",yield a.href;const r=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(a,t);if(yield r.href,s&&r.pathname.endsWith("/")){const e=new URL(r.href);e.pathname+=s,yield e.href}if(n){const e=new URL(r.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:a});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(i);if(t){return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}}),e.strategy)}}var P;u({prefix:"EleventyPluginWorkbox"}),self.skipWaiting(),self.addEventListener("activate",(()=>self.clients.claim())),P={directoryIndex:"index.html"},function(e){O().precache(e)}([{url:"/learning-spanish/404.html",revision:"3e834c7543d26500305089b85bce59c6"},{url:"/learning-spanish/index.html",revision:"36be4add1417c8c82e1d59be4fba936e"},{url:"/learning-spanish/manifest.json",revision:"a2f124b819407e5b41b3a2563216688a"},{url:"/learning-spanish/about/index.html",revision:"05763c3f6052b38957ac0f7a142e336f"},{url:"/learning-spanish/assets/js/webcomponent-crossword.js",revision:"490ce5718dfd8ab3fc7272a47b277e39"},{url:"/learning-spanish/assets/js/webcomponent-word-matcher.js",revision:"738750f14c4385f56b7e9f52deaee918"},{url:"/learning-spanish/assets/js/webcomponent-wordlist.js",revision:"2e13ba2b07be49ad859b05af5311d311"},{url:"/learning-spanish/crossword/index.html",revision:"330ab4e0095db9644d814b6373edc4ec"},{url:"/learning-spanish/css/index.css",revision:"cf68174d8738ea751739540f074658e4"},{url:"/learning-spanish/css/prism-base16-monokai.dark.css",revision:"78a9f1ae86e02f4646c65023ae0a14b9"},{url:"/learning-spanish/css/prism-diff.css",revision:"1c6fd5639e28d20a1a965254e25b226a"},{url:"/learning-spanish/feed/feed.json",revision:"1710104d2a0d4da1e08c6a4562074d02"},{url:"/learning-spanish/img/color-scheme-dark.svg",revision:"84c01673bca54f46b3889af7ab10f9d5"},{url:"/learning-spanish/img/color-scheme-light.svg",revision:"6989b24010d8fa2a9ae07cf52118e225"},{url:"/learning-spanish/img/favicon/favicon.ico",revision:"2f9b39d6f478643e8e0154fcbb08e462"},{url:"/learning-spanish/page-list/1/index.html",revision:"edb178109cd4e31410ca7c1de892e6f1"},{url:"/learning-spanish/page-list/index.html",revision:"ad8fad7dac0cf4c2682b74d288fda36e"},{url:"/learning-spanish/posts/cosmopolitanCourseA1/index.html",revision:"15e16204519bd225623e3812dfefa8d9"},{url:"/learning-spanish/posts/cosmopolitanCourseA2/index.html",revision:"ab1b8ba5188b4a220ca87b4c4880f4e9"},{url:"/learning-spanish/posts/cosmopolitanCourseB1/index.html",revision:"c23410d67b339ba47a1f1f03e391bf2e"},{url:"/learning-spanish/posts/index.html",revision:"e2c30b2ff73873aef2b33560a45bb879"},{url:"/learning-spanish/posts/nyelvtan-elbeszelo-mult/index.html",revision:"8880c45b67203e92f400f547a32cca13"},{url:"/learning-spanish/posts/nyelvtan-felszolito-mod/index.html",revision:"34172251e4e73cb288235c6d8bf5653e"},{url:"/learning-spanish/posts/nyelvtan-felteteteles-mod/index.html",revision:"ac0050eed199bfb57c5b7f5c52631d69"},{url:"/learning-spanish/posts/nyelvtan-folyamatos-mult/index.html",revision:"4d0bbdb25cfd010955de063136470468"},{url:"/learning-spanish/posts/nyelvtan-fuggo-beszed/index.html",revision:"9b48bc785785d557c31483acac8d297a"},{url:"/learning-spanish/posts/nyelvtan-gerundio/index.html",revision:"bee34a4f98f9ecf11b804b7307bc15e9"},{url:"/learning-spanish/posts/nyelvtan-jelen-ido/index.html",revision:"c3197524fe2865ddd1bfb4aa8a6ce98b"},{url:"/learning-spanish/posts/nyelvtan-jovo-ido/index.html",revision:"0b9941c223ab6744731da88fb8b85a54"},{url:"/learning-spanish/posts/nyelvtan-kozeljovo/index.html",revision:"20569bbd6dc1f7a2e27fb4641e3184e2"},{url:"/learning-spanish/posts/nyelvtan-kozelmult/index.html",revision:"63e2d8d213d18581cbc7316f4af4abff"},{url:"/learning-spanish/posts/nyelvtan-regmult/index.html",revision:"aa92de5ac8c7ddb8cf21c7a5850d186e"},{url:"/learning-spanish/posts/nyelvtan-subjuntivo-jelen/index.html",revision:"145039ef1a457bfd34b4339fcef7c0c5"},{url:"/learning-spanish/posts/nyelvtan-subjuntivo-kozelmult/index.html",revision:"cc4d7751118e88fc99d2f96d0aedd382"},{url:"/learning-spanish/posts/szamok/index.html",revision:"3e89c7ccb8feb1b9e41dd586ff812e14"},{url:"/learning-spanish/public/spain-flag-icon.png",revision:"91d9442ff57c60b462463ba453400ad2"},{url:"/learning-spanish/public/spanish-hungarian.json",revision:"82b0a1af6e93f4a1d85bfafc3fc98646"},{url:"/learning-spanish/szavak/index.html",revision:"494e36d8bc5ce2bc85a1215f0a0dda91"},{url:"/learning-spanish/tagbrowser/index.html",revision:"54c8581abbde3c6fa73d8f5898c243db"},{url:"/learning-spanish/tags/fueggobeszed/index.html",revision:"3cd503d1d353048d01ef2b655f56f035"},{url:"/learning-spanish/tags/gerundio/index.html",revision:"633c0de13be3fa67ad0008e15b2e53fd"},{url:"/learning-spanish/tags/igeido/index.html",revision:"be3885bbfebd896ec37ad616b9fc13e1"},{url:"/learning-spanish/tags/igemod/index.html",revision:"f1feed7117bc4ae5bcf253bab9db755c"},{url:"/learning-spanish/tags/index.html",revision:"f1ad8fffc6a4ae479d34973b64b925d1"},{url:"/learning-spanish/tags/jelen/index.html",revision:"5b0c33c0ed1afbd6df7060ee758fd71b"},{url:"/learning-spanish/tags/joevo/index.html",revision:"e513dd289db718b1bf1a1b298e40e900"},{url:"/learning-spanish/tags/koetomod/index.html",revision:"2179a7dd32177634e8c908d990b801c2"},{url:"/learning-spanish/tags/kurzus/index.html",revision:"85e06016973bb0af9d364378f3d0dfc1"},{url:"/learning-spanish/tags/mult/index.html",revision:"4f8283b4dae6c4c699f5ca627d5ee5dd"},{url:"/learning-spanish/tags/nyelvtan/index.html",revision:"9e26590b8104c09e1f376a690e9752a3"},{url:"/learning-spanish/tags/participio/index.html",revision:"204732fbf1a996caddb39a601b87c0e3"},{url:"/learning-spanish/tags/szamok/index.html",revision:"39d0ad1c7303244c68a9c527b3bc963b"},{url:"/learning-spanish/word-matcher/index.html",revision:"084b9424a246d638f6ca91e8412d560c"}]),function(e){const t=O();c(new N(t,e))}(P),self.addEventListener("activate",(e=>{const t=d();e.waitUntil((async(e,t="-precache-")=>{const s=(await self.caches.keys()).filter((s=>s.includes(t)&&s.includes(self.registration.scope)&&s!==e));return await Promise.all(s.map((e=>self.caches.delete(e)))),s})(t).then((e=>{})))})),c((({url:e})=>!new RegExp(`.+\\.(?:${["jpg","png","gif","ico","svg","jpeg","avif","webp","eot","ttf","otf","ttc","woff","woff2"].join("|")})`).test(e)),new class extends y{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(l),this.W=e.networkTimeoutSeconds||0}async U(e,s){const n=[],i=[];let a;if(this.W){const{id:t,promise:r}=this.K({request:e,logs:n,handler:s});a=t,i.push(r)}const r=this.I({timeoutId:a,request:e,logs:n,handler:s});i.push(r);const o=await s.waitUntil((async()=>await s.waitUntil(Promise.race(i))||await r)());if(!o)throw new t("no-response",{url:e.url});return o}K({request:e,logs:t,handler:s}){let n;return{promise:new Promise((t=>{n=setTimeout((async()=>{t(await s.cacheMatch(e))}),1e3*this.W)})),id:n}}async I({timeoutId:e,request:t,logs:s,handler:n}){let i,a;try{a=await n.fetchAndCachePut(t)}catch(e){e instanceof Error&&(i=e)}return e&&clearTimeout(e),!i&&a||(a=await n.cacheMatch(t)),a}},"GET"),c(/.+\.(?:eot|ttf|otf|ttc|woff|woff2|jpg|png|gif|ico|svg|jpeg|avif|webp)$/,new class extends y{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(l)}async U(e,s){const n=s.fetchAndCachePut(e).catch((()=>{}));s.waitUntil(n);let i,a=await s.cacheMatch(e);if(a);else try{a=await n}catch(e){e instanceof Error&&(i=e)}if(!a)throw new t("no-response",{url:e.url,error:i});return a}},"GET");

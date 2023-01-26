try{self["workbox:core:6.5.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:6.5.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}setCatchHandler(e){this.catchHandler=s(e)}}class i extends n{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class r{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:i,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let a=r&&r.handler;const o=e.method;if(!a&&this.i.has(o)&&(a=this.i.get(o)),!a)return;let c;try{c=a.handle({url:s,request:e,event:t,params:i})}catch(e){c=Promise.reject(e)}const l=r&&r.catchHandler;return c instanceof Promise&&(this.o||l)&&(c=c.catch((async n=>{if(l)try{return await l.handle({url:s,request:e,event:t,params:i})}catch(e){e instanceof Error&&(n=e)}if(this.o)return this.o.handle({url:s,request:e,event:t});throw n}))),c}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const i=this.t.get(s.method)||[];for(const r of i){let i;const a=r.match({url:e,sameOrigin:t,request:s,event:n});if(a)return i=a,(Array.isArray(i)&&0===i.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(e,t="GET"){this.i.set(t,s(e))}setCatchHandler(e){this.o=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let a;const o=()=>(a||(a=new r,a.addFetchListener(),a.addCacheListener()),a);function c(e,s,r){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n((({url:e})=>e.href===t.href),s,r)}else if(e instanceof RegExp)a=new i(e,s,r);else if("function"==typeof e)a=new n(e,s,r);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}return o().registerRoute(a),a}try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}const l={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null},h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},f=e=>[h.prefix,e,h.suffix].filter((e=>e&&e.length>0)).join("-"),u=e=>{(e=>{for(const t of Object.keys(h))e(t)})((t=>{"string"==typeof e[t]&&(h[t]=e[t])}))},d=e=>e||f(h.precache),w=e=>e||f(h.runtime);function p(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class b{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const m=new Set;function v(e){return"string"==typeof e?new Request(e):e}class y{constructor(e,t){this.l={},Object.assign(this,t),this.event=t.event,this.h=e,this.u=new b,this.p=[],this.m=[...e.plugins],this.v=new Map;for(const e of this.m)this.v.set(e,{});this.event.waitUntil(this.u.promise)}async fetch(e){const{event:s}=this;let n=v(e);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const i=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))n=await e({request:n.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const r=n.clone();try{let e;e=await fetch(n,"navigate"===n.mode?void 0:this.h.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw i&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:i.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=v(e);let s;const{cacheName:n,matchOptions:i}=this.h,r=await this.getCacheKey(t,"read"),a=Object.assign(Object.assign({},i),{cacheName:n});s=await caches.match(r,a);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:i,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,s){const n=v(e);var i;await(i=0,new Promise((e=>setTimeout(e,i))));const r=await this.getCacheKey(n,"write");if(!s)throw new t("cache-put-with-no-response",{url:(a=r.url,new URL(String(a),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var a;const o=await this.g(s);if(!o)return!1;const{cacheName:c,matchOptions:l}=this.h,h=await self.caches.open(c),f=this.hasCallback("cacheDidUpdate"),u=f?await async function(e,t,s,n){const i=p(t.url,s);if(t.url===i)return e.match(t,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),a=await e.keys(t,r);for(const t of a)if(i===p(t.url,s))return e.match(t,n)}(h,r.clone(),["__WB_REVISION__"],l):null;try{await h.put(r,f?o.clone():o)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of m)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:u,newResponse:o.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this.l[s]){let n=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=v(await e({mode:t,request:n,event:this.event,params:this.params}));this.l[s]=n}return this.l[s]}hasCallback(e){for(const t of this.h.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this.h.plugins)if("function"==typeof t[e]){const s=this.v.get(t),n=n=>{const i=Object.assign(Object.assign({},n),{state:s});return t[e](i)};yield n}}waitUntil(e){return this.p.push(e),e}async doneWaiting(){let e;for(;e=this.p.shift();)await e}destroy(){this.u.resolve(null)}async g(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g{constructor(e={}){this.cacheName=w(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,i=new y(this,{event:t,request:s,params:n}),r=this.R(i,s,t);return[r,this.q(r,i,s,t)]}async R(e,s,n){let i;await e.runCallbacks("handlerWillStart",{event:n,request:s});try{if(i=await this.U(s,e),!i||"error"===i.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(i=await r({error:t,event:n,request:s}),i)break;if(!i)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))i=await t({event:n,request:s,response:i});return i}async q(e,t,s,n){let i,r;try{i=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:i}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:i,error:r}),t.destroy(),r)throw r}}function x(e,t){const s=t();return e.waitUntil(s),s}try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}function R(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),r=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:r.href}}class q{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class U{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this.j.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this.j=e}}let j,L;async function E(e,s){let n=null;if(e.url){n=new URL(e.url).origin}if(n!==self.location.origin)throw new t("cross-origin-copy-response",{origin:n});const i=e.clone(),r={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},a=s?s(r):r,o=function(){if(void 0===j){const e=new Response("");if("body"in e)try{new Response(e.body),j=!0}catch(e){j=!1}j=!1}return j}()?i.body:await i.blob();return new Response(o,a)}class k extends g{constructor(e={}){e.cacheName=d(e.cacheName),super(e),this.L=!1!==e.fallbackToNetwork,this.plugins.push(k.copyRedirectedCacheableResponsesPlugin)}async U(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._(e,t):await this.k(e,t))}async k(e,s){let n;const i=s.params||{};if(!this.L)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const t=i.integrity,r=e.integrity,a=!r||r===t;n=await s.fetch(new Request(e,{integrity:"no-cors"!==e.mode?r||t:void 0})),t&&a&&"no-cors"!==e.mode&&(this.C(),await s.cachePut(e,n.clone()))}return n}async _(e,s){this.C();const n=await s.fetch(e);if(!await s.cachePut(e,n.clone()))throw new t("bad-precaching-response",{url:e.url,status:n.status});return n}C(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==k.copyRedirectedCacheableResponsesPlugin&&(n===k.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(k.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}k.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},k.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await E(e):e};class C{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this.O=new Map,this.N=new Map,this.P=new Map,this.h=new k({cacheName:d(e),plugins:[...t,new U({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.h}precache(e){this.addToCacheList(e),this.T||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.T=!0)}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=R(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this.O.has(i)&&this.O.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.O.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.P.has(e)&&this.P.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.P.set(e,n.integrity)}if(this.O.set(i,e),this.N.set(i,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return x(e,(async()=>{const t=new q;this.strategy.plugins.push(t);for(const[t,s]of this.O){const n=this.P.get(s),i=this.N.get(t),r=new Request(t,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return x(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this.O.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.O}getCachedURLs(){return[...this.O.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.O.get(t.href)}getIntegrityForCacheKey(e){return this.P.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}const O=()=>(L||(L=new C),L);class N extends n{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const i of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(i);if(t){return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}}),e.strategy)}}var P;u({prefix:"EleventyPluginWorkbox"}),self.skipWaiting(),self.addEventListener("activate",(()=>self.clients.claim())),P={directoryIndex:"index.html"},function(e){O().precache(e)}([{url:"/404.html",revision:"69cd829e56c79c35f9ea74473b2155e2"},{url:"/index.html",revision:"59e148eb8b2f43ba625e7dd6bc5f4d8b"},{url:"/manifest.json",revision:"49e5f7af295d3fab43df5e845b696341"},{url:"/about/index.html",revision:"666174d4f290794fa04b0087f6eac5c2"},{url:"/assets/js/webcomponent-crossword.js",revision:"352c8d239efc673cab588f4212a5acc8"},{url:"/assets/js/webcomponent-word-matcher.js",revision:"3546613d815a226e7b40c8fffdcaf4a8"},{url:"/assets/js/webcomponent-wordlist.js",revision:"9e525d3bd4ee39dfb8447f14479ab482"},{url:"/crossword/index.html",revision:"51477714b00265f21e04ac8faec3e38f"},{url:"/css/index.css",revision:"af18274d278854c1fadc5be39abc6242"},{url:"/css/prism-base16-monokai.dark.css",revision:"78a9f1ae86e02f4646c65023ae0a14b9"},{url:"/css/prism-diff.css",revision:"1c6fd5639e28d20a1a965254e25b226a"},{url:"/feed/feed.json",revision:"198790dcb852bcc093f2a621ceea100c"},{url:"/img/color-scheme-dark.svg",revision:"84c01673bca54f46b3889af7ab10f9d5"},{url:"/img/color-scheme-light.svg",revision:"6989b24010d8fa2a9ae07cf52118e225"},{url:"/img/favicon/favicon.ico",revision:"2f9b39d6f478643e8e0154fcbb08e462"},{url:"/page-list/1/index.html",revision:"4e414a959c805e4a01eceb34eddf235a"},{url:"/page-list/index.html",revision:"5b9e70ee4eea86eb64440a7d6c26a78d"},{url:"/posts/cosmopolitanCourseA1/index.html",revision:"bec32208be9ae892e4db9bea54fc53b8"},{url:"/posts/cosmopolitanCourseA2/index.html",revision:"365631a856be67f53ce8bfa27fd55c38"},{url:"/posts/cosmopolitanCourseB1/index.html",revision:"15b72b1a3493457871fafa308dc8415a"},{url:"/posts/index.html",revision:"31bc6131a61457d0d73889436c21b7c7"},{url:"/posts/nyelvtan-elbeszelo-mult/index.html",revision:"7c17659645a4a8e09a5775c547d708ad"},{url:"/posts/nyelvtan-felszolito-mod/index.html",revision:"c38146f2f35f26fd54f8f6957d3b79b1"},{url:"/posts/nyelvtan-felteteteles-mod/index.html",revision:"6544f46e1c37a179e4c5bc3fafd95c89"},{url:"/posts/nyelvtan-folyamatos-mult/index.html",revision:"3dfa7de8b249887fa601a03e78fb6f7b"},{url:"/posts/nyelvtan-gerundio/index.html",revision:"18daf43c6c1a894f97d87c353b16113f"},{url:"/posts/nyelvtan-jelen-ido/index.html",revision:"d39ad90efadfc471a983254e36d655de"},{url:"/posts/nyelvtan-jovo-ido/index.html",revision:"3a9f937dad7e2bdfc5cc445ded47d5e1"},{url:"/posts/nyelvtan-kozeljovo/index.html",revision:"e38972b4ea83ad3dd971adb26a442bce"},{url:"/posts/nyelvtan-kozelmult/index.html",revision:"36fe98917fd3a3ab2c19b1c2ca1fb5d9"},{url:"/posts/nyelvtan-regmult/index.html",revision:"d7b4bd10e0ace003eb196c9e9b32f8a1"},{url:"/posts/nyelvtan-subjuntivo-jelen/index.html",revision:"26376911c4782ad6d562ef0b869b8223"},{url:"/posts/szamok/index.html",revision:"2b9486e88a590fdefb1bbae5ef893973"},{url:"/public/spain-flag-icon.png",revision:"91d9442ff57c60b462463ba453400ad2"},{url:"/public/spanish-hungarian.json",revision:"56a16f7bc2c42ce300eabfd687a13b6c"},{url:"/szavak/index.html",revision:"f2a5aadd70ded8b3710c21d9f01ae377"},{url:"/tagbrowser/index.html",revision:"feabb6baa64ac052db7619956a49af44"},{url:"/tags/gerundio/index.html",revision:"fa533a0c2891efa819ca3eedbb336c01"},{url:"/tags/igeido/index.html",revision:"2ac2f1ac9a4afb37648ddcf10588c6a1"},{url:"/tags/igemod/index.html",revision:"b307fec59ce447e5507fc41d08264ad2"},{url:"/tags/index.html",revision:"0309ca6545f61ac9b40077d3029d7751"},{url:"/tags/jelen/index.html",revision:"4acdd98deaa5341bd36abc07072c8b36"},{url:"/tags/joevo/index.html",revision:"7a1254bba58945c616f12dae03aebe6c"},{url:"/tags/koetomod/index.html",revision:"8cf7f2b705baba16148dc513bafda229"},{url:"/tags/kurzus/index.html",revision:"4362fb342a989c4fd99675f5bcdf851a"},{url:"/tags/mult/index.html",revision:"d066b0f7cd1a4c82219825ba1dc3898b"},{url:"/tags/nyelvtan/index.html",revision:"6afa3f51bbbbf18b375000addd3426bd"},{url:"/tags/participio/index.html",revision:"3351e0ad5a77afa1f2eeacd3b10e6a2f"},{url:"/tags/szamok/index.html",revision:"e75322c8b3bdf04d73e8c3cdb427cb32"},{url:"/word-matcher/index.html",revision:"5af02442497ae41518f9047ff669652b"}]),function(e){const t=O();c(new N(t,e))}(P),self.addEventListener("activate",(e=>{const t=d();e.waitUntil((async(e,t="-precache-")=>{const s=(await self.caches.keys()).filter((s=>s.includes(t)&&s.includes(self.registration.scope)&&s!==e));return await Promise.all(s.map((e=>self.caches.delete(e)))),s})(t).then((e=>{})))})),c((({url:e})=>!new RegExp(`.+\\.(?:${["jpg","png","gif","ico","svg","jpeg","avif","webp","eot","ttf","otf","ttc","woff","woff2"].join("|")})`).test(e)),new class extends g{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(l),this.W=e.networkTimeoutSeconds||0}async U(e,s){const n=[],i=[];let r;if(this.W){const{id:t,promise:a}=this.K({request:e,logs:n,handler:s});r=t,i.push(a)}const a=this.I({timeoutId:r,request:e,logs:n,handler:s});i.push(a);const o=await s.waitUntil((async()=>await s.waitUntil(Promise.race(i))||await a)());if(!o)throw new t("no-response",{url:e.url});return o}K({request:e,logs:t,handler:s}){let n;return{promise:new Promise((t=>{n=setTimeout((async()=>{t(await s.cacheMatch(e))}),1e3*this.W)})),id:n}}async I({timeoutId:e,request:t,logs:s,handler:n}){let i,r;try{r=await n.fetchAndCachePut(t)}catch(e){e instanceof Error&&(i=e)}return e&&clearTimeout(e),!i&&r||(r=await n.cacheMatch(t)),r}},"GET"),c(/.+\.(?:eot|ttf|otf|ttc|woff|woff2|jpg|png|gif|ico|svg|jpeg|avif|webp)$/,new class extends g{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(l)}async U(e,s){const n=s.fetchAndCachePut(e).catch((()=>{}));s.waitUntil(n);let i,r=await s.cacheMatch(e);if(r);else try{r=await n}catch(e){e instanceof Error&&(i=e)}if(!r)throw new t("no-response",{url:e.url,error:i});return r}},"GET");
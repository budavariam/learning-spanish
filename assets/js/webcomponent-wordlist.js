function t(t){return Array.isArray?Array.isArray(t):"[object Array]"===c(t)}function e(t){return"string"==typeof t}function i(t){return"number"==typeof t}function s(t){return!0===t||!1===t||function(t){return n(t)&&null!==t}(t)&&"[object Boolean]"==c(t)}function n(t){return"object"==typeof t}function r(t){return null!=t}function o(t){return!t.trim().length}function c(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":Object.prototype.toString.call(t)}const h=Object.prototype.hasOwnProperty;class l{constructor(t){this._keys=[],this._keyMap={};let e=0;t.forEach((t=>{let i=a(t);e+=i.weight,this._keys.push(i),this._keyMap[i.id]=i,e+=i.weight})),this._keys.forEach((t=>{t.weight/=e}))}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function a(i){let s=null,n=null,r=null,o=1,c=null;if(e(i)||t(i))r=i,s=u(i),n=d(i);else{if(!h.call(i,"name"))throw new Error((t=>`Missing ${t} property in key`)("name"));const t=i.name;if(r=t,h.call(i,"weight")&&(o=i.weight,o<=0))throw new Error((t=>`Property 'weight' in key '${t}' must be a positive integer`)(t));s=u(t),n=d(t),c=i.getFn}return{path:s,id:n,weight:o,src:r,getFn:c}}function u(e){return t(e)?e:e.split(".")}function d(e){return t(e)?e.join("."):e}const f={useExtendedSearch:!1,getFn:function(n,o){let c=[],h=!1;const l=(n,o,a)=>{if(r(n))if(o[a]){const u=n[o[a]];if(!r(u))return;if(a===o.length-1&&(e(u)||i(u)||s(u)))c.push(function(t){return null==t?"":function(t){if("string"==typeof t)return t;let e=t+"";return"0"==e&&1/t==-1/0?"-0":e}(t)}(u));else if(t(u)){h=!0;for(let t=0,e=u.length;t<e;t+=1)l(u[t],o,a+1)}else o.length&&l(u,o,a+1)}else c.push(n)};return l(n,e(o)?o.split("."):o,0),h?c:c[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var v={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(t,e)=>t.score===e.score?t.idx<e.idx?-1:1:t.score<e.score?-1:1,includeMatches:!1,findAllMatches:!1,minMatchCharLength:1,location:0,threshold:.6,distance:100,...f};const g=/[^ ]+/g;class p{constructor({getFn:t=v.getFn,fieldNormWeight:e=v.fieldNormWeight}={}){this.norm=function(t=1,e=3){const i=new Map,s=Math.pow(10,e);return{get(e){const n=e.match(g).length;if(i.has(n))return i.get(n);const r=1/Math.pow(n,.5*t),o=parseFloat(Math.round(r*s)/s);return i.set(n,o),o},clear(){i.clear()}}}(e,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach(((t,e)=>{this._keysMap[t.id]=e}))}create(){!this.isCreated&&this.docs.length&&(this.isCreated=!0,e(this.docs[0])?this.docs.forEach(((t,e)=>{this._addString(t,e)})):this.docs.forEach(((t,e)=>{this._addObject(t,e)})),this.norm.clear())}add(t){const i=this.size();e(t)?this._addString(t,i):this._addObject(t,i)}removeAt(t){this.records.splice(t,1);for(let e=t,i=this.size();e<i;e+=1)this.records[e].i-=1}getValueForItemAtKeyId(t,e){return t[this._keysMap[e]]}size(){return this.records.length}_addString(t,e){if(!r(t)||o(t))return;let i={v:t,i:e,n:this.norm.get(t)};this.records.push(i)}_addObject(i,s){let n={i:s,$:{}};this.keys.forEach(((s,c)=>{let h=s.getFn?s.getFn(i):this.getFn(i,s.path);if(r(h))if(t(h)){let i=[];const s=[{nestedArrIndex:-1,value:h}];for(;s.length;){const{nestedArrIndex:n,value:c}=s.pop();if(r(c))if(e(c)&&!o(c)){let t={v:c,i:n,n:this.norm.get(c)};i.push(t)}else t(c)&&c.forEach(((t,e)=>{s.push({nestedArrIndex:e,value:t})}))}n.$[c]=i}else if(e(h)&&!o(h)){let t={v:h,n:this.norm.get(h)};n.$[c]=t}})),this.records.push(n)}toJSON(){return{keys:this.keys,records:this.records}}}function y(t,e,{getFn:i=v.getFn,fieldNormWeight:s=v.fieldNormWeight}={}){const n=new p({getFn:i,fieldNormWeight:s});return n.setKeys(t.map(a)),n.setSources(e),n.create(),n}function m(t,{errors:e=0,currentLocation:i=0,expectedLocation:s=0,distance:n=v.distance,ignoreLocation:r=v.ignoreLocation}={}){const o=e/t.length;if(r)return o;const c=Math.abs(s-i);return n?o+c/n:c?1:o}function M(t,e,i,{location:s=v.location,distance:n=v.distance,threshold:r=v.threshold,findAllMatches:o=v.findAllMatches,minMatchCharLength:c=v.minMatchCharLength,includeMatches:h=v.includeMatches,ignoreLocation:l=v.ignoreLocation}={}){if(e.length>32)throw new Error(`Pattern length exceeds max of ${32}.`);const a=e.length,u=t.length,d=Math.max(0,Math.min(s,u));let f=r,g=d;const p=c>1||h,y=p?Array(u):[];let M;for(;(M=t.indexOf(e,g))>-1;){let t=m(e,{currentLocation:M,expectedLocation:d,distance:n,ignoreLocation:l});if(f=Math.min(t,f),g=M+a,p){let t=0;for(;t<a;)y[M+t]=1,t+=1}}g=-1;let b=[],x=1,$=a+u;const w=1<<a-1;for(let s=0;s<a;s+=1){let r=0,c=$;for(;r<c;){m(e,{errors:s,currentLocation:d+c,expectedLocation:d,distance:n,ignoreLocation:l})<=f?r=c:$=c,c=Math.floor(($-r)/2+r)}$=c;let h=Math.max(1,d-c+1),v=o?u:Math.min(d+c,u)+a,M=Array(v+2);M[v+1]=(1<<s)-1;for(let r=v;r>=h;r-=1){let o=r-1,c=i[t.charAt(o)];if(p&&(y[o]=+!!c),M[r]=(M[r+1]<<1|1)&c,s&&(M[r]|=(b[r+1]|b[r])<<1|1|b[r+1]),M[r]&w&&(x=m(e,{errors:s,currentLocation:o,expectedLocation:d,distance:n,ignoreLocation:l}),x<=f)){if(f=x,g=o,g<=d)break;h=Math.max(1,2*d-g)}}if(m(e,{errors:s+1,currentLocation:d,expectedLocation:d,distance:n,ignoreLocation:l})>f)break;b=M}const S={isMatch:g>=0,score:Math.max(.001,x)};if(p){const t=function(t=[],e=v.minMatchCharLength){let i=[],s=-1,n=-1,r=0;for(let o=t.length;r<o;r+=1){let o=t[r];o&&-1===s?s=r:o||-1===s||(n=r-1,n-s+1>=e&&i.push([s,n]),s=-1)}return t[r-1]&&r-s>=e&&i.push([s,r-1]),i}(y,c);t.length?h&&(S.indices=t):S.isMatch=!1}return S}function b(t){let e={};for(let i=0,s=t.length;i<s;i+=1){const n=t.charAt(i);e[n]=(e[n]||0)|1<<s-i-1}return e}class x{constructor(t,{location:e=v.location,threshold:i=v.threshold,distance:s=v.distance,includeMatches:n=v.includeMatches,findAllMatches:r=v.findAllMatches,minMatchCharLength:o=v.minMatchCharLength,isCaseSensitive:c=v.isCaseSensitive,ignoreLocation:h=v.ignoreLocation}={}){if(this.options={location:e,threshold:i,distance:s,includeMatches:n,findAllMatches:r,minMatchCharLength:o,isCaseSensitive:c,ignoreLocation:h},this.pattern=c?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const l=(t,e)=>{this.chunks.push({pattern:t,alphabet:b(t),startIndex:e})},a=this.pattern.length;if(a>32){let t=0;const e=a%32,i=a-e;for(;t<i;)l(this.pattern.substr(t,32),t),t+=32;if(e){const t=a-32;l(this.pattern.substr(t),t)}}else l(this.pattern,0)}searchIn(t){const{isCaseSensitive:e,includeMatches:i}=this.options;if(e||(t=t.toLowerCase()),this.pattern===t){let e={isMatch:!0,score:0};return i&&(e.indices=[[0,t.length-1]]),e}const{location:s,distance:n,threshold:r,findAllMatches:o,minMatchCharLength:c,ignoreLocation:h}=this.options;let l=[],a=0,u=!1;this.chunks.forEach((({pattern:e,alphabet:d,startIndex:f})=>{const{isMatch:v,score:g,indices:p}=M(t,e,d,{location:s+f,distance:n,threshold:r,findAllMatches:o,minMatchCharLength:c,includeMatches:i,ignoreLocation:h});v&&(u=!0),a+=g,v&&p&&(l=[...l,...p])}));let d={isMatch:u,score:u?a/this.chunks.length:1};return u&&i&&(d.indices=l),d}}class ${constructor(t){this.pattern=t}static isMultiMatch(t){return w(t,this.multiRegex)}static isSingleMatch(t){return w(t,this.singleRegex)}search(){}}function w(t,e){const i=t.match(e);return i?i[1]:null}class S extends ${constructor(t,{location:e=v.location,threshold:i=v.threshold,distance:s=v.distance,includeMatches:n=v.includeMatches,findAllMatches:r=v.findAllMatches,minMatchCharLength:o=v.minMatchCharLength,isCaseSensitive:c=v.isCaseSensitive,ignoreLocation:h=v.ignoreLocation}={}){super(t),this._bitapSearch=new x(t,{location:e,threshold:i,distance:s,includeMatches:n,findAllMatches:r,minMatchCharLength:o,isCaseSensitive:c,ignoreLocation:h})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class A extends ${constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let e,i=0;const s=[],n=this.pattern.length;for(;(e=t.indexOf(this.pattern,i))>-1;)i=e+n,s.push([e,i-1]);const r=!!s.length;return{isMatch:r,score:r?0:1,indices:s}}}const L=[class extends ${constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const e=t===this.pattern;return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},A,class extends ${constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const e=t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const e=!t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const e=!t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const e=t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[t.length-this.pattern.length,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const e=-1===t.indexOf(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},S],k=L.length,C=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const j=new Set([S.type,A.type]);class _{constructor(t,{isCaseSensitive:e=v.isCaseSensitive,includeMatches:i=v.includeMatches,minMatchCharLength:s=v.minMatchCharLength,ignoreLocation:n=v.ignoreLocation,findAllMatches:r=v.findAllMatches,location:o=v.location,threshold:c=v.threshold,distance:h=v.distance}={}){this.query=null,this.options={isCaseSensitive:e,includeMatches:i,minMatchCharLength:s,findAllMatches:r,ignoreLocation:n,location:o,threshold:c,distance:h},this.pattern=e?t:t.toLowerCase(),this.query=function(t,e={}){return t.split("|").map((t=>{let i=t.trim().split(C).filter((t=>t&&!!t.trim())),s=[];for(let t=0,n=i.length;t<n;t+=1){const n=i[t];let r=!1,o=-1;for(;!r&&++o<k;){const t=L[o];let i=t.isMultiMatch(n);i&&(s.push(new t(i,e)),r=!0)}if(!r)for(o=-1;++o<k;){const t=L[o];let i=t.isSingleMatch(n);if(i){s.push(new t(i,e));break}}}return s}))}(this.pattern,this.options)}static condition(t,e){return e.useExtendedSearch}searchIn(t){const e=this.query;if(!e)return{isMatch:!1,score:1};const{includeMatches:i,isCaseSensitive:s}=this.options;t=s?t:t.toLowerCase();let n=0,r=[],o=0;for(let s=0,c=e.length;s<c;s+=1){const c=e[s];r.length=0,n=0;for(let e=0,s=c.length;e<s;e+=1){const s=c[e],{isMatch:h,indices:l,score:a}=s.search(t);if(!h){o=0,n=0,r.length=0;break}if(n+=1,o+=a,i){const t=s.constructor.type;j.has(t)?r=[...r,...l]:r.push(l)}}if(n){let t={isMatch:!0,score:o/n};return i&&(t.indices=r),t}}return{isMatch:!1,score:1}}}const E=[];function N(t,e){for(let i=0,s=E.length;i<s;i+=1){let s=E[i];if(s.condition(t,e))return new s(t,e)}return new x(t,e)}const R="$and",O="$or",I="$path",F="$val",z=t=>!(!t[R]&&!t[O]),U=t=>({[R]:Object.keys(t).map((e=>({[e]:t[e]})))});function T(i,s,{auto:r=!0}={}){const o=i=>{let c=Object.keys(i);const h=(t=>!!t[I])(i);if(!h&&c.length>1&&!z(i))return o(U(i));if((e=>!t(e)&&n(e)&&!z(e))(i)){const t=h?i[I]:c[0],n=h?i[F]:i[t];if(!e(n))throw new Error((t=>`Invalid value for key ${t}`)(t));const o={keyId:d(t),pattern:n};return r&&(o.searcher=N(n,s)),o}let l={children:[],operator:c[0]};return c.forEach((e=>{const s=i[e];t(s)&&s.forEach((t=>{l.children.push(o(t))}))})),l};return z(i)||(i=U(i)),o(i)}function W(t,e){const i=t.matches;e.matches=[],r(i)&&i.forEach((t=>{if(!r(t.indices)||!t.indices.length)return;const{indices:i,value:s}=t;let n={indices:i,value:s};t.key&&(n.key=t.key.src),t.idx>-1&&(n.refIndex=t.idx),e.matches.push(n)}))}function P(t,e){e.score=t.score}class J{constructor(t,e={},i){this.options={...v,...e},this.options.useExtendedSearch,this._keyStore=new l(this.options.keys),this.setCollection(t,i)}setCollection(t,e){if(this._docs=t,e&&!(e instanceof p))throw new Error("Incorrect 'index' type");this._myIndex=e||y(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){r(t)&&(this._docs.push(t),this._myIndex.add(t))}remove(t=(()=>!1)){const e=[];for(let i=0,s=this._docs.length;i<s;i+=1){const n=this._docs[i];t(n,i)&&(this.removeAt(i),i-=1,s-=1,e.push(n))}return e}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:s=-1}={}){const{includeMatches:n,includeScore:r,shouldSort:o,sortFn:c,ignoreFieldNorm:h}=this.options;let l=e(t)?e(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return function(t,{ignoreFieldNorm:e=v.ignoreFieldNorm}){t.forEach((t=>{let i=1;t.matches.forEach((({key:t,norm:s,score:n})=>{const r=t?t.weight:null;i*=Math.pow(0===n&&r?Number.EPSILON:n,(r||1)*(e?1:s))})),t.score=i}))}(l,{ignoreFieldNorm:h}),o&&l.sort(c),i(s)&&s>-1&&(l=l.slice(0,s)),function(t,e,{includeMatches:i=v.includeMatches,includeScore:s=v.includeScore}={}){const n=[];return i&&n.push(W),s&&n.push(P),t.map((t=>{const{idx:i}=t,s={item:e[i],refIndex:i};return n.length&&n.forEach((e=>{e(t,s)})),s}))}(l,this._docs,{includeMatches:n,includeScore:r})}_searchStringList(t){const e=N(t,this.options),{records:i}=this._myIndex,s=[];return i.forEach((({v:t,i,n})=>{if(!r(t))return;const{isMatch:o,score:c,indices:h}=e.searchIn(t);o&&s.push({item:t,idx:i,matches:[{score:c,value:t,norm:n,indices:h}]})})),s}_searchLogical(t){const e=T(t,this.options),i=(t,e,s)=>{if(!t.children){const{keyId:i,searcher:n}=t,r=this._findMatches({key:this._keyStore.get(i),value:this._myIndex.getValueForItemAtKeyId(e,i),searcher:n});return r&&r.length?[{idx:s,item:e,matches:r}]:[]}const n=[];for(let r=0,o=t.children.length;r<o;r+=1){const o=t.children[r],c=i(o,e,s);if(c.length)n.push(...c);else if(t.operator===R)return[]}return n},s=this._myIndex.records,n={},o=[];return s.forEach((({$:t,i:s})=>{if(r(t)){let r=i(e,t,s);r.length&&(n[s]||(n[s]={idx:s,item:t,matches:[]},o.push(n[s])),r.forEach((({matches:t})=>{n[s].matches.push(...t)})))}})),o}_searchObjectList(t){const e=N(t,this.options),{keys:i,records:s}=this._myIndex,n=[];return s.forEach((({$:t,i:s})=>{if(!r(t))return;let o=[];i.forEach(((i,s)=>{o.push(...this._findMatches({key:i,value:t[s],searcher:e}))})),o.length&&n.push({idx:s,item:t,matches:o})})),n}_findMatches({key:e,value:i,searcher:s}){if(!r(i))return[];let n=[];if(t(i))i.forEach((({v:t,i,n:o})=>{if(!r(t))return;const{isMatch:c,score:h,indices:l}=s.searchIn(t);c&&n.push({score:h,key:e,value:t,idx:i,norm:o,indices:l})}));else{const{v:t,n:r}=i,{isMatch:o,score:c,indices:h}=s.searchIn(t);o&&n.push({score:c,key:e,value:t,norm:r,indices:h})}return n}}J.version="6.6.2",J.createIndex=y,J.parseIndex=function(t,{getFn:e=v.getFn,fieldNormWeight:i=v.fieldNormWeight}={}){const{keys:s,records:n}=t,r=new p({getFn:e,fieldNormWeight:i});return r.setKeys(s),r.setIndexRecords(n),r},J.config=v,J.parseQuery=T,function(...t){E.push(...t)}(_);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K=window,B=K.ShadowRoot&&(void 0===K.ShadyCSS||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),H=new WeakMap;class V{constructor(t,e,i){if(this._$cssResult$=!0,i!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(B&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=H.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&H.set(e,t))}return t}toString(){return this.cssText}}const Z=B?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new V("string"==typeof t?t:t+"",void 0,D))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var q;const G=window,Q=G.trustedTypes,X=Q?Q.emptyScript:"",Y=G.reactiveElementPolyfillSupport,tt={toAttribute(t,e){switch(e){case Boolean:t=t?X:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},et=(t,e)=>e!==t&&(e==e||t==t),it={attribute:!0,type:String,converter:tt,reflect:!1,hasChanged:et};class st extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;null!==(e=this.h)&&void 0!==e||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=it){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||it}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(Z(t))}else void 0!==t&&e.push(Z(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{B?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=K.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=it){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:tt).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:tt;this._$El=n,this[n]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||et)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var nt;st.finalized=!0,st.elementProperties=new Map,st.elementStyles=[],st.shadowRootOptions={mode:"open"},null==Y||Y({ReactiveElement:st}),(null!==(q=G.reactiveElementVersions)&&void 0!==q?q:G.reactiveElementVersions=[]).push("1.4.1");const rt=window,ot=rt.trustedTypes,ct=ot?ot.createPolicy("lit-html",{createHTML:t=>t}):void 0,ht=`lit$${(Math.random()+"").slice(9)}$`,lt="?"+ht,at=`<${lt}>`,ut=document,dt=(t="")=>ut.createComment(t),ft=t=>null===t||"object"!=typeof t&&"function"!=typeof t,vt=Array.isArray,gt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,yt=/>/g,mt=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),Mt=/'/g,bt=/"/g,xt=/^(?:script|style|textarea|title)$/i,$t=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),wt=Symbol.for("lit-noChange"),St=Symbol.for("lit-nothing"),At=new WeakMap,Lt=ut.createTreeWalker(ut,129,null,!1),kt=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":"",o=gt;for(let e=0;e<i;e++){const i=t[e];let c,h,l=-1,a=0;for(;a<i.length&&(o.lastIndex=a,h=o.exec(i),null!==h);)a=o.lastIndex,o===gt?"!--"===h[1]?o=pt:void 0!==h[1]?o=yt:void 0!==h[2]?(xt.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=mt):void 0!==h[3]&&(o=mt):o===mt?">"===h[0]?(o=null!=n?n:gt,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,c=h[1],o=void 0===h[3]?mt:'"'===h[3]?bt:Mt):o===bt||o===Mt?o=mt:o===pt||o===yt?o=gt:(o=mt,n=void 0);const u=o===mt&&t[e+1].startsWith("/>")?" ":"";r+=o===gt?i+at:l>=0?(s.push(c),i.slice(0,l)+"$lit$"+i.slice(l)+ht+u):i+ht+(-2===l?(s.push(void 0),e):u)}const c=r+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==ct?ct.createHTML(c):c,s]};class Ct{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,c=this.parts,[h,l]=kt(t,e);if(this.el=Ct.createElement(h,i),Lt.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=Lt.nextNode())&&c.length<o;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(ht)){const i=l[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(ht),e=/([.?@])?(.*)/.exec(i);c.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?Rt:"?"===e[1]?It:"@"===e[1]?Ft:Nt})}else c.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(xt.test(s.tagName)){const t=s.textContent.split(ht),e=t.length-1;if(e>0){s.textContent=ot?ot.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],dt()),Lt.nextNode(),c.push({type:2,index:++n});s.append(t[e],dt())}}}else if(8===s.nodeType)if(s.data===lt)c.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(ht,t+1));)c.push({type:7,index:n}),t+=ht.length-1}n++}}static createElement(t,e){const i=ut.createElement("template");return i.innerHTML=t,i}}function jt(t,e,i=t,s){var n,r,o,c;if(e===wt)return e;let h=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const l=ft(e)?void 0:e._$litDirective$;return(null==h?void 0:h.constructor)!==l&&(null===(r=null==h?void 0:h._$AO)||void 0===r||r.call(h,!1),void 0===l?h=void 0:(h=new l(t),h._$AT(t,i,s)),void 0!==s?(null!==(o=(c=i)._$Co)&&void 0!==o?o:c._$Co=[])[s]=h:i._$Cl=h),void 0!==h&&(e=jt(t,h._$AS(t,e.values),h,s)),e}class _t{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:ut).importNode(i,!0);Lt.currentNode=n;let r=Lt.nextNode(),o=0,c=0,h=s[0];for(;void 0!==h;){if(o===h.index){let e;2===h.type?e=new Et(r,r.nextSibling,this,t):1===h.type?e=new h.ctor(r,h.name,h.strings,this,t):6===h.type&&(e=new zt(r,this,t)),this.u.push(e),h=s[++c]}o!==(null==h?void 0:h.index)&&(r=Lt.nextNode(),o++)}return n}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Et{constructor(t,e,i,s){var n;this.type=2,this._$AH=St,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=jt(this,t,e),ft(t)?t===St||null==t||""===t?(this._$AH!==St&&this._$AR(),this._$AH=St):t!==this._$AH&&t!==wt&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>vt(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==St&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(ut.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Ct.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.p(i);else{const t=new _t(n,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=At.get(t.strings);return void 0===e&&At.set(t.strings,e=new Ct(t)),e}k(t){vt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Et(this.O(dt()),this.O(dt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Nt{constructor(t,e,i,s,n){this.type=1,this._$AH=St,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=St}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=jt(this,t,e,0),r=!ft(t)||t!==this._$AH&&t!==wt,r&&(this._$AH=t);else{const s=t;let o,c;for(t=n[0],o=0;o<n.length-1;o++)c=jt(this,s[i+o],e,o),c===wt&&(c=this._$AH[o]),r||(r=!ft(c)||c!==this._$AH[o]),c===St?t=St:t!==St&&(t+=(null!=c?c:"")+n[o+1]),this._$AH[o]=c}r&&!s&&this.j(t)}j(t){t===St?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Rt extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===St?void 0:t}}const Ot=ot?ot.emptyScript:"";class It extends Nt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==St?this.element.setAttribute(this.name,Ot):this.element.removeAttribute(this.name)}}class Ft extends Nt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=jt(this,t,e,0))&&void 0!==i?i:St)===wt)return;const s=this._$AH,n=t===St&&s!==St||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==St&&(s===St||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class zt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){jt(this,t)}}const Ut=rt.litHtmlPolyfillSupport;null==Ut||Ut(Ct,Et),(null!==(nt=rt.litHtmlVersions)&&void 0!==nt?nt:rt.litHtmlVersions=[]).push("2.4.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Tt,Wt;class Pt extends st{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const r=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let o=r._$litPart$;if(void 0===o){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;r._$litPart$=o=new Et(e.insertBefore(dt(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return wt}}Pt.finalized=!0,Pt._$litElement$=!0,null===(Tt=globalThis.litElementHydrateSupport)||void 0===Tt||Tt.call(globalThis,{LitElement:Pt});const Jt=globalThis.litElementPolyfillSupport;null==Jt||Jt({LitElement:Pt}),(null!==(Wt=globalThis.litElementVersions)&&void 0!==Wt?Wt:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Bt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):Kt(t,e)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var Dt;null===(Dt=window.HTMLSlotElement)||void 0===Dt||Dt.prototype.assignedElements;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ht=function(t,e,i,s){for(var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s,c=t.length-1;c>=0;c--)(n=t[c])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o};let Vt=null;let Zt=class extends Pt{constructor(){super(...arguments),this.threshold=20,this.search="",this.href="./spanish-hungaria.json",this.dictionary=[]}connectedCallback(){super.connectedCallback(),this.fetchData(this.href)}fetchData(t){console.log("Initialized..."),fetch(t).then((t=>t.json())).then((t=>{console.log("AAA",t),this.dictionary=t,Vt=function(t){console.log("Init fuse...",t);const e={includeScore:!0,shouldSort:!0,useExtendedSearch:!0,keys:["src","dst"]},i=J.createIndex(e.keys,t);return new J(t,e,i)}(t)})).catch((t=>{console.error("Failed to get data:",t)}))}render(){return $t`
    <div class="search">
      <input
        id="search-box"
        ?autofocus=${!0}
        placeholder="Írd ide a Fuzzy keresőkifejezésed, majd üss Entert"
        @change=${t=>{const e=t.target.value;this.search=e||""}}
      />
    </div>
    <table border="1">
      <thead>
        <tr>
          <th>Spanyol</th>
          <th>Magyar</th>
          <th>Találat</th>
        </tr>
      </thead>
      <tbody>
        ${this._renderList(this.dictionary,this.search)}
      </tbody>
    </table>
    <slot></slot>
    `}_fuzzySearch(t,e){return 0!=t.length&&Vt?((t,e,i)=>i?t.search(i).map((t=>Object.assign(Object.assign({},t.item),{score:t.score}))):e)(Vt,t,e):[]}_renderList(t,e=""){return console.log("Filter",e),this._fuzzySearch(t,e).filter(((t,e)=>e<this.threshold)).map((t=>{const e=t.score?Math.floor(100*(1-(t.score||0)))+"%":"";return $t`
          <tr>
            <td>${t.src}</td>
            <td>${t.dst}</td>
            <td>${e}</td>
          </tr>
        `}))}};Zt.styles=((t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new V(i,t,D)})`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    .search {
      display: flex;
      justify-content: center;
    }
    table,
    #search-box {
      width:100%;
    }
    td {
      width: 50%;
    }
    tr>td:last-child {
      width: 30px;
    }
  `,Ht([Bt({type:Number})],Zt.prototype,"threshold",void 0),Ht([Bt({type:String})],Zt.prototype,"search",void 0),Ht([Bt({type:String})],Zt.prototype,"href",void 0),Ht([Bt({type:Object})],Zt.prototype,"dictionary",void 0),Zt=Ht([(t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e))("webcomponent-wordlist")],Zt);export{Zt as WebcomponentWordlist};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new WeakMap;class o{constructor(t,i,e){if(this._$cssResult$=!0,e!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const s=this.t;if(i&&void 0===t){const i=void 0!==s&&1===s.length;i&&(t=e.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&e.set(s,t))}return t}toString(){return this.cssText}}const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var r;const h=window,l=h.trustedTypes,c=l?l.emptyScript:"",a=h.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const o=this[t];this[i]=e,this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(n(t))}else void 0!==t&&i.push(n(t));return i}static _$Ep(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var s;const e=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,e)=>{i?s.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((i=>{const e=document.createElement("style"),o=t.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,s.appendChild(e)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$EO(t,i,s=v){var e;const o=this.constructor._$Ep(t,s);if(void 0!==o&&!0===s.reflect){const n=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:d).toAttribute(i,s.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,i){var s;const e=this.constructor,o=e._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=e.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:d;this._$El=o,this[o]=n.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var p;f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==a||a({ReactiveElement:f}),(null!==(r=h.reactiveElementVersions)&&void 0!==r?r:h.reactiveElementVersions=[]).push("1.6.1");const b=window,y=b.trustedTypes,w=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,g=`lit$${(Math.random()+"").slice(9)}$`,m="?"+g,$=`<${m}>`,S=document,x=(t="")=>S.createComment(t),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,E=/>/g,j=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),O=/'/g,M=/"/g,T=/^(?:script|style|textarea|title)$/i,U=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),R=Symbol.for("lit-noChange"),N=Symbol.for("lit-nothing"),z=new WeakMap,D=S.createTreeWalker(S,129,null,!1),L=(t,i)=>{const s=t.length-1,e=[];let o,n=2===i?"<svg>":"",r=A;for(let i=0;i<s;i++){const s=t[i];let h,l,c=-1,a=0;for(;a<s.length&&(r.lastIndex=a,l=r.exec(s),null!==l);)a=r.lastIndex,r===A?"!--"===l[1]?r=_:void 0!==l[1]?r=E:void 0!==l[2]?(T.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=null!=o?o:A,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?j:'"'===l[3]?M:O):r===M||r===O?r=j:r===_||r===E?r=A:(r=j,o=void 0);const d=r===j&&t[i+1].startsWith("/>")?" ":"";n+=r===A?s+$:c>=0?(e.push(h),s.slice(0,c)+"$lit$"+s.slice(c)+g+d):s+g+(-2===c?(e.push(void 0),i):d)}const h=n+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(h):h,e]};class I{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let o=0,n=0;const r=t.length-1,h=this.parts,[l,c]=L(t,i);if(this.el=I.createElement(l,s),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(e=D.nextNode())&&h.length<r;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(g)){const s=c[n++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(g),i=/([.?@])?(.*)/.exec(s);h.push({type:1,index:o,name:i[2],strings:t,ctor:"."===i[1]?K:"?"===i[1]?V:"@"===i[1]?W:J})}else h.push({type:6,index:o})}for(const i of t)e.removeAttribute(i)}if(T.test(e.tagName)){const t=e.textContent.split(g),i=t.length-1;if(i>0){e.textContent=y?y.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],x()),D.nextNode(),h.push({type:2,index:++o});e.append(t[i],x())}}}else if(8===e.nodeType)if(e.data===m)h.push({type:2,index:o});else{let t=-1;for(;-1!==(t=e.data.indexOf(g,t+1));)h.push({type:7,index:o}),t+=g.length-1}o++}}static createElement(t,i){const s=S.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,r,h;if(i===R)return i;let l=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const c=k(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,s,e)),void 0!==e?(null!==(r=(h=s)._$Co)&&void 0!==r?r:h._$Co=[])[e]=l:s._$Cl=l),void 0!==l&&(i=P(t,l._$AS(t,i.values),l,e)),i}class B{constructor(t,i){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:S).importNode(s,!0);D.currentNode=o;let n=D.nextNode(),r=0,h=0,l=e[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new H(n,n.nextSibling,this,t):1===l.type?i=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(i=new Z(n,this,t)),this.u.push(i),l=e[++h]}r!==(null==l?void 0:l.index)&&(n=D.nextNode(),r++)}return o}p(t){let i=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class H{constructor(t,i,s,e){var o;this.type=2,this._$AH=N,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cm=null===(o=null==e?void 0:e.isConnected)||void 0===o||o}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),k(t)?t===N||null==t||""===t?(this._$AH!==N&&this._$AR(),this._$AH=N):t!==this._$AH&&t!==R&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==N&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=I.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.p(s);else{const t=new B(o,this),i=t.v(this.options);t.p(s),this.T(i),this._$AH=t}}_$AC(t){let i=z.get(t.strings);return void 0===i&&z.set(t.strings,i=new I(t)),i}k(t){C(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new H(this.O(x()),this.O(x()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cm=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class J{constructor(t,i,s,e,o){this.type=1,this._$AH=N,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=N}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!k(t)||t!==this._$AH&&t!==R,n&&(this._$AH=t);else{const e=t;let r,h;for(t=o[0],r=0;r<o.length-1;r++)h=P(this,e[s+r],i,r),h===R&&(h=this._$AH[r]),n||(n=!k(h)||h!==this._$AH[r]),h===N?t=N:t!==N&&(t+=(null!=h?h:"")+o[r+1]),this._$AH[r]=h}n&&!e&&this.j(t)}j(t){t===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class K extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===N?void 0:t}}const Q=y?y.emptyScript:"";class V extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==N?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class W extends J{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:N)===R)return;const e=this._$AH,o=t===N&&e!==N||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==N&&(e===N||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const q=b.litHtmlPolyfillSupport;null==q||q(I,H),(null!==(p=b.litHtmlVersions)&&void 0!==p?p:b.litHtmlVersions=[]).push("2.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var F,Y;class G extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new H(i.insertBefore(x(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}G.finalized=!0,G._$litElement$=!0,null===(F=globalThis.litElementHydrateSupport)||void 0===F||F.call(globalThis,{LitElement:G});const X=globalThis.litElementPolyfillSupport;null==X||X({LitElement:G}),(null!==(Y=globalThis.litElementVersions)&&void 0!==Y?Y:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(s){s.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(s){s.createProperty(i.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function it(t){return(i,s)=>void 0!==s?((t,i,s)=>{i.constructor.createProperty(s,t)})(t,i,s):tt(t,i)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var st;null===(st=window.HTMLSlotElement)||void 0===st||st.prototype.assignedElements;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et=1;class ot{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,s){this._$Ct=t,this._$AM=i,this._$Ci=s}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=(t=>(...i)=>({_$litDirective$:t,values:i}))(class extends ot{constructor(t){var i;if(super(t),t.type!==et||"class"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((i=>t[i])).join(" ")+" "}update(t,[i]){var s,e;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in i)i[t]&&!(null===(s=this.st)||void 0===s?void 0:s.has(t))&&this.nt.add(t);return this.render(i)}const o=t.element.classList;this.nt.forEach((t=>{t in i||(o.remove(t),this.nt.delete(t))}));for(const t in i){const s=!!i[t];s===this.nt.has(t)||(null===(e=this.st)||void 0===e?void 0:e.has(t))||(s?(o.add(t),this.nt.add(t)):(o.remove(t),this.nt.delete(t)))}return R}});var rt=function(t,i,s,e){for(var o,n=arguments.length,r=n<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,s):e,h=t.length-1;h>=0;h--)(o=t[h])&&(r=(n<3?o(r):n>3?o(i,s,r):o(i,s))||r);return n>3&&r&&Object.defineProperty(i,s,r),r};const ht=Object.freeze({SRC:"SRC",DST:"DST"}),lt=Object.freeze({NORMAL:"normal",ERROR:"error",SUCCESS:"success",SELECTED:"selected",EMPTY:"empty"});let ct=class extends G{constructor(){super(...arguments),this.wordCount=5,this.href="./spanish-hungarian.json",this.srcQueue=[],this.dstQueue=[],this.src=[],this.dst=[]}connectedCallback(){super.connectedCallback(),this.fetchData(this.href)}fetchData(t){console.log("Initialized..."),fetch(t).then((t=>t.json())).then((t=>{const i=t.sort((()=>Math.random()<.6?-1:1)),s=i.map((t=>({text:t.src,identifier:t.src,state:"normal"}))),e=i.map((t=>({text:t.dst,identifier:t.src,state:"normal"})));this.srcQueue=[...s],this.dstQueue=[...e],this.src=this.srcQueue.splice(0,5).sort((()=>Math.random()<.6?-1:1)),this.dst=this.dstQueue.splice(0,5).sort((()=>Math.random()<.6?-1:1))})).catch((t=>{console.error("Failed to get data:",t)}))}_getNewValue(){const t=+new Date;console.log(t,this.srcQueue,this.dstQueue);const i=this.dstQueue.splice(0,3);let s=null;const e=Math.random();if(i.length>=3){const t=e<.6?0:e<.8?1:2;s=i.splice(t,1)[0]}else if(1==i.length)s=i.splice(0,1)[0];else if(2==i.length){const t=e<.5?0:1;s=i.splice(t,1)[0]}this.dstQueue=i.concat(this.dstQueue);const o=this.srcQueue.splice(0,3);let n=null;const r=Math.random();if(o.length>=3){const t=r<.6?0:r<.8?1:2;n=o.splice(t,1)[0]}else if(1==o.length)n=o.splice(0,1)[0];else if(2==o.length){const t=r<.5?0:1;n=o.splice(t,1)[0]}return this.srcQueue=o.concat(this.srcQueue),console.log(t,this.srcQueue,this.dstQueue),console.log(t,n,s),{src:n,dst:s}}_onClick(t){const i=t.target,s=i.getAttribute("data-dst"),e=i.getAttribute("data-src"),o=null===s?ht.SRC:ht.DST;if(o===ht.SRC){const t=this.src.findIndex((t=>t.identifier===e));if(t<0)throw new Error("Clicked item missing");const i={...this.src[t]};switch(i.state){case lt.SELECTED:i.state=lt.NORMAL;break;case lt.NORMAL:this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.NORMAL}:t)),i.state=lt.SELECTED}this.src[t]=i,this.requestUpdate()}else if(o===ht.DST){const t=this.dst.findIndex((t=>t.identifier===s));if(t<0)throw new Error("Clicked item missing");const i={...this.dst[t]};switch(i.state){case lt.SELECTED:i.state=lt.NORMAL;break;case lt.NORMAL:this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.NORMAL}:t)),i.state=lt.SELECTED}this.dst[t]=i,this.requestUpdate()}const n=this.src.find((t=>t.state===lt.SELECTED)),r=this.dst.find((t=>t.state===lt.SELECTED));if(n&&r){if(r.identifier===n.identifier){console.log("same",r.identifier,n.identifier),this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.SUCCESS}:t)),this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.SUCCESS}:t));const t=r.identifier;setTimeout((()=>{const{src:i,dst:s}=this._getNewValue();this.dst=this.dst.map((i=>i.identifier===t?s?{...i,text:s.text,identifier:s.identifier,state:lt.NORMAL}:{...i,text:"&nbsp",identifier:"",state:lt.EMPTY}:i)),this.src=this.src.map((s=>s.identifier===t?i?{...s,text:i.text,identifier:i.identifier,state:lt.NORMAL}:{...s,text:"&nbsp",identifier:"",state:lt.EMPTY}:s))}),2e3)}else{console.log("different",r.identifier,n.identifier),this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.ERROR}:t)),this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.ERROR}:t));const t=r.identifier,i=n.identifier;setTimeout((()=>{this.dst=this.dst.map((i=>i.identifier===t?{...i,state:lt.NORMAL}:i)),this.src=this.src.map((t=>t.identifier===i?{...t,state:lt.NORMAL}:t))}),2e3)}this.requestUpdate()}}render(){return U`
      <div class="word-matcher">
        ${this._renderList(this.src,this.dst)}
      </div>
      <slot></slot>
    `}_renderList(t,i){return console.log(t,i),Array(this.wordCount).fill(0).map(((s,e)=>{const o=t[e],n=i[e];return U`
        <div class="line">
          <div 
            class=${nt({btn:!0,[o.state]:!0})}
            data-src=${o.identifier} 
            @click=${this._onClick} 
            part="button"
            >
            <div class="text">
              ${o.text}
            </div>
          </div>
          <div 
            data-dst=${n.identifier} 
            class=${nt({btn:!0,[n.state]:!0})}
            @click=${this._onClick} 
            part="button"
          >
            <div class="text">
              ${n.text}
            </div>
          </div>
        </div>
        `}))}};ct.styles=((t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1]),t[0]);return new o(e,t,s)})`
    :host {
      display: block;
      /* border: solid 1px var(--border-color); */
      padding: 16px;
      max-width: 800px;
      background-color: var(--background-color);
      color: var(--text-color);
    }
    .word-matcher{
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .line {
      display: flex;
      justify-content: space-around;
    }
    .btn{
      display: inline-block;
      padding: 10px;
      width: 200px;
      border: 1px solid black;
      border-radius: 5px;
      text-align: center;
      line-height: 1em;
      height: 3em;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 0;
      flex-shrink: 1;
    }
    .text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      pointer-events: none;
    }
    @supports (-webkit-line-clamp: 2) {
      .text.text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .btn.selected {
      background-color: black;
      color: white;
    }
    .btn.error {
      background-color: red;
      border-color: red;
      color: white;
    }
    .btn.success {
      background-color: green;
      border-color: green;
      color: white;
      animation: fadeout 1.5s linear forwards;
    }
    .btn.empty {
      visibility: hidden;
    }
    @keyframes fadeout {
      0%,20% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes fadeout {
      0%,20% { opacity: 1; }
      100% { opacity: 0; }
    }
  `,rt([it({type:Number})],ct.prototype,"wordCount",void 0),rt([it({type:String})],ct.prototype,"href",void 0),rt([it({type:Object})],ct.prototype,"srcQueue",void 0),rt([it({type:Object})],ct.prototype,"dstQueue",void 0),rt([it({type:Object})],ct.prototype,"src",void 0),rt([it({type:Object})],ct.prototype,"dst",void 0),ct=rt([(t=>i=>"function"==typeof i?((t,i)=>(customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:s,elements:e}=i;return{kind:s,elements:e,finisher(i){customElements.define(t,i)}}})(t,i))("webcomponent-word-matcher")],ct);export{ct as WordMatcherElement};

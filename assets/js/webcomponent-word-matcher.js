/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new WeakMap;class n{constructor(t,i,e){if(this._$cssResult$=!0,e!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const s=this.t;if(i&&void 0===t){const i=void 0!==s&&1===s.length;i&&(t=e.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&e.set(s,t))}return t}toString(){return this.cssText}}const o=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var r;const h=window,l=h.trustedTypes,c=l?l.emptyScript:"",a=h.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const n=this[t];this[i]=e,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(o(t))}else void 0!==t&&i.push(o(t));return i}static _$Ep(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var s;const e=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,e)=>{i?s.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((i=>{const e=document.createElement("style"),n=t.litNonce;void 0!==n&&e.setAttribute("nonce",n),e.textContent=i.cssText,s.appendChild(e)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$EO(t,i,s=v){var e;const n=this.constructor._$Ep(t,s);if(void 0!==n&&!0===s.reflect){const o=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:d).toAttribute(i,s.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,i){var s;const e=this.constructor,n=e._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=e.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:d;this._$El=n,this[n]=o.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var p;f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==a||a({ReactiveElement:f}),(null!==(r=h.reactiveElementVersions)&&void 0!==r?r:h.reactiveElementVersions=[]).push("1.6.1");const b=window,m=b.trustedTypes,w=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,g=`lit$${(Math.random()+"").slice(9)}$`,y="?"+g,S=`<${y}>`,x=document,k=(t="")=>x.createComment(t),$=t=>null===t||"object"!=typeof t&&"function"!=typeof t,_=Array.isArray,A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,C=/-->/g,E=/>/g,O=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),j=/'/g,M=/"/g,R=/^(?:script|style|textarea|title)$/i,N=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),T=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),z=new WeakMap,D=x.createTreeWalker(x,129,null,!1),I=(t,i)=>{const s=t.length-1,e=[];let n,o=2===i?"<svg>":"",r=A;for(let i=0;i<s;i++){const s=t[i];let h,l,c=-1,a=0;for(;a<s.length&&(r.lastIndex=a,l=r.exec(s),null!==l);)a=r.lastIndex,r===A?"!--"===l[1]?r=C:void 0!==l[1]?r=E:void 0!==l[2]?(R.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=O):void 0!==l[3]&&(r=O):r===O?">"===l[0]?(r=null!=n?n:A,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?O:'"'===l[3]?M:j):r===M||r===j?r=O:r===C||r===E?r=A:(r=O,n=void 0);const d=r===O&&t[i+1].startsWith("/>")?" ":"";o+=r===A?s+S:c>=0?(e.push(h),s.slice(0,c)+"$lit$"+s.slice(c)+g+d):s+g+(-2===c?(e.push(void 0),i):d)}const h=o+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(h):h,e]};class L{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let n=0,o=0;const r=t.length-1,h=this.parts,[l,c]=I(t,i);if(this.el=L.createElement(l,s),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(e=D.nextNode())&&h.length<r;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(g)){const s=c[o++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(g),i=/([.?@])?(.*)/.exec(s);h.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?F:"?"===i[1]?K:"@"===i[1]?Q:Y})}else h.push({type:6,index:n})}for(const i of t)e.removeAttribute(i)}if(R.test(e.tagName)){const t=e.textContent.split(g),i=t.length-1;if(i>0){e.textContent=m?m.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],k()),D.nextNode(),h.push({type:2,index:++n});e.append(t[i],k())}}}else if(8===e.nodeType)if(e.data===y)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=e.data.indexOf(g,t+1));)h.push({type:7,index:n}),t+=g.length-1}n++}}static createElement(t,i){const s=x.createElement("template");return s.innerHTML=t,s}}function J(t,i,s=t,e){var n,o,r,h;if(i===T)return i;let l=void 0!==e?null===(n=s._$Co)||void 0===n?void 0:n[e]:s._$Cl;const c=$(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,s,e)),void 0!==e?(null!==(r=(h=s)._$Co)&&void 0!==r?r:h._$Co=[])[e]=l:s._$Cl=l),void 0!==l&&(i=J(t,l._$AS(t,i.values),l,e)),i}class P{constructor(t,i){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var i;const{el:{content:s},parts:e}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:x).importNode(s,!0);D.currentNode=n;let o=D.nextNode(),r=0,h=0,l=e[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new B(o,o.nextSibling,this,t):1===l.type?i=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(i=new V(o,this,t)),this.u.push(i),l=e[++h]}r!==(null==l?void 0:l.index)&&(o=D.nextNode(),r++)}return n}p(t){let i=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class B{constructor(t,i,s,e){var n;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cm=null===(n=null==e?void 0:e.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=J(this,t,i),$(t)?t===U||null==t||""===t?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==T&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>_(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==U&&$(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){var i;const{values:s,_$litType$:e}=t,n="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=L.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.p(s);else{const t=new P(n,this),i=t.v(this.options);t.p(s),this.T(i),this._$AH=t}}_$AC(t){let i=z.get(t.strings);return void 0===i&&z.set(t.strings,i=new L(t)),i}k(t){_(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const n of t)e===i.length?i.push(s=new B(this.O(k()),this.O(k()),this,this.options)):s=i[e],s._$AI(n),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cm=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class Y{constructor(t,i,s,e,n){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const n=this.strings;let o=!1;if(void 0===n)t=J(this,t,i,0),o=!$(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else{const e=t;let r,h;for(t=n[0],r=0;r<n.length-1;r++)h=J(this,e[s+r],i,r),h===T&&(h=this._$AH[r]),o||(o=!$(h)||h!==this._$AH[r]),h===U?t=U:t!==U&&(t+=(null!=h?h:"")+n[r+1]),this._$AH[r]=h}o&&!e&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}const H=m?m.emptyScript:"";class K extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==U?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name)}}class Q extends Y{constructor(t,i,s,e,n){super(t,i,s,e,n),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=J(this,t,i,0))&&void 0!==s?s:U)===T)return;const e=this._$AH,n=t===U&&e!==U||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,o=t!==U&&(e===U||n);n&&this.element.removeEventListener(this.name,this,e),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class V{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const W=b.litHtmlPolyfillSupport;null==W||W(L,B),(null!==(p=b.litHtmlVersions)&&void 0!==p?p:b.litHtmlVersions=[]).push("2.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Z,q;class G extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{var e,n;const o=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new B(i.insertBefore(k(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return T}}G.finalized=!0,G._$litElement$=!0,null===(Z=globalThis.litElementHydrateSupport)||void 0===Z||Z.call(globalThis,{LitElement:G});const X=globalThis.litElementPolyfillSupport;null==X||X({LitElement:G}),(null!==(q=globalThis.litElementVersions)&&void 0!==q?q:globalThis.litElementVersions=[]).push("3.2.2");
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
const et=1;class nt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,s){this._$Ct=t,this._$AM=i,this._$Ci=s}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=(t=>(...i)=>({_$litDirective$:t,values:i}))(class extends nt{constructor(t){var i;if(super(t),t.type!==et||"class"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((i=>t[i])).join(" ")+" "}update(t,[i]){var s,e;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in i)i[t]&&!(null===(s=this.st)||void 0===s?void 0:s.has(t))&&this.nt.add(t);return this.render(i)}const n=t.element.classList;this.nt.forEach((t=>{t in i||(n.remove(t),this.nt.delete(t))}));for(const t in i){const s=!!i[t];s===this.nt.has(t)||(null===(e=this.st)||void 0===e?void 0:e.has(t))||(s?(n.add(t),this.nt.add(t)):(n.remove(t),this.nt.delete(t)))}return T}});var rt=function(t,i,s,e){for(var n,o=arguments.length,r=o<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,s):e,h=t.length-1;h>=0;h--)(n=t[h])&&(r=(o<3?n(r):o>3?n(i,s,r):n(i,s))||r);return o>3&&r&&Object.defineProperty(i,s,r),r};const ht=Object.freeze({SRC:"SRC",DST:"DST"}),lt=Object.freeze({NORMAL:"normal",ERROR:"error",SUCCESS:"success",SELECTED:"selected",EMPTY:"empty"}),ct=Object.freeze({EASY:"EASY",MEDIUM:"MEDIUM",NONE:""}),at="webcomponent-word-matcher";function dt(t,i){const s=new Set(t.map((t=>t.identifier))),e=new Set(i.map((t=>t.identifier))),n=new Set([...s].filter((t=>e.has(t))));return n.size}let ut=class extends G{constructor(){super(...arguments),this.wordCount=5,this.showScore=!1,this.connectionMode=ct.EASY,this.score=0,this.streak=0,this.maxStreak=0,this.maxScore=0,this.numberOfConnections=0,this.href="./spanish-hungarian.json",this.srcQueue=[],this.dstQueue=[],this.src=[],this.dst=[]}connectedCallback(){super.connectedCallback(),this.fetchData(this.href),this.fetchScore()}fetchData(t){console.log("Initialized..."),fetch(t).then((t=>t.json())).then((t=>{const i=t.sort((()=>Math.random()<.6?-1:1)),s=i.map((t=>({text:t.src,identifier:t.src,state:"normal"}))),e=i.map((t=>({text:t.dst,identifier:t.src,state:"normal"})));this.srcQueue=[...s],this.dstQueue=[...e],this.src=this.srcQueue.splice(0,this.wordCount).sort((()=>Math.random()<.6?-1:1)),this.dst=this.dstQueue.splice(0,this.wordCount).sort((()=>Math.random()<.6?-1:1)),this.numberOfConnections=dt(this.src,this.dst)})).catch((t=>{console.error("Failed to get data:",t)}))}fetchScore(){try{const t=JSON.parse(localStorage.getItem(at+"-score")||"{}"),i=JSON.parse(localStorage.getItem(at+"-streak")||"{}");this.maxStreak=i.maxStreak||0,this.maxScore=t.maxScore||0,this.score=0,this.streak=0}catch(t){console.error("Failed to load score",t)}}updateStreak(t){this.maxStreak=this.streak,localStorage.setItem(at+"-streak",JSON.stringify({maxStreak:t}))}updateScore(t){this.maxScore=this.score,localStorage.setItem(at+"-score",JSON.stringify({maxScore:t}))}_onClickResetStreak(t){this.updateStreak(0),this.requestUpdate()}_onClickResetScore(t){this.updateScore(0),this.requestUpdate()}_getNewValue(){const t=+new Date;console.log(t,this.srcQueue,this.dstQueue);const i=this.dstQueue.splice(0,3);let s=null;const e=Math.random();if(i.length>=3){const t=e<.6?0:e<.8?1:2;s=i.splice(t,1)[0]}else if(1==i.length)s=i.splice(0,1)[0];else if(2==i.length){const t=e<.5?0:1;s=i.splice(t,1)[0]}this.dstQueue=i.concat(this.dstQueue);const n=this.srcQueue.splice(0,3);let o=null;const r=Math.random();if(n.length>=3){const t=r<.6?0:r<.8?1:2;o=n.splice(t,1)[0]}else if(1==n.length)o=n.splice(0,1)[0];else if(2==n.length){const t=r<.5?0:1;o=n.splice(t,1)[0]}return this.srcQueue=n.concat(this.srcQueue),console.log(t,this.srcQueue,this.dstQueue),console.log(t,o,s),{src:o,dst:s}}_onClick(t){const i=t.target,s=i.getAttribute("data-dst"),e=i.getAttribute("data-src"),n=null===s?ht.SRC:ht.DST;if(n===ht.SRC){const t=this.src.findIndex((t=>t.identifier===e));if(t<0)throw new Error("Clicked item missing");const i={...this.src[t]};switch(i.state){case lt.SELECTED:i.state=lt.NORMAL;break;case lt.NORMAL:this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.NORMAL}:t)),i.state=lt.SELECTED}this.src[t]=i,this.requestUpdate()}else if(n===ht.DST){const t=this.dst.findIndex((t=>t.identifier===s));if(t<0)throw new Error("Clicked item missing");const i={...this.dst[t]};switch(i.state){case lt.SELECTED:i.state=lt.NORMAL;break;case lt.NORMAL:this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.NORMAL}:t)),i.state=lt.SELECTED}this.dst[t]=i,this.requestUpdate()}const o=this.src.find((t=>t.state===lt.SELECTED)),r=this.dst.find((t=>t.state===lt.SELECTED));if(o&&r){if(r.identifier===o.identifier){console.log("same",r.identifier,o.identifier),this.score++,this.score>this.maxScore&&this.updateScore(this.score),this.streak++,this.streak>this.maxStreak&&this.updateStreak(this.streak),this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.SUCCESS}:t)),this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.SUCCESS}:t));const t=r.identifier;setTimeout((()=>{const{src:i,dst:s}=this._getNewValue();this.dst=this.dst.map((i=>i.identifier===t?s?{...i,text:s.text,identifier:s.identifier,state:lt.NORMAL}:{...i,text:"&nbsp",identifier:"",state:lt.EMPTY}:i)),this.src=this.src.map((s=>s.identifier===t?i?{...s,text:i.text,identifier:i.identifier,state:lt.NORMAL}:{...s,text:"&nbsp",identifier:"",state:lt.EMPTY}:s)),this.numberOfConnections=dt(this.src,this.dst)}),2e3)}else{console.log("different",r.identifier,o.identifier),this.streak=0,this.dst=this.dst.map((t=>t.state===lt.SELECTED?{...t,state:lt.ERROR}:t)),this.src=this.src.map((t=>t.state===lt.SELECTED?{...t,state:lt.ERROR}:t));const t=r.identifier,i=o.identifier;setTimeout((()=>{this.dst=this.dst.map((i=>i.identifier===t?{...i,state:lt.NORMAL}:i)),this.src=this.src.map((t=>t.identifier===i?{...t,state:lt.NORMAL}:t)),this.numberOfConnections=dt(this.src,this.dst)}),2e3)}this.requestUpdate()}}render(){return N`
      <div class="word-matcher">
        ${this._renderList(this.src,this.dst)}
        ${this._renderScore(this.score,this.streak,this.maxStreak,this.maxScore)}
        ${this._render_connections(this.connectionMode,this.wordCount,this.numberOfConnections)}
        </div>
      <slot></slot>
    `}_renderList(t,i){return console.log(t,i),Array(this.wordCount).fill(0).map(((s,e)=>{if(e>=t.length||e>=i.length)return N``;const n=t[e],o=i[e];return N`
        <div class="line">
          <div
            class=${ot({btn:!0,[n.state]:!0})}
            data-src=${n.identifier}
            @click=${this._onClick}
            part="button"
            >
            <div class="text">
              ${n.text}
            </div>
          </div>
          <div
            data-dst=${o.identifier}
            class=${ot({btn:!0,[o.state]:!0})}
            @click=${this._onClick}
            part="button"
          >
            <div class="text">
              ${o.text}
            </div>
          </div>
        </div>
        `}))}_renderScore(t,i,s,e){return this.showScore?N`
      <div class="metadata">
        <span class="info-streak">
          ${i}x
          ${s>0&&s>i?N` (<span
            class="info-reset"
            title="Reset"
            @click=${this._onClickResetStreak}
          >${s}x</span>)`:N``}
        </span>
        <span class="info-score">
          ${t}pt
          ${e>0&&e>t?N` (<span
                class="info-reset"
                title="Reset"
                @click=${this._onClickResetScore}
              >${e}pt</span>)`:N``}
        </span>
      </div>
      `:N``}_render_connections(t,i,s){let e=[N``];switch(t.toLocaleUpperCase()){case ct.EASY:e=Array(i).fill(null).map(((t,e)=>e<s?N`&#9899;${e<i-1?" ":""}`:N`&#9898;${e<i-1?" ":""}`));break;case ct.MEDIUM:{const t=s/(i||1),n=t=>Array(t).fill(null).map(((i,s)=>N`&#9888;${s<t-1?" ":""}`));t<=.2?e=n(3):t<=.4?e=n(2):t<=.5&&(e=n(1));break}case ct.NONE:default:return N``}return N`
    <div class="metadata-connections">
      <span class="info-connections">${e}</span>
    </div>`}};ut.styles=((t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1]),t[0]);return new n(e,t,s)})`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
    }
    .word-matcher{
      --wm-background-color: var(--background-color, #fff);
      --wm-btn-nrml-text-color: var(--text-color, #333);
      --wm-btn-nrml-background: var(--bckg-normal, #e0e0e0);
      --wm-btn-slct-text: var(--text-select, white);
      --wm-btn-slct-background: var(--bckg-select, #44403c);
      --wm-btn-fail-text: var(--text-fail, white);
      --wm-btn-fail-background: var(--bckg-fail, #dc2626);
      --wm-btn-succ-text: var(--text-success, white);
      --wm-btn-succ-background: var(--bckg-success, #16a34a);

      background-color: var(--wm-background-color);
      color: var(--wm-btn-nrml-text-color);
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .line {
      display: flex;
      justify-content: space-around;
    }
    .btn {
      background-color: var(--wm-btn-nrml-background);
      color: var(--wm-btn-nrml-text-color);
      border: 1px solid var(--wm-btn-nrml-text-color);
      display: inline-block;
      padding: 10px;
      width: 200px;
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
      -webkit-tap-highlight-color: transparent; /* for removing the blue highlight */
      tap-highlight-color: transparent; /* for removing the blue highlight */
    }
    .btn:first-child {
      margin-right: 1em;
    }
    .text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      pointer-events: none;
      padding: 0.1em 0;
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
      background-color: var(--wm-btn-slct-background);
      border-color: var(--wm-btn-slct-text);
      color: var(--wm-btn-slct-text);
    }
    .btn.error {
      background-color: var(--wm-btn-fail-background);
      border-color: var(--wm-btn-fail-text);
      color: var(--wm-btn-fail-text);
    }
    .btn.success {
      background-color: var(--wm-btn-succ-background);
      border-color: var(--wm-btn-succ-text);
      color: var(--wm-btn-succ-text);
      animation: fadeout 1.5s linear forwards;
    }
    .btn.empty {
      visibility: hidden;
    }
    .metadata {
      font-size: large;
      display: flex;
      flex: 1;
      justify-content: space-between;
    }
    .metadata-connections {
      font-size: large;
      display: flex;
      flex: 1;
      justify-content: center;
    }
    .info-reset {
      cursor: pointer;
    }
    .
    @keyframes fadeout {
      0%,20% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes fadeout {
      0%,20% { opacity: 1; }
      100% { opacity: 0; }
    }
  `,rt([it({type:Number})],ut.prototype,"wordCount",void 0),rt([it({type:Boolean})],ut.prototype,"showScore",void 0),rt([it({type:String})],ut.prototype,"connectionMode",void 0),rt([it({type:String})],ut.prototype,"href",void 0),rt([it({type:Object})],ut.prototype,"srcQueue",void 0),rt([it({type:Object})],ut.prototype,"dstQueue",void 0),rt([it({type:Object})],ut.prototype,"src",void 0),rt([it({type:Object})],ut.prototype,"dst",void 0),ut=rt([(t=>i=>"function"==typeof i?((t,i)=>(customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:s,elements:e}=i;return{kind:s,elements:e,finisher(i){customElements.define(t,i)}}})(t,i))("webcomponent-word-matcher")],ut);export{ut as WordMatcherElement};

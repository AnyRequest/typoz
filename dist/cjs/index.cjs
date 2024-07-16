(()=>{"use strict";var t={d:(e,s)=>{for(var i in s)t.o(s,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:s[i]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};function s(t,e){for(const i of Object.keys(e))"string"==typeof t[i]||"number"==typeof t[i]||"boolean"==typeof t[i]||t[i]instanceof Array?t[i]=e[i]:s(t[i],e[i])}function i(t,e,s){const i=document.createElement(t);return i.innerHTML=e,s&&i.setAttribute(s.name,s.value),i}function n({blink:t,blinkTime:e=1,content:s="",color:i="#56565656",dir:n="vertical",size:r=1,distance:o=.1},h,a=!1){const c=t?`animation: cursor-blink ${e}s steps(2) infinite;`:"animation: none";return a?`[typoz-node-builder-name${h?`="${h}"`:""}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-node-builder-name${h?`="${h}"`:""}] { } [typoz-node-builder-name${h?`="${h}"`:""}]>[typoz-cursor]::after { box-sizing: content-box; display: inline-block; content: "${s}"; width: 0px; height: 1em; overflow: hidden; box-shadow: 0 0 0 ${2.5*r}px ${i}; margin-left: ${o}em; margin-right: -${o}em; line-height: inherit;  ${c} }`:`[typoz-name${h?`="${h}"`:""}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-name${h?`="${h}"`:""}] { } [typoz-name${h?`="${h}"`:""}]::after { display: inline-block; content: "${s}"; ${{vertical:`height: ${r}em; width: 0px; box-shadow: 0 0 0 ${2.5*r}px ${i}; margin-left: ${o}em;`,horizontal:`width: ${.6*r}em; height: calc(${.35*r}em * 0.35); /* margin-left: ${o}em; */`}[n]} line-height: inherit; overflow: hidden; background-color: ${i}; ${c} }`}function r(t){return document.querySelector(t)}function o(t){if(document.head.querySelector("[typoz-styles]"))document.head.querySelector("[typoz-styles]").innerHTML+=t;else{const e=i("style",t);e.setAttribute("typoz-styles",""),document.head.append(e)}}function h(t){return JSON.parse(JSON.stringify(t))}function a(){return"xyxyxx-xyyx-xxy-xxyyxxyxyyxy1xxyyxyxxx0xxyyy".replace(/x|y/g,(t=>{const e=t=>t[Math.floor(Math.random()*t.length)];switch(t){case"x":return e("abcdefghijklmnopqrstuvwxyz");case"y":return e("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")}}))}t.r(e),t.d(e,{KoreanParser:()=>u,Parser:()=>p,Typoz:()=>T,Util:()=>m,default:()=>v,version:()=>b});const c=(t,e)=>{e?console.warn(`this method is deprecated since version ${t}, please use "${e}" method`):console.warn(`this method is deprecated since version ${t}.`)};class d{static id=0;id;name;typingList=[];config;element;isStarted=!1;injectStyle;order=0;stop=!1;play;intervalQueue=[];constructor(t,e,s){this.id=++d.id,this.element=t,this.name=a(),this.config=e,this.typingList=s.filter((t=>t&&t.length>0&&t[0].length>0&&t[0][0].length>0)),this.setup()}orderUp(){this.order=(this.order+1)%this.typingList.length||0}setup(){Object.freeze(this.typingList),Object.freeze(this.config),this.element.innerHTML="",this.element.setAttribute("typoz-id",""+this.id),this.element.setAttribute("typoz-name",this.name),this.element.setAttribute("typoz-processed",""),this.injectStyle=n(this.config.style.cursor,this.name)}copyCurrent(){try{let t=this.typingList[this.order];return t||(this.orderUp(),t=this.typingList[this.order]),JSON.parse(JSON.stringify(t))}catch(t){return this.destroy(),console.info(`TypeNode clear: [name: ${this.name}]`),[]}}resume(){this.play(!0),this.stop=!1}pause(){this.stop=!0}clear(){this.isStarted=!1}destroy(){console.info("TypeNode destroy"),this.pause(),this.clear(),"typings"in this.element&&(this.element.innerHTML=this.element.typings[0],delete this.element.typings),"typozConfig"in this.element&&delete this.element.typozConfig,this.typingList=[],queueMicrotask((()=>{for(;this.intervalQueue.length>0;){const t=this.intervalQueue.shift();clearInterval(t)}}))}wait(t=0){return new Promise((e=>{this.stop?this.play=e:setTimeout((()=>{e(!0)}),1e3*t)}))}run(){this.isStarted=!0,this.render()}renderEraseDivide(t){return new Promise((e=>{const s=[...this.element.innerText].map((t=>i("span",t).outerHTML));let n=s.length,r=t.pop();if(!r)return;const o=setInterval((async()=>{if(this.stop&&await this.wait(),0===r.length){if(0===t.length)return clearInterval(o),this.element.innerText="",void e(!0);r=t.pop(),n-=1,this.element.innerHTML="",this.element.innerHTML=s.slice(0,n).join("")}else this.element.innerHTML=[...s.slice(0,n-1),i("span",r.pop()).outerHTML].join("")}),1/this.config.speed.erase*100);this.intervalQueue.push(o)}))}renderWriteDivide(t){return new Promise((e=>{let s=0;const n=[];let r=t.shift();if(!r)return;const o=setInterval((async()=>{this.stop&&await this.wait(),0===r.length?0===t.length?(clearInterval(o),this.element.innerHTML=n.join(""),e(!0)):(r=t.shift(),s+=1):(n[s]=i("span",r.shift()).outerHTML,this.element.innerHTML=n.join(""))}),1/this.config.speed.write*100);this.intervalQueue.push(o)}))}renderErase(t){return new Promise((e=>{let s=this.element.innerText.length;const i=this.element.innerText;let n=t.pop();if(!n)return;const r=setInterval((async()=>{if(this.stop&&await this.wait(),0===n.length){if(0===t.length)return clearInterval(r),this.element.innerText="",void e(!0);n=t.pop(),s-=1,this.element.innerText=i.slice(0,s)}else this.element.innerText=i.slice(0,s-1)+n.pop()}),1/this.config.speed.erase*100);this.intervalQueue.push(r)}))}renderWrite(t){return new Promise((e=>{let s=0;const i=[];let n=t.shift();if(!n)return;const r=setInterval((async()=>{this.stop&&await this.wait(),0===n.length?0===t.length?(clearInterval(r),this.element.innerText=i.join(""),e(!0)):(n=t.shift(),s+=1):(i[s]=n.shift(),this.element.innerText=i.join(""))}),1/this.config.speed.write*100);this.intervalQueue.push(r)}))}async render(){!1!==this.isStarted&&(this.config.mode.divide?(await this.renderWriteDivide([...this.copyCurrent()]),await this.wait(this.config.delay),this.config.mode.erase&&(await this.renderEraseDivide([...this.copyCurrent()]),await this.wait(this.config.delay))):(await this.renderWrite([...this.copyCurrent()]),this.config.mode.erase&&(await this.renderErase([...this.copyCurrent()]),await this.wait(this.config.delay))),this.orderUp(),this.isStarted&&this.render())}}class l{}class u{onset=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];nucleus=["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];coda=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];gapLetterWithWord=18816;startKorPoint=12593;startKorWordPoint=44032;changeOnsetPoint=this.coda.length*this.nucleus.length;korInitializePoint(t){if(!this.isKorean(t))throw new TypeError("required only korean.");return t.charCodeAt(0)-this.startKorWordPoint}onsetIndex(t){return Math.floor(this.korInitializePoint(t)/this.changeOnsetPoint)}nucleusIndex(t){return Math.floor(this.korInitializePoint(t)/this.coda.length%this.nucleus.length)}codeIndex(t){return Math.floor(this.korInitializePoint(t)%this.coda.length)}getOnset(t){return this.onset[this.onsetIndex(t)]}getNucleus(t){return this.nucleus[this.nucleusIndex(t)]}getCoda(t){return this.coda[this.codeIndex(t)]}isKorean(t){return!!String(t).match(/[ㄱ-ㅎ가-힣]/g)}wordToLetters(t){return this.wordToLettersWithEmpty(t).filter((t=>t))}wordToLettersWithEmpty(t){return[this.getOnset(t),this.getNucleus(t),this.getCoda(t)]}getOnsetIndex(t){return this.onset.indexOf(t)}getNucleusIndex(t){return this.nucleus.indexOf(t)}getCodaIndex(t){return this.coda.indexOf(t)}getOnsetCode(t){return this.getOnsetIndex(t)*this.changeOnsetPoint}getNucleusCode(t){return this.getNucleusIndex(t)%this.nucleus.length*this.coda.length}getCodaCode(t){return this.getCodaIndex(t)%this.coda.length}getWordCode(t){let e=0;return t[0]&&(e+=this.getOnsetCode(t[0])),t[1]&&(e+=this.getNucleusCode(t[1])),t[2]&&(e+=this.getCodaCode(t[2])),e+this.startKorWordPoint}lettersToWord(t){const e=this.getWordCode(t),s=String.fromCharCode(e);return 1===t.length?t[0]:s}}class p extends l{koreanParser;constructor(){super(),this.koreanParser=new u}wordToLetters(t){return this.wordToLettersWithEmpty(t).filter((t=>t))}wordToLettersWithEmpty(t){return[t,"",""]}categorizing(t){const e=[];for(const s of t.trim())if(this.koreanParser.isKorean(s)){const t=this.koreanParser.wordToLetters(s);e.push(t)}else{const t=this.wordToLetters(s);e.push(t)}return e}categorizingWithEmpty(t){const e=[];for(const s of t)if(this.koreanParser.isKorean(s)){const t=this.koreanParser.wordToLettersWithEmpty(s);e.push(t)}else{const t=this.wordToLettersWithEmpty(s);e.push(t)}return e}getTypingFlow(t){return t.map((t=>{const e=[];if(t.some(this.koreanParser.isKorean))for(let s=1;s<=t.length;s++){const i=t.slice(0,s),n=this.koreanParser.lettersToWord(i);e.push(n)}else e.push(...t);return e}))}parse(t){if(""!==t){const e=this.categorizing(t);return this.getTypingFlow(e)}return[]}}const f={autoRender:!0,mode:{erase:!0,realTyping:!1,divide:!0},speed:{write:1,erase:5},delay:3,nodes:[],querySelector:".typoz",style:{cursor:{blink:!0,blinkTime:1,content:"",color:"#56565656",dir:"vertical",size:1,distance:.1}}};class g{static instance(t){return new g(t)}static id=0;parser;id;name;_config=f;typeNode;originContent;taskQueue=[];pointer=0;content=[];stop=!1;pauseSignal=!1;resumeResolver;pausePromise;constructor(t){this.parser=t}pauseRender(){this.pauseSignal=!0,this.pausePromise=new Promise((t=>{this.resumeResolver=t}))}resumeRender(){this.resumeResolver(!0),this.pauseSignal=!1,this.resumeResolver=void 0,this.pausePromise=void 0}wait(t){return new Promise((e=>{setTimeout((()=>{e(t)}),t)}))}select(t){const e=r(t);return g.id+=1,this.id=g.id,this.typeNode=e,this.originContent=e.innerHTML,this.name=a(),this}conf(t=f){return c("0.0.19","config"),t&&s(this._config,t),o(n(this._config.style.cursor,this.name,!0)),this.typeNode.setAttribute("typoz-node-builder-id",""+this.id),this.typeNode.setAttribute("typoz-node-builder-name",this.name),this.typeNode.setAttribute("typoz-node-builder",""),this.typeNode.setAttribute("typoz-processed",""),this.typeNode.innerHTML="",this}config(t=f){return t&&s(this._config,t),o(n(this._config.style.cursor,this.name,!0)),this.typeNode.setAttribute("typoz-node-builder-id",""+this.id),this.typeNode.setAttribute("typoz-node-builder-name",this.name),this.typeNode.setAttribute("typoz-node-builder",""),this.typeNode.setAttribute("typoz-processed",""),this.typeNode.innerHTML="",this}getCurrentRenderContentLength(){return c("0.0.19"),this.content.length}cursorUpdate(t){this.pointer+t>=0&&this.pointer+t<=this.content.length&&(this.pointer+=t)}pause(t){return this.addTask((async()=>await this.wait(1e3*t))),this}commonWrite(t){this.addTask((async()=>(this.content=this.content.slice(0,this.pointer).concat(t).concat(this.content.slice(this.pointer)),this.cursorUpdate(1),this.renderContent(),await this.wait(1/this._config.speed.write*100))))}addplace(t,e){return this.addTask((async()=>(this.content=this.content.slice(0,this.pointer).concat(e).concat(this.content.slice(this.pointer)),this.cursorUpdate(t),this.renderContent(),await this.wait(1/this._config.speed.write*100)))),this}replace(t,e){return this.addTask((async()=>(this.content.splice(this.pointer,1,e),this.cursorUpdate(t),this.renderContent(),await this.wait(1/this._config.speed.write*100)))),this}write(t,e){for(const s of t)if(this.parser.koreanParser.isKorean(s)){const t=this.parser.categorizing(s),i=this.parser.getTypingFlow(t)[0];for(let t=0;t<i.length;t++){const s=i[t];0===t?this.addTask((async()=>(this.content=this.content.slice(0,this.pointer).concat(s).concat(this.content.slice(this.pointer)),this.renderContent(),await this.wait(e?1/e*100:1/this._config.speed.write*100)))):this.addTask((async()=>(this.content.splice(this.pointer,1,s),this.renderContent(),await this.wait(e?1/e*100:1/this._config.speed.write*100))))}this.addTask((async()=>(this.cursorUpdate(1),this.renderContent(),await this.wait(e?1/e*100:1/this._config.speed.write*100))))}else this.commonWrite(s);return this}erase(t=1,e){for(let s=0;s<t;s++)this.addTask((async()=>(this.cursorUpdate(-1),this.content.splice(this.pointer,1),this.renderContent(),await this.wait(e?1/e*100:1/(this._config.speed.erase/2)*100))));return this}allErase(t){return this.addTask((async()=>{for(;this.content.length>0;)this.cursorUpdate(-1),this.content.pop(),this.renderContent(),await this.wait(t?1/(t/2)/5*100:1/(this._config.speed.erase/2)/5*100);return t?1/(t/2)/5*100:1/(this._config.speed.erase/2)/5*100})),this}move(t,e){const s=Math.abs(t),i=Math.floor(Math.abs(t)/t);for(let t=0;t<s;t++)this.addTask((async()=>(this.cursorUpdate(i),this.renderContent(),await this.wait(e?1/e*100:100*this._config.delay))));return this}addTask(t){this.taskQueue.push(t)}async run(){for(const t of this.taskQueue){if(this.stop)break;this.pauseSignal&&await this.pausePromise,await t()}}async forever(t=!1){for(const t of this.taskQueue){if(this.stop)return;this.pauseSignal&&await this.pausePromise,await t()}if(await this.wait(1e3*this._config.delay),t)this.pointer=0,this.content=[],this.renderContent();else{for(;this.content.length>0;)this.cursorUpdate(-1),this.content.pop(),this.renderContent(),await this.wait(1/(this._config.speed.erase/2)/5*100);await this.wait(1e3*this._config.delay)}this.forever(t)}renderContent(){this.typeNode.innerHTML=this.content.map(((t,e)=>i("span",t,e===this.pointer-1?{name:"typoz-cursor",value:""}:void 0).outerHTML)).join("")}destroy(){this.stop=!0,this.taskQueue=[],this.typeNode.innerHTML=this.originContent,delete this.typeNode.typings,delete this.typeNode.typozConfig}}const y={EnNn:"은/는",EiGa:"이/가",ElRl:"을/를",GwaWa:"과/와"};class m{static Josa=y;parser;constructor(t){this.parser=t}splitIndex(t,e){if(e>t.length)throw new RangeError("too much index");return[t.slice(0,e),t.slice(e)].filter((t=>t))}splitIndexes(t,...e){let s=t;const i=[];for(let t=0;t<e.length;t++){const n=e[t];if(n<=0)continue;const[r,o]=this.splitIndex(s,n);i.push(r),o&&e.length-1===t&&i.push(o),s=s.slice(n)}return i}verbToContinue(t){const e=this.parser.categorizing(t),s=t.endsWith("르다"),i=t.endsWith("하다");let n=!1;const[r,o]=e.slice(...s?[-3,-1]:[-2]),h="ㅣ"===r[1];n=/[ㅗㅏ]/.test(r[1]);const a=!!r[2],c="ㅂ"===r[2],d="ㅅ"===r[2];if(i)return(t.length>=2?t.slice(0,-2):t)+"해";if(s){const e=t.length>=3?t.slice(0,-3):t;return n?e+this.parser.koreanParser.lettersToWord([...r,"ㄹ"])+"라":e+this.parser.koreanParser.lettersToWord([...r,"ㄹ"])+"러"}{const e=t.length>=2?t.slice(0,-2):t;return h?e+this.parser.koreanParser.lettersToWord([r[0],"ㅕ"]):c?e+this.parser.koreanParser.lettersToWord([r[0],r[1]])+(/[ㅏㅜㅣㅟ]/.test(r[1])?"워":"와"):a?e+this.parser.koreanParser.lettersToWord(d?[r[0],r[1]]:[...r])+(/[ㅡㅓㅜㅣㅟㅚ]/.test(r[1])?"어":"아"):e+this.parser.koreanParser.lettersToWord(/[ㅜ]/.test(r[1])?[r[0],"ㅝ"]:[...r])+(/[ㅜ]/.test(r[1])?"":"어")}}josaOnly(t,e){const s=this.parser.categorizing(t);console.log(t,s);const i=s[s.length-1][2],[n,r]=e.split("/");return i?n:r}josa(t,e){const s=this.parser.categorizing(t),i=s[s.length-1][2],[n,r]=e.split("/");return i?t+n:t+r}josaWith(t,e){const s=[];for(const i of t.slice(0,-1))s.push(this.josa(i,e));return s.push(t[t.length-1]),s.join(" ")}josaAnd(t,e){const s=[];for(const i of t.slice(0,-2))s.push(this.josa(i,e));return[...s,t[t.length-2]+",","그리고",t[t.length-1]].join(" ")}searchByOnset(t,e,s){const i=[];for(const n of t)if(this.parser.koreanParser.isKorean(n))this.parser.categorizing(n).map((t=>t[0])).join("").includes(e)&&i.push(n);else{const t="word is not korean";if(s?.withThrow)throw new TypeError(t,{cause:`word: ${n}`});console.error(`[${n}] `+t)}return i}hasJosa(t){for(const e in m.Josa){const[s,i]=m.Josa[e].split("/");if(t.endsWith(s)||t.endsWith(i))return!0}return!1}extractJosa(t){if(this.hasJosa(t))return t[t.length-1]}withCorrectJosa(t){const e=this.extractJosa(t);if(!e)return;const s=t.slice(0,-1);return this.josa(s,m.Josa[this.findJosaKey(e)])}findJosaKey(t){const e=Object.entries(m.Josa).find((([e,s])=>s.includes(t)));if(e)return e[0]}findJosa(t){return m.Josa[this.findJosaKey(t)]}isCorrectJosa(t){const e=this.extractJosa(t);if(!e)return;const s=this.findJosa(e);return this.josa(t.slice(0,-1),s)===t}checkJosa(t,e){if(e){const s=this.findJosa(e);return this.josa(t,s)}return this.withCorrectJosa(t)}checkOta(t){const e=[],s=t.split(" ");for(let t=0;t<s.length;t++){const i=s[t];if(this.hasJosa(i))if(1===i.length&&t>0){const n=this.checkJosa(s[t-1],i);e.push({problem:i,index:t,correct:n,detail:"조사는 붙여써야 합니다."})}else if(this.isCorrectJosa(i))console.log("empty");else{const s=this.checkJosa(i);e.push({problem:i,index:t,correct:s})}}return e}}const w={rE:"0.1.2"},x=w.rE;class T{defaultConfig=f;parser;util;static version(){return x}createBuilder(){const t=g.instance(this.parser);return this.typeBuilderNodes.push(t),t}node(){c("0.1.0","createBuilder");const t=g.instance(this.parser);return this.typeBuilderNodes.push(t),t}config;typeNodes=[];typeBuilderNodes=[];constructor(){this.parser=new p,this.util=new m(this.parser)}initialize(){this.config=h(this.defaultConfig)}destroy(){this.config=h(this.defaultConfig),d.id=0,g.id=0;for(const t of this.typeNodes)t.destroy();for(const t of this.typeBuilderNodes)t.destroy();this.typeNodes=[],this.typeBuilderNodes=[],document.head.querySelectorAll("[typoz-styles]").forEach((t=>{t?.remove?.()}))}globalConfig(t=f){t&&s(this.config,t),this.config.autoRender&&this.render()}convert(t){return this.parser.parse(t)}bulkConvert(t){const e=[];for(const s of t)e.push(this.convert(s));return e}resume(t){if(null!=t&&"string"==typeof t){const e=this.typeNodes.find((e=>e.name===t));e&&e.resume();const s=this.typeBuilderNodes.find((e=>e.name===t));s&&s.resumeRender()}else{for(const t of this.typeNodes)t.resume();for(const t of this.typeBuilderNodes)t.resumeRender()}}pause(t){if(null!=t&&"string"==typeof t){const e=this.typeNodes.find((e=>e.name===t));e&&e.pause();const s=this.typeBuilderNodes.find((e=>e.name===t));s&&s.resumeRender()}else{for(const t of this.typeNodes)t.pause();for(const t of this.typeBuilderNodes)t.pauseRender()}}defaultRender(){const t=(e=this.config.querySelector,document.querySelectorAll([].concat(e).join(",")));var e;for(const e of[...new Set(t)]){const t=e.innerText.trim();let s=[];if(Object.hasOwn(e,"typings")||(e.typings=[]),t){e.typings.push(t);const i=this.convert(t);s.push(i)}const i=new d(e,e.typozConfig||JSON.parse(JSON.stringify(this.config)),s);this.typeNodes.push(i)}}manualRender(t){for(const e of[...new Set(t)]){const t=e.innerText.trim();let s=[];if(Object.hasOwn(e,"typings")||(e.typings=[]),""!==t){e.typings.push(t);const i=this.convert(t);s.push(i)}const i=new d(e,e.typozConfig||JSON.parse(JSON.stringify(this.config)),s);this.typeNodes.push(i)}}getConfigNodes(){return this.config.nodes.length>0?this.config.nodes.reduce(((t,{select:e,words:i,config:n})=>{const o=r(e),h=this.config.querySelector instanceof Array?this.config.querySelector[0]:this.config.querySelector;if(o&&!o.classList.contains(h)){if(!Object.hasOwn(o,"typozConfig")){const t=JSON.parse(JSON.stringify(this.config));s(t,n||this.config),o.typozConfig=t}const e=function(t){return t.innerText.trim()}(o);Object.hasOwn(o,"typings")||(o.typings=[],e&&o.typings.push(e)),i?.length>0&&o.typings.push(...i.map((t=>t.trim()))),t.push(o)}else console.error(new SyntaxError("not found element. select: "+e,{cause:e}));return t}),[]):[]}nodesRender(){const t=this.getConfigNodes();for(const e of[...new Set(t)]){const t=e.innerText.trim(),s=[];t&&s.push(t),e.typings?.length>0&&s.push(...e.typings);const i=new d(e,e.typozConfig||JSON.parse(JSON.stringify(this.defaultConfig)),this.bulkConvert([...new Set(s)]));this.typeNodes.includes(i)||this.typeNodes.push(i)}}render(t){let e="@keyframes cursor-blink { 100% { opacity: 0; } }";e+=n(this.config.style.cursor),this.defaultRender(),t&&this.manualRender(t),this.nodesRender();for(const t of this.typeNodes)e+=t.injectStyle+"\n",t.run();o(e)}}const{rE:b}=w,v=T;exports.KoreanParser=e.KoreanParser,exports.Parser=e.Parser,exports.Typoz=e.Typoz,exports.Util=e.Util,exports.default=e.default,exports.version=e.version,Object.defineProperty(exports,"__esModule",{value:!0})})();
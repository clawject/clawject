"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[908],{9047:(e,n,t)=>{t.d(n,{Z:()=>_});var i=t(7294),s=t(5893);function a(e){const{mdxAdmonitionTitle:n,rest:t}=function(e){const n=i.Children.toArray(e),t=n.find((e=>i.isValidElement(e)&&"mdxAdmonitionTitle"===e.type)),a=n.filter((e=>e!==t)),l=t?.props.children;return{mdxAdmonitionTitle:l,rest:a.length>0?(0,s.jsx)(s.Fragment,{children:a}):null}}(e.children),a=e.title??n;return{...e,...a&&{title:a},children:t}}var l=t(6905),o=t(5999),r=t(5281);const c={admonition:"admonition_xJq3",admonitionHeading:"admonitionHeading_Gvgb",admonitionIcon:"admonitionIcon_Rf37",admonitionContent:"admonitionContent_BuS1"};function d(e){let{type:n,className:t,children:i}=e;return(0,s.jsx)("div",{className:(0,l.Z)(r.k.common.admonition,r.k.common.admonitionType(n),c.admonition,t),children:i})}function u(e){let{icon:n,title:t}=e;return(0,s.jsxs)("div",{className:c.admonitionHeading,children:[(0,s.jsx)("span",{className:c.admonitionIcon,children:n}),t]})}function m(e){let{children:n}=e;return n?(0,s.jsx)("div",{className:c.admonitionContent,children:n}):null}function h(e){const{type:n,icon:t,title:i,children:a,className:l}=e;return(0,s.jsxs)(d,{type:n,className:l,children:[(0,s.jsx)(u,{title:i,icon:t}),(0,s.jsx)(m,{children:a})]})}function f(e){return(0,s.jsx)("svg",{viewBox:"0 0 14 16",...e,children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})})}const x={icon:(0,s.jsx)(f,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})};function v(e){return(0,s.jsx)(h,{...x,...e,className:(0,l.Z)("alert alert--secondary",e.className),children:e.children})}function j(e){return(0,s.jsx)("svg",{viewBox:"0 0 12 16",...e,children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})})}const g={icon:(0,s.jsx)(j,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})};function p(e){return(0,s.jsx)(h,{...g,...e,className:(0,l.Z)("alert alert--success",e.className),children:e.children})}function N(e){return(0,s.jsx)("svg",{viewBox:"0 0 14 16",...e,children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})})}const C={icon:(0,s.jsx)(N,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})};function b(e){return(0,s.jsx)(h,{...C,...e,className:(0,l.Z)("alert alert--info",e.className),children:e.children})}function L(e){return(0,s.jsx)("svg",{viewBox:"0 0 16 16",...e,children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})})}const Z={icon:(0,s.jsx)(L,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.warning",description:"The default label used for the Warning admonition (:::warning)",children:"warning"})};function H(e){return(0,s.jsx)("svg",{viewBox:"0 0 12 16",...e,children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})})}const y={icon:(0,s.jsx)(H,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})};const k={icon:(0,s.jsx)(L,{}),title:(0,s.jsx)(o.Z,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})};const w={...{note:v,tip:p,info:b,warning:function(e){return(0,s.jsx)(h,{...Z,...e,className:(0,l.Z)("alert alert--warning",e.className),children:e.children})},danger:function(e){return(0,s.jsx)(h,{...y,...e,className:(0,l.Z)("alert alert--danger",e.className),children:e.children})}},...{secondary:e=>(0,s.jsx)(v,{title:"secondary",...e}),important:e=>(0,s.jsx)(b,{title:"important",...e}),success:e=>(0,s.jsx)(p,{title:"success",...e}),caution:function(e){return(0,s.jsx)(h,{...k,...e,className:(0,l.Z)("alert alert--warning",e.className),children:e.children})}}};function _(e){const n=a(e),t=(i=n.type,w[i]||(console.warn(`No admonition component found for admonition type "${i}". Using Info as fallback.`),w.info));var i;return(0,s.jsx)(t,{...n})}},591:(e,n,t)=>{t.d(n,{Z:()=>w});var i=t(7294),s=t(1151),a=t(5742),l=t(9286),o=t(5893);var r=t(9960);var c=t(6905),d=t(788),u=t(2389),m=t(6043);const h={details:"details_lb9f",isBrowser:"isBrowser_bmU9",collapsibleContent:"collapsibleContent_i85q"};function f(e){return!!e&&("SUMMARY"===e.tagName||f(e.parentElement))}function x(e,n){return!!e&&(e===n||x(e.parentElement,n))}function v(e){let{summary:n,children:t,...s}=e;const a=(0,u.Z)(),l=(0,i.useRef)(null),{collapsed:r,setCollapsed:c}=(0,m.u)({initialState:!s.open}),[v,j]=(0,i.useState)(s.open),g=i.isValidElement(n)?n:(0,o.jsx)("summary",{children:n??"Details"});return(0,o.jsxs)("details",{...s,ref:l,open:v,"data-collapsed":r,className:(0,d.Z)(h.details,a&&h.isBrowser,s.className),onMouseDown:e=>{f(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const n=e.target;f(n)&&x(n,l.current)&&(e.preventDefault(),r?(c(!1),j(!0)):c(!0))},children:[g,(0,o.jsx)(m.z,{lazy:!1,collapsed:r,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{c(e),j(!e)},children:(0,o.jsx)("div",{className:h.collapsibleContent,children:t})})]})}const j={details:"details_b_Ee"},g="alert alert--info";function p(e){let{...n}=e;return(0,o.jsx)(v,{...n,className:(0,c.Z)(g,j.details,n.className)})}function N(e){const n=i.Children.toArray(e.children),t=n.find((e=>i.isValidElement(e)&&"summary"===e.type)),s=(0,o.jsx)(o.Fragment,{children:n.filter((e=>e!==t))});return(0,o.jsx)(p,{...e,summary:t,children:s})}var C=t(2503);function b(e){return(0,o.jsx)(C.Z,{...e})}const L={containsTaskList:"containsTaskList_mC6p"};function Z(e){if(void 0!==e)return(0,c.Z)(e,e?.includes("contains-task-list")&&L.containsTaskList)}const H={img:"img_ev3q"};var y=t(9047);const k={Head:a.Z,details:N,Details:N,code:function(e){return i.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")))?(0,o.jsx)("code",{...e}):(0,o.jsx)(l.Z,{...e})},a:function(e){return(0,o.jsx)(r.Z,{...e})},pre:function(e){return(0,o.jsx)(o.Fragment,{children:e.children})},ul:function(e){return(0,o.jsx)("ul",{...e,className:Z(e.className)})},img:function(e){return(0,o.jsx)("img",{loading:"lazy",...e,className:(n=e.className,(0,c.Z)(n,H.img))});var n},h1:e=>(0,o.jsx)(b,{as:"h1",...e}),h2:e=>(0,o.jsx)(b,{as:"h2",...e}),h3:e=>(0,o.jsx)(b,{as:"h3",...e}),h4:e=>(0,o.jsx)(b,{as:"h4",...e}),h5:e=>(0,o.jsx)(b,{as:"h5",...e}),h6:e=>(0,o.jsx)(b,{as:"h6",...e}),admonition:y.Z,mermaid:()=>null};function w(e){let{children:n}=e;return(0,o.jsx)(s.Z,{components:k,children:n})}},9407:(e,n,t)=>{t.d(n,{Z:()=>c});t(7294);var i=t(6905),s=t(3743);const a={tableOfContents:"tableOfContents_bqdL",docItemContainer:"docItemContainer_F8PC"};var l=t(5893);const o="table-of-contents__link toc-highlight",r="table-of-contents__link--active";function c(e){let{className:n,...t}=e;return(0,l.jsx)("div",{className:(0,i.Z)(a.tableOfContents,"thin-scrollbar",n),children:(0,l.jsx)(s.Z,{...t,linkClassName:o,linkActiveClassName:r})})}},3743:(e,n,t)=>{t.d(n,{Z:()=>x});var i=t(7294),s=t(6668);function a(e){const n=e.map((e=>({...e,parentIndex:-1,children:[]}))),t=Array(7).fill(-1);n.forEach(((e,n)=>{const i=t.slice(2,e.level);e.parentIndex=Math.max(...i),t[e.level]=n}));const i=[];return n.forEach((e=>{const{parentIndex:t,...s}=e;t>=0?n[t].children.push(s):i.push(s)})),i}function l(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:i}=e;return n.flatMap((e=>{const n=l({toc:e.children,minHeadingLevel:t,maxHeadingLevel:i});return function(e){return e.level>=t&&e.level<=i}(e)?[{...e,children:n}]:n}))}function o(e){const n=e.getBoundingClientRect();return n.top===n.bottom?o(e.parentNode):n}function r(e,n){let{anchorTopOffset:t}=n;const i=e.find((e=>o(e).top>=t));if(i){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(o(i))?i:e[e.indexOf(i)-1]??null}return e[e.length-1]??null}function c(){const e=(0,i.useRef)(0),{navbar:{hideOnScroll:n}}=(0,s.L)();return(0,i.useEffect)((()=>{e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function d(e){const n=(0,i.useRef)(void 0),t=c();(0,i.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:i,linkActiveClassName:s,minHeadingLevel:a,maxHeadingLevel:l}=e;function o(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(i),o=function(e){let{minHeadingLevel:n,maxHeadingLevel:t}=e;const i=[];for(let s=n;s<=t;s+=1)i.push(`h${s}.anchor`);return Array.from(document.querySelectorAll(i.join()))}({minHeadingLevel:a,maxHeadingLevel:l}),c=r(o,{anchorTopOffset:t.current}),d=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,t){t?(n.current&&n.current!==e&&n.current.classList.remove(s),e.classList.add(s),n.current=e):e.classList.remove(s)}(e,e===d)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),()=>{document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,t])}var u=t(9960),m=t(5893);function h(e){let{toc:n,className:t,linkClassName:i,isChild:s}=e;return n.length?(0,m.jsx)("ul",{className:s?void 0:t,children:n.map((e=>(0,m.jsxs)("li",{children:[(0,m.jsx)(u.Z,{to:`#${e.id}`,className:i??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,m.jsx)(h,{isChild:!0,toc:e.children,className:t,linkClassName:i})]},e.id)))}):null}const f=i.memo(h);function x(e){let{toc:n,className:t="table-of-contents table-of-contents__left-border",linkClassName:o="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:c,maxHeadingLevel:u,...h}=e;const x=(0,s.L)(),v=c??x.tableOfContents.minHeadingLevel,j=u??x.tableOfContents.maxHeadingLevel,g=function(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:s}=e;return(0,i.useMemo)((()=>l({toc:a(n),minHeadingLevel:t,maxHeadingLevel:s})),[n,t,s])}({toc:n,minHeadingLevel:v,maxHeadingLevel:j});return d((0,i.useMemo)((()=>{if(o&&r)return{linkClassName:o,linkActiveClassName:r,minHeadingLevel:v,maxHeadingLevel:j}}),[o,r,v,j])),(0,m.jsx)(f,{toc:g,className:t,linkClassName:o,...h})}},2212:(e,n,t)=>{t.d(n,{Z:()=>h});t(7294);var i=t(6905),s=t(5999),a=t(5742),l=t(5893);function o(){return(0,l.jsx)(s.Z,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function r(){return(0,l.jsx)(s.Z,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,l.jsx)(a.Z,{children:(0,l.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}var d=t(5281),u=t(9047);function m(e){let{className:n}=e;return(0,l.jsx)(u.Z,{type:"caution",title:(0,l.jsx)(o,{}),className:(0,i.Z)(n,d.k.common.unlistedBanner),children:(0,l.jsx)(r,{})})}function h(e){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(c,{}),(0,l.jsx)(m,{...e})]})}}}]);
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[992],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=a.createContext({}),s=function(e){var n=a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=s(e.components);return a.createElement(c.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},b=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(t),b=r,m=u["".concat(c,".").concat(b)]||u[b]||d[b]||o;return t?a.createElement(m,i(i({ref:n},p),{},{components:t})):a.createElement(m,i({ref:n},p))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=b;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l[u]="string"==typeof e?e:r,i[1]=l;for(var s=2;s<o;s++)i[s]=t[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}b.displayName="MDXCreateElement"},1155:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var a=t(7462),r=(t(7294),t(3905));const o={title:"Bean",id:"bean"},i=void 0,l={unversionedId:"base-concepts/bean/bean",id:"base-concepts/bean/bean",title:"Bean",description:"What is Bean?",source:"@site/docs/03-base-concepts/06-bean/index.mdx",sourceDirName:"03-base-concepts/06-bean",slug:"/base-concepts/bean/",permalink:"/docs/base-concepts/bean/",draft:!1,tags:[],version:"current",frontMatter:{title:"Bean",id:"bean"},sidebar:"tutorialSidebar",previous:{title:"CatContext",permalink:"/docs/base-concepts/cat-context"},next:{title:"Declare Bean",permalink:"/docs/base-concepts/bean/declare-bean"}},c={},s=[{value:"What is Bean?",id:"what-is-bean",level:2}],p={toc:s},u="wrapper";function d(e){let{components:n,...t}=e;return(0,r.kt)(u,(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"what-is-bean"},"What is Bean?"),(0,r.kt)("p",null,"Bean is an object that is managed and constructed by Clawject container it can have dependencies,\nand it can be a dependency for other Beans."),(0,r.kt)("p",null,"Almost anything can be a Bean, but there are some restrictions:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Should not be of type: ",(0,r.kt)("inlineCode",{parentName:"li"},"undefined"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"void"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"null"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"never"),", etc."),(0,r.kt)("li",{parentName:"ul"},"Should not have the following modifiers: ",(0,r.kt)("inlineCode",{parentName:"li"},"abstract"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"static")," or ",(0,r.kt)("inlineCode",{parentName:"li"},"declare")),(0,r.kt)("li",{parentName:"ul"},"Bean should have a statically known name")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Example of invalid declaration"',title:'"Example',of:!0,invalid:!0,'declaration"':!0},"class MyContext extends CatContext {\n  @Bean myBean1: void | undefined | null | never\n  @Bean abstract myBean2: string;\n  @Bean declare myBean3: string;\n  @Bean static myBean4 = 'hello';\n\n  @Bean ['myBean' + 5] = 'hello';\n}\n")))}d.isMDXComponent=!0}}]);
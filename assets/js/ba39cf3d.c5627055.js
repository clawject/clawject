"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[750],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>b});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),i=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=i(e.components);return n.createElement(u.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=i(r),d=a,b=p["".concat(u,".").concat(d)]||p[d]||m[d]||l;return r?n.createElement(b,o(o({ref:t},c),{},{components:r})):n.createElement(b,o({ref:t},c))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=d;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s[p]="string"==typeof e?e:a,o[1]=s;for(var i=2;i<l;i++)o[i]=r[i];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5162:(e,t,r)=>{r.d(t,{Z:()=>o});var n=r(7294),a=r(6010);const l={tabItem:"tabItem_Ymn6"};function o(e){let{children:t,hidden:r,className:o}=e;return n.createElement("div",{role:"tabpanel",className:(0,a.Z)(l.tabItem,o),hidden:r},t)}},4866:(e,t,r)=>{r.d(t,{Z:()=>v});var n=r(7462),a=r(7294),l=r(6010),o=r(2466),s=r(6550),u=r(1980),i=r(7392),c=r(12);function p(e){return function(e){return a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:r,attributes:n,default:a}}=e;return{value:t,label:r,attributes:n,default:a}}))}function m(e){const{values:t,children:r}=e;return(0,a.useMemo)((()=>{const e=t??p(r);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,r])}function d(e){let{value:t,tabValues:r}=e;return r.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:r}=e;const n=(0,s.k6)(),l=function(e){let{queryString:t=!1,groupId:r}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,u._X)(l),(0,a.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(n.location.search);t.set(l,e),n.replace({...n.location,search:t.toString()})}),[l,n])]}function f(e){const{defaultValue:t,queryString:r=!1,groupId:n}=e,l=m(e),[o,s]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=r.find((e=>e.default))??r[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:l}))),[u,i]=b({queryString:r,groupId:n}),[p,f]=function(e){let{groupId:t}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,l]=(0,c.Nk)(r);return[n,(0,a.useCallback)((e=>{r&&l.set(e)}),[r,l])]}({groupId:n}),g=(()=>{const e=u??p;return d({value:e,tabValues:l})?e:null})();(0,a.useLayoutEffect)((()=>{g&&s(g)}),[g]);return{selectedValue:o,selectValue:(0,a.useCallback)((e=>{if(!d({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);s(e),i(e),f(e)}),[i,f,l]),tabValues:l}}var g=r(2389);const k={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function y(e){let{className:t,block:r,selectedValue:s,selectValue:u,tabValues:i}=e;const c=[],{blockElementScrollPositionUntilNextRender:p}=(0,o.o5)(),m=e=>{const t=e.currentTarget,r=c.indexOf(t),n=i[r].value;n!==s&&(p(t),u(n))},d=e=>{let t=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":{const r=c.indexOf(e.currentTarget)+1;t=c[r]??c[0];break}case"ArrowLeft":{const r=c.indexOf(e.currentTarget)-1;t=c[r]??c[c.length-1];break}}t?.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":r},t)},i.map((e=>{let{value:t,label:r,attributes:o}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,key:t,ref:e=>c.push(e),onKeyDown:d,onClick:m},o,{className:(0,l.Z)("tabs__item",k.tabItem,o?.className,{"tabs__item--active":s===t})}),r??t)})))}function w(e){let{lazy:t,children:r,selectedValue:n}=e;const l=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===n));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},l.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==n}))))}function h(e){const t=f(e);return a.createElement("div",{className:(0,l.Z)("tabs-container",k.tabList)},a.createElement(y,(0,n.Z)({},e,t)),a.createElement(w,(0,n.Z)({},e,t)))}function v(e){const t=(0,g.Z)();return a.createElement(h,(0,n.Z)({key:String(t)},e))}},8361:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>u,default:()=>b,frontMatter:()=>s,metadata:()=>i,toc:()=>p});var n=r(7462),a=(r(7294),r(3905)),l=r(4866),o=r(5162);const s={title:"Setup \ud83d\udee0\ufe0f"},u=void 0,i={unversionedId:"setup",id:"setup",title:"Setup \ud83d\udee0\ufe0f",description:"Prerequisites",source:"@site/docs/02-setup.mdx",sourceDirName:".",slug:"/setup",permalink:"/docs/setup",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Setup \ud83d\udee0\ufe0f"},sidebar:"tutorialSidebar",previous:{title:"Introduction \ud83d\udc4b",permalink:"/docs/intro"},next:{title:"Intro to IoC and DI",permalink:"/docs/base-concepts/ioc-di"}},c={},p=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Installation",id:"installation",level:2},{value:"Webpack and ts-loader",id:"webpack-and-ts-loader",level:3},{value:"Webpack and ts-loader with custom compiler (ts-patch) TODO",id:"webpack-and-ts-loader-with-custom-compiler-ts-patch-todo",level:3},{value:"Pure typescript with custom compiler (ttypescript) TODO",id:"pure-typescript-with-custom-compiler-ttypescript-todo",level:3}],m={toc:p},d="wrapper";function b(e){let{components:t,...r}=e;return(0,a.kt)(d,(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Node.js version 16 or above"),(0,a.kt)("li",{parentName:"ul"},"TypeScript version 4.8\u20134.9")),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"yarn",label:"yarn",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add clawject\n"))),(0,a.kt)(o.Z,{value:"npm",label:"npm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm install clawject\n")))),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"webpack-and-ts-loader"},"Webpack and ts-loader"),(0,a.kt)("admonition",{title:"Please notice",type:"info"},(0,a.kt)("p",{parentName:"admonition"},"If you're going to use ",(0,a.kt)("strong",{parentName:"p"},"ts-loader")," - make sure ",(0,a.kt)("strong",{parentName:"p"},"transpileOnly")," mode is disabled.\nBasically, ",(0,a.kt)("strong",{parentName:"p"},"transpileOnly")," disables the ability to perform static type checking,\nwhich is required for ",(0,a.kt)("strong",{parentName:"p"},"Clawject")," to work."),(0,a.kt)("p",{parentName:"admonition"},"Also, if you're using ",(0,a.kt)("strong",{parentName:"p"},"Babel")," - please make sure that it's applied after ts-loader."),(0,a.kt)("p",{parentName:"admonition"},(0,a.kt)("a",{parentName:"p",href:"https://github.com/TypeStrong/ts-loader#transpileonly"},"ts-loader#transpileOnly"))),(0,a.kt)("p",null,"To start using Clawject with ",(0,a.kt)("strong",{parentName:"p"},"webpack and ts-loader"),", you need to pass typescript transformer."),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"ts-webpack",label:"TS webpack configuration",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ClawjectWebpackPlugin } from 'clawject/webpack';\nimport { ClawjectTransformer } from 'clawject/transformer';\n\nexport default {\n  module: {\n    rules: [{\n      test: /\\.ts$/,\n      loader: 'ts-loader',\n      options: {\n        getCustomTransformers: (program: any, getProgram: any) => ({\n          before: [ClawjectTransformer(getProgram)]\n        })\n      }\n    }]\n  },\n  plugins: [\n    new ClawjectWebpackPlugin()\n  ]\n};\n"))),(0,a.kt)(o.Z,{value:"js-webpack",label:"JS webpack configuration",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const {ClawjectWebpackPlugin} = require('clawject/webpack');\nconst {ClawjectTransformer} = require('clawject/transformer');\n\nmodule.exports = {\n  module: {\n    rules: [{\n      test: /\\.ts$/,\n      loader: 'ts-loader',\n      options: {\n        getCustomTransformers: (program, getProgram) => ({\n          before: [ClawjectTransformer(getProgram)]\n        })\n      }\n    }]\n  },\n  plugins: [\n    new ClawjectWebpackPlugin()\n  ]\n};\n")))),(0,a.kt)("h3",{id:"webpack-and-ts-loader-with-custom-compiler-ts-patch-todo"},"Webpack and ts-loader with custom compiler (ts-patch) TODO"),(0,a.kt)("p",null,"Instead of passing typescript transformer in webpack configuration -\nyou should pass custom compiler, for example - ",(0,a.kt)("strong",{parentName:"p"},"ts-patch"),"."),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"ts-webpack",label:"TS webpack configuration",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ClawjectWebpackPlugin } from 'clawject/webpack';\n\nexport default {\n  module: {\n    rules: [{\n      test: /\\.ts$/,\n      loader: 'ts-loader',\n      options: {\n        compiler: 'ts-patch'\n      }\n    }]\n  },\n  plugins: [\n    new ClawjectWebpackPlugin()\n  ]\n};\n"))),(0,a.kt)(o.Z,{value:"js-webpack",label:"JS webpack configuration",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const {ClawjectWebpackPlugin} = require('clawject/webpack');\n\nmodule.exports = {\n  module: {\n    rules: [{\n      test: /\\.ts$/,\n      loader: 'ts-loader',\n      options: {\n        compiler: 'ttypescript'\n      }\n    }]\n  },\n  plugins: [\n    new ClawjectWebpackPlugin()\n  ]\n};\n"))),(0,a.kt)(o.Z,{value:"tsconfig",label:"tsconfig.json",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "compilerOptions": {\n    "plugins": [\n      {\n        "transform": "clawject/transformer"\n      }\n    ]\n  }\n}\n')))),(0,a.kt)("h3",{id:"pure-typescript-with-custom-compiler-ttypescript-todo"},"Pure typescript with custom compiler (ttypescript) TODO"))}b.isMDXComponent=!0}}]);
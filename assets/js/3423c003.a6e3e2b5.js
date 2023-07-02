"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[907],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(n),f=a,m=u["".concat(s,".").concat(f)]||u[f]||d[f]||o;return n?r.createElement(m,c(c({ref:t},p),{},{components:n})):r.createElement(m,c({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=f;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:a,c[1]=i;for(var l=2;l<o;l++)c[l]=n[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},2034:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>c,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var r=n(7462),a=(n(7294),n(3905));const o={title:"CatContext",id:"cat-context"},c=void 0,i={unversionedId:"concepts/cat-context",id:"concepts/cat-context",title:"CatContext",description:"Overview",source:"@site/docs/03-concepts/03-CatContext.mdx",sourceDirName:"03-concepts",slug:"/concepts/cat-context",permalink:"/docs/concepts/cat-context",draft:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"CatContext",id:"cat-context"},sidebar:"tutorialSidebar",previous:{title:"ContainerManager",permalink:"/docs/concepts/container-manager"},next:{title:"Bean",permalink:"/docs/concepts/bean/"}},s={},l=[{value:"Overview",id:"overview",level:2},{value:"Usage",id:"usage",level:2}],p={toc:l},u="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"CatContext is a class that represents the IoC container.\nThe container is responsible for instantiating, configuring and assembling objects known as Beans and managing their life cycles."),(0,a.kt)("p",null,"CatContext it's an abstract class that can be extended to create a custom container."),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"To define container, you need to create a class that extends CatContext."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { CatContext } from 'clawject';\n\nexport class MyContext extends CatContext {}\n")),(0,a.kt)("p",null,"To init container, you need to use ContainerManager interface and pass class to the init method."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { ContainerManager } from 'clawject'; \n\nContainerManager.init(MyContext);\n")),(0,a.kt)("h2",{id:""}))}d.isMDXComponent=!0}}]);
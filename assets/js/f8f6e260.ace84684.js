"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[872],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=a.createContext({}),s=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(n),f=o,m=d["".concat(c,".").concat(f)]||d[f]||u[f]||i;return n?a.createElement(m,r(r({ref:t},p),{},{components:n})):a.createElement(m,r({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=f;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[d]="string"==typeof e?e:o,r[1]=l;for(var s=2;s<i;s++)r[s]=n[s];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},7521:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={title:"InitializedContext",id:"initialized-context"},r=void 0,l={unversionedId:"base-concepts/initialized-context",id:"base-concepts/initialized-context",title:"InitializedContext",description:"InitializedContext is an object that is returned from ContainerManager.init/getOrInit/get methods.",source:"@site/docs/04-base-concepts/04-initialized-context.mdx",sourceDirName:"04-base-concepts",slug:"/base-concepts/initialized-context",permalink:"/docs/base-concepts/initialized-context",draft:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"InitializedContext",id:"initialized-context"},sidebar:"tutorialSidebar",previous:{title:"ContainerManager",permalink:"/docs/base-concepts/container-manager"},next:{title:"CatContext",permalink:"/docs/base-concepts/cat-context"}},c={},s=[{value:"Methods overview",id:"methods-overview",level:2},{value:"<code>InitializedContext.getBean</code>",id:"initializedcontextgetbean",level:3},{value:"<code>InitializedContext.getBeans</code>",id:"initializedcontextgetbeans",level:3},{value:"<code>InitializedContext.getAllBeans</code>",id:"initializedcontextgetallbeans",level:3}],p={toc:s},d="wrapper";function u(e){let{components:t,...n}=e;return(0,o.kt)(d,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"InitializedContext is an object that is returned from ",(0,o.kt)("inlineCode",{parentName:"p"},"ContainerManager.init/getOrInit/get")," methods.\nYou can use to access public beans in context, or to retrieve Map of all beans in context."),(0,o.kt)("h2",{id:"methods-overview"},"Methods overview"),(0,o.kt)("h3",{id:"initializedcontextgetbean"},(0,o.kt)("inlineCode",{parentName:"h3"},"InitializedContext.getBean")),(0,o.kt)("p",null,"Returns external bean that is defined in ",(0,o.kt)("inlineCode",{parentName:"p"},"ExternalBeans")," interface by name."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Bean, CatContext, ContainerManager } from 'clawject';\n\ninterface MyExternalBeans {\n  foo: string;\n}\n\nclass MyContext extends CatContext<MyExternalBeans> {\n  @Bean foo = 'fooValue';\n}\n\nconst myContext = ContainerManager.init(MyContext);\n\nconsole.log(myContext.getBean('foo')) // <-- Will print \"fooValue\"\n")),(0,o.kt)("h3",{id:"initializedcontextgetbeans"},(0,o.kt)("inlineCode",{parentName:"h3"},"InitializedContext.getBeans")),(0,o.kt)("p",null,"Returns ",(0,o.kt)("inlineCode",{parentName:"p"},"ExternalBeans"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Bean, CatContext, ContainerManager } from 'clawject';\n\ninterface MyExternalBeans {\n  foo: string;\n}\n\nclass MyContext extends CatContext<MyExternalBeans> {\n  @Bean foo = 'fooValue';\n}\n\nconst myContext = ContainerManager.init(MyContext);\n\nconsole.log(myContext.getBeans()) // <-- Will print \"{ foo: 'fooValue' }\"\n")),(0,o.kt)("h3",{id:"initializedcontextgetallbeans"},(0,o.kt)("inlineCode",{parentName:"h3"},"InitializedContext.getAllBeans")),(0,o.kt)("p",null,"Returns ",(0,o.kt)("inlineCode",{parentName:"p"},"Map<string, unknown>")," where ",(0,o.kt)("inlineCode",{parentName:"p"},"string")," is bean name, and ",(0,o.kt)("inlineCode",{parentName:"p"},"unknown")," is bean value."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Bean, CatContext, ContainerManager } from 'clawject';\n\ninterface MyExternalBeans {\n  foo: string;\n}\n\nclass MyContext extends CatContext<MyExternalBeans> {\n  @Bean foo = 'fooValue';\n}\n\nconst myContext = ContainerManager.init(MyContext);\n\nmyContext.getAllBeans().forEach((value, name) => {\n  console.log(name, value) // <-- Will print \"foo fooValue\"\n});\n")))}u.isMDXComponent=!0}}]);
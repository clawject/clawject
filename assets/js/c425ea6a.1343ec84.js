"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[481],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>b});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=o.createContext({}),l=function(e){var t=o.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=l(e.components);return o.createElement(i.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),p=l(n),m=r,b=p["".concat(i,".").concat(m)]||p[m]||d[m]||a;return n?o.createElement(b,s(s({ref:t},u),{},{components:n})):o.createElement(b,s({ref:t},u))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,s=new Array(a);s[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[p]="string"==typeof e?e:r,s[1]=c;for(var l=2;l<a;l++)s[l]=n[l];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>s});var o=n(7294),r=n(6010);const a={tabItem:"tabItem_Ymn6"};function s(e){let{children:t,hidden:n,className:s}=e;return o.createElement("div",{role:"tabpanel",className:(0,r.Z)(a.tabItem,s),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>C});var o=n(7462),r=n(7294),a=n(6010),s=n(2466),c=n(6550),i=n(1980),l=n(7392),u=n(12);function p(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:o,default:r}}=e;return{value:t,label:n,attributes:o,default:r}}))}function d(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,l.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:n}=e;const o=(0,c.k6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,i._X)(a),(0,r.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(o.location.search);t.set(a,e),o.replace({...o.location,search:t.toString()})}),[a,o])]}function h(e){const{defaultValue:t,queryString:n=!1,groupId:o}=e,a=d(e),[s,c]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const o=n.find((e=>e.default))??n[0];if(!o)throw new Error("Unexpected error: 0 tabValues");return o.value}({defaultValue:t,tabValues:a}))),[i,l]=b({queryString:n,groupId:o}),[p,h]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[o,a]=(0,u.Nk)(n);return[o,(0,r.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:o}),g=(()=>{const e=i??p;return m({value:e,tabValues:a})?e:null})();(0,r.useLayoutEffect)((()=>{g&&c(g)}),[g]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);c(e),l(e),h(e)}),[l,h,a]),tabValues:a}}var g=n(2389);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function v(e){let{className:t,block:n,selectedValue:c,selectValue:i,tabValues:l}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,s.o5)(),d=e=>{const t=e.currentTarget,n=u.indexOf(t),o=l[n].value;o!==c&&(p(t),i(o))},m=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=u.indexOf(e.currentTarget)+1;t=u[n]??u[0];break}case"ArrowLeft":{const n=u.indexOf(e.currentTarget)-1;t=u[n]??u[u.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":n},t)},l.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,o.Z)({role:"tab",tabIndex:c===t?0:-1,"aria-selected":c===t,key:t,ref:e=>u.push(e),onKeyDown:m,onClick:d},s,{className:(0,a.Z)("tabs__item",f.tabItem,s?.className,{"tabs__item--active":c===t})}),n??t)})))}function k(e){let{lazy:t,children:n,selectedValue:o}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===o));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==o}))))}function y(e){const t=h(e);return r.createElement("div",{className:(0,a.Z)("tabs-container",f.tabList)},r.createElement(v,(0,o.Z)({},e,t)),r.createElement(k,(0,o.Z)({},e,t)))}function C(e){const t=(0,g.Z)();return r.createElement(y,(0,o.Z)({key:String(t)},e))}},5956:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var o=n(7462),r=(n(7294),n(3905));n(4866),n(5162);const a={title:"Custom Scopes"},s=void 0,c={unversionedId:"advanced-concepts/custom-scopes",id:"advanced-concepts/custom-scopes",title:"Custom Scopes",description:"Out of the box, Clawject provides two scopes: singleton and prototype, but sometimes you may need to define your own scopes.",source:"@site/docs/05-advanced-concepts/02-custom-scopes.mdx",sourceDirName:"05-advanced-concepts",slug:"/advanced-concepts/custom-scopes",permalink:"/docs/advanced-concepts/custom-scopes",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Custom Scopes"},sidebar:"tutorialSidebar",previous:{title:"Inject Arrays and Collections",permalink:"/docs/advanced-concepts/injecting-collections"}},i={},l=[{value:"Creating a CustomScope Class",id:"creating-a-customscope-class",level:2},{value:"Creating the server code",id:"creating-the-server-code",level:3},{value:"Managing the Scoped Objects and Callbacks",id:"managing-the-scoped-objects-and-callbacks",level:3},{value:"Retrieving an Object from Scope",id:"retrieving-an-object-from-scope",level:3},{value:"Registering a Destruction Callback",id:"registering-a-destruction-callback",level:3},{value:"Removing an Object from Scope",id:"removing-an-object-from-scope",level:3},{value:"Destroying the Scope",id:"destroying-the-scope",level:3},{value:"Registering the Scope",id:"registering-the-scope",level:3},{value:"Using the Custom Scope",id:"using-the-custom-scope",level:3},{value:"How it works?",id:"how-it-works",level:4},{value:"Now let&#39;s put everything together",id:"now-lets-put-everything-together",level:2}],u={toc:l},p="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Out of the box, Clawject provides two scopes: ",(0,r.kt)("inlineCode",{parentName:"p"},"singleton")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"prototype"),", but sometimes you may need to define your own scopes."),(0,r.kt)("p",null,"For example, if you are developing an http server application,\nyou may want to provide a separate instance of a particular bean or set of beans for each request.\nClawject provides a mechanism for creating custom scopes for scenarios such as this."),(0,r.kt)("h2",{id:"creating-a-customscope-class"},"Creating a CustomScope Class"),(0,r.kt)("p",null,"In order to create a custom scope, you should implement the ",(0,r.kt)("inlineCode",{parentName:"p"},"CustomScope")," interface."),(0,r.kt)("p",null,"In the following steps, we will implement ",(0,r.kt)("inlineCode",{parentName:"p"},"http-request")," scope that\nis using ",(0,r.kt)("a",{parentName:"p",href:"https://nodejs.org/api/async_context.html#class-asynclocalstorage"},"AsyncLocalStorage"),"\nto assign and retrieve ",(0,r.kt)("inlineCode",{parentName:"p"},"httpRequestId"),"."),(0,r.kt)("h3",{id:"creating-the-server-code"},"Creating the server code"),(0,r.kt)("p",null,"First of all - let's define ",(0,r.kt)("inlineCode",{parentName:"p"},"HttpExecutionContext")," class that will assign unique id to each http request,\nallows us to retrieve ",(0,r.kt)("inlineCode",{parentName:"p"},"currentRequestId"),", and notify subscriber when http request is finished:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import http from 'node:http';\nimport { AsyncLocalStorage } from 'node:async_hooks';\n\nexport class HttpExecutionContext {\n  private static idSeq = 0;\n  private static asyncLocalStorage = new AsyncLocalStorage<number>();\n  private static declare requestEndSubscriber: (requestId: number) => void;\n\n  static run(fn: () => void) {\n    this.asyncLocalStorage.run(this.idSeq++, fn);\n  }\n\n  static getCurrentRequestId(): number {\n    //For simplicity - let's assume that AsyncLocalStorage always returns a value\n    return this.asyncLocalStorage.getStore();\n  }\n\n  static onRequestEnd(): void {\n    this.requestEndSubscriber(this.getCurrentRequestId());\n  }\n\n  static subscribeOnRequestEnd(subscriber: (requestId: number) => void): void {\n    this.requestEndSubscriber = subscriber;\n  }\n}\n\nhttp.createServer((req, res) => {\n  HttpExecutionContext.run(() => {\n    setTimeout(() => {\n      res.end();\n      HttpExecutionContext.onRequestEnd();\n    }, 100);\n  });\n}).listen(8080);\n")),(0,r.kt)("h3",{id:"managing-the-scoped-objects-and-callbacks"},"Managing the Scoped Objects and Callbacks"),(0,r.kt)("p",null,"One of the first things to consider when implementing a ",(0,r.kt)("inlineCode",{parentName:"p"},"CustomScope")," class is how you will store\nand manage the scoped objects and destruction callbacks.\nThis could be done using a Map or a dedicated class, for example."),(0,r.kt)("p",null,"Now let's define our custom scope class:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class RequestScope implements CustomScope {\n  // requestId to Map of objectName to object\n  private scopedObjects = new Map<number, Map<string, any>>();\n  // requestId to Map of objectName to object destruction callback\n  private destructionCallbacks = new Map<number, Map<string, () => void>>();\n\n  /* ... */\n}\n")),(0,r.kt)("h3",{id:"retrieving-an-object-from-scope"},"Retrieving an Object from Scope"),(0,r.kt)("p",null,"To retrieve an object by name from our scope, let's implement the ",(0,r.kt)("inlineCode",{parentName:"p"},"get")," method.\nNote that if the named object does not exist in the scope, this method must create and return a new object."),(0,r.kt)("p",null,"In our implementation, we check to see if the named object is in our map under current requestId.\nIf it is, we return it, and if not, we use the ",(0,r.kt)("inlineCode",{parentName:"p"},"ObjectFactory")," to create a new object, add it to our map, and return it:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class RequestScope implements CustomScope {\n  /* ... */\n\n  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n\n    const scopedObjects = this.scopedObjects.get(currentRequestId) ?? new Map<string, any>();\n    this.scopedObjects.set(currentRequestId, scopedObjects);\n\n    const scopedObject = scopedObjects.get(name) ?? objectFactory.getObject();\n    scopedObjects.set(name, scopedObject);\n\n    return scopedObject;\n  }\n}\n")),(0,r.kt)("h3",{id:"registering-a-destruction-callback"},"Registering a Destruction Callback"),(0,r.kt)("p",null,"We must also implement the registerDestructionCallback method.\nThis method provides a callback that is to be executed when the named object is destroyed or if the scope\nitself is destroyed by the application:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class RequestScope implements CustomScope {\n  /* ... */\n\n  registerDestructionCallback(name: string, callback: () => void): void {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n    const scopedDestructionCallbacks = this.destructionCallbacks.get(currentRequestId) ?? new Map<string, () => void>();\n    this.destructionCallbacks.set(currentRequestId, scopedDestructionCallbacks);\n\n    scopedDestructionCallbacks.set(name, callback);\n  }\n}\n")),(0,r.kt)("h3",{id:"removing-an-object-from-scope"},"Removing an Object from Scope"),(0,r.kt)("p",null,"Next, let's implement the remove method,\nwhich removes the named object from the scope and also removes its registered\ndestruction callback, returning the removed object."),(0,r.kt)("p",null,"Note that it is the ",(0,r.kt)("strong",{parentName:"p"},"caller's (clawject) responsibility")," to actually execute the callback and destroy the removed object."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class RequestScope implements CustomScope {\n  /* ... */\n\n  remove(name: string): ObjectFactoryResult | null {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n\n    const scopedObject = this.scopedObjects.get(currentRequestId)?.get(name) ?? null;\n\n    this.scopedObjects.get(currentRequestId)?.delete(name);\n    this.destructionCallbacks.get(currentRequestId)?.delete(name);\n\n    return scopedObject;\n  }\n}\n")),(0,r.kt)("h3",{id:"destroying-the-scope"},"Destroying the Scope"),(0,r.kt)("p",null,"Finally, let's implement the ",(0,r.kt)("inlineCode",{parentName:"p"},"destroy")," method, that will be called when ",(0,r.kt)("inlineCode",{parentName:"p"},"http-request")," will be finished\nand which destroys the scope and all of its objects:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class RequestScope implements CustomScope {\n  constructor() {\n    HttpExecutionContext.subscribeOnRequestEnd(this.destroy)\n  }\n\n  private destroy = (requestId: number): void => {\n    this.scopedObjects.delete(requestId);\n    this.destructionCallbacks.get(requestId)?.forEach(callback => callback());\n  }\n\n  /* ... */\n}\n")),(0,r.kt)("h3",{id:"registering-the-scope"},"Registering the Scope"),(0,r.kt)("p",null,"To make the Clawject container aware of your new scope,\nyou need to register it through the ",(0,r.kt)("inlineCode",{parentName:"p"},"registerScope")," method on a ",(0,r.kt)("inlineCode",{parentName:"p"},"ContainerManager")," instance."),(0,r.kt)("p",null,"Let's take a look at this method's definition:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"registerScope(scopeName: string, scope: CustomScope): void\n")),(0,r.kt)("p",null,"The first parameter, scopeName, is used to identify/specify a scope by its unique name.\nThe second parameter, scope, is an actual instance of the ",(0,r.kt)("inlineCode",{parentName:"p"},"CustomScope")," implementation that you wish to register and use."),(0,r.kt)("p",null,"Let's register our ",(0,r.kt)("inlineCode",{parentName:"p"},"RequestScope"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"ContainerManager.registerScope('http-request', new RequestScope());\n")),(0,r.kt)("h3",{id:"using-the-custom-scope"},"Using the Custom Scope"),(0,r.kt)("p",null,"Now that we have registered our custom scope,\nwe can apply it to any of our beans just as we would with any other\nbean that uses a scope other than singleton (the default scope) \u2014 by using the\n",(0,r.kt)("inlineCode",{parentName:"p"},"@Scope")," decorator and specifying our custom scope by name."),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"ScopedBean")," class will assign a random value to its ",(0,r.kt)("inlineCode",{parentName:"p"},"scopedProperty")," property\nthat will be different for each request but identical in bounds of one request."),(0,r.kt)("h4",{id:"how-it-works"},"How it works?"),(0,r.kt)("p",null,"When ",(0,r.kt)("inlineCode",{parentName:"p"},"ScopedBean")," will be requested from the container -\nproxy will be injected instead of the actual bean instance,\nthis proxy will ask ",(0,r.kt)("inlineCode",{parentName:"p"},"RequestScope")," to get the bean instance, ",(0,r.kt)("inlineCode",{parentName:"p"},"RequestScope"),"\nwill return or create bean that is associated with current request id.\nBecause proxies are injected - no needs to rebuild the whole dependency tree,\nand other beans that is using ",(0,r.kt)("inlineCode",{parentName:"p"},"ScopedBean")," will have own scope."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"export class ScopedBean {\n  scopedProperty: number\n\n  constructor() {\n    this.scopedProperty = Math.random();\n  }\n}\n\nexport class NonScopedBean {\n  constructor(private scopedBean: ScopedBean) {}\n\n  invoke(): void {\n    console.log(`scopedProperty of ScopedBean: ${this.scopedBean.scopedProperty}`);\n  }\n}\n\nexport class ApplicationContext extends CatContext {\n  @Scope('http-request') scopedBean = Bean(ScopedBean);\n\n  nonScopedBean = Bean(NonScopedBean);\n}\n")),(0,r.kt)("h2",{id:"now-lets-put-everything-together"},"Now let's put everything together"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="index.ts"',title:'"index.ts"'},"import http from 'node:http';\nimport { ContainerManager } from 'clawject';\nimport { HttpExecutionContext } from './HttpExecutionContext';\nimport { ApplicationContext } from './ApplicationContext';\n\nconst {\n  nonScopedBean,\n} = ContainerManager.init(ApplicationContext).getBeans();\n\nhttp.createServer((req, res) => {\n  HttpExecutionContext.run(() => {\n    setTimeout(() => {\n      nonScopedBean.invoke();\n      res.end();\n      HttpExecutionContext.onRequestEnd();\n    }, 100);\n  });\n}).listen(8080);\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="HttpExecutionContext.ts"',title:'"HttpExecutionContext.ts"'},"import { AsyncLocalStorage } from 'node:async_hooks';\n\nexport class HttpExecutionContext {\n  private static idSeq = 0;\n  private static asyncLocalStorage = new AsyncLocalStorage<number>();\n  private static declare requestEndSubscriber: (requestId: number) => void;\n\n  static run(fn: () => void) {\n    this.asyncLocalStorage.run(this.idSeq++, fn);\n  }\n\n  static getCurrentRequestId(): number {\n    //For simplicity - let's assume that AsyncLocalStorage always returns a value\n    return this.asyncLocalStorage.getStore();\n  }\n\n  static onRequestEnd(): void {\n    this.requestEndSubscriber(this.getCurrentRequestId());\n  }\n\n  static subscribeOnRequestEnd(subscriber: (requestId: number) => void): void {\n    this.requestEndSubscriber = subscriber;\n  }\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="RequestScope.ts"',title:'"RequestScope.ts"'},"import { CustomScope, ObjectFactory, ObjectFactoryResult } from 'clawject';\nimport { HttpExecutionContext } from './HttpExecutionContext';\n\nexport class RequestScope implements CustomScope {\n  constructor() {\n    HttpExecutionContext.subscribeOnRequestEnd(this.destroy)\n  }\n\n  // requestId to Map of objectName to object\n  private scopedObjects = new Map<number, Map<string, any>>();\n  // requestId to Map of objectName to object destruction callback\n  private destructionCallbacks = new Map<number, Map<string, () => void>>();\n\n  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n\n    const scopedObjects = this.scopedObjects.get(currentRequestId) ?? new Map<string, any>();\n    this.scopedObjects.set(currentRequestId, scopedObjects);\n\n    const scopedObject = scopedObjects.get(name) ?? objectFactory.getObject();\n    scopedObjects.set(name, scopedObject);\n\n    return scopedObject;\n  }\n\n  registerDestructionCallback(name: string, callback: () => void): void {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n    const scopedDestructionCallbacks = this.destructionCallbacks.get(currentRequestId) ?? new Map<string, () => void>();\n    this.destructionCallbacks.set(currentRequestId, scopedDestructionCallbacks);\n\n    scopedDestructionCallbacks.set(name, callback);\n  }\n\n  remove(name: string): ObjectFactoryResult | null {\n    const currentRequestId = HttpExecutionContext.getCurrentRequestId();\n\n    const scopedObject = this.scopedObjects.get(currentRequestId)?.get(name) ?? null;\n\n    this.scopedObjects.get(currentRequestId)?.delete(name);\n    this.destructionCallbacks.get(currentRequestId)?.delete(name);\n\n    return scopedObject;\n  }\n\n  private destroy = (requestId: number): void => {\n    this.scopedObjects.delete(requestId);\n    this.destructionCallbacks.get(requestId)?.forEach(callback => callback());\n  }\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="ScopedBean.ts"',title:'"ScopedBean.ts"'},"export class ScopedBean {\n  scopedProperty: number\n\n  constructor() {\n    this.scopedProperty = Math.random();\n  }\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="NonScopedBean.ts"',title:'"NonScopedBean.ts"'},"import { ScopedBean } from './ScopedBean';\n\nexport class NonScopedBean {\n  constructor(private scopedBean: ScopedBean) {}\n\n  invoke(): void {\n    console.log(`scopedProperty of ScopedBean: ${this.scopedBean.scopedProperty}`);\n  }\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="ApplicationContext.ts"',title:'"ApplicationContext.ts"'},"import { Bean, CatContext, Scope } from 'clawject';\nimport { ScopedBean } from './ScopedBean';\nimport { NonScopedBean } from './NonScopedBean';\n\ninterface ExternalBeans {\n  nonScopedBean: NonScopedBean\n}\n\nexport class ApplicationContext extends CatContext<ExternalBeans> {\n  @Scope('http-request') scopedBean = Bean(ScopedBean);\n\n  nonScopedBean = Bean(NonScopedBean);\n}\n")))}d.isMDXComponent=!0}}]);
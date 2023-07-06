"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[865],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=o.createContext({}),i=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=i(e.components);return o.createElement(c.Provider,{value:t},e.children)},p="mdxType",b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},f=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=i(n),f=a,d=p["".concat(c,".").concat(f)]||p[f]||b[f]||r;return n?o.createElement(d,s(s({ref:t},u),{},{components:n})):o.createElement(d,s({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,s=new Array(r);s[0]=f;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[p]="string"==typeof e?e:a,s[1]=l;for(var i=2;i<r;i++)s[i]=n[i];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}f.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>s});var o=n(7294),a=n(6010);const r={tabItem:"tabItem_Ymn6"};function s(e){let{children:t,hidden:n,className:s}=e;return o.createElement("div",{role:"tabpanel",className:(0,a.Z)(r.tabItem,s),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>k});var o=n(7462),a=n(7294),r=n(6010),s=n(2466),l=n(6550),c=n(1980),i=n(7392),u=n(12);function p(e){return function(e){return a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:o,default:a}}=e;return{value:t,label:n,attributes:o,default:a}}))}function b(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function f(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function d(e){let{queryString:t=!1,groupId:n}=e;const o=(0,l.k6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c._X)(r),(0,a.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(o.location.search);t.set(r,e),o.replace({...o.location,search:t.toString()})}),[r,o])]}function m(e){const{defaultValue:t,queryString:n=!1,groupId:o}=e,r=b(e),[s,l]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!f({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const o=n.find((e=>e.default))??n[0];if(!o)throw new Error("Unexpected error: 0 tabValues");return o.value}({defaultValue:t,tabValues:r}))),[c,i]=d({queryString:n,groupId:o}),[p,m]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[o,r]=(0,u.Nk)(n);return[o,(0,a.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:o}),h=(()=>{const e=c??p;return f({value:e,tabValues:r})?e:null})();(0,a.useLayoutEffect)((()=>{h&&l(h)}),[h]);return{selectedValue:s,selectValue:(0,a.useCallback)((e=>{if(!f({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);l(e),i(e),m(e)}),[i,m,r]),tabValues:r}}var h=n(2389);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function v(e){let{className:t,block:n,selectedValue:l,selectValue:c,tabValues:i}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,s.o5)(),b=e=>{const t=e.currentTarget,n=u.indexOf(t),o=i[n].value;o!==l&&(p(t),c(o))},f=e=>{let t=null;switch(e.key){case"Enter":b(e);break;case"ArrowRight":{const n=u.indexOf(e.currentTarget)+1;t=u[n]??u[0];break}case"ArrowLeft":{const n=u.indexOf(e.currentTarget)-1;t=u[n]??u[u.length-1];break}}t?.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":n},t)},i.map((e=>{let{value:t,label:n,attributes:s}=e;return a.createElement("li",(0,o.Z)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>u.push(e),onKeyDown:f,onClick:b},s,{className:(0,r.Z)("tabs__item",y.tabItem,s?.className,{"tabs__item--active":l===t})}),n??t)})))}function g(e){let{lazy:t,children:n,selectedValue:o}=e;const r=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=r.find((e=>e.props.value===o));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},r.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==o}))))}function w(e){const t=m(e);return a.createElement("div",{className:(0,r.Z)("tabs-container",y.tabList)},a.createElement(v,(0,o.Z)({},e,t)),a.createElement(g,(0,o.Z)({},e,t)))}function k(e){const t=(0,h.Z)();return a.createElement(w,(0,o.Z)({key:String(t)},e))}},9038:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>c,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var o=n(7462),a=(n(7294),n(3905)),r=n(4866),s=n(5162);const l={title:"Bean Scopes",id:"bean-scopes"},c=void 0,i={unversionedId:"base-concepts/bean-scopes",id:"base-concepts/bean-scopes",title:"Bean Scopes",description:"Overview",source:"@site/docs/03-base-concepts/07-scopes.mdx",sourceDirName:"03-base-concepts",slug:"/base-concepts/bean-scopes",permalink:"/docs/base-concepts/bean-scopes",draft:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{title:"Bean Scopes",id:"bean-scopes"},sidebar:"tutorialSidebar",previous:{title:"Bean Types",permalink:"/docs/base-concepts/bean/bean-type"},next:{title:"Inject Arrays and Collections",permalink:"/docs/advanced-concepts/injecting-collections"}},u={},p=[{value:"Overview",id:"overview",level:2},{value:"Singleton scope <em>(default)</em>",id:"singleton-scope-default",level:2},{value:"Prototype scope",id:"prototype-scope",level:2}],b={toc:p},f="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(f,(0,o.Z)({},b,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"The Scope of Bean is a way to define when Bean will be created and how it is managed by container."),(0,a.kt)("p",null,"Clawject provides ",(0,a.kt)("inlineCode",{parentName:"p"},"@Scope")," decorator to define a scope and has 2 built-in scopes: ",(0,a.kt)("inlineCode",{parentName:"p"},"singleton")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"prototype"),"."),(0,a.kt)("h2",{id:"singleton-scope-default"},"Singleton scope ",(0,a.kt)("em",{parentName:"h2"},"(default)")),(0,a.kt)("p",null,"When we define a bean with the singleton scope, the container creates a single instance of that bean,\nall requests for that bean will return the same object, which is cached.\nAny modifications to the object will be reflected in all references to the bean.\nThis scope is the default value if no other scope is specified."),(0,a.kt)("p",null,"Let's use the singleton scope in the following example:"),(0,a.kt)(r.Z,{mdxType:"Tabs"},(0,a.kt)(s.Z,{value:"implicit-scope",label:"Declare a Bean with default singleton scope",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'class Foo {\n  name = \'foo\';\n}\n\nclass Bar {\n  constructor(public foo: Foo) {}\n\n  setName(): void {\n    this.foo.name = \'bar\';\n  }\n}\n\nclass Baz {\n  constructor(public foo: Foo) {}\n}\n\nclass MyContext extends CatContext {\n  foo = Bean(Foo);\n\n  bar = Bean(Bar);\n  baz = Bean(Baz);\n\n  @PostConstruct\n  postConstruct(\n    bar: Bar,\n    baz: Baz,\n  ) {\n    bar.setName();\n\n    console.log(bar.foo === baz.foo); // <- prints "true"\n\n    console.log(bar.foo.property); // <- prints "bar"\n    console.log(baz.foo.property); // <- prints "bar"\n  }\n}\n'))),(0,a.kt)(s.Z,{value:"explicit-scope",label:"Declare Scope of Bean using decorator",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'class Foo {\n  name = \'foo\';\n}\n\nclass Bar {\n  constructor(public foo: Foo) {}\n\n  setName(): void {\n    this.foo.name = \'bar\';\n  }\n}\n\nclass Baz {\n  constructor(public foo: Foo) {}\n}\n\nclass MyContext extends CatContext {\n  @Scope("singleton")\n  foo = Bean(Foo);\n\n  bar = Bean(Bar);\n  baz = Bean(Baz);\n\n  @PostConstruct\n  postConstruct(\n    bar: Bar,\n    baz: Baz,\n  ) {\n    bar.setName();\n\n    console.log(bar.foo === baz.foo); // <- prints "true"\n\n    console.log(bar.foo.property); // <- prints "bar"\n    console.log(baz.foo.property); // <- prints "bar"\n  }\n}\n')))),(0,a.kt)("h2",{id:"prototype-scope"},"Prototype scope"),(0,a.kt)("p",null,"A Bean with the prototype scope will return a different instance every time it is requested from the container."),(0,a.kt)("p",null,"Let's use the prototype scope in the following example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'class Foo {\n  name = \'foo\';\n}\n\nclass Bar {\n  constructor(public foo: Foo) {}\n\n  setName(): void {\n    this.foo.name = \'bar\';\n  }\n}\n\nclass Baz {\n  constructor(public foo: Foo) {}\n}\n\nclass MyContext extends CatContext {\n  @Scope("prototype")\n  foo = Bean(Foo);\n\n  bar = Bean(Bar);\n  baz = Bean(Baz);\n\n  @PostConstruct\n  postConstruct(\n    bar: Bar,\n    baz: Baz,\n  ) {\n    bar.setName();\n\n    console.log(bar.foo === baz.foo); // <- prints "false"\n\n    console.log(bar.foo.property); // <- prints "bar"\n    console.log(baz.foo.property); // <- prints "foo"\n  }\n}\n')),(0,a.kt)("p",null,"As you can see - Scopes is a very simple concept, but it is very important to understand it."),(0,a.kt)("p",null,"If you want to define your own scope, for example ",(0,a.kt)("inlineCode",{parentName:"p"},"HTTPRequestScope")," - you can check out the ",(0,a.kt)("a",{parentName:"p",href:"/docs/advanced-concepts/custom-scopes"},"Custom Scopes")," section."))}d.isMDXComponent=!0}}]);
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7278],{4938:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>i});var r=n(4848),s=n(8453);n(1470),n(9365);const o={title:"Lifecycle",hide_title:!0},a=void 0,l={id:"fundamentals/lifecycle",title:"Lifecycle",description:"Lifecycle",source:"@site/docs/fundamentals/lifecycle.mdx",sourceDirName:"fundamentals",slug:"/fundamentals/lifecycle",permalink:"/docs/fundamentals/lifecycle",draft:!1,unlisted:!1,tags:[],version:"current",lastUpdatedAt:1721595883e3,frontMatter:{title:"Lifecycle",hide_title:!0},sidebar:"docs",previous:{title:"@Internal @External",permalink:"/docs/fundamentals/internal-external"},next:{title:"@Embedded",permalink:"/docs/fundamentals/embedded"}},c={},i=[{value:"Lifecycle",id:"lifecycle",level:2},{value:"@PostConstruct",id:"postconstruct",level:3},{value:"@PostConstruct in Context",id:"postconstruct-in-context",level:4},{value:"@PostConstruct in Bean",id:"postconstruct-in-bean",level:4},{value:"@PreDestroy",id:"predestroy",level:3},{value:"@PreDestroy in Context",id:"predestroy-in-context",level:4},{value:"@PreDestroy in Bean",id:"predestroy-in-bean",level:4}];function u(e){const t={code:"code",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"lifecycle",children:"Lifecycle"}),"\n",(0,r.jsxs)(t.p,{children:["Clawject allows us to attach custom actions to bean or application creation and destruction,\nand it is done using the ",(0,r.jsx)(t.code,{children:"@PostConstruct"})," and ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," decorators."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"@PostConstruct"})," and ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," can be used in ",(0,r.jsx)(t.code,{children:"@Configuration"}),", ",(0,r.jsx)(t.code,{children:"@ClawjectApplication"})," classes and in Beans.\nYou can decorate ",(0,r.jsx)(t.code,{children:"method"})," or ",(0,r.jsx)(t.code,{children:"property with arrow function"}),", also decoration target should not be ",(0,r.jsx)(t.code,{children:"static"}),"."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"@PostConstruct"})," and ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," can be used together at the same method \u2014 so the method will be called twice."]}),"\n",(0,r.jsxs)(t.p,{children:["Note that ",(0,r.jsx)(t.code,{children:"@PostConstruct"})," and ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," works a little different in configuration classes and in Beans,\nwhen using in configuration classes - you can pass arguments to the method,\nthese arguments will be treated as a dependencies, and container will inject appropriate Beans to the method, in other hand,\nwhen using in Bean - you can't pass arguments to the method,\ncontainer will not inject anything to the method and will report compilation error."]}),"\n",(0,r.jsx)(t.h3,{id:"postconstruct",children:"@PostConstruct"}),"\n",(0,r.jsx)(t.p,{children:"Clawject calls the methods annotated with @PostConstruct only once, just after the initialization of bean or application."}),"\n",(0,r.jsx)(t.h4,{id:"postconstruct-in-context",children:"@PostConstruct in Context"}),"\n",(0,r.jsxs)(t.p,{children:["Let's use the ",(0,r.jsx)(t.code,{children:"@PostConstruct"})," decorator in the ",(0,r.jsx)(t.code,{children:"@Configuration"})," class:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:'@ClawjectApplication\nclass Application {\n  @Bean foo = \'string\';\n\n  @PostConstruct\n  postConstruct(stringBean: string) { // <- "foo" bean will be injected here\n    console.log(`MyContext has been created, "stringBean" value is ${stringBean}`);\n  }\n}\n'})}),"\n",(0,r.jsx)(t.h4,{id:"postconstruct-in-bean",children:"@PostConstruct in Bean"}),"\n",(0,r.jsxs)(t.p,{children:["Let's use the ",(0,r.jsx)(t.code,{children:"@PostConstruct"})," decorator in the Bean:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"class Foo {\n  @PostConstruct\n  postConstruct() {\n    console.log('Foo bean has been created');\n  }\n}\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Now when we register this class as a Bean in context -\nthe ",(0,r.jsx)(t.code,{children:"postConstruct"})," method will be called when ",(0,r.jsx)(t.code,{children:"Foo"})," instance is created."]}),"\n",(0,r.jsx)(t.h3,{id:"predestroy",children:"@PreDestroy"}),"\n",(0,r.jsx)(t.p,{children:"Clawject calls the methods annotated with @PostConstruct only once,\njust before context clearing or bean removal from context."}),"\n",(0,r.jsx)(t.p,{children:"The purpose of this method should be to release resources or perform other cleanup tasks,\nsuch as closing a database connection, before the bean gets destroyed."}),"\n",(0,r.jsx)(t.h4,{id:"predestroy-in-context",children:"@PreDestroy in Context"}),"\n",(0,r.jsxs)(t.p,{children:["Let's use the ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," decorator in the Context:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:'@ClawjectApplication\nclass Application {\n  @Bean foo = \'string\';\n\n  @PreDestroy\n  preDestroy(stringBean: string) { // <- "foo" bean will be injected here\n    console.log(`MyContext is going to be destroyed, "stringBean" value is ${stringBean}`);\n  }\n}\n'})}),"\n",(0,r.jsx)(t.h4,{id:"predestroy-in-bean",children:"@PreDestroy in Bean"}),"\n",(0,r.jsxs)(t.p,{children:["Let's use the ",(0,r.jsx)(t.code,{children:"@PreDestroy"})," decorator in the Bean:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"class Foo {\n  @PreDestroy\n  preDestroy() {\n    console.log('Foo bean is going to be destroyed');\n  }\n}\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Now when we register this class as a Bean in context -\nthe ",(0,r.jsx)(t.code,{children:"preDestroy"})," method will be called when ",(0,r.jsx)(t.code,{children:"Foo"})," bean is going to be destroyed."]})]})}function d(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>a});n(6540);var r=n(4164);const s={tabItem:"tabItem_Ymn6"};var o=n(4848);function a(e){let{children:t,hidden:n,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,r.A)(s.tabItem,a),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>w});var r=n(6540),s=n(4164),o=n(3104),a=n(6347),l=n(205),c=n(7485),i=n(1682),u=n(679);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:s}}=e;return{value:t,label:n,attributes:r,default:s}}))}(n);return function(e){const t=(0,i.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const s=(0,a.W6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(s.location.search);t.set(o,e),s.replace({...s.location,search:t.toString()})}),[o,s])]}function b(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,o=h(e),[a,c]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:o}))),[i,d]=f({queryString:n,groupId:s}),[b,m]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,o]=(0,u.Dv)(n);return[s,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:s}),x=(()=>{const e=i??b;return p({value:e,tabValues:o})?e:null})();(0,l.A)((()=>{x&&c(x)}),[x]);return{selectedValue:a,selectValue:(0,r.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);c(e),d(e),m(e)}),[d,m,o]),tabValues:o}}var m=n(2303);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=n(4848);function j(e){let{className:t,block:n,selectedValue:r,selectValue:a,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:i}=(0,o.a_)(),u=e=>{const t=e.currentTarget,n=c.indexOf(t),s=l[n].value;s!==r&&(i(t),a(s))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:o}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>c.push(e),onKeyDown:d,onClick:u,...o,className:(0,s.A)("tabs__item",x.tabItem,o?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function y(e){let{lazy:t,children:n,selectedValue:s}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function v(e){const t=b(e);return(0,g.jsxs)("div",{className:(0,s.A)("tabs-container",x.tabList),children:[(0,g.jsx)(j,{...t,...e}),(0,g.jsx)(y,{...t,...e})]})}function w(e){const t=(0,m.A)();return(0,g.jsx)(v,{...e,children:d(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>l});var r=n(6540);const s={},o=r.createContext(s);function a(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);
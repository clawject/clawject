"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5535],{7732:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>p,frontMatter:()=>r,metadata:()=>c,toc:()=>l});var o=t(4848),i=t(8453);const r={title:"IoC and DI",hide_title:!0,tags:["dependency injection","inversion of control","ioc","di","design patterns","software architecture","software engineering"]},s=void 0,c={id:"core-concepts/ioc-di-basics",title:"IoC and DI",description:"Inversion of Control and Dependency Injection",source:"@site/docs/core-concepts/ioc-di-basics.mdx",sourceDirName:"core-concepts",slug:"/core-concepts/ioc-di-basics",permalink:"/docs/core-concepts/ioc-di-basics",draft:!1,unlisted:!1,tags:[{inline:!0,label:"dependency injection",permalink:"/docs/tags/dependency-injection"},{inline:!0,label:"inversion of control",permalink:"/docs/tags/inversion-of-control"},{inline:!0,label:"ioc",permalink:"/docs/tags/ioc"},{inline:!0,label:"di",permalink:"/docs/tags/di"},{inline:!0,label:"design patterns",permalink:"/docs/tags/design-patterns"},{inline:!0,label:"software architecture",permalink:"/docs/tags/software-architecture"},{inline:!0,label:"software engineering",permalink:"/docs/tags/software-engineering"}],version:"current",lastUpdatedAt:1721595883e3,frontMatter:{title:"IoC and DI",hide_title:!0,tags:["dependency injection","inversion of control","ioc","di","design patterns","software architecture","software engineering"]},sidebar:"docs",previous:{title:"Nest",permalink:"/docs/integrations/nestjs"},next:{title:"Clawject IoC Container",permalink:"/docs/core-concepts/clawject-ioc"}},a={},l=[{value:"Inversion of Control and Dependency Injection",id:"inversion-of-control-and-dependency-injection",level:2},{value:"What is Inversion of Control?",id:"what-is-inversion-of-control",level:3},{value:"What is Dependency Injection?",id:"what-is-dependency-injection",level:3}];function d(e){const n={code:"code",em:"em",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h2,{id:"inversion-of-control-and-dependency-injection",children:"Inversion of Control and Dependency Injection"}),"\n",(0,o.jsx)(n.p,{children:"In this section, we will explore the principles of Inversion of Control (IoC) and Dependency Injection (DI)."}),"\n",(0,o.jsx)(n.h3,{id:"what-is-inversion-of-control",children:"What is Inversion of Control?"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Inversion of Control"})," is a principle in software engineering which transfers the control\nof objects or portions of a program to a container or framework.\nWe most often use it in the context of object-oriented programming."]}),"\n",(0,o.jsx)(n.p,{children:"In contrast with traditional programming, in which our custom code makes calls to a library,\nthe IoC enables a framework to take control of the flow of a program and make calls to our custom code.\nTo enable this, frameworks use abstractions with additional behavior built in."}),"\n",(0,o.jsx)(n.p,{children:"The advantages of this architecture are:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Decoupling the execution of a task from its implementation"}),"\n",(0,o.jsx)(n.li,{children:"Making it easier to switch between different implementations"}),"\n",(0,o.jsx)(n.li,{children:"Greater modularity of a program"}),"\n",(0,o.jsx)(n.li,{children:"Greater ease in testing a program by isolating a component or mocking its dependencies\nand allowing components to communicate through contracts"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"One of the ways you can achieve Inversion of Control is a Dependency Injection (DI)."}),"\n",(0,o.jsx)(n.h3,{id:"what-is-dependency-injection",children:"What is Dependency Injection?"}),"\n",(0,o.jsx)(n.p,{children:"Dependency injection is a pattern you can use to implement IoC,\nwhere the control being inverted is setting an object's dependencies."}),"\n",(0,o.jsxs)(n.p,{children:["Connecting objects with other objects, or \u201c",(0,o.jsx)(n.em,{children:(0,o.jsx)(n.strong,{children:"injecting"})}),"\u201d objects into other objects, is done by an assembler rather than by the objects themselves."]}),"\n",(0,o.jsx)(n.p,{children:"Here's how you would create an object dependency in traditional programming:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"class Store {\n  private item: Item;\n\n  constructor() {\n    this.item = new ItemImpl();\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"By using DI, you can rewrite the example without specifying the implementation of the Item that we want:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"class Store {\n  constructor(\n    private item: Item\n  ) {}\n}\n"})})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var o=t(6540);const i={},r=o.createContext(i);function s(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);
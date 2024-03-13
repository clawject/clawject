"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3237],{8142:(e,n,i)=>{i.r(n),i.d(n,{default:()=>E});var t=i(7294),s=i(7372),r=i(3967),o=i.n(r);const a="heroContainer_i2aB",l="contentContainer_C6d5",c="heroTitle_qg2I",d="textGradient_DJVw",p="heroSubtitle_jFu1",h="typeAnimation_Rfre",g="logoContainer_xdaK",m="logoBackground_Xngs",u="logo_Ukns";var v=i(9844),x=i(3692),y=i(5682),b=i(9361),f=i(2949),j=i(9286),w=i(1686);const R=w.ZP.div`
  position: relative;
`,I=(w.ZP.div`
  padding: 12px 16px;
  width: 500px;
  max-height: 400px;
  overflow-y: auto;

  font-size: var(--ifm-code-font-size);
  font-family: var(--ifm-font-family-monospace);
  color: var(--code-message-text-color);
  border: 1px solid var(--code-message-border);
  border-radius: var(--ifm-code-border-radius);
  background-color: var(--code-message-background);
  box-shadow: 0 2px 24px -6px rgba(0,0,0,0.51);
`,w.ZP.div`
  position: absolute;
  width: ${e=>e.$highlight.width}px;
  height: ${e=>e.$highlight.height+2}px;
  top: ${e=>e.$highlight.top}px;
  left: ${e=>e.$highlight.left}px;
  border-bottom: 1.5px solid;
  border-color: ${e=>{switch(e.$highlight.level){case"info":return"blue";case"warning":return"orange";case"error":return"red"}}};
`);var k=i(8830),B=i(4627),N=i(8957);const C="codeMessagePopover_kcda";var P=i(5893);const{Text:S}=k.default,T=e=>{let{$parentContainerRef:n,message:i}=e;const[s,r]=t.useState(null);return t.useEffect((()=>{const e=n.current;if(null===e)return;const t=e.querySelector(`code .token-line:nth-child(${i.line})`)??null;if(null===t)return;const s=t.getBoundingClientRect(),o=e.getBoundingClientRect(),a=s.top-o.top,l=t.textContent,c=s.width/(l.length||1),d=s.left-o.left+i.start*c,p=i.width*c,h=s.height;r({top:a,left:d,width:p,height:h,level:i.level})}),[n,i]),(0,P.jsx)(B.Z,{trigger:"hover",placement:"right",arrow:!1,overlayClassName:C,content:(0,P.jsxs)("div",{className:"container",children:[(0,P.jsx)("div",{className:"row",children:i.message}),i.relatedMessages.map(((e,n)=>(0,P.jsxs)("div",{className:"row",children:[(0,P.jsx)("a",{children:e.link}),(0,P.jsx)(N.Z,{}),":",e.highlightedPrefix&&(0,P.jsx)(S,{code:!0,children:e.highlightedPrefix}),(0,P.jsx)(S,{children:e.message})]},n)))]}),children:(0,P.jsx)(I,{$highlight:s??{level:"info",top:0,left:0,width:0,height:0}})})},$=e=>{let{showLineNumbers:n,code:i,messages:s,title:r}=e;const o=t.useRef(null);return(0,P.jsxs)(R,{ref:o,children:[(0,P.jsx)(j.Z,{title:r,language:"ts",showLineNumbers:n,children:i}),s?.map(((e,n)=>(0,P.jsx)(T,{message:e,$parentContainerRef:o},n)))??null]})},_=["Declarative","Intuitive","External","Lightweight","Adaptive","Easy-to-use","Resourceful","Far-sighted","Well-prepared","Sagacious","Innovative","Purr-fect","Paw-some","Feline grace"].map((e=>[e,4e3])).flat(),A="\ninterface IRepository<T> { /*...*/ }\nclass RepositoryImpl<T> implements IRepository<T> { /*...*/ }\nclass PrimitivesService {\n  constructor(\n    private stringRepository: IRepository<string>,\n    private numberRepository: IRepository<number>,\n    private booleanRepository: IRepository<boolean>,\n  ) {}\n}\n\n@ClawjectApplication\nclass Application {\n  stringRepository = Bean(RepositoryImpl<string>);\n  numberRepository = Bean(RepositoryImpl<number>);\n  booleanRepository = Bean(RepositoryImpl<boolean>);\n  primitivesService = Bean(PrimitivesService);\n}\n".trim(),Z="\ninterface IRepository<T> { /*...*/ }\n@Injectable()\nclass RepositoryImpl<T> implements IRepository<T> { /*...*/ }\nconst InjectionTokens = {\n  StringRepository: Symbol('StringRepository'),\n  NumberRepository: Symbol('NumberRepository'),\n  BooleanRepository: Symbol('BooleanRepository'),\n}\n\n@Injectable()\nclass PrimitivesService {\n  constructor(\n    @Inject(InjectionTokens.StringRepository)\n    private stringRepository: IRepository<string>,\n    @Inject(InjectionTokens.NumberRepository)\n    private numberRepository: IRepository<number>,\n    @Inject(InjectionTokens.BooleanRepository)\n    private booleanRepository: IRepository<boolean>,\n  ) {}\n}\n\n@Module({\n  providers: [\n    PrimitivesService,\n    {\n      provide: InjectionTokens.StringRepository,\n      useClass: RepositoryImpl,\n    },\n    {\n      provide: InjectionTokens.NumberRepository,\n      useClass: RepositoryImpl,\n    },\n    {\n      provide: InjectionTokens.BooleanRepository,\n      useClass: RepositoryImpl,\n    },\n  ],\n})\nclass Application {}\n".trim(),z="\nclass Foo {\n  constructor(baz: Baz, someString: string) {}\n}\nclass Bar {\n  constructor(private quux: Quux) {}\n}\nclass Baz {\n  constructor(private bar: Bar) {}\n}\nclass Quux {\n  constructor(private baz: Baz) {}\n}\n\n@ClawjectApplication\nclass Application {\n  @Bean string1 = 'string1';\n  @Bean string2 = 'string2';\n\n  foo = Bean(Foo);\n  bar = Bean(Bar);\n  baz = Bean(Baz);\n  quux = Bean(Quux);\n\n  @Bean\n  beanThatReturnsVoid(): void {}\n}\n".trim(),F=[{line:2,start:24,width:18,level:"error",message:"CE5: Could not qualify bean candidate. Found 2 injection candidates.",relatedMessages:[{link:"main.ts(16,3)",highlightedPrefix:"string1",message:"matched by type."},{link:"main.ts(17,3)",highlightedPrefix:"string2",message:"matched by type."},{link:"main.ts(19,3)",highlightedPrefix:"foo",message:"is declared here."},{link:"main.ts(17,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:19,start:2,width:16,level:"error",message:"CE4: Can not register Bean.",relatedMessages:[{link:"main.ts(2,25)",message:"Cannot find a Bean candidate for 'someString'."},{link:"main.ts(17,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:21,start:2,width:16,level:"error",message:"CE7: Circular dependencies detected. baz \u2192 bar \u2192 quux \u2192 baz",relatedMessages:[{link:"main.ts(20,3)",highlightedPrefix:"bar",message:"is declared here."},{link:"main.ts(22,3)",highlightedPrefix:"quux",message:"is declared here."},{link:"main.ts(17,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:25,start:25,width:4,level:"error",message:"CE8: Incorrect type. Type 'void' not supported as a Bean type.",relatedMessages:[{link:"main.ts(17,7)",highlightedPrefix:"Application",message:"is declared here."}]}],q=()=>{const{colorMode:e}=(0,f.I)();return(0,P.jsxs)(y.ZP,{theme:{algorithm:"dark"===e?b.Z.darkAlgorithm:b.Z.defaultAlgorithm,components:{Popover:{colorBgElevated:"var(--code-message-background)",borderRadiusLG:4}}},children:[(0,P.jsxs)("div",{className:o()("hero",a),children:[(0,P.jsxs)("div",{className:l,children:[(0,P.jsx)("h1",{className:o()("hero__title",c,d),children:"Clawject"}),(0,P.jsx)("p",{className:o()("hero__subtitle",p),children:"Full-stack, type-safe, declarative Dependency Injection framework for TypeScript"}),(0,P.jsx)(v.e,{preRenderFirstString:!0,sequence:_,speed:10,repeat:1/0,className:h}),(0,P.jsx)(x.Z,{className:o()("button button--primary button--outline"),to:"/docs",children:"Get Started"})]}),(0,P.jsxs)("div",{className:o()(g,"margin-top--lg"),children:[(0,P.jsx)("div",{className:o()(m)}),(0,P.jsx)("img",{className:o()(u),src:"/img/logo.svg",alt:"Clawject"})]})]}),(0,P.jsxs)("div",{className:"container margin-top--lg",children:[(0,P.jsxs)("div",{className:"row",children:[(0,P.jsx)("h1",{className:o()(d),children:"Built for developers convenience"}),(0,P.jsxs)("p",{children:["Clawject designed to make dependency injection and inversion of control in TypeScript as effortless, clear and intuitive as possible.",(0,P.jsx)("br",{}),"It allows define class dependencies in a declarative way, without the need to use injection tokens or any other boilerplate, especially when it comes to interfaces and generics."]})]}),(0,P.jsxs)("div",{className:"row",children:[(0,P.jsx)("div",{className:"col col--6",children:(0,P.jsx)(j.Z,{showLineNumbers:!0,title:"Develop with Clawject",language:"ts",children:A})}),(0,P.jsx)("div",{className:"col col--6",children:(0,P.jsx)(j.Z,{showLineNumbers:!0,title:"Develop with other popular framework",language:"ts",children:Z})})]}),(0,P.jsxs)("div",{className:"row margin-top--lg",children:[(0,P.jsxs)("div",{className:"col col--5",children:[(0,P.jsx)("h2",{className:o()(d),children:"In-editor diagnostics support"}),(0,P.jsx)("p",{children:"With Clawject's language service plugin, you can get instant feedback about missing beans, incorrect types, circular dependencies and more. It will help you to catch errors early without running your application and make your development process more productive."})]}),(0,P.jsx)("div",{className:"col",children:(0,P.jsx)($,{title:"main.ts",code:z,messages:F})})]})]})]})};function E(){return(0,P.jsx)(s.Z,{description:"TypeScript Dependency Injection Framework",children:(0,P.jsx)(q,{})})}}}]);
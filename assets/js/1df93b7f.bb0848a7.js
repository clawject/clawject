"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3237],{4089:(e,n,t)=>{t.r(n),t.d(n,{default:()=>ye});var o=t(7294),s=t(7372),i=t(3967),a=t.n(i);const r="heroContainer_i2aB",c="contentContainer_C6d5",l="heroTitle_qg2I",d="textGradient_DJVw",u="heroSubtitle_jFu1",p="typeAnimation_Rfre",g="logoContainer_xdaK",m="logoBackground_Xngs",h="logo_Ukns";var y=t(9844),b=t(3692),x=t(5682),j=t(9361),f=t(2949),v=t(4498),N=t(2389),k=t(512),B=t(6412),w=t(5281),C=t(7016);const R={codeBlockContainer:"codeBlockContainer_Wo3_"};var I=t(5893);function S(e){let{as:n,...t}=e;const o=(0,B.p)(),s=(0,C.QC)(o);return(0,I.jsx)(n,{...t,style:s,className:(0,k.Z)(t.className,R.codeBlockContainer,w.k.common.codeBlock)})}const L={codeBlockContent:"codeBlockContent_JcxH",codeBlockTitle:"codeBlockTitle_A_pv",codeBlock:"codeBlock_jBEb",codeBlockStandalone:"codeBlockStandalone_oFue",codeBlockLines:"codeBlockLines_dZHr",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_E43j",buttonGroup:"buttonGroup_EpKh"};function T(e){let{children:n,className:t}=e;return(0,I.jsx)(S,{as:"pre",tabIndex:0,className:(0,k.Z)(L.codeBlockStandalone,"thin-scrollbar",t),children:(0,I.jsx)("code",{className:L.codeBlockLines,children:n})})}var D=t(6668),_=t(5448),P=t(204);const E={codeDiagnosticsPopover:"codeDiagnosticsPopover_oSLf",codeDiagnosticsLink:"codeDiagnosticsLink_s3Vj",codeLine:"codeLine_Wk4M",codeLineNumber:"codeLineNumber_AMH6",codeLineContent:"codeLineContent_BWLK"};var Z=t(4513),A=t(4627),W=t(8957),F=t(8830);function z(e,n){return e.map(((e,t)=>(0,I.jsx)("span",{...n({token:e,key:t})},t)))}let q=BigInt(0);function G(){return(q++).toString()}function V(e,n){if(e instanceof Text)return e.textContent;if(!(e instanceof Element))return null;let t;const o=e.getAttributeNames().reduce(((o,s)=>{const i=e.getAttribute(s);return"data-codeblock-diagnostic-message"===s?t=n[Number(i)]:"class"===s?o.className=i:"style"===s?o.style=i.split(";").reduce(((e,n)=>{const[t,o]=n.split(":");return t&&o&&(e[t.replace(/-([a-z])/g,(e=>e[1].toUpperCase())).trim()]=o.trim()),e}),{}):o[s]=i,o}),{}),s=e.tagName.toLowerCase(),i=Array.from(e.childNodes).map((e=>V(e,n)));if(!t)return(0,I.jsx)(s,{...o,children:i},G());const a=(0,I.jsx)(s,{...o,className:(0,k.Z)(o.className,t.highlightedRangeClassName),children:i},G());return t.message?(0,I.jsx)(A.Z,{trigger:"hover",placement:"right",arrow:!1,overlayClassName:E.codeDiagnosticsPopover,content:(0,I.jsxs)("div",{className:"container",children:[(0,I.jsx)("div",{className:"row",children:t.message}),t.relatedDiagnostics.map(((e,n)=>(0,I.jsxs)("div",{className:"row",children:[(0,I.jsx)("a",{className:E.codeDiagnosticsLink,children:e.link}),(0,I.jsx)(W.Z,{}),":",e.highlightedPrefix&&(0,I.jsx)(F.Z.Text,{code:!0,children:e.highlightedPrefix}),(0,I.jsx)(F.Z.Text,{children:e.message})]},n)))]}),children:a},G()):a}const M=(e,n)=>{const t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let o=0,s=t.nextNode();for(;s;){const e=s.textContent?.length||0;if(o+e>=n)return{node:s,offset:n-o};o+=e,s=t.nextNode()}return{node:null,offset:0}};function H(e){const{line:n,classNames:t,showLineNumbers:s,getLineProps:i,getTokenProps:a,lineDiagnostics:r}=e,c=o.useRef(null);1===n.length&&"\n"===n[0].content&&(n[0].content="");const l=i({line:n,className:(0,k.Z)(t,s&&E.codeLine)}),[d,u]=o.useState(z(n,a)),p=o.useCallback((()=>{if(0===r.length)return;const e=c.current;if(!e)return;const n=[];r.forEach(((t,o)=>{const s=e.cloneNode(!0),i=M(s,t.start),a=M(s,t.start+t.width);if(i.node&&a.node){const e=new Range;e.setStart(i.node,i.offset),e.setEnd(a.node,a.offset);const t=document.createElement("span"),c=document.createAttribute("data-codeblock-diagnostic-message");c.value=o.toString(),t.attributes.setNamedItem(c),t.appendChild(e.extractContents()),e.insertNode(t),n.push(V(s,r))}})),u(n)}),[r]),[g,m,h]=(0,Z.Z)(p,50);return(0,o.useEffect)((()=>{c.current&&(m(),u(z(n,a)),h())}),[...Object.values(e),h,m]),(0,I.jsxs)("span",{...l,children:[s?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("span",{className:E.codeLineNumber}),(0,I.jsx)("span",{ref:c,className:(0,k.Z)(E.codeLineContent,"line-with-tokens"),children:d})]}):(0,I.jsx)("span",{ref:c,className:"line-with-tokens",children:d}),(0,I.jsx)("br",{})]})}var Q=t(195),U=t(5999),J=t(345),K=t(7666);const O={copyButtonCopied:"copyButtonCopied_DyYs",copyButtonIcons:"copyButtonIcons_ZVRJ",copyButtonIcon:"copyButtonIcon_sMZz",copyButtonSuccessIcon:"copyButtonSuccessIcon_gbd2"};function $(e){let{code:n,className:t}=e;const[s,i]=(0,o.useState)(!1),a=(0,o.useRef)(void 0),r=(0,o.useCallback)((()=>{(0,Q.Z)(n),i(!0),a.current=window.setTimeout((()=>{i(!1)}),1e3)}),[n]);return(0,o.useEffect)((()=>()=>window.clearTimeout(a.current)),[]),(0,I.jsx)("button",{type:"button","aria-label":s?(0,U.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,U.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,U.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,k.Z)("clean-btn",t,O.copyButton,s&&O.copyButtonCopied),onClick:r,children:(0,I.jsxs)("span",{className:O.copyButtonIcons,"aria-hidden":"true",children:[(0,I.jsx)(J.Z,{className:O.copyButtonIcon}),(0,I.jsx)(K.Z,{className:O.copyButtonSuccessIcon})]})})}var X=t(670);const Y={wordWrapButtonIcon:"wordWrapButtonIcon_k68c",wordWrapButtonEnabled:"wordWrapButtonEnabled_P92L"};function ee(e){let{className:n,onClick:t,isEnabled:o}=e;const s=(0,U.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return(0,I.jsx)("button",{type:"button",onClick:t,className:(0,k.Z)("clean-btn",n,o&&Y.wordWrapButtonEnabled),"aria-label":s,title:s,children:(0,I.jsx)(X.Z,{className:Y.wordWrapButtonIcon,"aria-hidden":"true"})})}function ne(e){let{children:n,className:t="",metastring:o,title:s,showLineNumbers:i,language:a,diagnostics:r=[]}=e;const{prism:{defaultLanguage:c,magicComments:l}}=(0,D.L)(),d=function(e){return e?.toLowerCase()}(a??(0,C.Vo)(t)??c),u=(0,B.p)(),p=(0,_.F)(),g=(0,C.bc)(o)||s,{lineClassNames:m,code:h}=(0,C.nZ)(n,{metastring:o,language:d,magicComments:l}),y=i??(0,C.nt)(o);return(0,I.jsxs)(S,{as:"div",className:(0,k.Z)(t,d&&!t.includes(`language-${d}`)&&`language-${d}`),children:[g&&(0,I.jsx)("div",{className:L.codeBlockTitle,children:g}),(0,I.jsxs)("div",{className:L.codeBlockContent,children:[(0,I.jsx)(P.y$,{theme:u,code:h,language:d??"text",children:e=>{let{className:n,style:t,tokens:o,getLineProps:s,getTokenProps:i}=e;return(0,I.jsx)("pre",{tabIndex:0,ref:p.codeBlockRef,className:(0,k.Z)(n,L.codeBlock,"thin-scrollbar"),style:t,children:(0,I.jsx)("code",{className:(0,k.Z)(L.codeBlockLines,y&&L.codeBlockLinesWithNumbering),children:o.map(((e,n)=>(0,I.jsx)(H,{line:e,getLineProps:s,getTokenProps:i,classNames:m[n],showLineNumbers:y,lineDiagnostics:r.filter((e=>e.line===n+1))},n)))})})}}),(0,I.jsxs)("div",{className:L.buttonGroup,children:[(p.isEnabled||p.isCodeScrollable)&&(0,I.jsx)(ee,{className:L.codeButton,onClick:()=>p.toggle(),isEnabled:p.isEnabled}),(0,I.jsx)($,{className:L.codeButton,code:h})]})]})]})}var te=t(1262);function oe(e){let{children:n,...t}=e;const s=(0,N.Z)(),i=function(e){return o.Children.toArray(e).some((e=>(0,o.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(n),a="string"==typeof i?ne:T;return(0,I.jsx)(te.Z,{children:()=>(0,I.jsx)(a,{...t,children:i},String(s))})}const se=["Declarative","Intuitive","External","Lightweight","Adaptive","Easy-to-use","Resourceful","Far-sighted","Well-prepared","Sagacious","Innovative","Purr-fect","Paw-some","Feline grace"].map((e=>[e,4e3])).flat(),ie="\ninterface IRepository<T> { /*...*/ }\nclass RepositoryImpl<T> implements IRepository<T> { /*...*/ }\nclass PrimitivesService {\n  constructor(\n    private stringRepository: IRepository<string>,\n    private numberRepository: IRepository<number>,\n    private booleanRepository: IRepository<boolean>,\n  ) {}\n}\n\n@ClawjectApplication\nclass Application {\n  stringRepository = Bean(RepositoryImpl<string>);\n  numberRepository = Bean(RepositoryImpl<number>);\n  booleanRepository = Bean(RepositoryImpl<boolean>);\n  primitivesService = Bean(PrimitivesService);\n}\n".trim(),ae="\ninterface IRepository<T> { /*...*/ }\n@Injectable()\nclass RepositoryImpl<T> implements IRepository<T> { /*...*/ }\nconst InjectionTokens = {\n  StringRepository: Symbol('StringRepository'),\n  NumberRepository: Symbol('NumberRepository'),\n  BooleanRepository: Symbol('BooleanRepository'),\n}\n\n@Injectable()\nclass PrimitivesService {\n  constructor(\n    @Inject(InjectionTokens.StringRepository)\n    private stringRepository: IRepository<string>,\n    @Inject(InjectionTokens.NumberRepository)\n    private numberRepository: IRepository<number>,\n    @Inject(InjectionTokens.BooleanRepository)\n    private booleanRepository: IRepository<boolean>,\n  ) {}\n}\n\n@Module({\n  providers: [\n    PrimitivesService,\n    {\n      provide: InjectionTokens.StringRepository,\n      useClass: RepositoryImpl,\n    },\n    {\n      provide: InjectionTokens.NumberRepository,\n      useClass: RepositoryImpl,\n    },\n    {\n      provide: InjectionTokens.BooleanRepository,\n      useClass: RepositoryImpl,\n    },\n  ],\n})\nclass Application {}\n".trim(),re="\nclass Foo {\n  constructor(baz: Baz, someString: string) {}\n}\nclass Bar {\n  constructor(private quux: Quux) {}\n}\nclass Baz {\n  constructor(private bar: Bar) {}\n}\nclass Quux {\n  constructor(private baz: Baz) {}\n}\n\n@ClawjectApplication\nclass Application {\n  @Bean string1 = 'string1';\n  @Bean string2 = 'string2';\n\n  foo = Bean(Foo);\n  bar = Bean(Bar);\n  baz = Bean(Baz);\n  quux = Bean(Quux);\n\n  @Bean\n  beanThatReturnsVoid(): void {}\n}\n".trim(),ce=[{line:2,start:24,width:18,highlightedRangeClassName:"textDecorationError",message:"CE5: Could not qualify bean candidate. Found 2 injection candidates.",relatedDiagnostics:[{link:"main.ts(16,3)",highlightedPrefix:"string1",message:"matched by type."},{link:"main.ts(17,3)",highlightedPrefix:"string2",message:"matched by type."},{link:"main.ts(19,3)",highlightedPrefix:"foo",message:"is declared here."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:19,start:2,width:16,highlightedRangeClassName:"textDecorationError",message:"CE4: Can not register Bean.",relatedDiagnostics:[{link:"main.ts(2,25)",message:"Cannot find a Bean candidate for 'someString'."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:21,start:2,width:16,highlightedRangeClassName:"textDecorationError",message:"CE7: Circular dependencies detected. baz \u2192 bar \u2192 quux \u2192 baz",relatedDiagnostics:[{link:"main.ts(20,3)",highlightedPrefix:"bar",message:"is declared here."},{link:"main.ts(22,3)",highlightedPrefix:"quux",message:"is declared here."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:25,start:25,width:4,highlightedRangeClassName:"textDecorationError",message:"CE8: Incorrect type. Type 'void' not supported as a Bean type.",relatedDiagnostics:[{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]}],le="\n@Configuration\nclass PetsConfiguration {\n  catRepository = Bean(Repository<Cat>);\n  dogRepository = Bean(Repository<Dog>);\n  foxRepository = Bean(Repository<Fox>);\n\n  catService = Bean(Service<Cat>);\n  dogService = Bean(Service<Dog>);\n  foxService = Bean(Service<Fox>);\n\n  @External petService = Bean(PetService);\n}\n".trim(),de=[{line:1,start:0,width:14,highlightedRangeClassName:"textDecorationInfo",message:"Use @Configuration decorator to define single configuration",relatedDiagnostics:[]},{line:11,start:2,width:9,highlightedRangeClassName:"textDecorationInfo",message:"Specify visibility of beans outside of configuration class",relatedDiagnostics:[]}],ue="\n@Injectable()\nclass PetService {\n  constructor(/* ... */) {}\n}\n\n@Configuration\nclass PetConfiguration {\n  petService = Bean(PetService);\n  /* ... */\n}\n".trim(),pe=[{line:1,start:0,width:13,highlightedRangeClassName:"textDecorationLineThroughRed",relatedDiagnostics:[]}],ge="\n@Injectable()\nclass CatService {\n  constructor(\n    @Inject(InjectionTokens.NotCatRepository)\n    private catRepository: Repository<Cat>\n  ) {}\n}\n".trim(),me=[{line:1,start:0,width:13,highlightedRangeClassName:"textDecorationLineThroughRed",relatedDiagnostics:[]},{line:4,start:4,width:41,message:"Oops, wrong injection token. Clawject will inject dependencies only by type, so type safety is guaranteed",highlightedRangeClassName:"textDecorationError",relatedDiagnostics:[]}],he=()=>{const{colorMode:e}=(0,f.I)();return(0,I.jsxs)(x.ZP,{theme:{algorithm:"dark"===e?j.Z.darkAlgorithm:j.Z.defaultAlgorithm,components:{Popover:{colorBgElevated:"var(--code-message-background)",borderRadiusLG:4}}},children:[(0,I.jsxs)("div",{className:a()("hero",r),children:[(0,I.jsxs)("div",{className:c,children:[(0,I.jsx)("h1",{className:a()("hero__title",l,d),children:"Clawject"}),(0,I.jsx)("p",{className:a()("hero__subtitle",u),children:"Full-stack, type-safe, declarative Dependency Injection framework for TypeScript"}),(0,I.jsx)(y.e,{preRenderFirstString:!0,sequence:se,speed:10,repeat:1/0,className:p}),(0,I.jsx)(b.Z,{className:a()("button button--primary button--outline"),to:"/docs",children:"Get Started"})]}),(0,I.jsxs)("div",{className:a()(g,"margin-top--lg"),children:[(0,I.jsx)("div",{className:a()(m)}),(0,I.jsx)("img",{className:a()(h),src:"/img/logo.svg",alt:"Clawject"})]})]}),(0,I.jsxs)("div",{className:"container margin-top--lg",children:[(0,I.jsx)("div",{className:"row",children:(0,I.jsxs)("div",{className:"col",children:[(0,I.jsx)("h1",{className:a()(d),children:"Built for developers convenience"}),(0,I.jsxs)("p",{children:["Clawject designed to make dependency injection and inversion of control in TypeScript as effortless, clear and intuitive as possible.",(0,I.jsx)("br",{}),"It allows define class dependencies in a declarative way, without the need to use injection tokens or any other boilerplate, especially when it comes to interfaces and generics."]})]})}),(0,I.jsxs)("div",{className:"row",children:[(0,I.jsxs)("div",{className:"col col--6",children:[(0,I.jsx)(v.Z,{showLineNumbers:!0,title:"Develop with Clawject",language:"ts",children:ie}),(0,I.jsx)("p",{children:"It's not only about the amount of code you write, but also about the clarity and readability of your code. Imagine how much time Clawject can save you. All this time can be used for more important things, like playing with your cat \ud83d\udc08"})]}),(0,I.jsx)("div",{className:"col col--6",children:(0,I.jsx)(v.Z,{showLineNumbers:!0,title:"Develop with other popular framework",language:"ts",children:ae})})]}),(0,I.jsxs)("div",{className:"row margin-top--lg",children:[(0,I.jsxs)("div",{className:"col",children:[(0,I.jsx)("h2",{className:a()(d),children:"In-editor diagnostics support"}),(0,I.jsx)("p",{children:"With Clawject's language service plugin, you can get instant feedback about missing beans, incorrect types, circular dependencies and more. It will help you to catch errors early without running your application and make your development process more productive."})]}),(0,I.jsx)("div",{className:"col",children:(0,I.jsx)(oe,{showLineNumbers:!0,language:"ts",diagnostics:ce,children:re})})]}),(0,I.jsxs)("div",{className:"row margin-top--lg",children:[(0,I.jsx)("div",{className:"col",children:(0,I.jsx)(oe,{showLineNumbers:!0,language:"ts",diagnostics:de,children:le})}),(0,I.jsxs)("div",{className:"col",children:[(0,I.jsx)("h2",{className:a()(d),children:"Split your code by features"}),(0,I.jsx)("p",{children:"Using @Configuration classes you can split your code by features. Encapsulate beans and expose only needed to the container. It will help you to keep your codebase clean and maintainable."})]})]}),(0,I.jsxs)("div",{className:"row margin-top--lg",children:[(0,I.jsxs)("div",{className:"col",children:[(0,I.jsx)("h2",{className:a()(d),children:"Externalize inversion of control"}),(0,I.jsx)("p",{children:"Forgot about tons of decorators on your business logic classes, with Clawject you can externalize inversion of control and keep your classes clean, readable and focused on business logic."})]}),(0,I.jsx)("div",{className:"col",children:(0,I.jsx)(oe,{showLineNumbers:!0,language:"ts",diagnostics:pe,children:ue})})]}),(0,I.jsxs)("div",{className:"row margin-top--lg",children:[(0,I.jsx)("div",{className:"col",children:(0,I.jsx)(oe,{showLineNumbers:!0,language:"ts",diagnostics:me,children:ge})}),(0,I.jsxs)("div",{className:"col",children:[(0,I.jsx)("h2",{className:a()(d),children:"First class type safety"}),(0,I.jsx)("p",{children:"With Clawject - you will never have to worry about the injection tokens mismatch, defining complex factory providers just because you want to use interfaces or generics \u2013 Clawject will take care of it for you."})]})]})]})]})};function ye(){return(0,I.jsx)(s.Z,{description:"TypeScript Dependency Injection Framework",children:(0,I.jsx)(he,{})})}}}]);
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["9452"],{370(e,t,s){s.d(t,{n:()=>E});var o=s(4848),i=s(6540),n=s(9863),a=s(4164),r=s(7810),c=s(8287),l=s(1643);function d({as:e,...t}){let s=(0,r.A)(),i=(0,l.M$)(s);return(0,o.jsx)(e,{...t,style:i,className:(0,a.A)(t.className,"codeBlockContainer_Wo3_",c.G.common.codeBlock)})}let u={codeBlockContent:"codeBlockContent_JcxH",codeBlockTitle:"codeBlockTitle_A_pv",codeBlock:"codeBlock_jBEb",codeBlockStandalone:"codeBlockStandalone_oFue",codeBlockLines:"codeBlockLines_dZHr",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_E43j",buttonGroup:"buttonGroup_EpKh"};function p({children:e,className:t}){return(0,o.jsx)(d,{as:"pre",tabIndex:0,className:(0,a.A)(u.codeBlockStandalone,"thin-scrollbar",t),children:(0,o.jsx)("code",{className:u.codeBlockLines,children:e})})}var h=s(1022),g=s(6270),m=s(1765),y=s(1774),x=s(2985),b=s(3133),j=s(6632);function f(e,t){return e.map((e,s)=>(0,o.jsx)("span",{...t({token:e,key:s})},s))}let v=BigInt(0);function N(){return(v++).toString()}let k=(e,t)=>{let s=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),o=0,i=s.nextNode();for(;i;){let e=i.textContent?.length||0;if(o+e>=t)return{node:i,offset:t-o};o+=e,i=s.nextNode()}return{node:null,offset:0}};function w(e){let{line:t,classNames:s,showLineNumbers:n,getLineProps:r,getTokenProps:c,lineDiagnostics:l}=e,d=i.useRef(null);1===t.length&&"\n"===t[0].content&&(t[0].content="");let u=r({line:t,className:(0,a.A)(s,n&&"codeLine_Wk4M")}),[p,h]=i.useState(f(t,c)),g=i.useCallback(()=>{if(0===l.length)return;let e=d.current;if(!e)return;let t=[];l.forEach((s,i)=>{let n=e.cloneNode(!0),r=k(n,s.start),c=k(n,s.start+s.width);if(r.node&&c.node){let e=new Range;e.setStart(r.node,r.offset),e.setEnd(c.node,c.offset);let s=document.createElement("span"),d=document.createAttribute("data-codeblock-diagnostic-message");d.value=i.toString(),s.attributes.setNamedItem(d),s.appendChild(e.extractContents()),e.insertNode(s),t.push(function e(t,s){let i;if(t instanceof Text)return t.textContent;if(!(t instanceof Element))return null;let n=t.getAttributeNames().reduce((e,o)=>{let n=t.getAttribute(o);return"data-codeblock-diagnostic-message"===o?i=s[Number(n)]:"class"===o?e.className=n:"style"===o?e.style=n.split(";").reduce((e,t)=>{let[s,o]=t.split(":");return s&&o&&(e[s.replace(/-([a-z])/g,e=>e[1].toUpperCase()).trim()]=o.trim()),e},{}):e[o]=n,e},{}),r=t.tagName.toLowerCase(),c=Array.from(t.childNodes).map(t=>e(t,s));if(!i)return(0,o.jsx)(r,{...n,children:c},N());let l=(0,o.jsx)(r,{...n,className:(0,a.A)(n.className,i.highlightedRangeClassName),children:c},N());return i.message?(0,o.jsx)(x.A,{trigger:"hover",placement:"right",arrow:!1,overlayClassName:"codeDiagnosticsPopover_oSLf",content:(0,o.jsxs)("div",{className:"container",children:[(0,o.jsx)("div",{className:"row",children:i.message}),i.relatedDiagnostics.map((e,t)=>(0,o.jsxs)("div",{className:"row",children:[(0,o.jsx)("a",{className:"codeDiagnosticsLink_s3Vj",children:e.link}),(0,o.jsx)(b.A,{}),":",e.highlightedPrefix&&(0,o.jsx)(j.A.Text,{code:!0,children:e.highlightedPrefix}),(0,o.jsx)(j.A.Text,{children:e.message})]},t))]}),children:l},N()):l}(n,l))}}),h(t)},[l]),[m,v,w]=(0,y.A)(g,50);return(0,i.useEffect)(()=>{d.current&&(v(),h(f(t,c)),w())},[...Object.values(e),w,v]),(0,o.jsxs)("span",{...u,children:[n?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{className:"codeLineNumber_AMH6"}),(0,o.jsx)("span",{ref:d,className:(0,a.A)("codeLineContent_BWLK","line-with-tokens"),children:p})]}):(0,o.jsx)("span",{ref:d,className:"line-with-tokens",children:p}),(0,o.jsx)("br",{})]})}var B=s(3436),C=s(568),R=s(1417),I=s(8104);let A={copyButtonCopied:"copyButtonCopied_DyYs",copyButtonIcons:"copyButtonIcons_ZVRJ",copyButtonIcon:"copyButtonIcon_sMZz",copyButtonSuccessIcon:"copyButtonSuccessIcon_gbd2"};function S({code:e,className:t}){let[s,n]=(0,i.useState)(!1),r=(0,i.useRef)(void 0),c=(0,i.useCallback)(()=>{(0,B.A)(e),n(!0),r.current=window.setTimeout(()=>{n(!1)},1e3)},[e]);return(0,i.useEffect)(()=>()=>window.clearTimeout(r.current),[]),(0,o.jsx)("button",{type:"button","aria-label":s?(0,C.T)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,C.T)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,C.T)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,a.A)("clean-btn",t,A.copyButton,s&&A.copyButtonCopied),onClick:c,children:(0,o.jsxs)("span",{className:A.copyButtonIcons,"aria-hidden":"true",children:[(0,o.jsx)(R.A,{className:A.copyButtonIcon}),(0,o.jsx)(I.A,{className:A.copyButtonSuccessIcon})]})})}var T=s(8592);function _({className:e,onClick:t,isEnabled:s}){let i=(0,C.T)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return(0,o.jsx)("button",{type:"button",onClick:t,className:(0,a.A)("clean-btn",e,s&&"wordWrapButtonEnabled_P92L"),"aria-label":i,title:i,children:(0,o.jsx)(T.A,{className:"wordWrapButtonIcon_k68c","aria-hidden":"true"})})}function D({children:e,className:t="",metastring:s,title:i,showLineNumbers:n,language:c,diagnostics:p=[]}){var y;let{prism:{defaultLanguage:x,magicComments:b}}=(0,h.p)(),j=(y=c??(0,l.DX)(t)??x,y?.toLowerCase()),f=(0,r.A)(),v=(0,g.f)(),N=(0,l.wt)(s)||i,{lineClassNames:k,code:B}=(0,l.Li)(e,{metastring:s,language:j,magicComments:b}),C=n??(0,l._u)(s);return(0,o.jsxs)(d,{as:"div",className:(0,a.A)(t,j&&!t.includes(`language-${j}`)&&`language-${j}`),children:[N&&(0,o.jsx)("div",{className:u.codeBlockTitle,children:N}),(0,o.jsxs)("div",{className:u.codeBlockContent,children:[(0,o.jsx)(m.f4,{theme:f,code:B,language:j??"text",children:({className:e,style:t,tokens:s,getLineProps:i,getTokenProps:n})=>(0,o.jsx)("pre",{tabIndex:0,ref:v.codeBlockRef,className:(0,a.A)(e,u.codeBlock,"thin-scrollbar"),style:t,children:(0,o.jsx)("code",{className:(0,a.A)(u.codeBlockLines,C&&u.codeBlockLinesWithNumbering),children:s.map((e,t)=>(0,o.jsx)(w,{line:e,getLineProps:i,getTokenProps:n,classNames:k[t],showLineNumbers:C,lineDiagnostics:p.filter(e=>e.line===t+1)},t))})})}),(0,o.jsxs)("div",{className:u.buttonGroup,children:[(v.isEnabled||v.isCodeScrollable)&&(0,o.jsx)(_,{className:u.codeButton,onClick:()=>v.toggle(),isEnabled:v.isEnabled}),(0,o.jsx)(S,{className:u.codeButton,code:B})]})]})]})}var L=s(9526);function E({children:e,...t}){let s=(0,n.A)(),a=i.Children.toArray(e).some(e=>(0,i.isValidElement)(e))?e:Array.isArray(e)?e.join(""):e,r="string"==typeof a?D:p;return(0,o.jsx)(L.A,{children:()=>(0,o.jsx)(r,{...t,children:a},String(s))})}},4254(e,t,s){s.d(t,{jK:()=>B,Gl:()=>x,RB:()=>b});var o=s(4848),i=s(6942),n=s.n(i);let a="textGradient_DJVw";var r=s(9519),c=s(5310);s(6540);var l=s(9105),d=s(5710),u=s(3941),p=s(2399),h=s(370);let g=["Declarative","Intuitive","External","Lightweight","Adaptive","Easy-to-use","Resourceful","Far-sighted","Well-prepared","Sagacious","Innovative","Purr-fect","Paw-some","Feline grace"].map(e=>[e,4e3]).flat(),m=`
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
class PrimitivesService {
  constructor(
    private stringRepository: IRepository<string>,
    private numberRepository: IRepository<number>,
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@ClawjectApplication
class Application {
  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}
`.trim(),y=`
interface IRepository<T> { /*...*/ }
@Injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@Injectable()
class PrimitivesService {
  constructor(
    @Inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @Inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @Inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@Module({
  providers: [
    PrimitivesService,
    {
      provide: InjectionTokens.StringRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.NumberRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useClass: RepositoryImpl,
    },
  ],
})
class Application {}
`.trim(),x=`
class Foo {
  constructor(baz: Baz, someString: string) {}
}
class Bar {
  constructor(private quux: Quux) {}
}
class Baz {
  constructor(private bar: Bar) {}
}
class Quux {
  constructor(private baz: Baz) {}
}

@ClawjectApplication
class Application {
  @Bean string1 = 'string1';
  @Bean string2 = 'string2';

  foo = Bean(Foo);
  bar = Bean(Bar);
  baz = Bean(Baz);
  quux = Bean(Quux);

  @Bean
  beanThatReturnsVoid(): void {}
}
`.trim(),b=[{line:2,start:24,width:18,highlightedRangeClassName:"textDecorationError",message:"CE5: Could not qualify bean candidate. Found 2 injection candidates.",relatedDiagnostics:[{link:"main.ts(16,3)",highlightedPrefix:"string1",message:"matched by type."},{link:"main.ts(17,3)",highlightedPrefix:"string2",message:"matched by type."},{link:"main.ts(19,3)",highlightedPrefix:"foo",message:"is declared here."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:19,start:2,width:16,highlightedRangeClassName:"textDecorationError",message:"CE4: Can not register Bean.",relatedDiagnostics:[{link:"main.ts(2,25)",message:"Cannot find a Bean candidate for 'someString'."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:21,start:2,width:16,highlightedRangeClassName:"textDecorationError",message:"CE7: Circular dependencies detected. baz \u2192 bar \u2192 quux \u2192 baz",relatedDiagnostics:[{link:"main.ts(20,3)",highlightedPrefix:"bar",message:"is declared here."},{link:"main.ts(22,3)",highlightedPrefix:"quux",message:"is declared here."},{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]},{line:25,start:25,width:4,highlightedRangeClassName:"textDecorationError",message:"CE8: Incorrect type. Type 'void' not supported as a Bean type.",relatedDiagnostics:[{link:"main.ts(15,7)",highlightedPrefix:"Application",message:"is declared here."}]}],j=`
@Configuration
class PetsConfiguration {
  catRepository = Bean(Repository<Cat>);
  dogRepository = Bean(Repository<Dog>);
  foxRepository = Bean(Repository<Fox>);

  catService = Bean(Service<Cat>);
  dogService = Bean(Service<Dog>);
  foxService = Bean(Service<Fox>);

  @External petService = Bean(PetService);
}
`.trim(),f=[{line:1,start:0,width:14,highlightedRangeClassName:"textDecorationInfo",message:"Use @Configuration decorator to define single configuration",relatedDiagnostics:[]},{line:11,start:2,width:9,highlightedRangeClassName:"textDecorationInfo",message:"Specify visibility of beans outside of configuration class",relatedDiagnostics:[]}],v=`
@Injectable()
class PetService {
  constructor(/* ... */) {}
}

@Configuration
class PetConfiguration {
  petService = Bean(PetService);
  /* ... */
}
`.trim(),N=[{line:1,start:0,width:13,highlightedRangeClassName:"textDecorationLineThroughRed",relatedDiagnostics:[]}],k=`
@Injectable()
class CatService {
  constructor(
    @Inject(InjectionTokens.NotCatRepository)
    private catRepository: Repository<Cat>
  ) {}
}
`.trim(),w=[{line:1,start:0,width:13,highlightedRangeClassName:"textDecorationLineThroughRed",relatedDiagnostics:[]},{line:4,start:4,width:41,message:"Oops, wrong injection token. Clawject will inject dependencies only by type, so type safety is guaranteed",highlightedRangeClassName:"textDecorationError",relatedDiagnostics:[]}],B=()=>{let{colorMode:e}=(0,u.G)();return(0,o.jsxs)(l.Ay,{theme:{algorithm:"dark"===e?d.A.darkAlgorithm:d.A.defaultAlgorithm,components:{Popover:{colorBgElevated:"var(--code-message-background)",borderRadiusLG:4}}},children:[(0,o.jsxs)("div",{className:n()("hero","heroContainer_i2aB"),children:[(0,o.jsxs)("div",{className:"contentContainer_C6d5",children:[(0,o.jsx)("h1",{className:n()("hero__title","heroTitle_qg2I",a),children:"Clawject"}),(0,o.jsx)("p",{className:n()("hero__subtitle","heroSubtitle_jFu1"),children:"Full-stack, type-safe, declarative Dependency Injection framework for TypeScript"}),(0,o.jsx)(r.d,{preRenderFirstString:!0,sequence:g,speed:10,repeat:1/0,className:"typeAnimation_Rfre"}),(0,o.jsx)(c.A,{className:n()("button button--primary button--outline"),to:"/docs",children:"Get Started"})]}),(0,o.jsxs)("div",{className:n()("logoContainer_xdaK","margin-top--lg"),children:[(0,o.jsx)("div",{className:n()("logoBackground_Xngs")}),(0,o.jsx)("img",{className:n()("logo_Ukns"),src:"/img/logo.svg",alt:"Clawject"})]})]}),(0,o.jsxs)("div",{className:"container margin-top--lg",children:[(0,o.jsx)("div",{className:"row",children:(0,o.jsxs)("div",{className:"col",children:[(0,o.jsx)("h1",{className:n()(a),children:"Built for developers convenience"}),(0,o.jsxs)("p",{children:["Clawject designed to make dependency injection and inversion of control in TypeScript as effortless, clear and intuitive as possible.",(0,o.jsx)("br",{}),"It allows define class dependencies in a declarative way, without the need to use injection tokens or any other boilerplate, especially when it comes to interfaces and generics."]})]})}),(0,o.jsxs)("div",{className:"row",children:[(0,o.jsxs)("div",{className:"col col--6",children:[(0,o.jsx)(p.A,{showLineNumbers:!0,title:"Develop with Clawject",language:"ts",children:m}),(0,o.jsx)("p",{children:"It's not only about the amount of code you write, but also about the clarity and readability of your code. Imagine how much time Clawject can save you. All this time can be used for more important things, like playing with your cat \u{1F408}"})]}),(0,o.jsx)("div",{className:"col col--6",children:(0,o.jsx)(p.A,{showLineNumbers:!0,title:"Develop with other popular framework",language:"ts",children:y})})]}),(0,o.jsxs)("div",{className:"row margin-top--lg",children:[(0,o.jsxs)("div",{className:"col",children:[(0,o.jsx)("h2",{className:n()(a),children:"In-editor diagnostics support"}),(0,o.jsx)("p",{children:"With Clawject's language service plugin, you can get instant feedback about missing beans, incorrect types, circular dependencies and more. It will help you to catch errors early without running your application and make your development process more productive."})]}),(0,o.jsx)("div",{className:"col",children:(0,o.jsx)(h.n,{showLineNumbers:!0,language:"ts",diagnostics:b,children:x})})]}),(0,o.jsxs)("div",{className:"row margin-top--lg",children:[(0,o.jsxs)("div",{className:"col",children:[(0,o.jsx)("h2",{className:n()(a),children:"Split your code by features"}),(0,o.jsx)("p",{children:"Using @Configuration classes you can split your code by features. Encapsulate beans and expose only needed to the container. It will help you to keep your codebase clean and maintainable."})]}),(0,o.jsx)("div",{className:"col",children:(0,o.jsx)(h.n,{showLineNumbers:!0,language:"ts",diagnostics:f,children:j})})]}),(0,o.jsxs)("div",{className:"row margin-top--lg",children:[(0,o.jsxs)("div",{className:"col",children:[(0,o.jsx)("h2",{className:n()(a),children:"Externalize inversion of control"}),(0,o.jsx)("p",{children:"Forgot about tons of decorators on your business logic classes, with Clawject you can externalize inversion of control and keep your classes clean, readable and focused on business logic."})]}),(0,o.jsx)("div",{className:"col",children:(0,o.jsx)(h.n,{showLineNumbers:!0,language:"ts",diagnostics:N,children:v})})]}),(0,o.jsxs)("div",{className:"row margin-top--lg",children:[(0,o.jsxs)("div",{className:"col",children:[(0,o.jsx)("h2",{className:n()(a),children:"First class type safety"}),(0,o.jsx)("p",{children:"With Clawject - you will never have to worry about the injection tokens mismatch, type - is a source of truth. Stop defining complex factory providers just because you want to use interfaces or generics \u2013 Clawject will take care of it for you."})]}),(0,o.jsx)("div",{className:"col",children:(0,o.jsx)(h.n,{showLineNumbers:!0,language:"ts",diagnostics:w,children:k})})]})]})]})}},5146(e,t,s){s.r(t),s.d(t,{default:()=>a});var o=s(4848);s(6540);var i=s(6386),n=s(4254);function a(){return(0,o.jsx)(i.A,{description:"TypeScript Dependency Injection Framework",children:(0,o.jsx)(n.jK,{})})}}}]);
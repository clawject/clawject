"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["7708"],{4854(e,o,n){n.r(o),n.d(o,{metadata:()=>t,default:()=>j,SpringLogo:()=>h,toc:()=>I,NestJSLogo:()=>d,assets:()=>y,frontMatter:()=>u,contentTitle:()=>m});var t=JSON.parse('{"id":"intro","title":"Introduction \u{1F680}","description":"Introduction \u{1F680}","source":"@site/docs/intro.mdx","sourceDirName":".","slug":"/","permalink":"/docs/","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedAt":1769589380000,"frontMatter":{"title":"Introduction \u{1F680}","hide_title":true,"slug":"/"},"sidebar":"docs","next":{"title":"Setup \u{1F6E0}","permalink":"/docs/setup"}}'),r=n(4848),i=n(8453);n(6540);var s=n(8010),a=n(7250),c=n(2399);let l=()=>{let e=`
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
  primitivesService Bean(PrimitivesService);
}
`,o=`
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
    { provide: InjectionTokens.StringRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.NumberRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.BooleanRepository, useClass: RepositoryImpl },
  ],
})
class Application {}
`,n=`
interface IRepository<T> { /*...*/ }
@Injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: new InjectionToken<IRepository<string>>('StringRepository'),
  NumberRepository: new InjectionToken<IRepository<number>>('NumberRepository'),
  BooleanRepository: new InjectionToken<IRepository<boolean>>('BooleanRepository'),
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

@NgModule({
  providers: [
    PrimitivesService,
    { provide: InjectionTokens.StringRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.NumberRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.BooleanRepository, useClass: RepositoryImpl },
  ],
})
class Application {}
`,t=`
interface IRepository<T> { /*...*/ }
@injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@injectable()
class PrimitivesService {
  constructor(
    @inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

container.register(InjectionTokens.StringRepository, { useClass: RepositoryImpl });
container.register(InjectionTokens.NumberRepository, { useClass: RepositoryImpl });
container.register(InjectionTokens.BooleanRepository, { useClass: RepositoryImpl });
container.register(PrimitivesService, { useClass: PrimitivesService });
`;return(0,r.jsxs)(s.A,{children:[(0,r.jsx)(a.A,{value:"clawject",label:"Clawject",default:!0,children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:e.trim()})}),(0,r.jsx)(a.A,{value:"nest",label:"NestJS",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:o.trim()})}),(0,r.jsx)(a.A,{value:"angular",label:"Angular",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:n.trim()})}),(0,r.jsx)(a.A,{value:"tsyringe",label:"TSyringe",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:t.trim()})})]})},p=()=>{let e=`
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}
class PrimitivesService {
  constructor(
    private stringRepository: IRepository<string>,
    private numberRepository: IRepository<number>,
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@ClawjectApplication
class Application {
  stringCache = Bean(CacheImpl<string>);
  numberCache = Bean(CacheImpl<number>);
  booleanCache = Bean(CacheImpl<boolean>);
  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}
`,o=`
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: Symbol('StringCache'),
  NumberCache: Symbol('NumberCache'),
  BooleanCache: Symbol('BooleanCache'),
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
    { provide: InjectionTokens.StringCache, useClass: CacheImpl },
    { provide: InjectionTokens.NumberCache, useClass: CacheImpl },
    { provide: InjectionTokens.BooleanCache, useClass: CacheImpl },
    {
      provide: InjectionTokens.StringRepository,
      useFactory: (cache: ICache<string>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.StringCache],
    },
    {
      provide: InjectionTokens.NumberRepository,
      useFactory: (cache: ICache<number>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.NumberCache],
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useFactory: (cache: ICache<boolean>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.BooleanCache],
    },
  ]
})
export class Application {}
`,n=`
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: new InjectionToken<ICache<string>>('StringCache'),
  NumberCache: new InjectionToken<ICache<number>>('NumberCache'),
  BooleanCache: new InjectionToken<ICache<boolean>>('BooleanCache'),
  StringRepository: new InjectionToken<IRepository<string>>('StringRepository'),
  NumberRepository: new InjectionToken<IRepository<number>>('NumberRepository'),
  BooleanRepository: new InjectionToken<IRepository<boolean>>('BooleanRepository'),
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

@NgModule({
  providers: [
    PrimitivesService,
    { provide: InjectionTokens.StringCache, useClass: CacheImpl },
    { provide: InjectionTokens.NumberCache, useClass: CacheImpl },
    { provide: InjectionTokens.BooleanCache, useClass: CacheImpl },
    {
      provide: InjectionTokens.StringRepository,
      useFactory: (cache: ICache<string>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.StringCache],
    },
    {
      provide: InjectionTokens.NumberRepository,
      useFactory: (cache: ICache<number>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.NumberCache],
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useFactory: (cache: ICache<boolean>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.BooleanCache],
    },
  ]
})
export class Application {}
`,t=`
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: Symbol('StringCache'),
  NumberCache: Symbol('NumberCache'),
  BooleanCache: Symbol('BooleanCache'),
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@injectable()
class PrimitivesService {
  constructor(
    @inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

container.register(InjectionTokens.StringCache, { useClass: CacheImpl });
container.register(InjectionTokens.NumberCache, { useClass: CacheImpl });
container.register(InjectionTokens.BooleanCache, { useClass: CacheImpl });
container.register(
  InjectionTokens.StringRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.StringCache)) },
);
container.register(
  InjectionTokens.NumberRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.NumberCache)) },
);
container.register(
  InjectionTokens.BooleanRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.BooleanCache)) },
);
container.register(PrimitivesService, { useClass: PrimitivesService });
`;return(0,r.jsxs)(s.A,{children:[(0,r.jsx)(a.A,{value:"clawject",label:"Clawject",default:!0,children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:e.trim()})}),(0,r.jsx)(a.A,{value:"nest",label:"NestJS",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:o.trim()})}),(0,r.jsx)(a.A,{value:"angular",label:"Angular",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:n.trim()})}),(0,r.jsx)(a.A,{value:"tsyringe",label:"TSyringe",children:(0,r.jsx)(c.A,{showLineNumbers:!0,language:"typescript",children:t.trim()})})]})},u={title:"Introduction \u{1F680}",hide_title:!0,slug:"/"},m,y={},h=()=>{let e={img:"img",...(0,i.R)()};return(0,r.jsx)(e.img,{src:"/img/spring.svg",alt:"spring_logo",style:{width:"1em",height:"auto"}})},d=()=>{let e={img:"img",...(0,i.R)()};return(0,r.jsx)(e.img,{src:"https://docs.nestjs.com/assets/logo-small.svg",alt:"nestjs_logo",style:{width:"1em",height:"auto"}})},I=[{value:"Introduction \u{1F680}",id:"introduction-",level:2},{value:"Main Features",id:"main-features",level:3},{value:"Inspiration",id:"inspiration",level:3}];function b(e){let o={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.h2,{id:"introduction-",children:"Introduction \u{1F680}"}),"\n",(0,r.jsxs)(o.p,{children:["Clawject is TypeScript Dependency Injection framework that's here to make your coding life easier.\nForget about ",(0,r.jsx)(o.strong,{children:"injection tokens"})," and a huge number of ",(0,r.jsx)(o.strong,{children:"decorators on and in your business classes"}),".\nUse typescript features like interfaces, generics, type hierarchies in\na declarative and intuitive way and let Clawject do messy work for you!"]}),"\n",(0,r.jsx)(o.h3,{id:"main-features",children:"Main Features"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"Ahead of Time Dependency Injection based on TypeScript types, full type safety because no injection tokens are used."}),"\n",(0,r.jsx)(o.li,{children:"Can be used both in Node.js and in the browser."}),"\n",(0,r.jsx)(o.li,{children:"Declarative and intuitive API."}),"\n",(0,r.jsx)(o.li,{children:"Fast at runtime, all dependency-resolution work is done at compile time!"}),"\n",(0,r.jsx)(o.li,{children:"IDEs support, all errors and warnings are shown right in your code editor window."}),"\n",(0,r.jsx)(o.li,{children:"Ahead of Time circular dependencies detection with a clear cycle path, forget about runtime loops and stack overflows!"}),"\n",(0,r.jsx)(o.li,{children:"No need to refer to a dependency injection library in your business-oriented classes, leave them clean and framework independent!"}),"\n",(0,r.jsx)(o.li,{children:"Injection scopes support and ability to create your own custom scopes."}),"\n",(0,r.jsxs)(o.li,{children:["Supports both experimental and stable JavaScript decorators + no dependency on ",(0,r.jsx)(o.code,{children:"reflect-metadata"})," library."]}),"\n",(0,r.jsx)(o.li,{children:"Minimal runtime overhead."}),"\n",(0,r.jsx)(o.li,{children:"Clawject is not modifying your classes, not adding additional runtime fields, so it's safe to use it with any other library or framework."}),"\n"]}),"\n",(0,r.jsx)(o.p,{children:"Let's compare Clawject with other popular frameworks that implements Dependency Injection, note how class is using interfaces with generics to declare dependencies:"}),"\n","\n",(0,r.jsx)(l,{}),"\n",(0,r.jsx)(o.p,{children:"When it comes to the more complex scenarios, like generic inside constructors - with Clawject,\nit's still easy and type-safe but with other frameworks, it's getting really messy and hard to maintain, see the comparison below:"}),"\n",(0,r.jsx)(p,{}),"\n",(0,r.jsxs)(o.p,{children:["As you can see - Clawject requires much less boilerplate code, not pollutes ",(0,r.jsx)(o.strong,{children:"business classes"})," and provides an intuitive,\ndeclarative and ",(0,r.jsx)(o.strong,{children:"really"})," type-safe API where you can't miss a thing.\nLet's clawject your codebase and make it more maintainable and easy to understand!"]}),"\n",(0,r.jsx)(o.h3,{id:"inspiration",children:"Inspiration"}),"\n","\n",(0,r.jsxs)(o.p,{children:[(0,r.jsx)(o.strong,{children:"Clawject"})," is inspired by ",(0,r.jsx)(o.a,{href:"https://docs.spring.io/spring-framework/reference/core/beans.html",children:"Spring framework"})," ",(0,r.jsx)(h,{})," and ",(0,r.jsx)(o.a,{href:"https://nestjs.com/",children:"NestJS"})," ",(0,r.jsx)(d,{})]})]})}function j(e={}){let{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(b,{...e})}):b(e)}},7250(e,o,n){n.d(o,{A:()=>i});var t=n(4848);n(6540);var r=n(4164);function i({children:e,hidden:o,className:n}){return(0,t.jsx)("div",{role:"tabpanel",className:(0,r.A)("tabItem_Ymn6",n),hidden:o,children:e})}},8010(e,o,n){n.d(o,{A:()=>R});var t=n(4848),r=n(6540),i=n(4164),s=n(8287),a=n(8584),c=n(6347),l=n(9989),p=n(6629),u=n(618),m=n(1367);function y(e){return r.Children.toArray(e).filter(e=>"\n"!==e).map(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){let{props:o}=e;return!!o&&"object"==typeof o&&"value"in o}(e))return e;throw Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})?.filter(Boolean)??[]}function h({value:e,tabValues:o}){return o.some(o=>o.value===e)}var d=n(9863);function I({className:e,block:o,selectedValue:n,selectValue:r,tabValues:s}){let c=[],{blockElementScrollPositionUntilNextRender:l}=(0,a.a_)(),p=e=>{let o=e.currentTarget,t=s[c.indexOf(o)].value;t!==n&&(l(o),r(t))},u=e=>{let o=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{let n=c.indexOf(e.currentTarget)+1;o=c[n]??c[0];break}case"ArrowLeft":{let n=c.indexOf(e.currentTarget)-1;o=c[n]??c[c.length-1]}}o?.focus()};return(0,t.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":o},e),children:s.map(({value:e,label:o,attributes:r})=>(0,t.jsx)("li",{role:"tab",tabIndex:n===e?0:-1,"aria-selected":n===e,ref:e=>{c.push(e)},onKeyDown:u,onClick:p,...r,className:(0,i.A)("tabs__item","tabItem_LNqP",r?.className,{"tabs__item--active":n===e}),children:o??e},e))})}function b({lazy:e,children:o,selectedValue:n}){let s=(Array.isArray(o)?o:[o]).filter(Boolean);if(e){let e=s.find(e=>e.props.value===n);return e?(0,r.cloneElement)(e,{className:(0,i.A)("margin-top--md",e.props.className)}):null}return(0,t.jsx)("div",{className:"margin-top--md",children:s.map((e,o)=>(0,r.cloneElement)(e,{key:o,hidden:e.props.value!==n}))})}function j(e){let o=function(e){let o,{defaultValue:n,queryString:t=!1,groupId:i}=e,s=function(e){let{values:o,children:n}=e;return(0,r.useMemo)(()=>{let e=o??y(n).map(({props:{value:e,label:o,attributes:n,default:t}})=>({value:e,label:o,attributes:n,default:t})),t=(0,u.XI)(e,(e,o)=>e.value===o.value);if(t.length>0)throw Error(`Docusaurus error: Duplicate values "${t.map(e=>e.value).join(", ")}" found in <Tabs>. Every value needs to be unique.`);return e},[o,n])}(e),[a,d]=(0,r.useState)(()=>(function({defaultValue:e,tabValues:o}){if(0===o.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(e){if(!h({value:e,tabValues:o}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${e}" but none of its children has the corresponding value. Available values are: ${o.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return e}let n=o.find(e=>e.default)??o[0];if(!n)throw Error("Unexpected error: 0 tabValues");return n.value})({defaultValue:n,tabValues:s})),[I,b]=function({queryString:e=!1,groupId:o}){let n=(0,c.W6)(),t=function({queryString:e=!1,groupId:o}){if("string"==typeof e)return e;if(!1===e)return null;if(!0===e&&!o)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return o??null}({queryString:e,groupId:o});return[(0,p.aZ)(t),(0,r.useCallback)(e=>{if(!t)return;let o=new URLSearchParams(n.location.search);o.set(t,e),n.replace({...n.location,search:o.toString()})},[t,n])]}({queryString:t,groupId:i}),[j,R]=function({groupId:e}){let o=e?`docusaurus.tab.${e}`:null,[n,t]=(0,m.Dv)(o);return[n,(0,r.useCallback)(e=>{o&&t.set(e)},[o,t])]}({groupId:i}),g=h({value:o=I??j,tabValues:s})?o:null;return(0,l.A)(()=>{g&&d(g)},[g]),{selectedValue:a,selectValue:(0,r.useCallback)(e=>{if(!h({value:e,tabValues:s}))throw Error(`Can't select invalid tab value=${e}`);d(e),b(e),R(e)},[b,R,s]),tabValues:s}}(e);return(0,t.jsxs)("div",{className:(0,i.A)(s.G.tabs.container,"tabs-container","tabList__CuJ"),children:[(0,t.jsx)(I,{...o,...e}),(0,t.jsx)(b,{...o,...e})]})}function R(e){let o=(0,d.A)();return(0,t.jsx)(j,{...e,children:y(e.children)},String(o))}},8453(e,o,n){n.d(o,{R:()=>s,x:()=>a});var t=n(6540);let r={},i=t.createContext(r);function s(e){let o=t.useContext(i);return t.useMemo(function(){return"function"==typeof e?e(o):{...o,...e}},[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(i.Provider,{value:o},e.children)}}}]);
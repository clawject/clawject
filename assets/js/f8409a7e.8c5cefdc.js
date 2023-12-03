"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[206],{3469:(e,n,t)=>{t.r(n),t.d(n,{SpringLogo:()=>m,assets:()=>p,contentTitle:()=>u,default:()=>I,frontMatter:()=>h,metadata:()=>d,toc:()=>C});var r=t(5893),s=t(1151),c=(t(7294),t(4866)),i=t(5162),a=t(9286),o=t(5758);const l=()=>{const e=(0,o.X)("\ninterface ICache<T> {}\nclass CacheImpl<T> implements ICache<T> { /* ... */ }\n\n    class Service {\n    constructor(\n      private customerCache: ICache<Customer>,\n      private storeCache: ICache<Store>,\n    ) {}\n    }\n\n  class ApplicationContext extends CatContext {\n    customerCache = Bean(CacheImpl<Customer>)\n    storeCache = Bean(CacheImpl<Store>)\n    service = Bean(Service)\n  }\n    ","typescript"),n=(0,o.X)("\ninterface ICache<T> {}\n@Injectable()\nclass CacheImpl<T> implements ICache<T> { /* ... */ }\n\nconst InjectionTokens = {\n  CustomerCache: Symbol('CustomerCache'),\n  StoreCache: Symbol('StoreCache'),\n};\n\n@Injectable()\nclass Service {\n  constructor(\n    @Inject(InjectionTokens.CustomerCache)\n    private customerCache: ICache<Customer>,\n    @Inject(InjectionTokens.StoreCache)\n    private storeCache: ICache<Store>,\n  ) {}\n}\n\n@Module({\n  providers: [\n    Service,\n    {\n      provide: InjectionTokens.CustomerCache,\n      useClass: CacheImpl,\n    },\n\n    {\n      provide: InjectionTokens.StoreCache,\n      useClass: CacheImpl,\n    },\n  ],\n})\nclass AppModule {}\n\n    ","typescript"),t=(0,o.X)("\n    interface ICache<T> {}\n@Injectable()\nclass CacheImpl<T> implements ICache<T> {\n  /* ... */\n}\n\nconst InjectionTokens = {\n  CustomerCache: new InjectionToken<ICache<Customer>>('CustomerCache'),\n  StoreCache: new InjectionToken<ICache<Store>>('StoreCache'),\n};\n\n@Injectable()\nclass Service {\n  constructor(\n    @Inject(InjectionTokens.CustomerCache)\n    private customerCache: ICache<Customer>,\n    @Inject(InjectionTokens.StoreCache)\n    private storeCache: ICache<Store>,\n  ) {}\n}\n\n@NgModule({\n  providers: [\n    Service,\n    {\n      provide: InjectionTokens.CustomerCache,\n      useClass: CacheImpl,\n      multi: true\n    },\n    {\n      provide: InjectionTokens.StoreCache,\n      useClass: CacheImpl,\n      multi: true\n    },\n ]\n})\nclass AppModule {}\n","typescript"),s=(0,o.X)('\ninterface ICache<T> {}\n@injectable()\nclass CacheImpl<T> implements ICache<T> { /* ... */ }\n\nconst InjectionTokens = {\n  CustomerCache: Symbol("CustomerCache"),\n  StoreCache: Symbol("StoreCache"),\n};\n\n@injectable()\nclass Service {\n  constructor(\n    @inject(InjectionTokens.CustomerCache)\n    private customerCache: ICache<Customer>,\n    @inject(InjectionTokens.StoreCache)\n   private storeCache: ICache<Store>,\n  ) {}\n}\n\ncontainer.register(InjectionTokens.CustomerCache, { useClass: CacheImpl });\ncontainer.register(InjectionTokens.StoreCache, { useClass: CacheImpl });\ncontainer.register(Service, { useClass: Service });\n\nconst service = container.resolve(Service);\n    ',"typescript");return(0,r.jsxs)(c.Z,{children:[(0,r.jsx)(i.Z,{value:"clawject",label:"Clawject",default:!0,children:(0,r.jsx)(a.Z,{showLineNumbers:!0,language:"typescript",children:e})}),(0,r.jsx)(i.Z,{value:"nest",label:"NestJS",children:(0,r.jsx)(a.Z,{showLineNumbers:!0,language:"typescript",children:n})}),(0,r.jsx)(i.Z,{value:"angular",label:"Angular",children:(0,r.jsx)(a.Z,{showLineNumbers:!0,language:"typescript",children:t})}),(0,r.jsx)(i.Z,{value:"tsyringe",label:"TSyringe",children:(0,r.jsx)(a.Z,{showLineNumbers:!0,language:"typescript",children:s})})]})},h={title:"Introduction",slug:"/"},u=void 0,d={id:"intro",title:"Introduction",description:"Clawject is TypeScript Dependency Injection framework that's here to make your coding life easier.",source:"@site/docs/intro.mdx",sourceDirName:".",slug:"/",permalink:"/docs/",draft:!1,unlisted:!1,tags:[],version:"current",lastUpdatedAt:1701628664,formattedLastUpdatedAt:"Dec 3, 2023",frontMatter:{title:"Introduction",slug:"/"},sidebar:"docs",next:{title:"Setup \ud83d\udee0\ufe0f",permalink:"/docs/setup"}},p={},C=[{value:"Main Features",id:"main-features",level:3},{value:"Inspiration",id:"inspiration",level:2}],m=()=>{const e={img:"img",...(0,s.a)()};return(0,r.jsx)(e.img,{src:"/img/spring.svg",alt:"spring_logo",style:{width:"1em",height:"auto"}})};function j(e){const n={a:"a",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["Clawject is TypeScript Dependency Injection framework that's here to make your coding life easier.\nForget about ",(0,r.jsx)(n.strong,{children:"injection tokens"}),", ",(0,r.jsx)(n.strong,{children:"providers"})," and a huge number of ",(0,r.jsx)(n.strong,{children:"decorators on and in your business classes"}),".\nUse typescript features like interfaces, generics, type hierarchies in a declarative and intuitive way and let Clawject do messy work for you!"]}),"\n",(0,r.jsx)(n.h3,{id:"main-features",children:"Main Features"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Ahead of Time Dependency Injection based on TypeScript types."}),"\n",(0,r.jsx)(n.li,{children:"Declarative and intuitive API."}),"\n",(0,r.jsx)(n.li,{children:"Fast runtime dependency resolution, because all the work is done at compile time!"}),"\n",(0,r.jsx)(n.li,{children:"IDEs support, all errors and warnings are shown right in your code editor window."}),"\n",(0,r.jsx)(n.li,{children:"Ahead of Time circular dependencies detection with a clear cycle path, forget about runtime loops and stack overflows!"}),"\n",(0,r.jsx)(n.li,{children:"No need to use injection tokens and providers."}),"\n",(0,r.jsx)(n.li,{children:"No need to refer to a dependency injection library in your business-oriented classes, leave them clean and framework independent!"}),"\n",(0,r.jsx)(n.li,{children:"Injection scopes support and ability to create your own custom scopes."}),"\n",(0,r.jsx)(n.li,{children:"Lifecycle events support."}),"\n",(0,r.jsx)(n.li,{children:"Supports both experimental and stable JavaScript decorators."}),"\n",(0,r.jsx)(n.li,{children:"Minimal runtime overhead."}),"\n",(0,r.jsx)(n.li,{children:"Clawject is not modifying your classes, not adding additional fields, so it's safe to use it with any other library or framework."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Let's compare Clawject with other popular DI frameworks:"}),"\n","\n","\n",(0,r.jsx)(l,{}),"\n",(0,r.jsx)(n.h2,{id:"inspiration",children:"Inspiration"}),"\n","\n",(0,r.jsxs)(n.p,{children:["Calwject API is inspired by ",(0,r.jsx)(n.a,{href:"https://docs.spring.io/spring-framework/reference/core/beans.html",children:"Spring DI framework"})," ",(0,r.jsx)(m,{})]})]})}function I(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(j,{...e})}):j(e)}},5758:(e,n,t)=>{t.d(n,{X:()=>h});var r=t(7294),s=t(4935),c=t(6780),i=t(8538),a=t(9966),o=t(4990);const l=[i.Z,a.ZP,o.Z],h=(e,n)=>{const t=r.useCallback((()=>(0,s.WU)(e,{parser:n,plugins:l})),[e]),{data:i,error:a}=(0,c.r5)({promiseFn:t});return r.useEffect((()=>{a&&console.error(a)}),[a]),i}}}]);
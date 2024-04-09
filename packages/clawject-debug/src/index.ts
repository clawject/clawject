declare const Controller: (target: any, context: ClassDecoratorContext) => void;

@Controller
export class  A {
  get data(): string {
    return 'data';
  }
}

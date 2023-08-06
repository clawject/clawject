import { BeanRegister } from '../bean/BeanRegister';
import { Component } from '../component/Component';

export class Configuration extends Component {
  beanRegister = new BeanRegister(this);
}

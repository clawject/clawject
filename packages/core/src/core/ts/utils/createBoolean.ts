import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

export const createBoolean = (value: boolean): ts.BooleanLiteral => value ?
  Context.ts.factory.createTrue() : Context.ts.factory.createFalse();

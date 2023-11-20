import React from 'react';
import { format } from 'prettier/standalone';
import { useAsync } from 'react-async';
import TypescriptPrettierPlugin from 'prettier/plugins/typescript';
import ESTreePrettierPlugin from 'prettier/plugins/estree';
import BabelPrettierPlugin from 'prettier/plugins/babel';

const plugins = [
  TypescriptPrettierPlugin,
  ESTreePrettierPlugin,
  BabelPrettierPlugin,
];

export const useFormattedCode = (code: string, language: 'typescript' | 'json'): string => {
  const formatFunction = React.useCallback(() => format(code, { parser: language, plugins }), [code]);
  const { data, error } = useAsync({ promiseFn: formatFunction });

  React.useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return data;
};

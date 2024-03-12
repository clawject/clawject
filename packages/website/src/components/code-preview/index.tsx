import React, { MutableRefObject } from 'react';
import CodeBlock from '@theme/CodeBlock';
import { CodePreviewContainer } from './styles';
import { ICodeMessage } from './types';
import { CodeMessage } from '@site/src/components/code-preview/CodeMessage';

interface Props {
  showLineNumbers?: boolean;
  code: string;
  messages?: ICodeMessage[];
}

export const CodePreview: React.FC<Props> = ({showLineNumbers, code, messages}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <CodePreviewContainer ref={containerRef}>
      <CodeBlock
        language="ts"
        showLineNumbers={showLineNumbers}
      >
        {code}
      </CodeBlock>
      {
        messages?.map((it, index) => (
          <CodeMessage key={index} message={it} $parentContainerRef={containerRef} />
        )) ?? null
      }
    </CodePreviewContainer>
  );
};

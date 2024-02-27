import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const AddDependency = () => {
  const yarnAddCode = 'yarn add @clawject/di';
  const npmAddCode = 'npm install @clawject/di';

  return (
    <Tabs>
      <TabItem value="yarn" label="yarn" default>
        <CodeBlock showLineNumbers language="bash">
          {yarnAddCode}
        </CodeBlock>
      </TabItem>
      <TabItem value="npm" label="npm">
        <CodeBlock showLineNumbers language="bash">
          {npmAddCode}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};


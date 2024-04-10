import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

type Props = {
  libraries: string[];
  dev: boolean;
}

export const InstallCommands: React.FC<Props> = ({
  libraries,
  dev,
}) => {
  const librariesCommand = libraries.join(' ');

  const npmCommand = `npm install ${librariesCommand}${dev ? ' --save-dev' : ''}`;
  const yarnCommand = `yarn add ${librariesCommand}${dev ? ' --dev' : ''}`;

  const commands = [
    {
      label: 'npm',
      command: npmCommand,
    },
    {
      label: 'yarn',
      command: yarnCommand,
    },
  ];

  return (
    <Tabs>
      {
        commands.map(({ label, command }) => (
          <TabItem key={label} value={label} label={label}>
            <CodeBlock language="bash">
              {command}
            </CodeBlock>
          </TabItem>
        ))
      }
    </Tabs>
  );
};

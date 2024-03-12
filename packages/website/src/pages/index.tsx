import React from 'react';
import Layout from '@theme/Layout';
import { Index } from '@site/src/components/root/index';

export default function Home(): React.JSX.Element {
  return (
    <Layout
      description="TypeScript Dependency Injection Framework"
    >
      <Index/>
    </Layout>
  );
}

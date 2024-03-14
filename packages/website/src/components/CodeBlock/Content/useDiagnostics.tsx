import React, { RefObject, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ConfigProvider, Popover, Space, theme, Typography } from 'antd';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';
import { ICodeDiagnostic } from '../types';

const {Text} = Typography;

const getTextNodeAtPosition = (root: Node, position: number) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode();
  while (node) {
    const length = node.textContent?.length || 0;
    if (offset + length >= position) {
      return {node, offset: position - offset};
    }
    offset += length;
    node = walker.nextNode();
  }
  return {node: null, offset: 0};
};

export const useDiagnostics = (diagnostics: ICodeDiagnostic[], preRef: RefObject<HTMLPreElement>): HTMLDivElement => {
  const portalRoot = useRef<HTMLDivElement>(document.createElement('div')).current;
  const tooltipRoots = useRef<Root[]>([]);
  const {colorMode} = useColorMode();

  useEffect(() => {
    tooltipRoots.current.forEach(it => it.unmount());
    tooltipRoots.current = [];

    if (diagnostics.length === 0 || !preRef.current) {
      return;
    }
    const pre = preRef.current;

    const codeBlock = pre.querySelector('code');

    if (!codeBlock) {
      return;
    }

    diagnostics.forEach((diagnostic) => {
      const lineElements = Array.from(codeBlock.querySelectorAll('.line-with-tokens'));
      const lineElement = lineElements[diagnostic.line - 1];

      const range = new Range();

      const startNode = getTextNodeAtPosition(lineElement, diagnostic.start);
      const endNode = getTextNodeAtPosition(lineElement, diagnostic.start + diagnostic.width);

      if (startNode.node && endNode.node) {
        range.setStart(startNode.node, startNode.offset);
        range.setEnd(endNode.node, endNode.offset);

        const wrapper = document.createElement('span');
        wrapper.classList.add(`diagnostic-message-text-decoration-${diagnostic.level}`);
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);

        const innerHtml = wrapper.innerHTML;

        const tooltipRootNode = document.createElement('span');
        const tooltipRoot = createRoot(tooltipRootNode);
        tooltipRoots.current.push(tooltipRoot);
        tooltipRoot.render(
          <ConfigProvider
            theme={{
              algorithm: colorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
              components: {
                Popover: {
                  colorBgElevated: 'var(--code-message-background)',
                  borderRadiusLG: 4
                }
              }
            }}
          >
            <Popover
              trigger="hover"
              placement={'right'}
              arrow={false}
              overlayClassName={styles.codeDiagnosticsPopover}
              content={(
                <div className="container">
                  <div className="row">
                    {diagnostic.message}
                  </div>

                  {diagnostic.relatedDiagnostics.map((relatedMessage, index) => {
                    return (
                      <div className="row" key={index}>
                        <a>
                          {relatedMessage.link}
                        </a>
                        <Space/>
                        :
                        {
                          relatedMessage.highlightedPrefix && (
                            <Text code>
                              {relatedMessage.highlightedPrefix}
                            </Text>
                          )
                        }

                        <Text>
                          {relatedMessage.message}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              )}
            >
              <span dangerouslySetInnerHTML={{__html: innerHtml}}/>
            </Popover>
          </ConfigProvider>
        );

        wrapper.innerHTML = '';
        wrapper.appendChild(tooltipRootNode);
      }
    });
  }, [diagnostics, preRef]);

  return portalRoot;
};

import React, { useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { LineInputProps, LineOutputProps, Token, TokenInputProps, TokenOutputProps } from 'prism-react-renderer';
import { ICodeDiagnostic } from '@site/src/components/CodeBlockWithDiagnostics/types';
import { useTimeoutFn } from 'react-use';
import { Popover, Space, Typography } from 'antd';

interface Props {
  line: Token[];
  classNames: string[] | string;
  showLineNumbers: boolean;
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
  lineDiagnostics: ICodeDiagnostic[];
}


function lineRenderer(line: Token[], getTokenProps: Props['getTokenProps']): React.ReactNode[] {
  return line.map((token, key) => (
    <span key={key} {...getTokenProps({token, key})} />
  ));
}

function mapCssToObject(style: string): Record<string, string> {
  return style.split(';').reduce((acc, it) => {
    const [key, value] = it.split(':');
    if (key && value) {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).trim();

      acc[camelCaseKey] = value.trim();
    }
    return acc;
  }, {});
}

let uniqKeyCounter = BigInt(0);

function getNextKey() {
  return (uniqKeyCounter++).toString();
}

function mapToJsxElement(element: Node, diagnostics: ICodeDiagnostic[]): React.ReactNode {
  if (element instanceof Text) {
    return element.textContent;
  }

  if (!(element instanceof Element)) {
    return null;
  }

  let foundDiagnostic: ICodeDiagnostic | undefined = undefined;

  const attributeNames = element.getAttributeNames();
  const attributes = attributeNames.reduce((acc, name) => {
    const attributeValue = element.getAttribute(name);

    if (name === 'data-codeblock-diagnostic-message') {
      foundDiagnostic = diagnostics[Number(attributeValue)];
    } else if (name === 'class') {
      acc['className'] = attributeValue;
    } else if (name === 'style') {
      acc['style'] = mapCssToObject(attributeValue);
    } else {
      acc[name] = attributeValue;
    }

    return acc;
  }, {} as Record<string, any>);

  const As = element.tagName.toLowerCase() as any;

  const elementChild = Array.from(element.childNodes).map(it => mapToJsxElement(it, diagnostics));

  if (!foundDiagnostic) {
    return (
      <As
        key={getNextKey()}
        {...attributes}
      >
        { elementChild }
      </As>
    );
  }

  const elementToWrap = (
    <As
      key={getNextKey()}
      {...attributes}
      className={clsx(attributes.className, foundDiagnostic.highlightedRangeClassName)}
    >
      { elementChild }
    </As>
  );

  if (foundDiagnostic.message) {
    return (
      <Popover
        key={getNextKey()}
        trigger="hover"
        placement={'right'}
        arrow={false}
        overlayClassName={styles.codeDiagnosticsPopover}
        content={(
          <div className="container">
            <div className="row">
              {foundDiagnostic.message}
            </div>

            {foundDiagnostic.relatedDiagnostics.map((relatedMessage, index) => {
              return (
                <div className="row" key={index}>
                  <a className={styles.codeDiagnosticsLink}>
                    {relatedMessage.link}
                  </a>
                  <Space/>
                  :
                  {
                    relatedMessage.highlightedPrefix && (
                      <Typography.Text code>
                        {relatedMessage.highlightedPrefix}
                      </Typography.Text>
                    )
                  }

                  <Typography.Text>
                    {relatedMessage.message}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        )}
      >
        {elementToWrap}
      </Popover>
    );
  }

  return elementToWrap;
}

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

export default function CodeBlockLine(props: Props) {
  const {
    line,
    classNames,
    showLineNumbers,
    getLineProps,
    getTokenProps,
    lineDiagnostics,
  } = props;
  const lineRef = React.useRef<HTMLSpanElement | null>(null);

  if (line.length === 1 && line[0].content === '\n') {
    line[0].content = '';
  }
  const lineProps = getLineProps({
    line,
    className: clsx(classNames, showLineNumbers && styles.codeLine),
  });

  const [lineTokens, setLineTokens] =
    React.useState<React.ReactNode[]>(lineRenderer(line, getTokenProps));

  const renderCallback = React.useCallback(() => {
    if (lineDiagnostics.length === 0) {
      return;
    }

    const lineElement = lineRef.current;
    if (!lineElement) {
      return;
    }

    const newJsx: React.ReactNode[] = [];

    lineDiagnostics.forEach((diagnostic, diagnosticIndex) => {
      const lineElementCopy = lineElement.cloneNode(true) as HTMLElement;
      const startNode = getTextNodeAtPosition(lineElementCopy, diagnostic.start);
      const endNode = getTextNodeAtPosition(lineElementCopy, diagnostic.start + diagnostic.width);

      if (startNode.node && endNode.node) {
        const range = new Range();

        range.setStart(startNode.node, startNode.offset);
        range.setEnd(endNode.node, endNode.offset);

        const wrapper = document.createElement('span');
        const diagnosticMessageAttribute = document.createAttribute('data-codeblock-diagnostic-message');
        diagnosticMessageAttribute.value = diagnosticIndex.toString();
        wrapper.attributes.setNamedItem(diagnosticMessageAttribute);
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);

        newJsx.push(mapToJsxElement(lineElementCopy, lineDiagnostics));
      }
    });

    setLineTokens(newJsx);
  }, [lineDiagnostics]);
  const [_, cancel, reset] = useTimeoutFn(renderCallback, 50);

  useEffect(() => {
    if (!lineRef.current) {
      return;
    }

    cancel();
    setLineTokens(lineRenderer(line, getTokenProps));
    reset();
  }, [...Object.values(props), reset, cancel]);

  return (
    <span {...lineProps}>
      {showLineNumbers ? (
        <>
          <span className={styles.codeLineNumber} />
          <span ref={lineRef} className={clsx(styles.codeLineContent, 'line-with-tokens')}>{lineTokens}</span>
        </>
      ) : (
        <span ref={lineRef} className="line-with-tokens">
          {lineTokens}
        </span>
      )}
      <br />
    </span>
  );
}

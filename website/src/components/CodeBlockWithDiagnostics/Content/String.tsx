import React from 'react';
import clsx from 'clsx';
import { usePrismTheme, useThemeConfig } from '@docusaurus/theme-common';
import { containsLineNumbers, parseCodeBlockTitle, parseLanguage, parseLines, useCodeWordWrap, } from '@docusaurus/theme-common/internal';
import { Highlight } from 'prism-react-renderer';
import Line from '../Line/index';
import CopyButton from '../CopyButton';
import WordWrapButton from '../WordWrapButton';
import Container from '../Container/index';
import styles from './styles.module.css';
import { CodeBlockProps } from '../types';

// Prism languages are always lowercase
// We want to fail-safe and allow both "php" and "PHP"
// See https://github.com/facebook/docusaurus/issues/9012
function normalizeLanguage(language) {
  return language?.toLowerCase();
}

interface Props extends CodeBlockProps {
  children: string;
}

export default function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
  diagnostics = [],
}: Props) {
  const {
    prism: {defaultLanguage, magicComments},
  } = useThemeConfig();
  const language = normalizeLanguage(
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage,
  );
  const prismTheme = usePrismTheme();
  const wordWrap = useCodeWordWrap();
  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp;
  const {lineClassNames, code} = parseLines(children, {
    metastring,
    language,
    magicComments,
  });
  const showLineNumbers = showLineNumbersProp ?? containsLineNumbers(metastring);
  return (
    <Container
      as="div"
      className={clsx(
        blockClassName,
        language &&
        !blockClassName.includes(`language-${language}`) &&
        `language-${language}`,
      )}>
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <div className={styles.codeBlockContent}>
        <Highlight theme={prismTheme} code={code} language={language ?? 'text'}>
          {({className, style, tokens, getLineProps, getTokenProps}) => (
            <pre
              tabIndex={0}
              ref={wordWrap.codeBlockRef}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              style={style}
            >
              <code
                className={clsx(
                  styles.codeBlockLines,
                  showLineNumbers && styles.codeBlockLinesWithNumbering,
                )}>
                {tokens.map((line, i) => (
                  <Line
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    classNames={lineClassNames[i]}
                    showLineNumbers={showLineNumbers}
                    lineDiagnostics={diagnostics.filter(it => it.line === i + 1)}
                  />
                ))}
              </code>
            </pre>
          )}
        </Highlight>
        <div className={styles.buttonGroup}>
          {(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
            <WordWrapButton
              className={styles.codeButton}
              onClick={() => wordWrap.toggle()}
              isEnabled={wordWrap.isEnabled}
            />
          )}
          <CopyButton className={styles.codeButton} code={code}/>
        </div>
      </div>
    </Container>
  );
}

import React from 'react';
import { Highlight, ICodeMessage } from './types';
import { CodePreviewHighlightLine } from './styles';
import { Popover, Typography } from 'antd';
import styles from './styles.module.css';
import classNames from 'classnames';

interface Props {
  $parentContainerRef: React.RefObject<HTMLDivElement | null>;
  message: ICodeMessage;
}

export const CodeMessage: React.FC<Props> = ({$parentContainerRef, message}) => {
  const [highlight, setHighlight] = React.useState<Highlight | null>(null);

  React.useEffect(() => {
    const parentContainer = $parentContainerRef.current;
    if (parentContainer === null) {
      return;
    }

    const lineToHighlight = parentContainer.querySelector(`code .token-line:nth-child(${message.line})`) ?? null;

    if (lineToHighlight === null) {
      return;
    }

    const lineToHighlightRect = lineToHighlight.getBoundingClientRect();
    const parentContainerRect = parentContainer.getBoundingClientRect();
    const top = lineToHighlightRect.top - parentContainerRect.top;

    const textContent = lineToHighlight.textContent;
    const letterWidth = lineToHighlightRect.width / (textContent.length || 1);

    const left = lineToHighlightRect.left - parentContainerRect.left + message.start * letterWidth;
    const width = message.width * letterWidth;
    const height = lineToHighlightRect.height;
    setHighlight({top, left, width, height, level: message.level});
  }, [$parentContainerRef, message]);

  return (

    <Popover
      trigger="hover"
      placement={'right'}
      arrow={false}
      overlayClassName={styles.codeMessagePopover}
      content={(
        message.message
      )}
    >
      <CodePreviewHighlightLine
        $highlight={highlight ?? {level: 'info', top: 0, left: 0, width: 0, height: 0}}
      />
    </Popover>
  );
};

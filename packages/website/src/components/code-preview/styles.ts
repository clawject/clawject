import styled from 'styled-components';
import { Highlight } from './types';


export const CodePreviewContainer = styled.div`
  position: relative;
`;

export const MessagePopover = styled.div`
  padding: 12px 16px;
  width: 500px;
  max-height: 400px;
  overflow-y: auto;

  font-size: var(--ifm-code-font-size);
  font-family: var(--ifm-font-family-monospace);
  color: var(--code-message-text-color);
  border: 1px solid var(--code-message-border);
  border-radius: var(--ifm-code-border-radius);
  background-color: var(--code-message-background);
  box-shadow: 0 2px 24px -6px rgba(0,0,0,0.51);
`;


export const CodePreviewHighlightLine = styled.div<{ $highlight: Highlight }>`
  position: absolute;
  width: ${props => props.$highlight.width}px;
  height: ${props => props.$highlight.height + 2}px;
  top: ${props => props.$highlight.top}px;
  left: ${props => props.$highlight.left}px;
  border-bottom: 1.5px solid;
  border-color: ${props => {
    switch (props.$highlight.level) {
    case 'info':
      return 'blue';
    case 'warning':
      return 'orange';
    case 'error':
      return 'red';
    }
  }};
`;

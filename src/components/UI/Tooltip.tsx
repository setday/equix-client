import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  children: React.ReactElement;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div<{
  $position: 'top' | 'right' | 'bottom' | 'left';
  $visible: boolean;
  $maxWidth: string;
}>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  max-width: ${({ $maxWidth }) => $maxWidth};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  box-shadow: ${({ theme }) => theme.shadows.md};
  pointer-events: none;
  white-space: nowrap;
  animation: ${fadeIn} 0.2s ease-in-out;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  
  ${({ $position }) => {
    switch ($position) {
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 8px;
        `;
      case 'top':
      default:
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
        `;
    }
  }}
  
  &::after {
    content: '';
    position: absolute;
    border-style: solid;
    
    ${({ $position }) => {
      switch ($position) {
        case 'right':
          return `
            left: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 5px 5px 5px 0;
            border-color: transparent ${({ theme }) => theme.colors.background.secondary} transparent transparent;
          `;
        case 'bottom':
          return `
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 5px 5px 5px;
            border-color: transparent transparent ${({ theme }) => theme.colors.background.secondary} transparent;
          `;
        case 'left':
          return `
            right: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 5px 0 5px 5px;
            border-color: transparent transparent transparent ${({ theme }) => theme.colors.background.secondary};
          `;
        case 'top':
        default:
          return `
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 5px 0 5px;
            border-color: ${({ theme }) => theme.colors.background.secondary} transparent transparent transparent;
          `;
      }
    }}
  }
`;

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 300,
  maxWidth = '200px',
  children
}) => {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setVisible(false);
  };

  return (
    <TooltipWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <TooltipContent 
        $position={position} 
        $visible={visible} 
        $maxWidth={maxWidth}
      >
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
};

export default Tooltip;

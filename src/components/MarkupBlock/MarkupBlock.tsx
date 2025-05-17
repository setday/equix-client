import React, { useState } from 'react';
import styled from 'styled-components';
import { BoundingBox } from '../../types';
import { MoreHorizontal, Copy, Download, Edit, Search, Table, Image, FileText, Code } from 'react-feather';
import IconButton from '../UI/IconButton';
import Tooltip from '../UI/Tooltip';

interface MarkupBlockProps {
  blockType: string;
  boundingBox: BoundingBox;
  onContextAction?: (action: string, blockType: string) => void;
}

interface ContextAction {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const StyledMarkupBlock = styled.div<{ blockType: string; boundingBox: BoundingBox }>`
  position: absolute;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px dashed;
  opacity: 0.6;
  pointer-events: all;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  top: ${({ boundingBox }) => boundingBox.y * 100}%;
  left: ${({ boundingBox }) => boundingBox.x * 100}%;
  width: ${({ boundingBox }) => boundingBox.width * 100}%;
  height: ${({ boundingBox }) => boundingBox.height * 100}%;
  
  ${({ blockType }) => {
    switch (blockType) {
      case 'text':
        return `
          border-color: rgba(24, 144, 255, 0.5);
          background-color: rgba(24, 144, 255, 0.05);
        `;
      case 'table':
        return `
          border-color: rgba(247, 37, 133, 0.5);
          background-color: rgba(247, 37, 133, 0.05);
        `;
      case 'figure':
        return `
          border-color: rgba(82, 196, 26, 0.5);
          background-color: rgba(82, 196, 26, 0.05);
        `;
      case 'title':
        return `
          border-color: rgba(250, 173, 20, 0.5);
          background-color: rgba(250, 173, 20, 0.05);
        `;
      default:
        return `
          border-color: rgba(144, 144, 144, 0.5);
          background-color: rgba(144, 144, 144, 0.05);
        `;
    }
  }}
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.005);
  }
`;

const ContextButtonContainer = styled.div`
  position: absolute;
  top: -14px;
  left: -14px;
  z-index: 5;
  transition: opacity 0.2s;
  opacity: 0;
  
  ${StyledMarkupBlock}:hover & {
    opacity: 1;
  }
`;

const ContextActionsContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 120px;
  z-index: 10;
`;

const ContextActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.highlight};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ContextButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  width: 28px;
  height: 28px;
  padding: 4px;
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const MarkupBlock: React.FC<MarkupBlockProps> = ({ blockType, boundingBox, onContextAction }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  
  // Define context actions based on block type
  const getContextActions = (): ContextAction[] => {
    const commonActions = [
      { id: 'copy', icon: <Copy size={16} />, label: 'Copy content' },
    ];
    
    switch (blockType) {
      case 'text':
        return [
          ...commonActions,
          { id: 'search', icon: <Search size={16} />, label: 'Search in text' },
          { id: 'annotate', icon: <Edit size={16} />, label: 'Add annotation' }
        ];
      case 'table':
        return [
          ...commonActions,
          { id: 'extract', icon: <Table size={16} />, label: 'Extract table' },
          { id: 'download', icon: <Download size={16} />, label: 'Download as CSV' }
        ];
      case 'figure':
        return [
          ...commonActions,
          { id: 'save', icon: <Image size={16} />, label: 'Save image' },
          { id: 'analyze', icon: <Search size={16} />, label: 'Analyze image' }
        ];
      case 'title':
        return [
          ...commonActions,
          { id: 'bookmark', icon: <FileText size={16} />, label: 'Add bookmark' },
        ];
      default:
        return [
          ...commonActions,
          { id: 'identify', icon: <Code size={16} />, label: 'Identify content' }
        ];
    }
  };

  const handleContextButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(prev => !prev);
  };

  const handleActionClick = (actionId: string) => {
    if (onContextAction) {
      onContextAction(actionId, blockType);
    }
    setShowContextMenu(false);
  };

  const handleOutsideClick = () => {
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  };

  React.useEffect(() => {
    if (showContextMenu) {
      document.addEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showContextMenu]);

  return (
    <StyledMarkupBlock blockType={blockType} boundingBox={boundingBox}>
      <ContextButtonContainer>
        <Tooltip content={`${blockType.charAt(0).toUpperCase() + blockType.slice(1)} block options`}>
          <ContextButton 
            variant="text" 
            onClick={handleContextButtonClick}
            aria-label="Context menu"
          >
            <MoreHorizontal size={16} />
          </ContextButton>
        </Tooltip>
        
        <ContextActionsContainer isVisible={showContextMenu}>
          {getContextActions().map(action => (
            <ContextActionButton
              key={action.id}
              onClick={() => handleActionClick(action.id)}
            >
              {action.icon}
              {action.label}
            </ContextActionButton>
          ))}
        </ContextActionsContainer>
      </ContextButtonContainer>
    </StyledMarkupBlock>
  );
};

export default MarkupBlock;

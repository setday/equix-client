import React, { useState } from "react";
import styled from "styled-components";
import { BoundingBox, LayoutBlockType } from "../../types";
import {
  MoreHorizontal,
  Copy,
  Search,
  Table,
  Image,
  FileText,
  Code,
} from "react-feather";
import IconButton from "../UI/IconButton";
import Tooltip from "../UI/Tooltip";

interface MarkupBlockProps {
  $blockType: LayoutBlockType;
  $boundingBox: BoundingBox;
  onContextAction?: (action: string, blockType: string) => void;
}

interface ContextAction {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const StyledMarkupBlock = styled.div<{
  $blockType: LayoutBlockType;
  $boundingBox: BoundingBox;
}>`
  position: absolute;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px dashed;
  opacity: 0.6;
  pointer-events: all;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s;
  top: ${({ $boundingBox }) => $boundingBox.y * 100}%;
  left: ${({ $boundingBox }) => $boundingBox.x * 100}%;
  width: ${({ $boundingBox }) => $boundingBox.width * 100}%;
  height: ${({ $boundingBox }) => $boundingBox.height * 100}%;
  z-index: 2;

  ${({ $blockType }) => {
    switch ($blockType) {
      case LayoutBlockType.TEXT:
        return `
          border-color: rgba(24, 144, 255, 0.5);
          background-color: rgba(24, 144, 255, 0.05);
        `;
      case LayoutBlockType.TABLE:
        return `
          border-color: rgba(247, 37, 133, 0.5);
          background-color: rgba(247, 37, 133, 0.05);
        `;
      case LayoutBlockType.PICTURE:
        return `
          border-color: rgba(82, 196, 26, 0.5);
          background-color: rgba(82, 196, 26, 0.05);
        `;
      case LayoutBlockType.CAPTION:
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
    opacity: 1;
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

const ContextActionsContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 200px;
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
  line-height: 1.2;

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

const MarkupBlock: React.FC<MarkupBlockProps> = ({
  $blockType,
  $boundingBox,
  onContextAction,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const getContextActions = (): ContextAction[] => {
    switch ($blockType) {
      case LayoutBlockType.TEXT:
        return [
          { id: "copy", icon: <Copy />, label: "Copy content" },
          { id: "ask", icon: <Search />, label: "Ask about text" },
        ];
      case LayoutBlockType.TABLE:
        return [
          {
            id: "extract_md",
            icon: <Table />,
            label: "Extract as MD",
          },
          {
            id: "extract_csv",
            icon: <FileText />,
            label: "Extract as CSV",
          },
          {
            id: "extract_image",
            icon: <Image />,
            label: "Extract image",
          },
          // { id: "edit", icon: <Edit />, label: "Edit table" },
          { id: "ask", icon: <Search />, label: "Ask about table" },
        ];
      case LayoutBlockType.PICTURE:
        return [
          {
            id: "save_image",
            icon: <Image />,
            label: "Save image",
          },
          { id: "ask", icon: <Search />, label: "Ask about image" },
        ];
      case LayoutBlockType.CHART:
        return [
          {
            id: "extract_code",
            icon: <Code />,
            label: "Extract data as code",
          },
          { id: "ask", icon: <Search />, label: "Ask about chart" },
        ];
      case LayoutBlockType.FORMULA:
        return [
          {
            id: "copy",
            icon: <Copy />,
            label: "Copy formula as latex",
          },
          { id: "ask", icon: <Search />, label: "Ask about formula" },
        ];
      default:
        return [];
    }
  };

  const handleContextButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu((prev) => !prev);
  };

  const handleActionClick = (actionId: string) => {
    if (onContextAction) {
      onContextAction(actionId, $blockType);
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
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showContextMenu]);

  return (
    <>
      <StyledMarkupBlock $blockType={$blockType} $boundingBox={$boundingBox}>
        <ContextButtonContainer>
          <Tooltip content={`${$blockType.toLowerCase()} block options`}>
            <ContextButton
              $variant="text"
              onClick={handleContextButtonClick}
              aria-label="Context menu"
            >
              <MoreHorizontal size={16} />
            </ContextButton>
          </Tooltip>

          <ContextActionsContainer $isVisible={showContextMenu}>
            {getContextActions().map((action) => (
              <ContextActionButton
                key={action.id}
                onClick={() => {
                  handleActionClick(action.id);
                }}
              >
                {action.icon}
                {action.label}
              </ContextActionButton>
            ))}
          </ContextActionsContainer>
        </ContextButtonContainer>
      </StyledMarkupBlock>
    </>
  );
};

export default MarkupBlock;

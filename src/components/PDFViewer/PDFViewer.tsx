import React from "react";
import styled from "styled-components";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { DocumentLayout, LayoutBlock, LayoutBlockType } from "../../types";
import { Upload } from "react-feather";
import Button from "../UI/Button";
import { layoutPlugin } from "../../plugins/PDFViewerLayoutPlugin";
import MarkupBlock from "../MarkupBlock/MarkupBlock";
import { useNotification } from "../../hooks/notification/NotificationContext";
import { ChatMessage } from "../../types";
import { documentService } from "../../api";
import { v4 as uuidv4 } from "uuid";

/**
 * Extracts an image of a specific region from the PDF canvas
 * @param block - The layout block containing position and dimensions
 * @param pageIndex - The page index (0-based)
 * @returns Promise<string | null> - Base64 encoded image data or null if extraction fails
 */
const extractBlockImage = async (
  block: LayoutBlock,
  pageIndex: number,
): Promise<string | null> => {
  try {
    const pageSelectors = [
      `[data-page-number="${pageIndex + 1}"]`,
      `.rpv-core__page[data-page-index="${pageIndex}"]`,
      `.rpv-core__page-layer[data-page-index="${pageIndex}"]`,
      `.page-${pageIndex + 1}`,
      `.react-pdf__Page[data-page-number="${pageIndex + 1}"]`,
      `.rpv-core__inner-pages .rpv-core__inner-page:nth-child(${pageIndex + 1})`,
      `.rpv-core__inner-page[data-testid="core__page-layer-${pageIndex}"]`,
    ];

    let pageElement: HTMLElement | null = null;
    let canvas: HTMLCanvasElement | null = null;

    for (const selector of pageSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        pageElement = elements[0] as HTMLElement;
        canvas = pageElement.querySelector("canvas") as HTMLCanvasElement;
        if (canvas) {
          break;
        }
      }
    }

    if (!canvas) {
      const allCanvases = document.querySelectorAll("canvas");
      if (allCanvases.length > pageIndex && pageIndex >= 0) {
        canvas = allCanvases[pageIndex] as HTMLCanvasElement;
      } else {
        if (allCanvases.length > 0) {
          canvas = allCanvases[0] as HTMLCanvasElement;
        }
      }
    }

    if (!canvas) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allCanvases = document.querySelectorAll("canvas");

      if (allCanvases.length > 0) {
        canvas = allCanvases[0] as HTMLCanvasElement;
      } else {
        return null;
      }
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Could not get canvas context");
      return null;
    }

    const x = block.bounding_box.x * canvas.width;
    const y = block.bounding_box.y * canvas.height;
    const width = block.bounding_box.width * canvas.width;
    const height = block.bounding_box.height * canvas.height;

    if (
      x < 0 ||
      y < 0 ||
      width <= 0 ||
      height <= 0 ||
      x + width > canvas.width ||
      y + height > canvas.height
    ) {
      console.warn("Invalid coordinates for extraction:", {
        x,
        y,
        width,
        height,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      });
    }

    const extractCanvas = document.createElement("canvas");
    extractCanvas.width = Math.max(1, width);
    extractCanvas.height = Math.max(1, height);
    const extractCtx = extractCanvas.getContext("2d");

    if (!extractCtx) {
      return null;
    }

    try {
      extractCtx.drawImage(
        canvas,
        Math.max(0, x),
        Math.max(0, y),
        Math.max(1, width),
        Math.max(1, height),
        0,
        0,
        Math.max(1, width),
        Math.max(1, height),
      );

      const dataURL = extractCanvas.toDataURL("image/png");
      return dataURL;
    } catch (drawError) {
      console.error("Error drawing image extract:", drawError);

      const fallbackWidth = Math.min(200, canvas.width);
      const fallbackHeight = Math.min(150, canvas.height);
      const fallbackX = (canvas.width - fallbackWidth) / 2;
      const fallbackY = (canvas.height - fallbackHeight) / 2;

      extractCanvas.width = fallbackWidth;
      extractCanvas.height = fallbackHeight;

      try {
        extractCtx.drawImage(
          canvas,
          fallbackX,
          fallbackY,
          fallbackWidth,
          fallbackHeight,
          0,
          0,
          fallbackWidth,
          fallbackHeight,
        );
        const fallbackDataURL = extractCanvas.toDataURL("image/png");
        return fallbackDataURL;
      } catch (fallbackError) {
        console.error("Fallback extraction also failed:", fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error("Error extracting block image:", error);
    return null;
  }
};

interface PDFViewerProps {
  file: File | null;
  documentLayout: DocumentLayout | null;
  isLoading?: boolean;
  onCancel?: () => void;
  onAddMessage?: (message: Partial<ChatMessage>) => void;
}

const PDFContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%; /* Center vertically */
  margin: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};

  svg {
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    max-width: 400px;
  }
`;

const ViewerWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  .rpv-core__viewer {
    width: 100%;
    height: 100%;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(26, 30, 39, 0.85);
  z-index: 10;
  backdrop-filter: blur(3px);
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(67, 97, 238, 0.3);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary.main};
  animation: spin 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

/**
 * Component for rendering PDF with layout overlays
 */
const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  documentLayout,
  isLoading = false,
  onCancel,
  onAddMessage,
}): JSX.Element => {
  const { showNotification, showSuccess } = useNotification();

  const handleContextAction = async (
    action: string,
    blockType: string,
    block: LayoutBlock,
  ) => {
    if (!onAddMessage || !file) {
      showNotification("error", "Unable to perform action");
      return;
    }

    const fileName = file.name.replace(".pdf", "");
    const pageIndex = block.page_number <= 0 ? 0 : block.page_number - 1;

    const blockImage = await extractBlockImage(block, pageIndex);

    if (action === "extract_image" || action === "save_image") {
      if (blockImage) {
        const link = document.createElement("a");
        link.href = blockImage;
        link.download = `${fileName}-block-${block.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess(`${blockType} image saved successfully`);
      } else {
        showNotification("error", "Could not extract image from block");
      }
      return;
    }

    if (action === "ask") {
      onAddMessage({
        type: "ask_prompt",
        markupInfo: {
          blockType: blockType as LayoutBlockType,
          action: action,
          blockId: block.id,
          format: "text",
          imageData: blockImage || undefined,
        },
      });
      return;
    }

    const actionDescription = getActionDescription(action, blockType);
    const messageId = uuidv4();

    const initialMessage: Partial<ChatMessage> = {
      id: messageId,
      text: actionDescription,
      response: "",
      timestamp: new Date(),
      isLoading: true,
      type: "markup_action",
      markupInfo: {
        blockType: blockType as LayoutBlockType,
        action: action,
        blockId: block.id,
        format: getFormatFromAction(action),
        imageData: blockImage || undefined,
      },
    };

    onAddMessage(initialMessage);

    try {
      let response = "";

      switch (action) {
        case "copy":
          if (block.text_content) {
            await navigator.clipboard.writeText(block.text_content);
            response = "Content copied to clipboard successfully.";
            showSuccess("Content copied to clipboard");
          } else {
            response = "No text content available to copy.";
          }
          break;

        case "extract_md":
        case "extract_csv":
        case "extract_code":
          const format = action.includes("md")
            ? "md"
            : action.includes("csv")
              ? "csv"
              : action.includes("code")
                ? "code"
                : "text";
          const extractionResult = await documentService.extractGraphics(
            fileName,
            block.id,
            format,
          );
          response = extractionResult.text || "No content extracted.";
          showSuccess(`${blockType} extracted successfully`);
          break;

        default:
          response = `${action} action completed for ${blockType} block.`;
          showNotification(
            "info",
            `${action} action triggered on ${blockType} block`,
          );
      }

      onAddMessage({
        id: messageId,
        text: actionDescription,
        response: response,
        timestamp: new Date(),
        isLoading: false,
        type: "markup_action",
        markupInfo: {
          blockType: blockType as LayoutBlockType,
          action: action,
          blockId: block.id,
          format: getFormatFromAction(action),
          imageData: blockImage || undefined,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      onAddMessage({
        id: messageId,
        text: actionDescription,
        response: `Failed to ${action}: ${errorMessage}`,
        timestamp: new Date(),
        isLoading: false,
        error: errorMessage,
        type: "markup_action",
        markupInfo: {
          blockType: blockType as LayoutBlockType,
          action: action,
          blockId: block.id,
          format: getFormatFromAction(action),
          imageData: blockImage || undefined,
        },
      });

      showNotification("error", `Failed to ${action}: ${errorMessage}`);
    }
  };

  const getActionDescription = (action: string, blockType: string): string => {
    switch (action) {
      case "copy":
        return `Copy ${blockType} content`;
      case "extract_md":
        return `Extract ${blockType} as Markdown`;
      case "extract_csv":
        return `Extract ${blockType} as CSV`;
      case "extract_code":
        return `Extract ${blockType} data as code`;
      case "extract_image":
        return `Extract ${blockType} image`;
      case "ask":
        return `Ask about ${blockType}`;
      default:
        return `${action} on ${blockType}`;
    }
  };

  const getFormatFromAction = (action: string): string => {
    if (action.includes("md")) return "md";
    if (action.includes("code")) return "code";
    if (action.includes("csv")) return "text";
    return "text";
  };

  if (!file) {
    return (
      <PDFContainer>
        <PlaceholderContainer>
          <Upload size={64} />
          <h3>No PDF Document Loaded</h3>
          <p>
            Drag and drop a PDF file here or use the upload button in the header
            to analyze a scientific document.
          </p>
        </PlaceholderContainer>
      </PDFContainer>
    );
  }

  const AllowedBlockTypes = [
    LayoutBlockType.TABLE,
    LayoutBlockType.PICTURE,
    LayoutBlockType.CHART,
    LayoutBlockType.FORMULA,
  ];

  const layoutPluginInstance = layoutPlugin({
    layout: documentLayout,
    renderLayoutBlock: (block) => {
      if (!AllowedBlockTypes.includes(block.block_type)) {
        return null;
      }

      return (
        <MarkupBlock
          key={block.id}
          $blockType={block.block_type}
          $boundingBox={block.bounding_box}
          onContextAction={(action, blockType) =>
            handleContextAction(action, blockType, block)
          }
        />
      );
    },
  });

  return (
    <PDFContainer>
      <ViewerWrapper>
        <Viewer
          fileUrl={URL.createObjectURL(file)}
          plugins={[layoutPluginInstance]}
        />

        {isLoading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Analyzing document structure...</LoadingText>
            {onCancel && (
              <Button $variant="outlined" onClick={onCancel}>
                Cancel Analysis
              </Button>
            )}
          </LoadingOverlay>
        )}
      </ViewerWrapper>
    </PDFContainer>
  );
};

export default React.memo(PDFViewer);

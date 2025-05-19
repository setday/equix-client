import React from "react";
import styled from 'styled-components';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { DocumentLayout, LayoutBlock } from "../../types";
import { Upload } from 'react-feather';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { layoutPlugin } from "../../plugins/PDFViewerLayoutPlugin";
import MarkupBlock from '../MarkupBlock/MarkupBlock';
import { useNotification } from "../../contexts/NotificationContext";

interface PDFViewerProps {
  file: File | null;
  documentLayout: DocumentLayout | null;
  isLoading?: boolean;
  onCancel?: () => void;
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

const PlaceholderContainer = styled(Card)`
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
    to { transform: rotate(360deg); }
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
  onCancel
}): JSX.Element => {
  const { showNotification, showSuccess } = useNotification();
  
  // Handle context menu actions from MarkupBlock
  const handleContextAction = (action: string, blockType: string, block: LayoutBlock) => {
    console.log(`Action ${action} on ${blockType} block`, block);
    
    switch (action) {
      case 'copy':
        if (block.text_content) {
          navigator.clipboard.writeText(block.text_content)
            .then(() => {
              showSuccess('Content copied to clipboard');
            })
            .catch((err) => {
              console.error('Failed to copy content:', err);
              showNotification('error', 'Failed to copy content');
            });
        }
        break;
      case 'extract':
        showNotification('info', `Extracting ${blockType} content...`);
        // Additional logic to extract table would go here
        break;
      case 'search':
        showNotification('info', `Searching in ${blockType} content...`);
        // Additional logic for search would go here
        break;
      case 'save':
        showNotification('info', `Saving ${blockType} content...`);
        // Additional logic for saving would go here
        break;
      case 'annotate':
      case 'bookmark':
        showNotification('info', `Adding annotation to ${blockType}...`);
        // Additional logic for annotation would go here
        break;
      default:
        showNotification('info', `${action} action triggered on ${blockType} block`);
    }
  };
  if (!file) {
    return (
      <PDFContainer>
        <PlaceholderContainer $elevation={0}>
          <Upload size={64} />
          <h3>No PDF Document Loaded</h3>
          <p>
            Drag and drop a PDF file here or use the upload button in the header to analyze a scientific document.
          </p>
        </PlaceholderContainer>
      </PDFContainer>
    );
  }
  const layoutPluginInstance = layoutPlugin({
    layout: documentLayout,
    layoutInteraction: (block) => {
      // Handle block interaction if needed
      console.log('Block clicked:', block);
    },
    renderLayoutBlock: (block) => {
      return (
        <MarkupBlock 
          key={block.id} 
          $blockType={block.block_type} 
          $boundingBox={block.bounding_box} 
          onContextAction={(action, blockType) => handleContextAction(action, blockType, block)}
        />
      );
    },
  });


  return (
    <PDFContainer>
      <ViewerWrapper>
        <Viewer
          fileUrl={URL.createObjectURL(file)}
          // plugins={[layoutPluginInstance]}
        />
          
        {isLoading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Analyzing document structure...</LoadingText>
            {onCancel && (
              <Button 
                $variant="outlined"
                onClick={onCancel}
              >
                Cancel Analysis
              </Button>
            )}
          </LoadingOverlay>
        )}
      </ViewerWrapper>
    </PDFContainer>
  );
};

export default PDFViewer;

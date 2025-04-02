import React, { useState } from "react";
import styled from 'styled-components';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { DocumentLayout } from "../../types";
import { Upload } from 'react-feather';
import Card from '../UI/Card';
import Button from '../UI/Button';

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

const MarkupOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
`;

const MarkupBlock = styled.div<{ blockType: string }>`
  position: absolute;
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  border: 1.5px solid;
  opacity: 0.6;
  pointer-events: all;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  
  ${({ blockType, theme }) => {
    switch (blockType) {
      case 'text':
        return `
          border-color: ${theme.colors.info};
          background-color: rgba(24, 144, 255, 0.1);
        `;
      case 'table':
        return `
          border-color: ${theme.colors.secondary.main};
          background-color: rgba(247, 37, 133, 0.1);
        `;
      case 'figure':
        return `
          border-color: ${theme.colors.success};
          background-color: rgba(82, 196, 26, 0.1);
        `;
      case 'title':
        return `
          border-color: ${theme.colors.warning};
          background-color: rgba(250, 173, 20, 0.1);
        `;
      default:
        return `
          border-color: ${theme.colors.neutral[500]};
          background-color: rgba(144, 144, 144, 0.1);
        `;
    }
  }}
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.005);
  }
`;

const InfoFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  z-index: 6;
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
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Get blocks for the current page
  const currentPageBlocks = documentLayout?.blocks.filter(
    block => block.pageNumber === currentPage
  ) || [];

  const handleDocumentLoad = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (!file) {
    return (
      <PDFContainer>
        <PlaceholderContainer elevation={0}>
          <Upload size={64} />
          <h3>No PDF Document Loaded</h3>
          <p>
            Drag and drop a PDF file here or use the upload button in the header to analyze a scientific document.
          </p>
        </PlaceholderContainer>
      </PDFContainer>
    );
  }

  return (
    <PDFContainer>
      <ViewerWrapper>
        <Viewer 
        fileUrl={URL.createObjectURL(file)}
        // onDocumentLoad={handleDocumentLoad}
        // onPageChange={handlePageChange}
        />
          
        {isLoading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Analyzing document structure...</LoadingText>
            {onCancel && (
              <Button 
                variant="outlined"
                onClick={onCancel}
              >
                Cancel Analysis
              </Button>
            )}
          </LoadingOverlay>
        )}
        
        {documentLayout && !isLoading && (
          <MarkupOverlay>
            {currentPageBlocks.map((block) => (
              <MarkupBlock 
                key={block.id} 
                blockType={block.type}
                style={{ 
                  top: `${block.boundingBox.y}px`,
                  left: `${block.boundingBox.x}px`,
                  width: `${block.boundingBox.width}px`,
                  height: `${block.boundingBox.height}px`,
                  ...(block.style || {})
                }}
                title={`${block.type}: ${block.content.substring(0, 50)}${block.content.length > 50 ? '...' : ''}`}
              />
            ))}
          </MarkupOverlay>
        )}
        
        {documentLayout && !isLoading && (
          <InfoFooter>
            <span>Page {currentPage} of {numPages}</span>
            <span>{currentPageBlocks.length} detected elements on this page</span>
          </InfoFooter>
        )}
      </ViewerWrapper>
    </PDFContainer>
  );
};

export default PDFViewer;

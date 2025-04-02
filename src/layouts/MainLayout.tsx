import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { ChevronRight, ChevronLeft, UploadCloud, MessageCircle } from 'react-feather';
import PDFViewerContainer from "../containers/PDFViewerContainer";
import ChatContainer from "../containers/ChatContainer";
import { useFileDropHandler } from "../hooks/useFileDropHandler";
import AppHeader from "../components/AppHeader/AppHeader";
import { usePDFFileStore } from "../stores/pdfFileStore";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const LeftPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: ${({ theme }) => theme.spacing.md};
  margin-right: 0;
`;

const RightPanel = styled.div<{ isVisible: boolean }>`
  width: ${({ isVisible }) => (isVisible ? '380px' : '0')};
  transition: width ${({ theme }) => theme.transitions.default};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ToggleChatButton = styled.button<{ isVisible: boolean }>`
  position: absolute;
  right: ${({ isVisible }) => (isVisible ? '380px' : '0px')};
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.background.tertiary || theme.colors.background.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm} 0 0 ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: right ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.fast};
  z-index: 100;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${({ isDragActive }) => (isDragActive ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(26, 30, 39, 0.9);
  z-index: 1000;
  pointer-events: none;
  border: 3px dashed ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h2 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    max-width: 400px;
  }
`;

const FileInputLabel = styled.label`
  display: none;
`;

const FileInput = styled.input`
  display: none;
`;

/**
 * Main layout component that handles the application structure
 */
const MainLayout: React.FC = (): JSX.Element => {
  const [chatVisible, setChatVisible] = useState<boolean>(true);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const { fileDropHandler } = useFileDropHandler();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setPDFFile } = usePDFFileStore();
  
  useEffect(() => {
    // Set up the file drop handler and return unsubscribe function for cleanup
    let cleanupFn: () => void = () => {};
    
    fileDropHandler()
      .then(unlisten => {
        cleanupFn = () => {
          unlisten();
        };
      })
      .catch(error => {
        console.error("Failed to set up file drop handler:", error);
      });
    
    // Set up drag enter/leave handling
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target === document.documentElement) {
        setIsDragActive(false);
      }
    };
    
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    });
    
    // Return cleanup function
    return () => {
      cleanupFn();
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', (e) => e.preventDefault());
      document.removeEventListener('drop', (e) => e.preventDefault());
    };
  }, [fileDropHandler]);

  const toggleChat = (): void => setChatVisible(prev => !prev);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setPDFFile(file);
      }
    }
    
    // Reset input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <AppContainer>
      <AppHeader onUploadClick={triggerFileInput} />
      
      <MainContent>
        <LeftPanel>
          <PDFViewerContainer />
        </LeftPanel>
        
        <ToggleChatButton 
          onClick={toggleChat}
          isVisible={chatVisible}
          aria-label={chatVisible ? "Hide chat" : "Show chat"}
          title={chatVisible ? "Hide chat" : "Show chat"}
        >
          <MessageCircle size={16} />
          {chatVisible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </ToggleChatButton>
        
        <RightPanel isVisible={chatVisible}>
          <ChatContainer />
        </RightPanel>
        
        <DropZone isDragActive={isDragActive}>
          <UploadCloud size={64} />
          <h2>Drop PDF File to Analyze</h2>
          <p>Release your file here to begin analysis</p>
        </DropZone>
        
        <FileInputLabel htmlFor="pdf-upload">Upload PDF</FileInputLabel>
        <FileInput 
          id="pdf-upload"
          ref={fileInputRef}
          type="file" 
          accept="application/pdf"
          onChange={handleFileUpload}
        />
      </MainContent>
    </AppContainer>
  );
};

export default MainLayout;

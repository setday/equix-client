import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useApi } from "../../hooks/useApi";
import { ChatMessage } from "../../types";
import { Send, MessageCircle } from 'react-feather';
import Card from '../UI/Card';
import IconButton from '../UI/IconButton';

interface ChatProps {
  pdfFile: File | null;
  fileName?: string;
  onClearMessages?: ((clearMessages: () => void) => void) | null;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  justify-content: center; /* Center the title horizontally */
`;

const ChatTitle = styled.h3`
  margin: 0;
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyChatMessage = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: auto;
  text-align: center;
  max-width: 80%;
  
  svg {
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h4 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
`;

const MessageItem = styled.div<{ isError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ isError, theme }) => isError && `
    .message-response {
      border-color: ${theme.colors.error};
      background-color: rgba(255, 77, 79, 0.1);
    }
  `}
`;

const UserMessage = styled(Card)`
  align-self: flex-end;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border-radius: ${({ theme }) => theme.borderRadius.md} 
                ${({ theme }) => theme.borderRadius.md} 
                0 
                ${({ theme }) => theme.borderRadius.md};
  max-width: 80%;
  word-break: break-word;
`;

const BotMessage = styled(Card)<{ isLoading?: boolean }>`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md} 
                ${({ theme }) => theme.borderRadius.md} 
                ${({ theme }) => theme.borderRadius.md} 
                0;
  max-width: 85%;
  word-break: break-word;
  
  ${({ isLoading }) => isLoading && `
    &::after {
      content: "●●●";
      display: inline-block;
      animation: loading-dots 1.5s infinite;
    }
    
    @keyframes loading-dots {
      0%, 20% {
        content: "●○○";
      }
      40% {
        content: "●●○";
      }
      60%, 100% {
        content: "●●●";
      }
    }
  `}
`;

const ChatFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ChatTextarea = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  min-height: 24px;
  max-height: 150px;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

/**
 * Chat component for interacting with the PDF document
 */
const Chat: React.FC<ChatProps> = ({ pdfFile, fileName, onClearMessages }): JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { askQuestion, loading } = useApi();
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (onClearMessages) {
      onClearMessages(clearMessages); // Pass the clearMessages function to the parent
    }
  }, [onClearMessages, clearMessages]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Scroll to bottom when new messages are added
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (): Promise<void> => {
    if (!queryRef.current || !queryRef.current.value.trim() || !pdfFile || !fileName) {
      return;
    }
    
    const input = queryRef.current.value.trim();
    const messageId = uuidv4();
    
    // Add user message with loading state
    setMessages(prev => [...prev, { 
      id: messageId, 
      text: input, 
      response: '', 
      timestamp: new Date(),
      isLoading: true
    }]);
    
    // Clear input field
    queryRef.current.value = "";
    adjustHeight();
    
    try {
      // Call API to get response
      const documentId = fileName;
      const answer = await askQuestion(documentId, input);
      
      // Update message with response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: answer || 'No response received', isLoading: false } 
            : msg
        )
      );
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: 'Failed to get response', isLoading: false, error: errorMessage } 
            : msg
        )
      );
    }
  }, [pdfFile, fileName, askQuestion]);

  function adjustHeight(): void {
    if (queryRef.current) {
      queryRef.current.style.height = "auto";
      const scrollHeight = queryRef.current.scrollHeight;
      queryRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }

  useLayoutEffect(adjustHeight, []);

  function handleKeyDown(_: React.ChangeEvent<HTMLTextAreaElement>): void {
    adjustHeight();
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isQueryDisabled = !pdfFile || loading.askQuestion;
  
  // Simplified file name for display
  const displayFileName = fileName 
    ? fileName.split('\\').pop()?.split('/').pop() 
    : 'PDF Document';

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          {pdfFile ? `Chat about ${displayFileName}` : 'Chat with Paper'}
        </ChatTitle>
      </ChatHeader>
      
      <ChatBody>
        {messages.length === 0 ? (
          <EmptyChatMessage>
            <MessageCircle size={40} />
            <h4>No Conversations Yet</h4>
            <p>
              Ask questions about the document to extract information, analyze data, or understand the content better.
            </p>
          </EmptyChatMessage>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} isError={!!msg.error}>
              <UserMessage>{msg.text}</UserMessage>
              <BotMessage isLoading={msg.isLoading}>
                {msg.isLoading ? '' : msg.response}
              </BotMessage>
            </MessageItem>
          ))
        )}
        <div ref={messagesEndRef} />
      </ChatBody>
      
      <ChatFooter>
        <InputContainer>
          <ChatTextarea
            ref={queryRef}
            onChange={handleKeyDown}
            onKeyPress={handleKeyPress}
            placeholder={isQueryDisabled 
              ? "Please upload a PDF file first" 
              : "Ask a question about the document..."}
            disabled={isQueryDisabled}
            rows={1}
          />
          <IconButton
            onClick={sendMessage}
            disabled={isQueryDisabled}
            variant="primary"
            size="small"
            title="Send message"
          >
            <Send size={18} />
          </IconButton>
        </InputContainer>
      </ChatFooter>
    </ChatContainer>
  );
};

export default Chat;

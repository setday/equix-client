import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'react-feather';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ $type: NotificationType; $isExiting: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 300px;
  max-width: 450px;
  animation: ${({ $isExiting }) => $isExiting ? css`${slideOut} 0.3s forwards` : css`${slideIn} 0.3s forwards`};
  
  ${({ $type, theme }) => {
    switch ($type) {
      case 'error':
        return css`
          background-color: #2a1215;
          border-left: 4px solid ${theme.colors.error};
          .icon-container {
            color: ${theme.colors.error};
          }
        `;
      case 'success':
        return css`
          background-color: #162312;
          border-left: 4px solid ${theme.colors.success};
          .icon-container {
            color: ${theme.colors.success};
          }
        `;
      case 'warning':
        return css`
          background-color: #2b2111;
          border-left: 4px solid ${theme.colors.warning};
          .icon-container {
            color: ${theme.colors.warning};
          }
        `;
      case 'info':
      default:
        return css`
          background-color: #111d2c;
          border-left: 4px solid ${theme.colors.info};
          .icon-container {
            color: ${theme.colors.info};
          }
        `;
    }
  }}
`;

const IconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  word-break: break-word;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const NotificationItem: React.FC<NotificationProps> = ({ 
  id, 
  type, 
  message, 
  duration = 5000,
  onClose 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleClose = () => {
    setIsExiting(true);
    // Wait for exit animation to complete
    setTimeout(() => onClose(id), 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration]);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <NotificationContainer $type={type} $isExiting={isExiting}>
      <IconContainer className="icon-container">
        {getIcon()}
      </IconContainer>
      <Content>{message}</Content>
      <CloseButton onClick={handleClose} aria-label="Close notification">
        <X size={16} />
      </CloseButton>
    </NotificationContainer>
  );
};

export default NotificationItem;

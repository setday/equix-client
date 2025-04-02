import React from 'react';
import styled from 'styled-components';
import NotificationItem, { NotificationProps } from './NotificationItem';

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.snackbar};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
  
  & > * {
    pointer-events: auto;
  }
`;

interface NotificationContainerProps {
  notifications: Omit<NotificationProps, 'onClose'>[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onClose 
}) => {
  return (
    <Container>
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          {...notification} 
          onClose={onClose} 
        />
      ))}
    </Container>
  );
};

export default NotificationContainer;

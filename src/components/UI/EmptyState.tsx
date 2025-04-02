import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const Container = styled(Card)<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme, size }) => 
    size === 'small' 
      ? theme.spacing.md 
      : size === 'large' 
        ? theme.spacing.xxl 
        : theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.md};
  width: ${({ size }) => 
    size === 'small' 
      ? '300px' 
      : size === 'large' 
        ? '600px' 
        : '450px'};
  max-width: 100%;
`;

const IconWrapper = styled.div<{ size: string }>`
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  svg {
    width: ${({ size }) => 
      size === 'small' 
        ? '32px' 
        : size === 'large' 
          ? '80px' 
          : '48px'};
    height: ${({ size }) => 
      size === 'small' 
        ? '32px' 
        : size === 'large' 
          ? '80px' 
          : '48px'};
  }
`;

const Title = styled.h3<{ size: string }>`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme, size }) => 
    size === 'small' 
      ? theme.typography.fontSizes.lg 
      : size === 'large' 
        ? theme.typography.fontSizes.xxl 
        : theme.typography.fontSizes.xl};
`;

const Description = styled.p<{ size: string }>`
  margin: 0;
  margin-bottom: ${({ theme, size }) => 
    size === 'small' 
      ? theme.spacing.md 
      : theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme, size }) => 
    size === 'small' 
      ? theme.typography.fontSizes.sm 
      : size === 'large' 
        ? theme.typography.fontSizes.lg 
        : theme.typography.fontSizes.md};
`;

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  size = 'medium'
}) => {
  return (
    <Container size={size} elevation={0}>
      {icon && <IconWrapper size={size}>{icon}</IconWrapper>}
      <Title size={size}>{title}</Title>
      {description && <Description size={size}>{description}</Description>}
      {actionText && onAction && (
        <Button 
          onClick={onAction}
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
        >
          {actionText}
        </Button>
      )}
    </Container>
  );
};

export default EmptyState;

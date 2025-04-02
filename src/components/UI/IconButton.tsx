import React from 'react';
import styled, { css } from 'styled-components';

type IconButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const StyledIconButton = styled.button<IconButtonProps>`
  display: inline-flex;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  /* Size styles */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          width: 32px;
          height: 32px;
          font-size: ${theme.typography.fontSizes.sm};
        `;
      case 'large':
        return css`
          width: 48px;
          height: 48px;
          font-size: ${theme.typography.fontSizes.lg};
        `;
      default:
        return css`
          width: 40px;
          height: 40px;
          font-size: ${theme.typography.fontSizes.md};
        `;
    }
  }}
  
  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrast};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary.dark};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.secondary.dark};
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.highlight};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.highlight};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.highlight};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.highlight};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary.dark};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary.dark};
          }
        `;
    }
  }}
  
  /* Loading spinner */
  ${({ isLoading }) => isLoading && css`
    .icon-content {
      visibility: hidden;
    }
    
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: calc(50% - 8px);
      left: calc(50% - 8px);
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: button-spin 0.8s linear infinite;
    }
    
    @keyframes button-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'text',
  size = 'medium',
  isLoading = false,
  ...props
}) => {
  return (
    <StyledIconButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      {...props}
    >
      <span className="icon-content">{children}</span>
    </StyledIconButton>
  );
};

export default IconButton;

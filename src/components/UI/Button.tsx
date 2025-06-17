import React from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "outlined" | "text";
type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  icon?: React.ReactNode;
  $iconPosition?: "left" | "right";
  $isLoading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
  
  /* Size styles */
  ${({ $size, theme }) => {
    switch ($size) {
      case "small":
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSizes.xs};
        `;
      case "large":
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSizes.lg};
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSizes.md};
        `;
    }
  }}
  
  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
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
      case "outlined":
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
      case "text":
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
  
  /* Icon positioning */
  .button-icon {
    ${({ $iconPosition }) =>
      $iconPosition === "left" &&
      css`
        margin-right: 8px;
      `}

    ${({ $iconPosition }) =>
      $iconPosition === "right" &&
      css`
        margin-left: 8px;
      `}
  }

  /* Loading spinner */
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      .button-content {
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

export const Button: React.FC<ButtonProps> = ({
  children,
  $variant = "primary",
  $size = "medium",
  $fullWidth = false,
  icon,
  $iconPosition = "left",
  $isLoading = false,
  ...props
}) => {
  return (
    <StyledButton
      $variant={$variant}
      $size={$size}
      $fullWidth={$fullWidth}
      $iconPosition={$iconPosition}
      $isLoading={$isLoading}
      {...props}
    >
      {icon && $iconPosition === "left" && (
        <span className="button-icon">{icon}</span>
      )}
      <span className="button-content">{children}</span>
      {icon && $iconPosition === "right" && (
        <span className="button-icon">{icon}</span>
      )}
    </StyledButton>
  );
};

export default Button;

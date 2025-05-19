import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
  $elevation?: 0 | 1 | 2 | 3;
  $padding?: boolean | string;
  $margin?: string;
  $fullWidth?: boolean;
  $className?: string;
  children: React.ReactNode;
  $isLoading?: boolean;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  ${({ $padding, theme }) => {
    if ($padding === false) return css`padding: 0;`;
    if (typeof $padding === 'string') return css`padding: ${$padding};`;
    return css`padding: ${theme.spacing.md};`;
  }}
  
  ${({ $margin }) => $margin && css`
    margin: ${$margin};
  `}
  
  ${({ $elevation, theme }) => {
    switch ($elevation) {
      case 0:
        return css`
          box-shadow: none;
          border: 1px solid ${theme.colors.divider};
        `;
      case 2:
        return css`
          box-shadow: ${theme.shadows.md};
        `;
      case 3:
        return css`
          box-shadow: ${theme.shadows.lg};
        `;
      case 1:
      default:
        return css`
          box-shadow: ${theme.shadows.sm};
        `;
    }
  }}
`;

const Card: React.FC<CardProps> = ({ 
  children, 
  $elevation = 1, 
  $padding = true, 
  $margin,
  $fullWidth = false,
  $className,
  $isLoading = false,
}) => {
  return (
    <StyledCard 
      $elevation={$elevation}
      $padding={$padding}
      $margin={$margin}
      $fullWidth={$fullWidth}
      $className={$className}
      $isLoading={$isLoading}
    >
      {children}
    </StyledCard>
  );
};

export default Card;

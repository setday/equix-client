import { createGlobalStyle } from 'styled-components';
import { Theme } from '../theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  p {
    margin-top: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  }

  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary.light};
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[600]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral[500]};
  }

  /* Custom selection color */
  ::selection {
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
  }
`;

export default GlobalStyles;

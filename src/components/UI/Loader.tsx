import React from "react";
import styled, { keyframes } from "styled-components";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  center?: boolean;
  fullPage?: boolean;
  text?: string;
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div<{ center?: boolean; fullPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ center }) =>
    center &&
    `
    height: 100%;
    width: 100%;
  `}

  ${({ fullPage, theme }) =>
    fullPage &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(26, 30, 39, 0.7);
    z-index: ${theme.zIndex.modal};
    backdrop-filter: blur(2px);
  `}
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div<{ size: string; customColor?: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border: ${({ size }) => parseInt(size) / 8}px solid rgba(67, 97, 238, 0.2);
  border-radius: 50%;
  border-top-color: ${({ theme, customColor }) =>
    customColor || theme.colors.primary.main};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color,
  center = false,
  fullPage = false,
  text,
}) => {
  const getSizeInPixels = () => {
    switch (size) {
      case "small":
        return "24px";
      case "large":
        return "56px";
      case "medium":
      default:
        return "40px";
    }
  };

  return (
    <LoaderContainer center={center} fullPage={fullPage}>
      <SpinnerWrapper>
        <Spinner size={getSizeInPixels()} customColor={color} />
      </SpinnerWrapper>
      {text && <LoadingText>{text}</LoadingText>}
    </LoaderContainer>
  );
};

export default Loader;

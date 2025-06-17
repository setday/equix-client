import React from "react";
import styled from "styled-components";
import { Sun, Moon } from "react-feather";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeIconButton = styled(IconButton)`
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(12deg);
  }
`;

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  toggleTheme,
}) => {
  return (
    <Tooltip
      content={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      position="bottom"
    >
      <ThemeIconButton
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </ThemeIconButton>
    </Tooltip>
  );
};

export default ThemeToggle;

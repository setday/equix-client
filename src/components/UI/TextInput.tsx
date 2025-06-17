import React from "react";
import styled from "styled-components";

interface TextInputProps {
  type?: "text" | "url" | "number";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.main}30;
    background-color: ${({ theme }) =>
      theme.colors.background.secondary} !important;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &::-moz-placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  /* Prevent white background on autofill */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.background.secondary} inset !important;
    -webkit-text-fill-color: ${({ theme }) =>
      theme.colors.text.primary} !important;
  }
`;

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  min,
  max,
  step,
}) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
    />
  );
};

export default TextInput;

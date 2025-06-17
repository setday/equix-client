import React from "react";
import styled from "styled-components";

interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
  padding: 0;

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 2px;
    top: -1px;
    width: 6px;
    height: 10px;
    border: solid ${({ theme }) => theme.colors.primary.contrast};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.main}30;
  }

  &:hover:not(:checked) {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:hover:checked {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <CheckboxContainer>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label}
    </CheckboxContainer>
  );
};

export default CheckboxInput;

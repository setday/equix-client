import React from "react";
import styled from "styled-components";
import { Folder } from "react-feather";
import Button from "./Button";
import TextInput from "../UI/TextInput";

interface FilePathInputProps {
  value: string;
  onChange: (value: string) => void;
  onBrowse: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilePathInput: React.FC<FilePathInputProps> = ({
  value,
  onChange,
  onBrowse,
  placeholder,
  disabled = false,
}) => {
  return (
    <Container>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Button
        $variant="outlined"
        onClick={onBrowse}
        icon={<Folder size={16} />}
        disabled={disabled}
      >
        Browse
      </Button>
    </Container>
  );
};

export default FilePathInput;

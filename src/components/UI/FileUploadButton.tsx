import React, { useRef } from "react";
import styled from "styled-components";
import { UploadCloud } from "react-feather";
import Button, { ButtonProps } from "./Button";

interface FileUploadButtonProps extends Omit<ButtonProps, "onChange"> {
  acceptedFileTypes?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  buttonText?: string;
}

const HiddenInput = styled.input`
  display: none;
`;

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  acceptedFileTypes = "*",
  multiple = false,
  onChange,
  buttonText = "Upload File",
  ...buttonProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        icon={<UploadCloud size={18} />}
        onClick={handleClick}
        {...buttonProps}
      >
        {buttonText}
      </Button>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        multiple={multiple}
        onChange={handleChange}
      />
    </>
  );
};

export default FileUploadButton;

import React from "react";
import styled from "styled-components";

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const SettingItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: 1.4;
`;

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  children,
}) => {
  return (
    <SettingItemContainer>
      <Label>{label}</Label>
      {description && <Description>{description}</Description>}
      {children}
    </SettingItemContainer>
  );
};

export default SettingItem;

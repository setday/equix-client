import React from "react";
import styled from "styled-components";

interface SectionProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SectionContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.divider};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <SectionContainer>
      {(title || icon) && (
        <SectionTitle>
          {icon}
          {title}
        </SectionTitle>
      )}
      {children}
    </SectionContainer>
  );
};

export default Section;

import React from 'react';
import styled from 'styled-components';
import { Upload, Info, Settings, HelpCircle } from 'react-feather';
import IconButton from '../UI/IconButton';
import { APP } from '../../config/constants';

const HeaderContainer = styled.header`
  height: ${({ theme }) => theme.sizes.headerHeight};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: ${({ theme }) => theme.zIndex.appBar};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const Version = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface AppHeaderProps {
  onUploadClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onUploadClick }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo>{APP.NAME}</Logo>
        <Version>v{APP.VERSION}</Version>
      </LogoContainer>
      
      <ActionsContainer>
        <IconButton 
          title="Upload PDF" 
          onClick={onUploadClick}
          $variant="text"
        >
          <Upload size={20} />
        </IconButton>
        
        <IconButton 
          title="Information" 
          $variant="text"
        >
          <Info size={20} />
        </IconButton>
        
        <IconButton 
          title="Settings" 
          $variant="text"
        >
          <Settings size={20} />
        </IconButton>
        
        <IconButton 
          title="Help" 
          $variant="text"
        >
          <HelpCircle size={20} />
        </IconButton>
      </ActionsContainer>
    </HeaderContainer>
  );
};

export default AppHeader;

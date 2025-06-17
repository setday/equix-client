import React from "react";
import styled from "styled-components";
import {
  X,
  Folder,
  Globe,
  Edit,
  Bell,
  Settings as SettingsIcon,
} from "react-feather";
import { useSettings } from "../../hooks/settings/SettingsContext";
import { useNotification } from "../../hooks/notification/NotificationContext";
import Button from "../../components/UI/Button";
import IconButton from "../../components/UI/IconButton";
import Section from "../../components/UI/Section";
import SettingsItem from "./SettingItem";
import Selector from "../../components/UI/Selector";
import TextInput from "../../components/UI/TextInput";
import FilePathInput from "../../components/UI/FilePathInput";
import CheckboxInput from "../../components/UI/CheckboxInput";

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
`;

const SettingsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px ${({ theme }) => theme.colors.divider};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 0;
  position: relative;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.lg}
    ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SettingGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const SettingsPage: React.FC<SettingsPageProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting } = useSettings();
  const { showSuccess, showError } = useNotification();

  const handleThemeChange = (value: string) => {
    updateSetting("theme", value as "light" | "dark" | "system");
    showSuccess(`Theme changed to ${value}`);
  };

  const handleFolderSelect = async () => {
    try {
      const { open } = await import("@tauri-apps/api/dialog");
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: settings.artifactsPath || undefined,
      });

      if (selected && typeof selected === "string") {
        updateSetting("artifactsPath", selected);
        showSuccess("Artifacts path updated");
      }
    } catch (error) {
      console.error("Failed to open folder picker:", error);
      showError("Failed to open folder picker");
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <SettingsContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>
            <SettingsIcon size={24} />
            Settings
          </Title>
          <IconButton onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </IconButton>
        </Header>

        <Content>
          {/* Appearance Settings */}
          <Section title="Appearance" icon={<Edit size={20} />}>
            <SettingGroup>
              <SettingsItem
                label="Theme"
                description="Choose your preferred color theme"
              >
                <Selector
                  value={settings.theme}
                  options={[
                    { value: "system", label: "System" },
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                  ]}
                  onChange={handleThemeChange}
                />
              </SettingsItem>
              <SettingsItem
                label="Language"
                description="Select interface language"
              >
                <Selector
                  value={settings.language}
                  options={[
                    { value: "en", label: "English" },
                    { value: "ru", label: "Русский" },
                  ]}
                  onChange={(value) => updateSetting("language", value)}
                  disabled
                />
              </SettingsItem>
            </SettingGroup>
          </Section>

          {/* Application Settings */}
          <Section title="Application" icon={<Globe size={20} />}>
            <SettingGroup>
              <SettingsItem
                label="Backend URL"
                description="API endpoint for document processing"
              >
                <TextInput
                  type="url"
                  value={settings.backendUrl}
                  onChange={(value) => updateSetting("backendUrl", value)}
                  placeholder="http://localhost:5123"
                  disabled
                />
              </SettingsItem>
              <SettingsItem
                label="Artifacts Path"
                description="Default path for saving extracted content"
              >
                <FilePathInput
                  value={settings.artifactsPath}
                  onChange={(value) => updateSetting("artifactsPath", value)}
                  onBrowse={handleFolderSelect}
                  placeholder="/path/to/artifacts"
                  disabled
                />
              </SettingsItem>
              <SettingsItem
                label="Export Quality"
                description="Quality setting for exported content"
              >
                <Selector
                  value={settings.exportQuality}
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                  onChange={(value) =>
                    updateSetting(
                      "exportQuality",
                      value as "low" | "medium" | "high",
                    )
                  }
                  disabled
                />
              </SettingsItem>
            </SettingGroup>
          </Section>

          {/* Notifications Settings */}
          <Section title="Notifications" icon={<Bell size={20} />}>
            <SettingGroup>
              <SettingsItem
                label="Notification Duration (ms)"
                description="How long notifications stay visible"
              >
                <TextInput
                  type="number"
                  value={settings.notificationDuration}
                  onChange={(value) =>
                    updateSetting(
                      "notificationDuration",
                      parseInt(value) || 4000,
                    )
                  }
                  min="1000"
                  max="10000"
                  step="500"
                  disabled
                />
              </SettingsItem>
            </SettingGroup>
          </Section>

          {/* Advanced Settings */}
          <Section title="Advanced" icon={<Folder size={20} />}>
            <SettingGroup>
              <SettingsItem
                label="Auto-save"
                description="Automatically save your work"
              >
                <CheckboxInput
                  label="Enable Auto-save"
                  checked={settings.autoSaveEnabled}
                  onChange={(checked) =>
                    updateSetting("autoSaveEnabled", checked)
                  }
                  disabled
                />
              </SettingsItem>
              <SettingsItem
                label="Debug Mode"
                description="Enable detailed logging and debug information"
              >
                <CheckboxInput
                  label="Debug Mode"
                  checked={settings.debugMode}
                  onChange={(checked) => updateSetting("debugMode", checked)}
                  disabled
                />
              </SettingsItem>
            </SettingGroup>
          </Section>

          {/* Action Buttons */}
          <Section title="" icon={null}>
            <Button $variant="primary" onClick={onClose}>
              Save & Close
            </Button>
          </Section>
        </Content>
      </SettingsContainer>
    </Overlay>
  );
};

export default SettingsPage;

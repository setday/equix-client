import React from "react";
import styled from "styled-components";
import {
  X,
  Book,
  Target,
  Zap,
  Shield,
  GitBranch,
  Users,
  BarChart,
  FileText,
  Cpu,
  Database,
  ExternalLink,
} from "react-feather";
import IconButton from "../../components/UI/IconButton";
import Button from "../../components/UI/Button";
import { APP } from "../../config/constants";
import Section from "../../components/UI/Section";

interface InfoPageProps {
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

const InfoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px ${({ theme }) => theme.colors.divider};
  width: 90%;
  max-width: 900px;
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

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const FeatureTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;
`;

const MetricsList = styled.ul`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TechTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary.main}20;
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const VersionInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.main}10;
  border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const VersionTitle = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LinkButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const InfoPage: React.FC<InfoPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <InfoContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>
            <Book size={24} />
            About {APP.NAME}
          </Title>
          <IconButton onClick={onClose} aria-label="Close info">
            <X size={20} />
          </IconButton>
        </Header>

        <Content>
          {/* Project Overview */}
          <Section title="Project Overview" icon={<Target size={20} />}>
            <Description>
              Equix is an advanced ML system designed for automatic extraction
              of key information from scientific PDF documents. The system
              accelerates the analysis of scientific articles and facilitates
              the integration of concepts into company products.
            </Description>
            <Description>
              Unlike existing solutions that only extract tables, Equix supports
              data extraction from graphs, charts, and diagrams, as well as
              connected and general information. Everything works locally,
              allowing processing of confidential company developments.
            </Description>

            <VersionInfo>
              <VersionTitle>Current Version: {APP.VERSION}</VersionTitle>
              <Description style={{ margin: 0, fontSize: "0.875rem" }}>
                This pilot version focuses on core extraction capabilities and
                local processing.
              </Description>
            </VersionInfo>
          </Section>

          {/* Key Features */}
          <Section title="Key Features" icon={<Zap size={20} />}>
            <FeatureGrid>
              {" "}
              <FeatureCard>
                <FeatureTitle>
                  <BarChart size={16} />
                  Data Extraction
                </FeatureTitle>
                <FeatureDescription>
                  Extract data from tables, graphs, and charts with high
                  accuracy using advanced ML models.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureTitle>
                  <FileText size={16} />
                  Document Q&A
                </FeatureTitle>
                <FeatureDescription>
                  Ask questions about document content and get intelligent
                  responses based on the analyzed content.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureTitle>
                  <Shield size={16} />
                  Local Processing
                </FeatureTitle>
                <FeatureDescription>
                  All processing happens locally without internet connection,
                  ensuring confidentiality of sensitive documents.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureTitle>
                  <Cpu size={16} />
                  High Performance
                </FeatureTitle>
                <FeatureDescription>
                  Optimized for fast processing with support for various
                  hardware configurations including GPU acceleration.
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          {/* Technical Specifications */}
          <Section
            title="Technical Specifications"
            icon={<Database size={20} />}
          >
            <Description>
              Equix leverages state-of-the-art machine learning models and
              technologies to deliver accurate and efficient document
              processing.
            </Description>

            <h4
              style={{
                margin: "1rem 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              Core Technologies:
            </h4>
            <TechStack>
              <TechTag>Llama 3.2 Multimodal</TechTag>
              <TechTag>DETR Layout Detection</TechTag>
              <TechTag>mPLUG-DocOwl 1.5</TechTag>
              <TechTag>React + TypeScript</TechTag>
              <TechTag>Tauri</TechTag>
              <TechTag>Styled Components</TechTag>
            </TechStack>

            <h4
              style={{
                margin: "1rem 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              System Requirements:
            </h4>
            <MetricsList>
              <li>NVIDIA GeForce RTX 3070 or equivalent</li>
              <li>Intel Core i7 12th Gen or Apple M2</li>
              <li>32 GB RAM minimum</li>
              <li>500 GB available storage</li>
            </MetricsList>
          </Section>

          {/* Performance Metrics */}
          <Section title="Performance Metrics" icon={<BarChart size={20} />}>
            <Description>
              The system is designed to meet specific quality and performance
              benchmarks for production use.
            </Description>
            <h4
              style={{
                margin: "1rem 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              Quality Metrics:
            </h4>
            <MetricsList>
              <li>Table data extraction accuracy: ≥ 90%</li>
              <li>
                Non-tabular data extraction accuracy: ≥ 85% (graphs, charts)
              </li>
              <li>Q&A system accuracy: ≥ 75% (cosine similarity)</li>
              <li>Layout detection IoU: ≥ 75%</li>
            </MetricsList>
            <h4
              style={{
                margin: "1rem 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              Performance Targets:
            </h4>
            <MetricsList>
              <li>Processing speed: ≤ 5 seconds per page</li>
              <li>Graphics extraction: ≤ 3 seconds per request</li>
              <li>Document Q&A response: ≤ 10 seconds</li>
              <li>Maximum document size: 100 MB</li>
            </MetricsList>
          </Section>

          {/* Development Info */}
          <Section
            title="Development & Research"
            icon={<GitBranch size={20} />}
          >
            <Description>
              This system represents the culmination of extensive research in
              machine learning, computer vision, and natural language
              processing, specifically tailored for scientific document
              analysis.
            </Description>

            <h4
              style={{
                margin: "1rem 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              Research Areas:
            </h4>
            <MetricsList>
              <li>Multimodal Large Language Models (LLMs)</li>
              <li>Optical Character Recognition (OCR)</li>
              <li>Document Layout Analysis</li>
              <li>Retrieval-Augmented Generation (RAG)</li>
              <li>Computer Vision for Scientific Documents</li>
            </MetricsList>

            <Description>
              The system is designed for iterative improvement, with planned
              expansions including support for additional languages, enhanced
              visualization analysis, and mobile deployment.
            </Description>
          </Section>

          {/* Team & Collaboration */}
          <Section title="About the Team" icon={<Users size={20} />}>
            <Description>
              Developed by the HSE research team specializing in AI and document
              processing. This project represents a collaborative effort between
              machine learning engineers, software developers, and domain
              experts.
            </Description>

            <LinkButton
              $variant="outlined"
              icon={<ExternalLink size={16} />}
              onClick={() =>
                window.open("https://github.com/setday/Equix", "_blank")
              }
            >
              View on GitHub
            </LinkButton>
          </Section>

          {/* Action Buttons */}
          <Section>
            <Button $variant="primary" onClick={onClose}>
              Close
            </Button>
          </Section>
        </Content>
      </InfoContainer>
    </Overlay>
  );
};

export default InfoPage;

// Common TypeScript interfaces for the application

// PDF Document Types
export interface PDFDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: Date;
}

// Layout and Content Types
export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BoundingBox extends Coordinates, Dimensions {}

export interface LayoutBlockStyle {
  position: 'absolute' | 'relative';
  top?: number;
  left?: number;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  border?: string;
  opacity?: number;
  zIndex?: number;
}

export interface LayoutBlock {
  id: string;
  type: 'text' | 'image' | 'table' | 'figure' | 'title' | 'list' | 'formula' | 'other';
  content: string;
  boundingBox: BoundingBox;
  pageNumber: number;
  confidence: number;
  metadata?: Record<string, unknown>;
  style?: LayoutBlockStyle;
  children?: LayoutBlock[];
}

export interface DocumentLayout {
  blocks: LayoutBlock[];
  pageCount: number;
  metadata?: Record<string, unknown>;
}

// API Response Types
export interface LayoutResponse {
  layout: DocumentLayout;
  status: 'success' | 'error';
  processingTime?: number;
}

export interface GraphicsExtractionResponse {
  text: string;
  blockId: number;
  format: 'Markdown' | 'HTML' | 'Plain';
  status: 'success' | 'error';
}

// Message Types
export interface ChatMessage {
  id: string;
  text: string;
  response: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

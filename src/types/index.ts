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

export enum LayoutBlockType {
  UNKNOWN = 'unknown',

  CAPTION = 'caption',
  FOOTNOTE = 'footnote',
  FORMULA = 'formula',
  
  LIST_ITEM = 'list_item',
  
  PAGE_FOOTER = 'page_footer',
  PAGE_HEADER = 'page_header',

  PICTURE = 'picture',

  SECTION_HEADER = 'section_header',

  TABLE = 'table',
  TEXT = 'text',

  CHART = 'chart',
}
export enum LayoutBlockSpecification {
  UNKNOWN = 'unknown',
  HEADER = 'header',
  FOOTER = 'footer',
  ANNOTATION = 'annotation',
  CAPTION = 'caption',
  PAGE_NUMBER = 'page_number',
}

export interface LayoutBlock {
  id: number;
  block_type: LayoutBlockType;
  block_specification: LayoutBlockSpecification;
  text_content: string;
  byte_content?: Uint8Array;
  annotation?: string;
  bounding_box: BoundingBox;
  page_number: number;
  confidence: number;
  metadata?: Record<string, unknown>;
  children?: LayoutBlock[];
}

export interface DocumentLayout {
  blocks: LayoutBlock[];
  page_count: number;
  metadata?: Record<string, unknown>;
}

// API Response Types
export interface LayoutResponse {
  layout: DocumentLayout;
  document_id: string;
  processing_time?: number;
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

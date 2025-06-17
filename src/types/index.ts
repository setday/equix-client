// Common TypeScript interfaces for the application

export interface PDFDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: Date;
}

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
  UNKNOWN = "UNKNOWN",

  CAPTION = "CAPTION",
  FOOTNOTE = "FOOTNOTE",
  FORMULA = "FORMULA",

  LIST_ITEM = "LIST_ITEM",

  PAGE_FOOTER = "PAGE_FOOTER",
  PAGE_HEADER = "PAGE_HEADER",

  PICTURE = "PICTURE",

  SECTION_HEADER = "SECTION_HEADER",

  TABLE = "TABLE",
  TEXT = "TEXT",

  CHART = "CHART",
}

export enum LayoutBlockSpecification {
  UNKNOWN = "UNKNOWN",
  HEADER = "HEADER",
  FOOTER = "FOOTER",
  ANNOTATION = "ANNOTATION",
  CAPTION = "CAPTION",
  PAGE_NUMBER = "PAGE_NUMBER",
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

export interface LayoutResponse {
  layout: DocumentLayout;
  document_id: string;
  processing_time?: number;
}

export interface GraphicsExtractionResponse {
  text: string;
  blockId: number;
  format: "text" | "md" | "code" | "csv" | "json";
  status: "success" | "error";
}

export interface ChatMessage {
  id: string;
  text: string;
  response: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  type?: "user" | "system" | "markup_action" | "ask_prompt";
  markupInfo?: {
    blockType: LayoutBlockType;
    action: string;
    blockId: number;
    format?: string;
    imageData?: string; // base64 image data for block preview
    questionText?: string; // for ask actions - the actual question text
  };
}

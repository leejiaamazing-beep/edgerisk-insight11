export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  notebookCode?: string;
  notebookFilename?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedFiles: FileInfo[];
}

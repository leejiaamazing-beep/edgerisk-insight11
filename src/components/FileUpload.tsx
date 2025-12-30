import { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import type { FileInfo } from './types.js';

interface FileUploadProps {
  onFilesSelected: (files: FileInfo[]) => void;
  selectedFiles: FileInfo[];
  onRemoveFile: (fileId: string) => void;
}

export default function FileUpload({ onFilesSelected, selectedFiles, onRemoveFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const supportedFormats = ['.csv', '.xlsx', '.xls', '.json'];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: FileInfo[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (supportedFormats.includes(extension)) {
        validFiles.push({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        });
      } else {
        errors.push(`${file.name}: 不支持的文件格式`);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      {/* 上传区域 */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Upload size={18} className="text-gray-400" />
          <div className="text-sm">
            <span className="text-gray-700">点击上传</span>
            <span className="text-gray-400"> 或拖拽文件</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          支持 CSV, Excel, JSON
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={supportedFormats.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* 已选文件列表 */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-500">已选择 {selectedFiles.length} 个文件:</p>
          {selectedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText size={16} className="text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

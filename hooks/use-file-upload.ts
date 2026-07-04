import { toDropzoneAccept } from '@/utils/mime-types';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

const DEFAULT_MAX_SIZE = 20 * 1024 * 1024; // 20MB

interface PreviewFile extends File {
  preview: string;
  width?: number;
  height?: number;
  formattedSize: string;
}

interface UseFileUploadOptions {
  maxSize?:    number;
  disabled?:   boolean;
  accept?:     string[];
  maxFiles?:   number;
}

interface UseFileUploadReturn {
  files:            PreviewFile[];
  fileRejections:   readonly FileRejection[];
  isDragActive:     boolean;
  getRootProps:     ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps:    ReturnType<typeof useDropzone>['getInputProps'];
  clearFiles:       () => void;
}

// Helpers

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useFileUpload = ({
  maxSize  = DEFAULT_MAX_SIZE,
  disabled = false,
  accept,
  maxFiles = 1,
}: UseFileUploadOptions = {}): UseFileUploadReturn => {

  const [files, setFiles] = useState<PreviewFile[]>([]);

  // clearFiles
  const clearFiles = useCallback(() => {
    setFiles(prevFiles => {
      prevFiles.forEach(file => URL.revokeObjectURL(file.preview));
      return [];
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    clearFiles();

    if (!acceptedFiles?.length) return;

    const previewFiles = await Promise.all(
        acceptedFiles.map(async file => {
          const preview = URL.createObjectURL(file);

          try {

            return Object.assign(file, {
              preview,
              formattedSize: formatFileSize(file.size),
            });
          } catch {
            return Object.assign(file, {
              preview,
              formattedSize: formatFileSize(file.size),
            });
          }
        })
      );

      setFiles(previewFiles);
  }, [clearFiles]);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, fileRejections, isDragActive } = useDropzone({
    accept: toDropzoneAccept(accept),
    maxFiles,
    maxSize,
    disabled,
    onDrop,
  });

  return {
    files,
    fileRejections,
    isDragActive,
    getRootProps,
    getInputProps,
    clearFiles,
  };
};
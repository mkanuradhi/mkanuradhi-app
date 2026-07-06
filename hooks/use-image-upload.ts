import { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface PreviewFile extends File {
  preview: string;
  width?: number;
  height?: number;
  formattedSize: string;
}

interface UseImageUploadOptions {
  maxSize?:    number;
  disabled?:   boolean;
  accept?:     Accept;
  maxFiles?:   number;
}

interface UseImageUploadReturn {
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

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject();
    };

    img.src = url;
  });
};

export const useImageUpload = ({
  maxSize  = DEFAULT_MAX_SIZE,
  disabled = false,
  accept   = { 'image/*': [] },
  maxFiles = 1,
}: UseImageUploadOptions = {}): UseImageUploadReturn => {

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
            const dimensions = await getImageDimensions(file);

            return Object.assign(file, {
              preview,
              formattedSize: formatFileSize(file.size),
              width: dimensions.width,
              height: dimensions.height,
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
    accept,
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
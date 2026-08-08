'use client';

import { useState, useCallback, useEffect, Activity } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UniversalUploaderProps {
  variant: 'inline' | 'popup';
  isOpen?: boolean;
  onClose?: () => void;
  onUploadSuccess: (url: string) => void;
  folderName?: string;
}

export function UniversalUploader({
  variant,
  isOpen = false,
  onClose,
  onUploadSuccess,
  folderName = 'work-pulse',
}: UniversalUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const handleUpload = async () => {
  if (!selectedFile) return;

  setIsUploading(true);
  setProgress(0);

  try {
    const formData = new FormData();

    formData.append('file', selectedFile);
    formData.append('upload_preset', 'work-pulse');
    formData.append('folder', folderName);

    const data = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          setProgress(percent);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(JSON.parse(xhr.responseText));
        }
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );

      xhr.send(formData);
    });

    onUploadSuccess(data.secure_url);

    resetSelection();

    if (variant === 'popup' && onClose) {
      onClose();
    }
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    setIsUploading(false);
    setProgress(0);
  }
};

  const resetSelection = () => {
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const DropzoneCoreView = (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors select-none
        ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20 hover:border-primary/50'
        }
        ${isUploading ? 'bg-muted opacity-50 pointer-events-none' : ''}
      `}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-64 w-auto rounded-lg object-cover"
            />

            <div>
              <p className="text-sm font-medium">{selectedFile?.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile?.size ?? 0 / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop your image here, or click to browse'}
            </p>

            <p className="text-xs text-muted-foreground mt-2">
              Supports JPG, PNG, WEBP up to 5MB
            </p>
          </>
        )}
        <Activity mode={isUploading ? "visible" : "hidden"}>
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        </Activity>
      </div>

      <Activity mode={previewUrl ? "visible" : "hidden"}>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={resetSelection}
            disabled={isUploading}
          >
            Change Image
          </Button>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </Activity>
    </div>
  );

  if (variant === 'popup') {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetSelection();
            onClose?.();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>

          <div className="py-4">{DropzoneCoreView}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return <div className="w-full max-w-md">{DropzoneCoreView}</div>;
}
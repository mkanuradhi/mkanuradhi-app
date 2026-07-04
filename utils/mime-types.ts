import { Accept } from 'react-dropzone';

// --- Dropzone accept config ---
export const MIME_EXTENSION_MAP: Record<string, string[]> = {
  'image/png':                                                                ['.png'],
  'image/jpeg':                                                               ['.jpg', '.jpeg'],
  'image/webp':                                                               ['.webp'],
  'image/gif':                                                                ['.gif'],
  'application/pdf':                                                         ['.pdf'],
  'application/msword':                                                      ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel':                                                ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':       ['.xlsx'],
  'application/vnd.ms-powerpoint':                                           ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain':                                                              ['.txt'],
  'text/csv':                                                                ['.csv'],
};

/**
 * Converts a plain list of MIME types into the shape react-dropzone expects.
 * Unknown MIME types are passed through with no extension restriction.
 */
export const toDropzoneAccept = (mimeTypes?: string[]): Record<string, string[]> | undefined => {
  if (!mimeTypes?.length) return undefined;

  return mimeTypes.reduce<Record<string, string[]>>((acc, mime) => {
    acc[mime] = MIME_EXTENSION_MAP[mime] ?? [];
    return acc;
  }, {});
};

// --- File kind / icon resolution ---

export type FileKind = 'image' | 'pdf' | 'word' | 'excel' | 'powerpoint' | 'text' | 'csv' | 'other';

const MIME_KIND_MAP: Record<string, FileKind> = {
  'application/pdf':                                                          'pdf',
  'application/msword':                                                       'word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  'word',
  'application/vnd.ms-excel':                                                 'excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':        'excel',
  'application/vnd.ms-powerpoint':                                            'powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':'powerpoint',
  'text/plain':                                                               'text',
  'text/csv':                                                                 'csv',
};

export const getFileKind = (mimeType: string): FileKind => {
  if (mimeType.startsWith('image/')) return 'image';
  return MIME_KIND_MAP[mimeType] ?? 'other';
};

const EXTENSION_KIND_MAP: Record<string, FileKind> = {
  pdf: 'pdf', doc: 'word', docx: 'word', xls: 'excel', xlsx: 'excel',
  ppt: 'powerpoint', pptx: 'powerpoint', txt: 'text', csv: 'csv',
  png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', gif: 'image',
};

export const getFileKindFromUrl = (url: string): FileKind => {
  const match = url.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  const ext = match?.[1]?.toLowerCase();
  if (!ext) return 'other';
  return EXTENSION_KIND_MAP[ext] ?? 'other';
};

const FILE_KIND_ICON_MAP: Record<FileKind, string> = {
  image:      '',
  pdf:        'bi-filetype-pdf',
  word:       'bi-filetype-docx',
  excel:      'bi-filetype-xlsx',
  powerpoint: 'bi-filetype-pptx',
  text:       'bi-filetype-txt',
  csv:        'bi-filetype-csv',
  other:      'bi-file-earmark',
};

export const getFileIconClass = (kind: FileKind): string => FILE_KIND_ICON_MAP[kind];

export type DownloadDocumentStatus = 'active' | 'inactive';

export type DownloadDocumentRow = {
  id: string;
  sl: number;
  title: string;
  publishDate: string;
  status: DownloadDocumentStatus;
  fileUrl?: string;
};

export type DownloadDocumentInput = {
  title: string;
  publishDate: string;
  status?: DownloadDocumentStatus;
  file?: File | null;
};

export type NoticeRow = {
  id: string;
  sl: number;
  title: string;
  publishDate: string; // UI keeps string
  href?: string;
};

export type NoticeApiItem = {
  id: number | string;
  title: string;
  content?: string | null;
  audience?: string | null | undefined;
  publish_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  attachments?: Array<
    | string
    | { url?: string | null; path?: string | null; file?: string | null; name?: string | null }
  > | null;
};

export type CreateNoticeInput = {
  title: string;
  content: string;
  audience: string; // older doc required
  publishDate?: string; // newer doc might require (YYYY-MM-DD)
  attachments?: File[];
};

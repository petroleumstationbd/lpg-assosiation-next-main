export type StationOption = {
  id: string;
  label: string;
};

export type PaymentRecordRow = {
  id: string;
  sl: number;
  stationId?: string;
  stationName: string;
  bankName: string;
  amountPaid: number;
  note: string;
  paymentDocUrl?: string | null;
  createdAt?: string;
};

export type PaymentRecordInput = {
  stationId: string;
  bankName: string;
  amountPaid: number;
  note?: string;
  paymentDoc: File;
};

export type PaymentRecordUpdateInput = {
  bankName?: string;
  amountPaid?: number;
  note?: string;
  paymentDoc?: File | null;
};

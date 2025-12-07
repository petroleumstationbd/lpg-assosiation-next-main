export type Owner = {
  id: number;
  memberId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  photoUrl?: string;
  isVerified: boolean;
};

export type Station = {
  id: number;
  name: string;
  ownerName: string;
  ownerPhone: string;
  division: string;
  district: string;
  upazila: string;
  isVerified: boolean;
};

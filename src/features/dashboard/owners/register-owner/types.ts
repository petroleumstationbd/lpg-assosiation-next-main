export type RegisterOwnerInput = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  address: string;
};

export type RegisterOwnerResult = {
  id: string;
};

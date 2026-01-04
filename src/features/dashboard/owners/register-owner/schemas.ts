import { z } from 'zod';

export const registerOwnerSchema = z
  .object({
    full_name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone_number: z.string().min(6, 'Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
    address: z.string().min(3, 'Address is required'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

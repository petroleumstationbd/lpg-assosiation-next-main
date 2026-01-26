import { z } from 'zod';
import { isValidBangladeshPhone } from '@/lib/phone';

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(4, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .min(6, 'Phone is required')
    .refine((value) => isValidBangladeshPhone(value), {
      message: 'Phone must be 11 digits',
    }),
  address: z.string().min(3, 'Address is required'),
});

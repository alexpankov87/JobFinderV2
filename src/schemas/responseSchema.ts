import { z } from 'zod';

export const responseSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное'),
  
  email: z
    .string()
    .email('Введите корректный email')
    .min(1, 'Email обязателен'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: 'Введите корректный номер телефона',
    }),
  
  preferredContact: z.enum(['email', 'whatsapp', 'telegram']),
  
  contactValue: z
    .string()
    .min(1, 'Введите контактные данные')
    .max(200, 'Слишком длинное значение'),
  
  coverLetter: z
    .string()
    .max(1000, 'Сопроводительное письмо не должно превышать 1000 символов')
    .optional(),
});

export type ResponseFormData = z.infer<typeof responseSchema>;
import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(100, 'Слишком длинное имя').optional().nullable(),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]+$/, 'Введите корректный номер телефона').optional().nullable(),
  preferred_contact: z.enum(['email', 'whatsapp', 'telegram']).optional().nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
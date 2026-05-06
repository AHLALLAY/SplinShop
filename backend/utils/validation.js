import { z } from 'zod';

export const loginCredentialsSchema = z.object({
    email: z
        .string({ message: 'email requis' })
        .trim()
        .toLowerCase()
        .email({ message: 'email invalide' }),
    password: z
        .string({ message: 'mot de passe requis' })
        .min(8, { message: 'minimum 8 caractères' }),
});
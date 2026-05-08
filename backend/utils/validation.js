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

export const sellerSchema = z.object({
    name: z
        .string({ message: 'nom requis' })
        .trim()
        .max(30, { message: 'maximum 30 caractères' }),
    email: z
        .string({ message: 'email requis' })
        .trim()
        .toLowerCase()
        .email({ message: 'email invalide' }),
    password: z
        .string({ message: 'mot de passe requis' })
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/, {
            message:
                'mot de passe invalide (8-20 caractères, majuscule, minuscule, chiffre et symbole)',
        }),
    role: z
        .enum(['admin', 'seller', 'customer'], { message: 'role invalide' })
        .optional(),
    phone: z
        .string()
        .trim()
        .regex(/^0[67]\d{8}$/, { message: 'numéro invalide (ex: 06XXXXXXXX)' })
        .optional(),
})
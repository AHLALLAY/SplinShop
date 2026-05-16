import { z } from 'zod';

export const loginCredentialsSchema = z.object({
    email: z
        .string({ message: 'email requis' })
        .trim()
        .toLowerCase()
        .email({ message: 'email invalide' }),
    password: z
        .string({ message: 'mot de passe requis' })
        .trim()
        .min(8, { message: 'minimum 8 caractères' }),
});

export const sellerSchema = z.object({
    name: z
        .string({ message: 'nom requis' })
        .trim()
        .min(1, { message: 'nom requis' })
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
});

/** Chaîne optionnelle : null, absent ou "" → undefined après trim */
const optionalTrimmed = (schema) =>
    z.preprocess((val) => {
        if (val === null || val === undefined) return undefined;
        if (typeof val !== 'string') return val;
        const t = val.trim();
        return t === '' ? undefined : t;
    }, schema.optional());

export const catalogSchema = z.object({
    name: z
        .string({ message: 'nom requis' })
        .trim()
        .min(1, { message: 'nom requis' })
        .max(30, { message: 'maximum 30 caractères' }),
    slug: optionalTrimmed(z.string().max(30, { message: 'slug trop long' })),
    imgUrl: optionalTrimmed(z.string().max(2048, { message: 'url trop longue' })),
    description: optionalTrimmed(z.string().max(5000, { message: 'description trop longue' })),
});

export const productSchema = z.object({
    catalogId: z.uuid({message: "Catalog invalide"}),
    name: z
        .string({ message: 'nom requis' })
        .trim()
        .min(1, { message: 'nom requis' })
        .max(30, { message: 'maximum 30 caractères' }),

    price: z.coerce.number().positive(),
    quantity: z.coerce.number().int().min(1),
    slug: optionalTrimmed(z.string().max(30, { message: 'slug trop long' })),
    description: optionalTrimmed(z.string().max(5000, { message: 'description trop longue' })),
});
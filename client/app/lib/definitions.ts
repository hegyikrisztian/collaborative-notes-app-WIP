import { z } from 'zod';

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { error: 'Username must be at least 2 characters long.' })
        .trim(),
    password: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            error: 'Contain at least one special character.',
        })
        .trim(),
    // TODO: Add password again here
})

export const LoginFormSchema = z.object({
    username: z
        .string()
        .min(1, { error: 'Please fill in the username' })
        .trim(),
    password: z
        .string()
        .min(1, { error: 'Please fill in the password' })
        .trim(),
})

export type SignupFormState = {
    errors: {
        errors: string[];
        properties?: {
            username?: {
                errors: string[];
            } | undefined;
            password?: {
                errors: string[];
            } | undefined;
        } | undefined;
    }
} | undefined

export type LoginFormState = {
    errors: {
        errors: string[];
        properties?: {
            username?: {
                errors: string[];
            } | undefined;
            password?: {
                errors: string[];
            } | undefined;
        } | undefined;
    }
} | undefined

export type SessionPayload = {
    userId: string,
    expiresAt: Date
}

export type User = {
    id: string,
    name: string
}

export const NOTE_EVENTS = {
    NEW_NOTE_CONTENT: 'new-note-content',
    NOTE_CONTENT_CHANGE: 'note-content-change',
    ERROR: 'error'
}
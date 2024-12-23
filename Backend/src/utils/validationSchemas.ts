import {z} from "zod";

export const createUserSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}).min(1, {message: "Email is required"}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}).min(1, {message: "Password is required"}),
    name: z.string().min(1, {message: "Name is required"}),
    phone: z.string().min(11, {message: "Phone must be atleast 8 digits"})
})

export const loginUserSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}).min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"})
})


import *as z from "zod"

export const signInSchema=z.object({
    identifier:z
    .string()
    .min(1,{message:"Email is required"})
    .email({message:"Please enter a valid email"}),
    password:z
    .string()
    .min(1,{message:"Password is required"})
    .min(8, { message: "password should be minumun of 8 characters" }),
})
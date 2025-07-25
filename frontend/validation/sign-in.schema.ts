import { InferType, number, object, string } from "yup";

export const signInSchema = object({
  email: string().email().required(),
  password: string().required(),
});

export type SignInType = InferType<typeof signInSchema>;

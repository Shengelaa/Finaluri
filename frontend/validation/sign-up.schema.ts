import { InferType, number, object, string } from "yup";

export const signUpSchema = object({
  name: string().required(),
  lastname: string().required(),
  email: string().email().required(),
  password: string().min(8).max(20).required(),
});

export type SignupType = InferType<typeof signUpSchema>;

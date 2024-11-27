import { z } from "zod";

export const RegisterSchema = z.object({
  displayName: z.string(),
  playerTag: z.string().min(1).max(4),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string(),
});

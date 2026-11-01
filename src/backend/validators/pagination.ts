import { z } from "zod";
import { validate } from "./validate";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function getPagination(request: Request) {
  const params = new URL(request.url).searchParams;
  return validate(paginationSchema, Object.fromEntries(params));
}

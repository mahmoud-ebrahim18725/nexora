import type { PaginationInput } from "@/backend/validators";

export function paginationArgs({ page, limit }: PaginationInput) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

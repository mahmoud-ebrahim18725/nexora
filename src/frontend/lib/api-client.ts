export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }
  return new ApiError("Something went wrong, please try again", 0);
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers:
      options.body === undefined
        ? undefined
        : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/")) {
      // A hard navigation: this runs outside React, so the router is not available.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
    throw new ApiError(
      payload?.error?.message ?? "Something went wrong, please try again",
      response.status,
      payload?.error?.details,
    );
  }
  return payload.data;
}

export async function fetchAll<T>(
  path: string,
  select: (data: never) => { items: T[]; total: number },
) {
  const items: T[] = [];
  for (let page = 1; ; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const data = await api<never>(`${path}${separator}page=${page}&limit=100`);
    const result = select(data);
    items.push(...result.items);
    if (items.length >= result.total || result.items.length === 0) {
      return items;
    }
  }
}

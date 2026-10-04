export function parseRouteId(id: string | string[] | undefined): number {
  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    return Number.NaN;
  }

  const parsed = Number(id);
  return Number.isSafeInteger(parsed) ? parsed : Number.NaN;
}
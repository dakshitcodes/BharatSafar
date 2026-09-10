export const STRAPI_BASE_URL = "http://localhost:1337";
export function getFullImageUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : STRAPI_BASE_URL + path;
}

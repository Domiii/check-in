export function getQueryString(key) {
  return new URLSearchParams(window.location.search.substring(1)).get(key);
}
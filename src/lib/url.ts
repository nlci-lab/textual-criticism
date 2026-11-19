// Every internal link goes through here so the base path stays a build setting (ADR 0001).
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const url = (path = '') => base + path.replace(/^\//, '');

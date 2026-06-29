export const stripHeading = (raw) => raw.replace(/^#+\s*/, '').trim();

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

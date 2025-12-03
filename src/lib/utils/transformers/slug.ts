export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with dashes
    .replace(/-+/g, '-')         // Replace multiple dashes with a single dash
}

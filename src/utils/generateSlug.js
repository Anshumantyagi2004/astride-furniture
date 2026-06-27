export const generateSlug = (text) => {
    // Ensure we always operate on a string; fall back to empty string for null/undefined
    const source = text == null ? "" : String(text);
    return source
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
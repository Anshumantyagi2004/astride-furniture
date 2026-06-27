
export const verifyAdmin = (req) => {
  const token = req.cookies.get("admin-token")?.value;

  if (!token || token !== "secret123") {
    return false;
  }
  return true;
};
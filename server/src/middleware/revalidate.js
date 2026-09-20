import { triggerRevalidate } from "../utils/revalidate.js";

// Maps a mutated API resource to the exact frontend cache tags it
// affects. Single choke point: any successful content mutation
// (POST/PUT/PATCH/DELETE outside /auth) purges only those tags,
// so untouched pages keep serving visitors from cache.
const tagsForPath = (rawPath) => {
  const path = rawPath.replace(/^\/api/, "");
  if (path.startsWith("/vehicles")) return ["home", "section:vehicles"];
  if (path.startsWith("/occasions")) return ["home", "section:occasions"];
  if (path.startsWith("/testimonials")) return ["home", "section:testimonials"];
  if (path.startsWith("/gallery")) return ["home", "section:gallery"];
  if (path.startsWith("/hero")) return ["home", "section:hero"];
  if (path.startsWith("/about")) return ["home", "section:about"];
  if (path.startsWith("/contact")) return ["home", "section:contact"];
  // SEO, schemas and anything else touch metadata everywhere.
  return ["site"];
};

const revalidateAfterMutation = (req, res, next) => {
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
    !req.path.startsWith("/auth") &&
    !req.path.endsWith("/inquiry")
  ) {
    res.on("finish", () => {
      if (res.statusCode < 400) triggerRevalidate(tagsForPath(req.path));
    });
  }
  next();
};

export { revalidateAfterMutation, tagsForPath };
export default revalidateAfterMutation;

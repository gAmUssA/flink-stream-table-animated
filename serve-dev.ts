import { serve, file } from "bun";
import { join, extname } from "path";

const PORT = 3000;
const SRC_DIR = "./src";

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".ts": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

async function buildTs(path: string): Promise<Response> {
  const result = await Bun.build({
    entrypoints: [path],
    format: "esm",
    target: "browser",
  });

  if (!result.success) {
    console.error("Build failed:", result.logs);
    return new Response("Build failed", { status: 500 });
  }

  const output = await result.outputs[0].text();
  return new Response(output, {
    headers: { "Content-Type": "application/javascript" },
  });
}

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // Serve index.html for root
    if (pathname === "/" || pathname === "/index.html") {
      pathname = "/index.html";
    }

    // Handle images from root /images path
    if (pathname.startsWith("/images/")) {
      const imagePath = join(".", pathname);
      const imageFile = file(imagePath);
      if (await imageFile.exists()) {
        const ext = extname(pathname);
        return new Response(imageFile, {
          headers: { "Content-Type": mimeTypes[ext] || "application/octet-stream" },
        });
      }
    }

    const filePath = join(SRC_DIR, pathname);
    const ext = extname(pathname);

    // Handle TypeScript files - build on the fly
    if (ext === ".ts") {
      return buildTs(filePath);
    }

    // Handle CSS files
    if (ext === ".css") {
      const cssFile = file(filePath);
      if (await cssFile.exists()) {
        return new Response(cssFile, {
          headers: { "Content-Type": "text/css" },
        });
      }
    }

    // Handle other static files
    const staticFile = file(filePath);
    if (await staticFile.exists()) {
      return new Response(staticFile, {
        headers: { "Content-Type": mimeTypes[ext] || "text/plain" },
      });
    }

    // 404
    return new Response("Not found", { status: 404 });
  },
});

console.log(`🚀 Dev server running at http://localhost:${PORT}`);

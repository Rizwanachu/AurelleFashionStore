import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    // Fallback for Vercel or other environments where public might be at root
    const rootPublicPath = path.resolve(process.cwd(), "dist", "public");
    if (fs.existsSync(rootPublicPath)) {
      app.use(express.static(rootPublicPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve(rootPublicPath, "index.html"));
      });
      return;
    }
    
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

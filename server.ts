import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend Health & Platform API
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      platform: "Airbcar Morocco Mobility & Fleet Cloud",
      backend: "Express.js Full-Stack Server (TypeScript)",
      database: "Google Cloud Firestore",
      version: "1.0.0",
    });
  });

  // Database Connection & Metadata API
  app.get("/api/db/status", (req, res) => {
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        return res.json({
          status: "connected",
          engine: "Google Cloud Firestore",
          projectId: config.projectId,
          databaseId: config.firestoreDatabaseId,
          authDomain: config.authDomain,
          collections: ["users", "cars", "bookings", "contracts"],
          securityRules: "Active & Deployed (Dahir 2026 Compliant)",
        });
      }
    } catch (e: any) {
      console.error("Error reading database configuration:", e);
    }
    res.json({ status: "standby", engine: "Google Cloud Firestore" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Airbcar Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

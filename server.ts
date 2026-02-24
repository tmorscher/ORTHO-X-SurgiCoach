import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database setup
  const db = new Database("ortho_x.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      patient_uuid TEXT,
      patient_name TEXT,
      diagnosis TEXT,
      treatment_plan TEXT,
      implant_choice TEXT,
      outcome_notes TEXT,
      low_resource_mode INTEGER DEFAULT 0,
      phi_confirmed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      case_id TEXT,
      content TEXT,
      source_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(case_id) REFERENCES cases(id)
    );
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      case_id TEXT,
      type TEXT,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(case_id) REFERENCES cases(id)
    );
  `);

  // API Routes
  app.get("/api/cases", (req, res) => {
    const cases = db.prepare("SELECT * FROM cases ORDER BY created_at DESC").all();
    res.json(cases);
  });

  app.post("/api/cases", (req, res) => {
    const { id, patient_uuid, patient_name, low_resource_mode } = req.body;
    db.prepare("INSERT INTO cases (id, patient_uuid, patient_name, low_resource_mode) VALUES (?, ?, ?, ?)")
      .run(id, patient_uuid, patient_name, low_resource_mode ? 1 : 0);
    res.json({ success: true });
  });

  app.get("/api/cases/:id", (req, res) => {
    const caseData = db.prepare("SELECT * FROM cases WHERE id = ?").get(req.params.id);
    const notes = db.prepare("SELECT * FROM notes WHERE case_id = ?").all(req.params.id);
    const media = db.prepare("SELECT * FROM media WHERE case_id = ?").all(req.params.id);
    res.json({ ...caseData, notes, media });
  });

  app.patch("/api/cases/:id", (req, res) => {
    const { diagnosis, treatment_plan, implant_choice, outcome_notes, low_resource_mode, phi_confirmed } = req.body;
    db.prepare(`
      UPDATE cases 
      SET diagnosis = COALESCE(?, diagnosis),
          treatment_plan = COALESCE(?, treatment_plan),
          implant_choice = COALESCE(?, implant_choice),
          outcome_notes = COALESCE(?, outcome_notes),
          low_resource_mode = COALESCE(?, low_resource_mode),
          phi_confirmed = COALESCE(?, phi_confirmed)
      WHERE id = ?
    `).run(
      diagnosis, 
      treatment_plan, 
      implant_choice, 
      outcome_notes, 
      low_resource_mode !== undefined ? (low_resource_mode ? 1 : 0) : null,
      phi_confirmed !== undefined ? (phi_confirmed ? 1 : 0) : null,
      req.params.id
    );
    res.json({ success: true });
  });

  app.post("/api/media", (req, res) => {
    const { id, case_id, type, url } = req.body;
    db.prepare("INSERT INTO media (id, case_id, type, url) VALUES (?, ?, ?, ?)").run(id, case_id, type, url);
    res.json({ success: true });
  });

  app.post("/api/notes", (req, res) => {
    const { id, case_id, content, source_url } = req.body;
    db.prepare("INSERT INTO notes (id, case_id, content, source_url) VALUES (?, ?, ?, ?)").run(id, case_id, content, source_url);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

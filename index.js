import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import courseRouter from "./routes/courses.js";
import { uploadFile } from "./utils/uploadFile.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV == "development") {
  var BASE_URL = "http://localhost";
  morgan.token("host", function (req, res) {
    return req.hostname;
  });
  // ":id :method :host :status :res[content-length] :date[web] :response-time ms"
  app.use(
    morgan(
      ":remote-addr ':host'  :remote-user [:date[clf]] ':method :url HTTP/:http-version' :status :response-time ms - :res[content-length] ':referrer'"
    )
  );
} else {
  var BASE_URL = process.env.BASE_URL;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let loggedIn = false;

app.get("/", function (req, res) {
  res.send("Go To /login");
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "login.html"));
});
app.get("/logout", (req, res) => {
  loggedIn = false;
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  const uname = "john";
  const pass = "password";
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide Username & Password!");
  }

  if (username !== uname || password !== pass) {
    return res
      .status(400)
      .send("Access denied - Password or Username is incorrect!");
  }

  loggedIn = true;
  res.redirect("/node-course");
});

app.get("/node-course", (req, res) => {
  try {
    if (loggedIn) {
      return res.sendFile(path.join(__dirname, "Public", "node-course.html"));
    }
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
});
// Upload images endpoint
app.post("/api/upload", uploadFile);
app.use("/api/courses", courseRouter);
app.listen(PORT, () =>
  console.log(`Course Server listening on ${BASE_URL}:${PORT}`)
);

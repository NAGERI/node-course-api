import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import uuid from "node-uuid";

import path from 'path';
import { fileURLToPath } from 'url';

// import loginRouter from "./routes/auth.js";
import courseRouter from "./routes/courses.js";

const app = express();
app.use(express.json());
app.use(assignId);
app.use(cors());
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV == "development") {
   var BASE_URL = "http://localhost";
  morgan.token("host", function (req, res) {
    return req.hostname;
  });
  morgan.token("id", function getId(req) {
    return req.id;
  });
  app.use(
    morgan(
      ":id :method :host :status :res[content-length] :date[web] :response-time ms"
    )
  );
} else{
   var BASE_URL = process.env.BASE_URL;
}
function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.use("/login",  (req,res)=>{
res.sendFile(path.join(__dirname,"public","login.html"))
});
app.use("/node-course", (req,res)=>{
res.sendFile(path.join(__dirname,"public","node-course.html"))
});
app.use("/api/courses", courseRouter);
app.listen(PORT, () =>
  console.log(`Course Server listening on ${BASE_URL}:${PORT}`)
);

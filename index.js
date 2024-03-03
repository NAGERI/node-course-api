import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import uuid from "node-uuid";

import loginRouter from "./routes/auth.js";
import courseRouter from "./routes/course.js";

const app = express();
app.use(express.json());
app.use(assignId);
app.use(cors());

if (process.env.NODE_ENV == "development") {
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
}
function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.use("/login", loginRouter);
app.use("/node-course", courseRouter);

app.listen(process.env.PORT, () =>
  console.log(`File Server app listening on port ${process.env.PORT}!`)
);

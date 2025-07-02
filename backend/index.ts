import express from "express";
import { exec, spawn } from "child_process";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("dist"));

app.get("/api/info", (req, res) => {
  const child = exec("sh -c 'ncdu /drive -o -'", (err, stdout, stderr) => {
    res.send({err, stdout, stderr})
  });
  req.on("close", () => {
    child.kill();
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

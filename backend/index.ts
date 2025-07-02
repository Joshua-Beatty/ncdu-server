import express from "express";
import { spawn } from "child_process";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("dist"));

app.get("/api/info", (req, res) => {
    // sh -c "ncdu /drive -o -"
  const child = spawn("sh", ["-c", "ncdu /drive -o - | tr -d '\\n\\r'"]);
  req.on("close", () => {
    child.kill();
  });

  child.stdout.on("data", (data) => {
    res.write(data)
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//   const child = exec("sh -c 'ncdu /drive -o -'", (err, stdout, stderr) => {
//     res.send({err, stdout, stderr})
//   });
//   req.on("close", () => {
//     child.kill();
//   });
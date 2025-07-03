import express from "express";
import { spawn } from "child_process";
import stripAnsi from "strip-ansi"
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("dist"));

app.get("/api/start", (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  
  const child = spawn('script', ['-q', '-c', 'ncdu /drive -o /output.json'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    res.write(stripAnsi(data.toString()))
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.write(`code: ${code}`)
    res.end()
  });
});

app.get("/api/output", (req, res) => {
  res.sendFile("/output.json")
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
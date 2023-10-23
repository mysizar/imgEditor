import express from "express";
// import * as fs from "fs";
import { imgResize, imgCrop /*imgMirror, imgGrayscale*/ } from "./functions";

const app = express();
const port = 4000;

app.listen(port, () => console.log(`The server is listening on port ${port}`));
app.use(express.static("public"));
app.use(express.json({ limit: "500mb" }));

// let newImage = false;
// export let lastPath = "./img/init.png";

// app.post("/api", (request, response) => {
//   console.log("\nI got a request!", new Date());
//   console.log(request.body);

//   const img = request.body.b64str;

//   // strip off the data: url prefix to get just the base64-encoded bytes
//   let data = img.replace(/^data:image\/\w+;base64,/, "");
//   let buf = Buffer.from(data, "base64");
//   fs.writeFile("./img/init.png", buf, (err) => {
//     if (err) throw err;
//     console.log("Original file Saved!\n");
//     lastPath = "./img/init.png";
//   });

//   response.json({
//     status: "success",
//     added: img,
//   });
// });

app.post("/resize", async (request, response) => {
  console.log("\nI got a resize request!", new Date());
  console.log(request.body);

  const w = request.body.w;
  const h = request.body.h;
  const data = request.body.b64.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  const base64 = await imgResize(w, h, buf);
  // lastPath = "./img/init-res.png";

  response.json({
    status: "success",
    resized: base64,
  });
});

app.post("/crop", async (request, response) => {
  console.log("\nI got a crop request!", new Date());
  console.log(request.body);

  const { x, y, w, h, b64 } = request.body;
  const data = b64.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  const base64 = await imgCrop(x, y, w, h, buf);

  response.json({
    status: "success",
    cropped: base64,
  });
});

// app.post("/mirror", async (request, response) => {
//   console.log("\nI got a mirror request!", new Date());
//   console.log(request.body);

//   const x = request.body.x;
//   const y = request.body.y;
//   const base64 = await imgMirror(x, y);
//   lastPath = "./img/init-mirror.png";

//   response.json({
//     status: "success",
//     mirrored: base64,
//   });
// });

// app.post("/grayscale", async (request, response) => {
//   console.log("\nI got a grayscale request!", new Date());
//   console.log(request.body);

//   const base64 = await imgGrayscale();
//   lastPath = "./img/init-grayscale.png";

//   response.json({
//     status: "success",
//     grayscale: base64,
//   });
// });

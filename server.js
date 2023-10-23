import express from "express";
import { imgResize, imgCrop } from "./functions";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(express.json({ limit: "500mb" }));

app.post("/resize", async (request, response) => {
  console.log("\nI got a resize request!", new Date());
  console.log(request.body);

  const w = request.body.w;
  const h = request.body.h;
  const data = request.body.b64.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  const savePath = await imgResize(w, h, buf);

  response.json({
    status: "success",
    resized: savePath,
  });
});

app.post("/crop", async (request, response) => {
  console.log("\nI got a crop request!", new Date());
  console.log(request.body);

  const { x, y, w, h, b64 } = request.body;
  const data = b64.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  const savePath = await imgCrop(x, y, w, h, buf);

  response.json({
    status: "success",
    cropped: savePath,
  });
});

app.listen(port, () => console.log(`The server is listening on port ${port}`));

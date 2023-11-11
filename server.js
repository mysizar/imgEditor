import express from "express";

import { resizeChecker } from "./middleware/resizeChecker.js";
import { cropChecker } from "./middleware/cropChecker.js";
import { resizeController } from "./controllers/resize.controller.js";
import { cropController } from "./controllers/crop.controller.js";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(express.json({ limit: "500mb" }));

app.post("/resize", resizeChecker, resizeController);

app.post("/crop", cropChecker, cropController);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.code || 500).json({
    status: "error",
    message: err.message || "Server Error",
  });
});

app.get("/cron", (req, res) => res.status(200).json({ status: "OK" }));

app.listen(port, () => console.log(`The server is listening on port ${port}`));

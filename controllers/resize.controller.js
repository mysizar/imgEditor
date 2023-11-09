import { imgResize } from "../lib/functions.js";

export async function resizeController(request, response, next) {
  try {
    console.log("\nI got a resize request!", new Date());
    console.log(request.body);

    const w = request.body.w;
    const h = request.body.h;
    const data = request.body.b64.replace(/^data:image\/\w+;base64,/, "");
    const buf = data.endsWith(".jpg") ? data : Buffer.from(data, "base64");
    const savePath = await imgResize(w, h, buf);

    response.json({
      status: "success",
      resized: savePath,
    });
  } catch (error) {
    next(error);
  }
}

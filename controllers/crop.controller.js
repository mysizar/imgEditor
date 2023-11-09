import { imgCrop } from "../lib/functions.js";

export async function cropController(request, response, next) {
  try {
    console.log("\nI got a crop request!", new Date());
    console.log(request.body);

    const { x, y, w, h, b64 } = request.body;
    const data = b64.replace(/^data:image\/\w+;base64,/, "");
    const buf = data.endsWith(".jpg") ? data : Buffer.from(data, "base64");
    const savePath = await imgCrop(x, y, w, h, buf);

    response.json({
      status: "success",
      cropped: savePath,
    });
  } catch (error) {
    next(error);
  }
}

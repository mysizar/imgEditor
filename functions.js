import Jimp from "jimp";
// import { lastPath } from "./server";

export async function imgResize(w = Jimp.AUTO, h = Jimp.AUTO, buf) {
  // const path = lastPath;
  // const savePath = "./img/init-res.png";

  const file = await Jimp.read(buf);
  const res = await file.resize(w, h);
  // const quality = await res.quality(10);
  // const save = await res.write(savePath);

  if (res) console.log("Successfully resized\n");

  const b64 = await res.getBase64Async(Jimp.AUTO);

  // lastPath = savePath;
  return b64;
}

export async function imgCrop(x, y, w, h, buf) {
  // const path = lastPath;
  // const savePath = "./img/init-res.png";

  const file = await Jimp.read(buf);
  const cropped = await file.crop(x, y, w, h);
  // const quality = await res.quality(10);
  // const save = await res.write(savePath);

  if (cropped) console.log("Successfully cropped\n");

  const b64 = await cropped.getBase64Async(Jimp.AUTO);

  // lastPath = savePath;
  return b64;
}

// export async function imgMirror(x = false, y = false) {
//   const path = lastPath;
//   const savePath = "./img/init-mirror.png";

//   const file = await Jimp.read(path);
//   const res = await file.mirror(x, y);
//   const save = await res.write(savePath);

//   if (save) console.log("Mirrored file Saved\n");

//   const b64 = await res.getBase64Async(Jimp.AUTO);
//   return b64;
// }

// export async function imgGrayscale() {
//   const path = lastPath;
//   const savePath = "./img/init-grayscale.png";

//   const file = await Jimp.read(path);
//   const res = await file.greyscale();
//   const save = await res.write(savePath);

//   if (save) console.log("Grayscale file Saved\n");

//   const b64 = await res.getBase64Async(Jimp.AUTO);
//   return b64;
// }
import Jimp from "jimp";

export async function imgResize(w = Jimp.AUTO, h = Jimp.AUTO, buf) {
  const savePath = "./public/output/resize.jpg";

  const file = await Jimp.read(buf);
  const res = await file.resize(w, h);
  const quality = await res.quality(99);
  const save = await quality.write(savePath);

  if (save) console.log("Successfully resized\n");

  return savePath.slice(8);
}

export async function imgCrop(x, y, w, h, buf) {
  const savePath = "./public/output/crop.jpg";

  const file = await Jimp.read(buf);
  const cropped = await file.crop(x, y, w, h);
  const quality = await cropped.quality(99);
  const save = await quality.write(savePath);

  if (save) console.log("Successfully cropped\n");

  return savePath.slice(8);
}

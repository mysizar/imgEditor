import { errorCreator } from "../lib/errorCreator.js";

export const resizeChecker = (req, res, next) => {
  const { w, h, b64 } = req.body;

  if (isNaN(w) && isNaN(h)) {
    next(errorCreator(`Bad width or height`, 400));
    return;
  }

  if (!b64) {
    next(errorCreator(`No / Bad image`, 400));
    return;
  }
  next();
};

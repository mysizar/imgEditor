import { errorCreator } from "../lib/errorCreator.js";

export const cropChecker = (req, res, next) => {
  const { x1, x2, w, h, b64 } = req.body;

  if (isNaN(x1) && isNaN(x2) && isNaN(w) && isNaN(h)) {
    next(errorCreator(`Bad coordinates`, 400));
    return;
  }

  if (!b64) {
    next(errorCreator(`No / Bad image`, 400));
    return;
  }
  next();
};

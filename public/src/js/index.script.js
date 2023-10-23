/* --------------- drag and drop code --------------- */

// prevent drop the file outside of the upload area
window.addEventListener("dragover", (event) => {
  event.preventDefault();
});
window.addEventListener("drop", (event) => {
  event.preventDefault();
});

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  document.getElementById("loader-ring").classList.add("loader-ring");
  file = this.files[0];

  // check file type
  if (!file) return;
  if (file.type.includes("image")) {
    loadNewImage(); //calling function
  } else {
    alert("The file is not an image!");
    document.getElementById("loader-ring").classList.remove("loader-ring");
  }
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  document.getElementById("loader-ring").classList.add("loader-ring");
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];

  // check file type
  if (!file) return;
  if (file.type.includes("image")) {
    loadNewImage(); //calling function
  } else {
    alert("The file is not an image!");
    document.getElementById("loader-ring").classList.remove("loader-ring");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
});

/* ---------------------------------------------------- */

/* --------------- filter & canvas code --------------- */

const /* fileInput = document.querySelector(".file-input"),*/
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  // applyChangesBtn = document.querySelector(".apply-changes"),
  resetImageBtn = document.querySelector("#reset-image"),
  changeImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");

let brightness = "100",
  saturation = "100",
  contrast = "100",
  grayscale = "0";
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const loadNewImage = () => {
  //   let file = fileInput.files[0];
  //   sendImage();
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
    document.getElementById("upload-area").style.display = "none";
  });
};

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "contrast") {
      filterSlider.max = "200";
      filterSlider.value = contrast;
      filterValue.innerText = `${contrast}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "contrast") {
    contrast = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
      fixPreview();
    } else if (option.id === "right") {
      rotate += 90;
      fixPreview();
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  contrast = "100";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
  // reset rotate-fixPreview
  previewImg.style.width = "";
  // disable crop area
  if (document.getElementById("activateGrid").checked === true) {
    document.getElementById("activateGrid").checked = false;
    document.getElementById("imageTemplate").style.display = "none";
    rect.inset = "10%";
  }
  cropBtn.disabled = true;
};

const getFilteredImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const sx = previewImg.naturalWidth;
  const sy = previewImg.naturalHeight;

  const count = rotate / 90;
  if (count % 2 === 1 || count % 2 === -1) {
    canvas.width = previewImg.naturalHeight;
    canvas.height = previewImg.naturalWidth;
  } else {
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
  }

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -sx / 2, -sy / 2);

  return canvas.toDataURL();
};

// const loadFilteredImage = () => {
//   // TODO: animation + text: processing image
//   previewImg.src = getFilteredImage();
// };

const saveImage = async () => {
  // TODO: check if filters is apply?
  // TODO: which quality?
  const link = document.createElement("a");
  link.href = await checkChanges();
  link.download = "image.png";
  link.click();
};

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
// applyChangesBtn.addEventListener("click", loadFilteredImage);
resetImageBtn.addEventListener("click", loadNewImage);
saveImgBtn.addEventListener("click", saveImage);
changeImgBtn.addEventListener("click", () => input.click());

/* ---------------------------------------------------- */

/* ------------------ resize section ------------------ */

// resize global variables
let wasImageChanged = false;
const resizeW = document.getElementById("resizeW"),
  resizeH = document.getElementById("resizeH"),
  resizeBtn = document.getElementById("resizeBtn");

/*** server communication code ***/

// send RESIZE parameters and get new image data
async function resizeImg() {
  // set waiting animation
  document.getElementById("overlay").style.display = "flex";

  const b64str = await checkChanges();
  const inputW = parseInt(resizeW.value);
  const inputH = parseInt(resizeH.value);

  if (isNaN(inputW) && isNaN(inputH)) return;
  // console.log(inputW, inputH);

  let data = { b64: b64str };

  if (isNaN(inputW)) {
    data.h = inputH;
  } else if (isNaN(inputH)) {
    data.w = inputW;
  } else {
    data.w = inputW;
    data.h = inputH;
  }

  // fetch options
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // get response from server
  const response = await fetch("/resize", options);
  const json = await response.json();
  console.log(json);

  // clear values
  resizeW.value = "";
  resizeH.value = "";
  resizeBtn.disabled = true;
  previewImg.style.width = "";
  previewImg.style.height = "";

  // show resized img from server
  previewImg.src = json.resized;
  // disable animation after loading the picture
  previewImg.addEventListener("load", () => {
    document.getElementById("overlay").style.display = "none";
  });
}

resizeBtn.addEventListener("click", resizeImg);
resizeH.addEventListener("keyup", checkResizeValue);
resizeW.addEventListener("keyup", checkResizeValue);

/* ---------------------------------------------------- */

/* ------------------- crop section ------------------- */

const inputCropArea = document.getElementById("activateGrid");
const imgContainer = document.querySelector(".preview-img");
const lt = document.getElementById("lt");
const lb = document.getElementById("lb");
const rt = document.getElementById("rt");
const rb = document.getElementById("rb");
const cn = document.getElementById("cnr");
const rect = document.getElementById("rect-border").style;
const cropBtn = document.getElementById("cropBtn");
let direction = "";
let coordinates = {};
let box = {};
let borderPos = {};

function showCropArea() {
  const imgTemplate = document.getElementById("imageTemplate");
  console.log("preview:", previewImg.clientWidth, previewImg.clientHeight);
  if (inputCropArea.checked) {
    let count = rotate / 90;
    if (count % 2 === 1 || count % 2 === -1) {
      imgTemplate.style.width = previewImg.offsetHeight + "px";
      imgTemplate.style.height = previewImg.offsetWidth + "px";
    } else {
      imgTemplate.style.width = previewImg.offsetWidth + "px";
      imgTemplate.style.height = previewImg.offsetHeight + "px";
    }

    setInitCoordinates();

    cropBtn.disabled = false;
    imgTemplate.style.display = "block";
  } else {
    cropBtn.disabled = true;
    imgTemplate.style.display = "none";
    rect.inset = "10%";
  }
}

function setInitCoordinates() {
  box = previewImg.getBoundingClientRect();
  let naturalWidth, naturalHeight;
  let count = rotate / 90;
  if (count % 2 === 1 || count % 2 === -1) {
    naturalWidth = previewImg.naturalHeight;
    naturalHeight = previewImg.naturalWidth;
  } else {
    naturalWidth = previewImg.naturalWidth;
    naturalHeight = previewImg.naturalHeight;
  }

  let x1, x2, y1, y2;
  x1 = parseInt(naturalWidth * 0.1);
  x2 = parseInt(naturalWidth * 0.9);
  y1 = parseInt(naturalHeight * 0.1);
  y2 = parseInt(naturalHeight * 0.9);
  coordinates = { x1, x2, y1, y2 };
  console.log("init natural size:", coordinates);
}

function setMouseStatus(position, e) {
  direction = position;
  box = previewImg.getBoundingClientRect();

  if (position === "cn") {
    const brd = cn.getBoundingClientRect();
    borderPos = {
      xClick: e.clientX - box.x || e.touches[0].pageX - box.x,
      yClick: e.clientY - box.y || e.touches[0].pageY - box.y,
      x1: brd.x - box.x - 1,
      x2: box.width - brd.width - (brd.x - box.x) - 1,
      y1: brd.y - box.y - 1,
      y2: box.height - brd.height - (brd.y - box.y) - 1,
      w: brd.width,
      h: brd.height,
    };
  }

  document.addEventListener("mousemove", moveRect);
  document.addEventListener("touchmove", moveRect);
}

function removeMouseStatus() {
  direction = "";
  document.removeEventListener("mousemove", moveRect);
  document.removeEventListener("touchmove", moveRect);
}

function moveRect(e) {
  // get global position of pointer
  let xGlobal, yGlobal;
  if (e.type == "touchmove") {
    let touch = e.touches[0] || e.changedTouches[0];
    xGlobal = touch.pageX;
    yGlobal = touch.pageY;
  } else if (e.type == "mousemove") {
    xGlobal = e.clientX;
    yGlobal = e.clientY;
  }
  // get local position of pointer
  let x = xGlobal - box.x;
  let y = yGlobal - box.y;

  // show actual coordinates of pointer
  // document.getElementById("test").innerHTML = `"x: ${x}, y: ${y}`;

  switch (direction) {
    case "lt":
      rect.left = x + "px";
      rect.top = y + "px";
      if (x < 0) {
        rect.left = "0px";
        if (y < 0) rect.top = "0px";
        if (y > box.height) rect.top = box.height + "px";
      } else if (y < 0) {
        rect.top = "0px";
        if (x < 0) rect.left = "0px";
        if (x > box.width) rect.left = box.width + "px";
      } else if (y < 0 && x < 0) {
        rect.top = "0px";
        rect.left = "0px";
      } else {
        if (y < 0) rect.top = "0px";
        if (y > box.height) rect.top = box.height + "px";
        if (x > box.width) rect.left = box.width + "px";
      }
      break;
    case "lb":
      rect.left = x + "px";
      rect.bottom = box.height - y + "px";
      if (x < 0) {
        rect.left = "0px";
        if (y > box.height) rect.bottom = "0px";
      } else if (y > box.height) {
        rect.bottom = "0px";
        if (x > box.width) rect.left = box.width + "px";
      } else if (y > box.height && x < 0) {
        rect.bottom = "0px";
        rect.left = "0px";
      } else {
        if (x > box.width) rect.left = box.width + "px";
      }
      break;
    case "rt":
      rect.right = box.width - x + "px";
      rect.top = y + "px";
      if (x > box.width) {
        rect.right = "0px";
        if (y < 0) rect.top = "0px";
        if (y > box.height) rect.top = box.height + "px";
      } else if (y < 0) {
        rect.top = "0px";
      } else if (y < 0 && x > box.width) {
        rect.top = "0px";
        rect.right = "0px";
      } else {
        if (y > box.height) rect.top = box.height + "px";
      }
      break;
    case "rb":
      rect.right = box.width - x + "px";
      rect.bottom = box.height - y + "px";
      if (x > box.width) {
        rect.right = "0px";
        if (y > box.height) rect.bottom = "0px";
      } else if (y > box.height) {
        rect.bottom = "0px";
      } else if (y > box.height && x > box.width) {
        rect.bottom = "0px";
        rect.right = "0px";
      }
      break;
    case "cn":
      // get initial border parameters and convert them into CSS-prop
      let { xClick, yClick, x1, x2, y1, y2, w, h } = borderPos;
      let left = x1 + (x - xClick);
      let right = x2 - (x - xClick);
      let top = y1 + (y - yClick);
      let bottom = y2 - (y - yClick);

      rect.left = left + "px";
      rect.right = right + "px";
      rect.top = top + "px";
      rect.bottom = bottom + "px";

      if (left <= 0) {
        rect.left = 0 + "px";
        rect.right = box.width - w + "px";
      }
      if (top <= 0) {
        rect.top = 0 + "px";
        rect.bottom = box.height - h + "px";
      }
      if (bottom <= 0) {
        rect.bottom = 0 + "px";
        rect.top = box.height - h + "px";
      }
      if (right <= 0) {
        rect.right = 0 + "px";
        rect.left = box.width - w + "px";
      }
      break;
  }

  // change properties if image is rotated
  let naturalWidth, naturalHeight;
  let count = rotate / 90;
  if (count % 2 === 1 || count % 2 === -1) {
    naturalWidth = previewImg.naturalHeight;
    naturalHeight = previewImg.naturalWidth;
  } else {
    naturalWidth = previewImg.naturalWidth;
    naturalHeight = previewImg.naturalHeight;
  }

  let { x1, x2, y1, y2 } = coordinates;

  // set new natural coordinates
  if (rect.left.includes("px"))
    x1 = parseInt((naturalWidth / box.width) * parseFloat(rect.left));

  if (rect.right.includes("px"))
    x2 = parseInt(
      (naturalWidth / box.width) * (box.width - parseFloat(rect.right))
    );

  if (rect.top.includes("px"))
    y1 = parseInt((naturalHeight / box.height) * parseFloat(rect.top));

  if (rect.bottom.includes("px"))
    y2 = parseInt(
      (naturalHeight / box.height) * (box.height - parseFloat(rect.bottom))
    );

  // save new natural coordinates
  coordinates = { x1, x2, y1, y2 };
  console.log("changed natural size", coordinates);
}

// event listeners

inputCropArea.addEventListener("click", showCropArea);

lt.addEventListener("touchstart", () => setMouseStatus("lt"));
lb.addEventListener("touchstart", () => setMouseStatus("lb"));
rt.addEventListener("touchstart", () => setMouseStatus("rt"));
rb.addEventListener("touchstart", () => setMouseStatus("rb"));
cn.addEventListener("touchstart", (e) => setMouseStatus("cn", e));

lt.addEventListener("mousedown", () => setMouseStatus("lt"));
lb.addEventListener("mousedown", () => setMouseStatus("lb"));
rt.addEventListener("mousedown", () => setMouseStatus("rt"));
rb.addEventListener("mousedown", () => setMouseStatus("rb"));
cn.addEventListener("mousedown", (e) => setMouseStatus("cn", e));

imgContainer.addEventListener("mousedown", (e) => e.preventDefault());
imgContainer.addEventListener("touchstart", (e) => e.preventDefault());

document.addEventListener("mouseup", removeMouseStatus);
document.addEventListener("touchend", removeMouseStatus);

cropBtn.addEventListener("click", cropImg);
window.addEventListener("resize", () => {
  inputCropArea.click();
  inputCropArea.click();
});

/*** server communication code ***/

// send CROP parameters and get new image data
async function cropImg() {
  // TODO: Loader Animation
  document.getElementById("overlay").style.display = "flex";

  const b64str = await checkChanges();
  const { x1, x2, y1, y2 } = coordinates;

  if (isNaN(x1) && isNaN(x2) && isNaN(y1) && isNaN(y2)) return;

  // console.log(x1,x2,y1,y2);

  let data = { x: x1, y: y1, w: x2 - x1, h: y2 - y1, b64: b64str };

  console.log(data);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // get response from server
  const response = await fetch("/crop", options);
  const json = await response.json();
  console.log(json);

  // clear values
  cropBtn.disabled = true;
  previewImg.style.width = "";
  previewImg.style.height = "";

  // show resized img from server
  previewImg.src = json.cropped;

  // disable animation after loading the picture
  previewImg.addEventListener("load", () => {
    document.getElementById("overlay").style.display = "none";
  });
}

/* ---------------------------------------------------- */

/* -------------- additionally functions -------------- */

async function checkChanges() {
  let b64 = "";
  if (previewImg.src.includes("blob:")) {
    b64 = await getFilteredImage();
    console.log("filtered/decoded with canvas");
    wasImageChanged = true;
    return b64;
  } else if (
    wasImageChanged &&
    (brightness !== "100" ||
      saturation !== "100" ||
      contrast !== "100" ||
      grayscale !== "0" ||
      rotate !== 0 ||
      flipHorizontal !== 1 ||
      flipVertical !== 1)
  ) {
    b64 = await getFilteredImage();
    console.log("filtered with canvas");
    return b64;
  } else {
    b64 = previewImg.src;
    console.log("without changes");
    return b64;
  }
}

function checkResizeValue() {
  const regEx = /^[0-9]+$/g;
  if (regEx.test(resizeW.value) || regEx.test(resizeH.value)) {
    resizeBtn.disabled = false;
  } else {
    resizeBtn.disabled = true;
  }
}

function fixPreview() {
  // rotate + resize part
  let count = rotate / 90;
  if (
    previewImg.offsetWidth > imgContainer.offsetHeight &&
    (count % 2 === 1 || count % 2 === -1)
  ) {
    imgContainer.style.height = imgContainer.offsetHeight + "px";
    previewImg.style.width = imgContainer.offsetHeight + "px";
  } else if (
    previewImg.offsetHeight > previewImg.offsetWidth &&
    (count % 2 === 1 || count % 2 === -1)
  ) {
    previewImg.style.height = imgContainer.offsetWidth + "px";
    previewImg.style.maxHeight = imgContainer.offsetWidth + "px";
  } else {
    imgContainer.style.height = "";
    previewImg.style.width = "";
    previewImg.style.height = "";
    previewImg.style.maxHeight = "";
  }
  // crop area part
  setInitCoordinates();
  rect.inset = "10%";
  const imgTemplate = document.getElementById("imageTemplate");
  if (count % 2 === 1 || count % 2 === -1) {
    imgTemplate.style.width = previewImg.offsetHeight + "px";
    imgTemplate.style.height = previewImg.offsetWidth + "px";
  } else {
    imgTemplate.style.width = previewImg.offsetWidth + "px";
    imgTemplate.style.height = previewImg.offsetHeight + "px";
  }
}

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------

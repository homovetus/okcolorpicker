const { setup_view_handler, clamp } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");

class Slider2D {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setSVComponent(view_id, manipulator) {
    this.view = document.getElementById(view_id);
    this.manipulator = document.getElementById(manipulator);

    let width = this.view.width;
    let height = this.view.height;

    setup_view_handler(this.view, (x, y) => {
      this.okhsv.s = clamp(x / width);
      this.okhsv.v = clamp(1 - y / height);
    });

    document.addEventListener("saturationChange", () => {
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsv.s}, ${height * (1 - this.okhsv.v)})`,
      );
    });
    document.addEventListener("valueChange", () => {
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsv.s}, ${height * (1 - this.okhsv.v)})`,
      );
    });

    document.addEventListener("hueChange", () => {
      let url = this.render_sv(width, height);
      this.view.src = url;
    });
  }

  //render_sv(width, height) {
  //  let canvas = document.createElement("canvas");
  //  canvas.width = this.view.width;
  //  canvas.height = this.view.height;
  //  let ctx = canvas.getContext("2d");
  //
  //  let colors = new Uint8ClampedArray(width * height * 4);
  //  for (let i = 0; i < height; i++) {
  //    for (let j = 0; j < width; j++) {
  //      let [r, g, b] = okhsl_to_srgb(this.okhsv.h, j / width, 1 - i / height);
  //      colors.set([r, g, b, 255], (i * width + j) * 4);
  //    }
  //  }
  //
  //  let img = new ImageData(colors, width, height);
  //  ctx.putImageData(img, 0, 0);
  //  let url = canvas.toDataURL();
  //  return url;
  //}
  render_sv(width, height) {
    const pixelCount = width * height;
    let buffer = new ArrayBuffer(pixelCount * 3); // 3 bytes per pixel (RGB)
    let colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let [r, g, b] = okhsl_to_srgb(this.okhsv.h, j / width, 1 - i / height);
        let index = (i * width + j) * 3;
        colorArrayView[index] = r;
        colorArrayView[index + 1] = g;
        colorArrayView[index + 2] = b;
      }
    }

    // Creating ImageBlob metadata
    const imageMetaData = {
      width: width,
      height: height,
      colorSpace: "RGB",
      colorProfile: "",
      pixelFormat: "RGB",
      components: 3,
      componentSize: 8,
      hasAlpha: false,
      type: "image/uncompressed",
    };

    // Create an ImageBlob from the color array
    let imageBlob = new ImageBlob(colorArrayView, imageMetaData);

    // Generate a URL that can be used as the image source
    const url = URL.createObjectURL(imageBlob);

    // Revoke the URL to free up memory after it’s no longer needed
    //URL.revokeObjectURL(url);

    return url;
  }
}

module.exports = Slider2D;

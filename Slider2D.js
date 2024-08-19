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

    let debounceTimeout;
    const debounceDelay = 100; // Adjust the delay as needed (milliseconds)

    document.addEventListener("hueChange", () => {
      // Clear any previous debounce timers
      clearTimeout(debounceTimeout);

      // Set a new debounce timer
      debounceTimeout = setTimeout(() => {
        let url = this.render_sv(50, 200);
        this.view.src = url;
        URL.revokeObjectURL(url);
      }, debounceDelay);
    });

    // document.addEventListener("hueChange", () => {
    //   let url = this.render_sv(200, 200);
    //   this.view.src = url;
    //   URL.revokeObjectURL(url);
    // });
  }

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

    let imageBlob = new ImageBlob(colorArrayView, imageMetaData);
    return URL.createObjectURL(imageBlob);
  }
}

module.exports = Slider2D;

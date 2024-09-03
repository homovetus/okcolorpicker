const { setup_view_handler, clamp } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");

class Slider2D {
  constructor(psState, okhsl) {
    this._psState = psState;
    this.okhsl = okhsl;
  }

  setSLComponent(view_id, manipulator) {
    this.view = document.getElementById(view_id);
    this.manipulator = document.getElementById(manipulator);

    setup_view_handler(this.view, this._psState, (x, y) => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;
      this.okhsl.s = clamp(x / width);
      this.okhsl.l = clamp(1 - y / height);
    });

    this.okhsl.registerSaturationChange(() => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsl.s}, ${height * (1 - this.okhsl.l)})`
      );
    });

    this.okhsl.registerLightnessChange(() => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsl.s}, ${height * (1 - this.okhsl.l)})`
      );
    });

    let debounceTimeout;
    const debounceDelay = 10;

    this.okhsl.registerHueChange(() => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        let url = this.render_sl(50, 200);
        this.view.src = url;
        URL.revokeObjectURL(url);
      }, debounceDelay);
    });
  }

  render_sl(width, height) {
    const pixelCount = width * height;
    let buffer = new ArrayBuffer(pixelCount * 3);
    let colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let [r, g, b] = okhsl_to_srgb(this.okhsl.h, j / width, 1 - i / height);
        let index = (i * width + j) * 3;
        colorArrayView[index] = r;
        colorArrayView[index + 1] = g;
        colorArrayView[index + 2] = b;
      }
    }

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

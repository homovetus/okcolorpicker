const { setup_view_handler, clamp } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");

class Slider {
  constructor(okhsv) {
    this.okhsv = okhsv;
    this.debounceDelay = 16;
  }

  setHueComponent(view_id, manipulator_id) {
    this.hue_view = document.getElementById(view_id);
    this.hue_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.hue_view, (x, _) => {
      let width = this.hue_view.clientWidth;
      this.okhsv.h = clamp(x / width);
    });

    document.addEventListener("hueChange", () => {
      let width = this.hue_view.clientWidth;
      this.hue_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsv.h}, 0)`,
      );
    });

    let debounceTimeout;

    document.addEventListener("saturationChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_hue(100, 1);
        this.hue_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });

    document.addEventListener("valueChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_hue(100, 1);
        this.hue_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });
  }

  setSaturationComponent(view_id, manipulator_id) {
    this.saturation_view = document.getElementById(view_id);
    this.saturation_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.saturation_view, (x, _) => {
      let width = this.saturation_view.clientWidth;
      this.okhsv.s = clamp(x / width);
    });

    document.addEventListener("saturationChange", () => {
      let width = this.saturation_view.clientWidth;
      this.saturation_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsv.s}, 0)`,
      );
    });

    let debounceTimeout;

    document.addEventListener("hueChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_saturation(100, 1);
        this.saturation_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });

    document.addEventListener("valueChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_saturation(100, 1);
        this.saturation_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });
  }

  setValueComponent(view_id, manipulator_id) {
    this.value_view = document.getElementById(view_id);
    this.value_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.value_view, (x, _) => {
      let width = this.value_view.clientWidth;
      this.okhsv.v = clamp(x / width);
    });

    document.addEventListener("valueChange", () => {
      let width = this.value_view.clientWidth;
      this.value_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsv.v}, 0)`,
      );
    });

    let debounceTimeout;

    document.addEventListener("hueChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_value(100, 1);
        this.value_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });

    document.addEventListener("saturationChange", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let url = this.render_value(100, 1);
        this.value_view.src = url;
        URL.revokeObjectURL(url);
      }, this.debounceDelay);
    });
  }

  render_hue(width, height) {
    const buffer = new ArrayBuffer(width * height * 3); // 3 bytes per pixel (RGB)
    const colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < width; i++) {
      const [r, g, b] = okhsl_to_srgb(i / width, this.okhsv.s, this.okhsv.v);
      for (let j = 0; j < height; j++) {
        const index = (j * width + i) * 3;
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

    const imageBlob = new ImageBlob(colorArrayView, imageMetaData);
    const url = URL.createObjectURL(imageBlob);
    return url;
  }

  render_saturation(width, height) {
    const buffer = new ArrayBuffer(width * height * 3);
    const colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < width; i++) {
      const [r, g, b] = okhsl_to_srgb(this.okhsv.h, i / width, this.okhsv.v);
      for (let j = 0; j < height; j++) {
        const index = (j * width + i) * 3;
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

    const imageBlob = new ImageBlob(colorArrayView, imageMetaData);
    const url = URL.createObjectURL(imageBlob);
    return url;
  }

  render_value(width, height) {
    const buffer = new ArrayBuffer(width * height * 3);
    const colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < width; i++) {
      const [r, g, b] = okhsl_to_srgb(this.okhsv.h, this.okhsv.s, i / width);
      for (let j = 0; j < height; j++) {
        const index = (j * width + i) * 3;
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

    const imageBlob = new ImageBlob(colorArrayView, imageMetaData);
    const url = URL.createObjectURL(imageBlob);
    return url;
  }
}

module.exports = Slider;

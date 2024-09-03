const { setup_view_handler, clamp } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");

class Slider {
  constructor(okhsl) {
    this.okhsl = okhsl;
    this.debounceDelay = 16;
  }

  setHueComponent(view_id, manipulator_id) {
    this.hue_view = document.getElementById(view_id);
    this.hue_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.hue_view, (x, _) => {
      let width = this.hue_view.clientWidth;
      this.okhsl.h = clamp(x / width);
    });

    this.okhsl.registerHueChange(() => {
      let width = this.hue_view.clientWidth;
      this.hue_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsl.h}, 0)`
      );
    });

    this.okhsl.registerSaturationChange(() => {
      let url = this.render_hue(100, 1);
      this.hue_view.src = url;
      URL.revokeObjectURL(url);
    });

    this.okhsl.registerLightnessChange(() => {
      let url = this.render_hue(100, 1);
      this.hue_view.src = url;
      URL.revokeObjectURL(url);
    });
  }

  setSaturationComponent(view_id, manipulator_id) {
    this.saturation_view = document.getElementById(view_id);
    this.saturation_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.saturation_view, (x, _) => {
      let width = this.saturation_view.clientWidth;
      this.okhsl.s = clamp(x / width);
    });

    this.okhsl.registerSaturationChange(() => {
      let width = this.saturation_view.clientWidth;
      this.saturation_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsl.s}, 0)`
      );
    });

    this.okhsl.registerHueChange(() => {
      let url = this.render_saturation(100, 1);
      this.saturation_view.src = url;
      URL.revokeObjectURL(url);
    });

    this.okhsl.registerLightnessChange(() => {
      let url = this.render_saturation(100, 1);
      this.saturation_view.src = url;
      URL.revokeObjectURL(url);
    });
  }

  setLightnessComponent(view_id, manipulator_id) {
    this.lightness_view = document.getElementById(view_id);
    this.lightness_manipulator = document.getElementById(manipulator_id);

    setup_view_handler(this.lightness_view, (x, _) => {
      let width = this.lightness_view.clientWidth;
      this.okhsl.l = clamp(x / width);
    });

    this.okhsl.registerLightnessChange(() => {
      let width = this.lightness_view.clientWidth;
      this.lightness_manipulator.setAttribute(
        "transform",
        `translate(${width * this.okhsl.l}, 0)`
      );
    });

    this.okhsl.registerHueChange(() => {
      let url = this.render_lightness(100, 1);
      this.lightness_view.src = url;
      URL.revokeObjectURL(url);
    });

    this.okhsl.registerSaturationChange(() => {
      let url = this.render_lightness(100, 1);
      this.lightness_view.src = url;
      URL.revokeObjectURL(url);
    });
  }

  render_hue(width, height) {
    const buffer = new ArrayBuffer(width * height * 3); // 3 bytes per pixel (RGB)
    const colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < width; i++) {
      const [r, g, b] = okhsl_to_srgb(i / width, this.okhsl.s, this.okhsl.l);
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
      const [r, g, b] = okhsl_to_srgb(this.okhsl.h, i / width, this.okhsl.l);
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

  render_lightness(width, height) {
    const buffer = new ArrayBuffer(width * height * 3);
    const colorArrayView = new Uint8Array(buffer);

    for (let i = 0; i < width; i++) {
      const [r, g, b] = okhsl_to_srgb(this.okhsl.h, this.okhsl.s, i / width);
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

import { setup_canvas_handler, clamp } from "./shared.js";
import { okhsv_to_srgb } from "./conversion.js";

export class Slider {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setHueComponent(canvas, manipulator) {
    this.hue_canvas = document.getElementById(canvas);
    this.hue_manipulator = document.getElementById(manipulator);

    let width = this.hue_canvas.width;
    let height = this.hue_canvas.height;

    setup_canvas_handler(this.hue_canvas, (x, _) => {
      this.okhsv.h = clamp(x / width);
    });

    document.addEventListener("hueChange", () => {
      this.hue_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(width * this.okhsv.h, 0);
    });

    document.addEventListener("saturationChange", () => {
      let ctx = this.hue_canvas.getContext("2d");
      let image = this.render_hue(width, height);
      ctx.putImageData(image, 0, 0);
    });

    document.addEventListener("valueChange", () => {
      let ctx = this.hue_canvas.getContext("2d");
      let image = this.render_hue(width, height);
      ctx.putImageData(image, 0, 0);
    });
  }

  setSaturationComponent(canvas, manipulator) {
    this.saturation_canvas = document.getElementById(canvas);
    this.saturation_manipulator = document.getElementById(manipulator);

    let width = this.hue_canvas.width;
    let height = this.hue_canvas.height;

    setup_canvas_handler(this.saturation_canvas, (x, _) => {
      this.okhsv.s = clamp(x / width);
    });

    document.addEventListener("saturationChange", () => {
      this.saturation_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(width * this.okhsv.s, 0);
    });

    document.addEventListener("hueChange", () => {
      let ctx = this.saturation_canvas.getContext("2d");
      let image = this.render_saturation(width, height);
      ctx.putImageData(image, 0, 0);
    });

    document.addEventListener("valueChange", () => {
      let ctx = this.saturation_canvas.getContext("2d");
      let image = this.render_saturation(width, height);
      ctx.putImageData(image, 0, 0);
    });
  }

  setValueComponent(canvas, manipulator) {
    this.value_canvas = document.getElementById(canvas);
    this.value_manipulator = document.getElementById(manipulator);

    let width = this.hue_canvas.width;
    let height = this.hue_canvas.height;

    setup_canvas_handler(this.value_canvas, (x, _) => {
      this.okhsv.v = clamp(x / width);
    });

    document.addEventListener("valueChange", () => {
      this.value_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(width * this.okhsv.v, 0);
    });

    document.addEventListener("hueChange", () => {
      let ctx = this.value_canvas.getContext("2d");
      let image = this.render_value(width, height);
      ctx.putImageData(image, 0, 0);
    });

    document.addEventListener("saturationChange", () => {
      let ctx = this.value_canvas.getContext("2d");
      let image = this.render_value(width, height);
      ctx.putImageData(image, 0, 0);
    });
  }

  render_hue(width, height) {
    let colors = new Uint8ClampedArray(width * 4);
    for (let i = 0; i < width; i++) {
      let rgb = okhsv_to_srgb(i / width, this.okhsv.s, this.okhsv.v);
      let index = 4 * i;
      colors[index + 0] = rgb[0];
      colors[index + 1] = rgb[1];
      colors[index + 2] = rgb[2];
      colors[index + 3] = 255;
    }

    let img = new ImageData(width, height);
    for (let i = 0; i < height; i++) {
      img.data.set(colors, i * width * 4);
    }

    return img;
  }

  render_saturation(width, height) {
    let colors = new Uint8ClampedArray(width * 4);
    for (let i = 0; i < width; i++) {
      let rgb = okhsv_to_srgb(this.okhsv.h, i / width, this.okhsv.v);
      let index = 4 * i;
      colors[index + 0] = rgb[0];
      colors[index + 1] = rgb[1];
      colors[index + 2] = rgb[2];
      colors[index + 3] = 255;
    }

    let img = new ImageData(width, height);
    for (let i = 0; i < height; i++) {
      img.data.set(colors, i * width * 4);
    }

    return img;
  }

  render_value(width, height) {
    let colors = new Uint8ClampedArray(width * 4);
    for (let i = 0; i < width; i++) {
      let rgb = okhsv_to_srgb(this.okhsv.h, this.okhsv.s, i / width);
      let index = 4 * i;
      colors[index + 0] = rgb[0];
      colors[index + 1] = rgb[1];
      colors[index + 2] = rgb[2];
      colors[index + 3] = 255;
    }

    let img = new ImageData(width, height);
    for (let i = 0; i < height; i++) {
      img.data.set(colors, i * width * 4);
    }

    return img;
  }
}

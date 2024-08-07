import { setup_canvas_handler, clamp } from "./shared.js";
import { okhsl_to_srgb } from "./conversion.js";

export class Slider2D {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setSVComponent(canvas, manipulator) {
    this.canvas = document.getElementById(canvas);
    this.manipulator = document.getElementById(manipulator);

    let width = this.canvas.width;
    let height = this.canvas.height;

    setup_canvas_handler(this.canvas, (x, y) => {
      this.okhsv.s = clamp(x / width);
      this.okhsv.v = clamp(1 - y / height);
    });

    document.addEventListener("saturationChange", () => {
      this.manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(width * this.okhsv.s, height * (1 - this.okhsv.v));
    });
    document.addEventListener("valueChange", () => {
      this.manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(width * this.okhsv.s, height * (1 - this.okhsv.v));
    });

    document.addEventListener("hueChange", () => {
      let ctx = this.canvas.getContext("2d");
      let image = this.render_sv(width, height);
      ctx.putImageData(image, 0, 0);
    });
  }

  render_sv(width, height) {
    let colors = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let [r, g, b] = okhsl_to_srgb(this.okhsv.h, j / width, 1 - i / height);
        colors.set([r, g, b, 255], (i * width + j) * 4);
      }
    }

    let img = new ImageData(colors, width, height);

    return img;
  }
}

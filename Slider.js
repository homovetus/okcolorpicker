import { setup_canvas_handler, clamp, state } from "./shared.js";

export class Slider {
  setHueComponent(canvas, manipulator) {
    this.hue_canvas = document.getElementById(canvas);
    this.hue_manipulator = document.getElementById(manipulator);

    setup_canvas_handler(this.hue_canvas, function (x, y) {
      let picker_size = 257;
      let new_h = clamp(x / picker_size);
      state.okhsv.h = new_h;
    });

    document.addEventListener("hueChange", () => {
      let hue = state.okhsv.h;
      let picker_size = 257;
      this.hue_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(picker_size * hue, 0);
    });
  }

  setSaturationComponent(canvas, manipulator) {
    this.saturation_canvas = document.getElementById(canvas);
    this.saturation_manipulator = document.getElementById(manipulator);

    setup_canvas_handler(this.saturation_canvas, function (x, y) {
      let picker_size = 257;
      let new_s = clamp(x / picker_size);
      state.okhsv.s = new_s;
    });

    document.addEventListener("saturationChange", () => {
      let hue = state.okhsv.s;
      let picker_size = 257;
      this.saturation_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(picker_size * hue, 0);
    });
  }

  setValueComponent(canvas, manipulator) {
    this.value_canvas = document.getElementById(canvas);
    this.value_manipulator = document.getElementById(manipulator);

    setup_canvas_handler(this.value_canvas, function (x, y) {
      let picker_size = 257;
      let new_v = clamp(1 - y / picker_size);
      state.okhsv.v = new_v;
    });

    document.addEventListener("valueChange", () => {
      let value = state.okhsv.v;
      let picker_size = 257;
      this.value_manipulator.transform.baseVal
        .getItem(0)
        .setTranslate(0, picker_size * (1 - value));
    });
  }
}

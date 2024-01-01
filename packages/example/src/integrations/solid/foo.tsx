import { qwikify$ } from "@mechairoi/qwik-solid";
// import App from "@try-qwik-solid/solid-example";
import App from "./App";

export const SolidApp = qwikify$(App);
export const SolidAppHover = qwikify$(App, { eagerness: "hover" });

// export const MUIButton = qwikify$(Button);
// export const MUISlider = qwikify$(Slider, { eagerness: "hover" });

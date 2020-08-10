// https://observablehq.com/d/1d38193beca74e77@900
import define1 from "./e93997d5089d7165@2283.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Radar chart with dynamic .csv binding and static image generator`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`
  <p class="section-header">
    Paste .csv data into the field below, or experiment by tweaking existing values.
  </p>`
)});
  main.variable(observer("viewof csv")).define("viewof csv", ["html"], function(html){return(
html`
  <textarea
    style="margin-left: 0px; min-height: 100px; width: 60%;"
  >group,Axis 1,Axis 2,Axis 3,Axis 4,Axis 5
Group 1,75,27,56,78,38
Group 2,44,31,76,55,94
Group 3,61,72,72,55,12</textarea>
`
)});
  main.variable(observer("csv")).define("csv", ["Generators", "viewof csv"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], function(html){return(
html`
  <p class="section-header">
    You can use this button to download a static version of the visible chart.
  </p>`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<div id="download">Download</div>`
)});
  return main;
}

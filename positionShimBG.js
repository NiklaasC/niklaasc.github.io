var wrap = document.getElementById("wrapper");
resize();

window.addEventListener("resize", resize, false);
window.addEventListener("orientationchange", resize, false);

function resize() {

  var container = 1024 - (window.innerHeight/8) + "px";
  var frame = window.innerHeight - 60 + "px";

  wrap.style.top = frame < container ? frame : container;
}

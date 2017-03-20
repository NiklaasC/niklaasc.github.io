var wrap = document.getElementById("wrapper");
resize();

window.addEventListener("resize", resize, false);
window.addEventListener("orientationchange", resize, false);

function resize() {
  var container = 720 * (window.innerWidth/1280) - 10 + "px";
  var frame = window.innerHeight - 60 + "px";
  
  wrap.style.top = frame < container ? frame : container;
}

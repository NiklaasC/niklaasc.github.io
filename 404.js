var canvas = document.getElementById('canvas404');
var c = canvas.getContext('2d');
var count = 1;
var hexagons = [];
var H = canvas.height = 256;
var W = canvas.width = 0 | H * window.innerWidth / window.innerHeight;
c.translate(W/2, H/2);
c.shadowBlur = 12;
var timer = 0;
var gravity = 40;
var lastTime = performance.now();
var totalTime = 0;
var counter;
var resizeTimeout;

window.addEventListener("resize", resize, false);

function resize() {
  // ignore resize events as long as an actualResize execution is in the queue
  if ( !resizeTimeout ) {
    resizeTimeout = setTimeout(function() {
      resizeTimeout = null;
      actualResize();
      
      // The actualResizeHandler will execute at a rate of 15fps
    }, 66);
  }
}

function actualResize() {
  // Handle the resize event
  var H = canvas.height = 256;
  var W = canvas.width = 0 | H * window.innerWidth / window.innerHeight;
  c.translate(W/2, H/2);
  c.shadowBlur = 12;
}

function update() {
  window.requestAnimationFrame(update);
  var timestep = performance.now();
  var dt = (timestep - lastTime)/1000;
  
  totalTime += dt;
  lastTime = timestep;
  
  c.clearRect(-W/2,-H/2,W,H);
  
  //	Draw some hexes
  if (totalTime > 0.1) {
    hexagons[hexagons.length] = new Hexagon(Math.random()*36-18,Math.random()*28-14-50,Math.random()*5+5,Math.random()*2*Math.PI,Math.random()*64-32, -Math.random()*30, Math.random()*2+3);
    hexagons[hexagons.length-1].setRandomColour();
    totalTime = 0;
  }
  
  //	Update
  hexagons.forEach(function(currentValue, index, array){ currentValue.update(dt);});
  hexagons.forEach(function(currentValue, index, array){ currentValue.draw();});
  
  c.shadowColor = c.fillStyle = 'rgba(255,255,255,0.3)';
  c.font = 'bold 88px sans-serif';
  c.textAlign = 'center';
  c.fillText('404', 0, 44);
  
  //	Remove hexagons from the array whose life is equal-to or less than 0!
  for (counter = hexagons.length-1; counter >= 0; counter -= 1) {
    if (hexagons[counter].life <= 0) {
      hexagons.splice(counter,1);
    }
  }
}

//	Hexagon
function Hexagon(initialX, initialY, initialRadius, initialRotation, velocityX, velocityY, lifetime) {
  this.x = initialX;
  this.y = initialY;
  this.radius = initialRadius;
  this.rotation = initialRotation
  this.apothem = initialRadius / 1.1547;
  this.fillColour = [];
  this.xVelocity = velocityX;
  this.yVelocity = velocityY;
  this.lifetime = lifetime;
  this.life = lifetime;
}

Hexagon.prototype = {
  constructor: Hexagon,
  draw: function (){
    if (this.fillColour[3]!==0) {
      c.shadowColor = c.fillStyle = 'rgba(' + this.fillColour[0] + ',' + this.fillColour[1] + ',' + this.fillColour[2] + ',' + this.fillColour[3] + ')';
      
      c.translate(this.x, this.y);
      c.rotate(this.rotation);
      c.beginPath();
      c.moveTo(-this.radius,0);
      c.lineTo(-0.5*this.radius,-this.apothem);
      c.lineTo(0.5*this.radius,-this.apothem);
      c.lineTo(this.radius,0);
      c.lineTo(0.5*this.radius,this.apothem);
      c.lineTo(-0.5*this.radius,this.apothem);
      c.lineTo(-this.radius,0);	//	Can replace with c.closePath() or if using fill() ... then nothing!
      c.fill();
      c.rotate(-this.rotation);
      c.translate(-this.x, -this.y);
    }
  },
  setRandomColour: function () {
    this.fillColour[0] = Math.floor(Math.random()*60)+150;
    this.fillColour[1] = Math.floor(Math.random()*60)+50;
    this.fillColour[2] = Math.floor(Math.random()*60)+150;
    this.fillColour[3] = 1;
  },
  setRadius: function (newRadius) {
    this.radius = newRadius;
    this.apothem = newRadius / 1.1547;
  },
  distanceToPoint: function (x,y) {
    return Math.sqrt(((x-this.x)*(x-this.x))+((y-this.y)*(y-this.y)));
  },
  update: function (dt) {
    this.yVelocity = this.yVelocity + (gravity*dt);
    this.y = this.y + this.yVelocity*dt;
    this.x = this.x + this.xVelocity*dt;
    this.life -= dt;
    this.fillColour[3] = this.life / this.lifetime;
  }
};

update();

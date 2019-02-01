var increment = 0.01;
var tinc = 0.1;
var toff = 0;

var increase = true;
let red = 80;
let green = 0;
let blue = 80;

function setup() {
	// put setup code here
	createCanvas(400,225);
	pixelDensity(1);
	loadPixels();
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var index = (x + y * width) * 4;
			pixels[index] = 80;
			pixels[index+1] = 0;
			pixels[index+2] = 80;
			pixels[index+3] = 255;
		}
	}
	updatePixels();
}

function draw() {
	// put drawing code here
blip();

	loadPixels();

	var yoff = 0;
	for (var y = 0; y < height; y++) {
		var xoff = 0;
		for (var x = 0; x < width; x++) {
			var index = (x + y * width) * 4;
			/*
			//  Random - Static!
			var r = random(255)
			pixels[index] = r;
			pixels[index+1] = r;
			pixels[index+2] = r;
			pixels[index+3] = 255;
			*/
			/*
			// Noise with Threshold
			var r = noise(xoff, yoff, toff);
			if (r > 0.5) {
				r = 255;
			} else {
				r = 0;
			}
			pixels[index] = r;
			pixels[index+1] = r;
			pixels[index+2] = r;
			pixels[index+3] = 255;
			*/
			///*
	  		// Noise with Threshold
			var r = noise(xoff, yoff, toff);
			if (r > 0.5) {
				pixels[index] = red;
				pixels[index+1] = green;
				pixels[index+2] = blue;
				pixels[index+3] = 255;
			}

			xoff += increment;
		}
		yoff += increment;
	}
	updatePixels();
	toff += tinc;

	if (increase == true) {
		red = red + 2;
		if (red >= 220) {
			red = 200;
			increase = false;
		}
	} else {
		red = red - 2;
		if (red <= 80) {
			red = 80;
			increase = true;
		}
	}
	blip();
}

function blip() {
	let c = color(255,204,0);
	fill(c);
	noStroke();
	rect(random(2*width-(width)),random(2*height-(height)), random(width/2), random(height/2));
}

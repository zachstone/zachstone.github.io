(function() {
	var root = this;
	var pixal = {};

	root.pixal = pixal;

	var canvas = {};
	var context = {};

	var image = [];
	var pixelSize = 20;
	var cursor = {red: 0, green: 0, blue: 0};
	var lastPosition = {x: 0, y: 0};

	var screenPixels = {width: Math.floor(640 / pixelSize), height: Math.floor(640 / pixelSize)};

	pixal.init = function(cnv, ctx) {
		canvas = cnv;
		context = ctx;
	};

	pixal.clearScreen = function() {
		for(var i = 0; i < screenPixels.width; i++) {
			image[i] = [];
			for(var j = 0; j < screenPixels.height; j++) {
				image[i][j] = {red: 255, green: 255, blue: 255};
				pixal.updatePixel(i, j);
			}
		}
	};

	pixal.randImage = function() {
		for(var i = 0; i < screenPixels.width; i++) {
			for(var j = 0; j < screenPixels.height; j++) {
				image[i][j] = {red: Math.floor(Math.random() * 256),
											 green: Math.floor(Math.random() * 256),
											 blue: Math.floor(Math.random() * 256)};
				pixal.updatePixel(i, j);
			}
		}
	};

	pixal.updatePixel = function(x, y) {
		context.fillStyle = 'rgb(' + image[x][y].red + ',' + image[x][y].green + ',' + image[x][y].blue + ')';
		context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
	};

	//---

	function snapToPixel(val) {
		return Math.floor(val / pixelSize) * pixelSize;
	}

	function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  pixal.updateRed = function(event) {
  	cursor.red = event.srcElement.valueAsNumber;
  	document.getElementById("redshow").innerText = event.srcElement.value;
  }

  pixal.updateGreen = function(event) {
  	cursor.green = event.srcElement.valueAsNumber;
  	document.getElementById("greenshow").innerText = event.srcElement.value;
  }

  pixal.updateBlue = function(event) {
  	cursor.blue = event.srcElement.valueAsNumber;
  	document.getElementById("blueshow").innerText = event.srcElement.value;
  }

  function updatePhantom(x, y) {
		context.fillStyle = 'rgb(' + cursor.red + ',' + cursor.green + ',' + cursor.blue + ')';
		context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

		pixal.updatePixel(lastPosition.x, lastPosition.y);

		lastPosition.x = x;
		lastPosition.y = y;
  }

  pixal.colorPixel = function(event) {
  	var mousePos = getMousePos(event);
	  var mouseIndex = {x: Math.floor(mousePos.x / pixelSize), y: Math.floor(mousePos.y / pixelSize)};

  	if(event.which === 1) {
			//ctx.fillStyle = 'rgb(' + cursor.red + ',' + cursor.green + ',' + cursor.blue + ')';
			//ctx.fillRect(snapToPixel(mousePos.x), snapToPixel(mousePos.y), pixelSize, pixelSize);
			image[mouseIndex.x][mouseIndex.y] = {red: cursor.red, green: cursor.green, blue: cursor.blue};
			pixal.updatePixel(mouseIndex.x, mouseIndex.y);
		}
		else if(event.button === 2) {
			updatePhantom(mouseIndex.x, mouseIndex.y);

			cursor = image[mouseIndex.x][mouseIndex.y];

			document.getElementById("red").value = cursor.red;
			document.getElementById("green").value = cursor.green;
			document.getElementById("blue").value = cursor.blue;

			document.getElementById("redshow").innerText = cursor.red;
			document.getElementById("greenshow").innerText = cursor.green;
			document.getElementById("blueshow").innerText = cursor.blue;
		}
		else if(event.which === 0) {
			if(!((mouseIndex.x === lastPosition.x) && (mouseIndex.y === lastPosition.y))) {
				updatePhantom(mouseIndex.x, mouseIndex.y);
			}
		}
  };
})();

window.onload = function() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	pixal.init(canvas, context);
	pixal.clearScreen();

	document.getElementById("redshow").innerText = 0;
	document.getElementById("greenshow").innerText = 0;
	document.getElementById("blueshow").innerText = 0;

  document.getElementById("clearButton").addEventListener('click', pixal.clearScreen);
  document.getElementById("randomButton").addEventListener('click', pixal.randImage)

  document.getElementById("red").addEventListener('change', pixal.updateRed);
  document.getElementById("green").addEventListener('change', pixal.updateGreen);
  document.getElementById("blue").addEventListener('change', pixal.updateBlue);

	canvas.addEventListener('mousedown', pixal.colorPixel);
	canvas.addEventListener('mousemove', pixal.colorPixel);
};
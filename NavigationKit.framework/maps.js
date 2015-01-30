// Get query parameters
// These are things that must be passed from the native code through
// the WebView at load time
var dotX = Number($.url().param("dot-x"));
var dotY = Number($.url().param("dot-y"));
var boothCoords = $.url().param("booth-coords");
var mapWidth = Number($.url().param("map-width"));
var mapHeight = Number($.url().param("map-height"));
var cropWidth = Number($.url().param("crop-width"));
var cropHeight = Number($.url().param("crop-height"));
var mapFile = $.url().param("map-file");
var unscaledDotRadius = 25;
var dotRadius = unscaledDotRadius;
var dotUncertaintyRadius = Number($.url().param("uncertainty-radius"));
var zoomTimeout;
var dotHidden = true;
var boothShown = false;
var dotPulseAnimation = {
  dot : null,
  maxSize : 0,
  //based on: (Math.cos(3.14*2*(this.loopCount/this.maxLoopCount))+1)/8+0.75;
  scaleArray : [0.9938882149919368,0.9761505226235041,0.9485214662914219,0.9137028516321279,0.8750995408388417,0.8364864960902509,0.8016396314345176,0.7739665715913362,0.7561734252371356,0.7500001585340575,0.7560504463442886,0.7737326397345001,0.8013176224731406,0.8361078988170147,0.8747013777359648,0.9133240584961375,0.9481990847576727,0.9759160779179938,0.9937646331248473,0.9999993658641719,1,1,1,1,1,1],
  loopCount : 0,
  speed : 300,
  dotScale : function() {
    return array[this.loopCount];
  },
  start : function() {
    this.changeFrame();
    this.interval = setInterval(function() { window.dotPulseAnimation.changeFrame(); }, this.speed);
  },
  stop : function() {
    clearInterval(this.interval);
    this.interval = null;
  },
  changeFrame : function() {
    this.loopCount += 1;
    if (this.loopCount >= this.scaleArray.length) {
      this.loopCount = 0;
    }
    var scale = this.scaleArray[this.loopCount];
    this.dot.setAttribute("r", this.maxSize*scale);
  },
  interval : null
};

var dotMoveAnimation = {
  x : 0,
  y : 0,
  startX : 0,
  startY : 0,
  endX : 0,
  endY : 0,
  startTime : 0,
  endTime : 0,
  speed : 90, /* milliseconds between animation frames */
  duration : 900, /* milliseconds of animation */
  start : function() {
    this.startTime = (new Date()).getTime();
    this.stopTime = (new Date()).getTime()+ this.duration;
    this.loopCount = 0;
    this.changeFrame();
    this.interval = setInterval(function() { window.dotMoveAnimation.changeFrame(); }, this.speed);
  },
  stop : function() {
    clearInterval(this.interval);
    this.interval = null;
  },
  changeFrame : function() {
    var now = (new Date()).getTime();
    var fractionComplete = (now - this.startTime)/this.duration;
    if (fractionComplete > 1) {
      fractionComplete = 1;
    }
    this.x = this.startX + (this.endX-this.startX)*fractionComplete;
    this.y = this.startY + (this.endY-this.startY)*fractionComplete;
    $("#dot").css({left: (this.x-dotImageWidth()/2), top: (this.y-dotImageWidth()/2)});
    this.loopCount += 1;
    if (fractionComplete >= 1) {
      this.stop();
    }
  },
  interval : null
};



function setDotPosition(x, y, uncertaintyRadius, animate) {
  if (typeof animate == 'undefined') {
    animate == false;
  }

  // if the dot hasn't moved, force animation off
  if (dotX == x && dotY == y) {
    animate = false
  }

  dotMoveAnimation.stop();  // stop animation if in progress
  if (typeof uncertaintyRadius != 'undefined') {
    dotUncertaintyRadius = uncertaintyRadius;
  }
  else {
    // leave dotUncertaintyRadius unchanged
  }
  if (animate) {
    dotMoveAnimation.startX = dotX;
    dotMoveAnimation.startY = dotY;
    dotMoveAnimation.endX = x;
    dotMoveAnimation.endY = y;
    drawDot(); // redraw dot in start position to make sure it is in the start position
    dotMoveAnimation.start();
    // set the position of record for the dot in case animation is stopped
    dotX = x;
    dotY = y;
  }
  else {
    dotX = x;
    dotY = y;
    drawDot();
  }
  dotHidden = false;
}

function setDotPositionAndRecenter(x,y, uncertaintyRadius) {
  hideDot();
  recenterOnPosition(x,y);
  setDotPosition(x,y, uncertaintyRadius, false);
}

function setDotPositionAutomatic(x,y, uncertaintyRadius) {
  if (dotOnVisibleScreen()) {
    // If dot is on the screen, just set dot position with animation
    setDotPosition(x,y, uncertaintyRadius, true);
  }
  else {
    // If dot is not on screen, recenter without animation
    setDotPositionAndRecenter(x,y, uncertaintyRadius, false);
  }
}

function dotOnVisibleScreen() {
  if (dotHidden) {
    return false;
  }
  if (dotY < $(window).scrollTop() || dotY > $(window).scrollTop()+window.innerHeight) {
    return false;
  }
  if (dotX < $(window).scrollLeft() || dotX > $(window).scrollLeft()+window.innerWidth) {
    return false;
  }
  return true;
}


function recenter() {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  //if (mapHeight >= mapWidth) {
    // When we get the size of the SVG, it is becomes exactly what it was set to in HTML
    // so if we set it to 1000x1000, the height returns 1000 even if it isn't nearly that
    // tall.  So we fudge this here.  We need a better way.
    //mapHeight = mapWidth/2;
  //}
  var desiredX = (cropWidth-windowWidth)/2;
  var desiredY = (cropHeight-windowHeight)/2;
  var scrollX = desiredX > 0 ? desiredX : 0;
  var scrollY = desiredY > 0 ? desiredY : 0;
  $(window).scrollTop(scrollY);
  $(window).scrollLeft(scrollX);
}

function recenterOnDot() {
  console.log("Recentering on dot at "+dotX+","+dotY);
  recenterOnPosition(dotX,dotY);
}

function recenterOnPosition(x,y) {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var desiredX = x-windowWidth/2;
  var desiredY = y-windowHeight/2;
  var scrollX = desiredX > 0 ? desiredX : 0;
  var scrollY = desiredY > 0 ? desiredY : 0;
  $(window).scrollTop(scrollY);
  $(window).scrollLeft(scrollX);
}

function hideDot() {
  $("#dot").hide();
  dotHidden = true;
}

function getZoomLevel() {
  return document.documentElement.clientWidth / window.innerWidth;
}

function adjustForZoom() {
  var zoomLevel = getZoomLevel();
  console.log("zoomLevel is now "+zoomLevel);
  if (dotRadius != unscaledDotRadius/zoomLevel) {
    dotRadius = unscaledDotRadius/zoomLevel;
    console.log("dot radius has changed to "+dotRadius);
    if (!dotHidden) {
      dotMoveAnimation.stop();
      setDotPosition(dotX, dotY, dotUncertaintyRadius, false);
    }
  }
}

function hideBooth() {
  $("#booth").hide();
  $("#booth").html("");
  boothShown = false;
}

function showBooth(startXY, points, pixelsPerFoot, xOffset, yOffset, rotation) {
  $("#booth").width( $("#map_container").width() );
  $("#booth").height( $("#map_container").height() );
  $("#booth").show();
  $("#booth").click(mapClick);
  if (typeof rotation == 'undefined') {
    rotation = 0;
  }
  var startX = Number(startXY.split(",")[0]);
  var startY = Number(startXY.split(",")[1]);
  var pointsXY = points.split("|");
  var i;
  // The SVGs for the CES maps are all natively 792 pixels high
  // but we magnify them inside the HTML so you can zoom further
  var pointsAttribute = "";
  var maxInt = 9007199254740992; // javascript maxint
  var maxX = 0;
  var maxY = 0;
  var minX = maxInt;
  var minY = maxInt;
  for (i = 0; i < pointsXY.length; i++) {
    point = pointsXY[i].split(",")
    var deltaX;
    var deltaY;
    if (rotation != 0) {
      // rotation is negated in the line below because booth_coords.txt rotations are
      // counter-clockwise
      var rotatedCoords = rotateCoordinates( Number(point[0]), Number(point[1]), -rotation);
      deltaX = rotatedCoords['x'];
      deltaY = rotatedCoords['y'];
    }
    else {
      deltaX = Number(point[0]);
      deltaY = Number(point[1]);
    }
    
    var x = deltaX + startX;
    var y = deltaY + startY;
    if (i > 0) {
      pointsAttribute += " ";
    }
    var screenX=x*pixelsPerFoot+xOffset;
    var screenY=y*pixelsPerFoot+yOffset;
    pointsAttribute += screenX+","+screenY;
    console.log("Plotting point at "+screenX+","+screenY);
    if (screenX > maxX) {
      maxX = screenX;
    }
    if (screenY > maxY) {
      maxY = screenY;
    }
    if (screenX < minX) {
      minX = screenX;
    }
    if (screenY < maxY) {
      minY = screenY;
    }
  }
  
  var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  // Set any attributes as desired
  polygon.setAttribute("points",pointsAttribute);
  polygon.setAttribute("style", "fill:red;fill-rule:evenodd;fill-opacity:0.5");
  $("#booth").html(polygon);
  
  // Recenter on booth
  var centerY = minY+(maxY-minY)/2;
  var centerX = minX+(maxX-minX)/2;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var desiredX = centerX-windowWidth/2;
  var desiredY = centerY-windowHeight/2;
  var scrollX = desiredX > 0 ? desiredX : 0;
  var scrollY = desiredY > 0 ? desiredY : 0;
  $(window).scrollTop(scrollY);
  $(window).scrollLeft(scrollX);
  
  boothShown = true;
}

function highlightPolygon(points)
{
  $("#booth").width( $("#map_container").width() );
  $("#booth").height( $("#map_container").height() );
  $("#booth").show();

  var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  // Set any attributes as desired
  polygon.setAttribute("points",points);
  polygon.setAttribute("style", "fill:red;fill-rule:evenodd;fill-opacity:0.5");
  $("#booth").html(polygon);
}

function dotImageWidth() {
  var width = dotUncertaintyRadius*2;
  if (dotRadius * 2 > width) {
    width = dotRadius *2;
  }
  return width;
}

function drawDot() {
  $("#dot").hide();
  dotPulseAnimation.stop();
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", dotImageWidth());
  svg.setAttribute("height", dotImageWidth());
  svg.setAttribute("version", "1.1");
  var uCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  uCircle.setAttribute("cx", dotImageWidth()/2);
  uCircle.setAttribute("cy", dotImageWidth()/2);
  uCircle.setAttribute("r", dotUncertaintyRadius);
  uCircle.setAttribute("fill", "#33A1DE");
  uCircle.setAttribute("style", "opacity:0.2");
  uCircle.setAttribute
  svg.appendChild(uCircle);
  var gDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  gDot.setAttribute("cx", dotImageWidth()/2);
  gDot.setAttribute("cy", dotImageWidth()/2);
  gDot.setAttribute("r", dotRadius);
  gDot.setAttribute("fill", "#888888");
  gDot.setAttribute("style", "opacity:0.2");
  svg.appendChild(gDot);
  var uDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  uDot.setAttribute("cx", dotImageWidth()/2);
  uDot.setAttribute("cy", dotImageWidth()/2);
  uDot.setAttribute("r", dotRadius*0.7);
  uDot.setAttribute("fill", "#ffffff");
  svg.appendChild(uDot);
  var dotMaxSize = dotRadius*0.5;
  var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", dotImageWidth()/2);
  dot.setAttribute("cy", dotImageWidth()/2);
  dot.setAttribute("r", dotMaxSize);
  dot.setAttribute("fill", "#33A1DE");
  svg.appendChild(dot);
  $("#dot").html(svg);
  $("#dot").css({left: (dotX-dotImageWidth()/2), top: (dotY-dotImageWidth()/2)});
  $("#dot").width(dotImageWidth());
  $("#dot").height(dotImageWidth());
  $("#dot").show();
  dotPulseAnimation.dot = dot;
  dotPulseAnimation.maxSize = dotMaxSize;
  //dotPulseAnimation.start();
}

function rotateCoordinates(x,y,theta) {
  console.log("before rotation: "+x+","+y);
  theta = (Math.PI/180)*theta; // Convert from degrees to radians
  rotatedX = x*Math.cos(theta) + y*Math.sin(theta);
  rotatedY = -1*x*Math.sin(theta) + y*Math.cos(theta);
  return {"x": rotatedX, "y": rotatedY};
}


// Calls adjustForZoom 10ms in the future to give the page a chance to reflow
// before calculating zoom level. This is needed because after pinching, the calculated
// zoom level has not updated to the new value yet
function adjustForZoomDelayed() {
  clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout("adjustForZoom()", 10);
}

function mapClick(e) {
  var x;
  var y;
  x = Number(e.clientX)+$(window).scrollLeft();
  y = Number(e.clientY)+$(window).scrollTop();
  console.log("clicked at "+x+","+y);
  showBoothInfo(""+x+","+y);
}

$(document).ready(function() {
  console.log("on ready, width is "+$(document).width());
  $("#map").attr("src","./"+mapFile);
  if (mapWidth > 0) {
    $("#map").width(mapWidth);
  }
  if (mapHeight > 0) {
    $("#map").height(mapHeight);
  }
  console.log("after set map width, width is "+$(document).width());

  $("#map_container").width(cropWidth);
  $("#map_container").height(cropHeight);
  $("#map_container").css("overflow", "hidden");

  adjustForZoom();
  if (dotX > 0 && dotY > 0) {
    console.log("recentering map on dot");
    setDotPositionAndRecenter(dotX,dotY,dotUncertaintyRadius);
  }
  else {
    console.log("centering map in 10ms");
    if (!boothShown && dotHidden) { recenter(); }
  }

  $("#map").click(mapClick);
  $(window).resize(function() {
    console.log("resize event");
    adjustForZoomDelayed();
  });
  $(window).scroll(function() {
    console.log("scroll event");
    adjustForZoomDelayed();
  });
  // This works well for UIWebView on iOS
  $(window).on("touchend", function(e) {
    console.log("touchend event");
    adjustForZoomDelayed();
  });

});

$(window).load(function() {
  console.log("after load, width is "+$(document).width());
});

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var $canvas = $("#canvas");
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;

var dots = [];

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots = [];
    for (var i = 1; i < 5; i++)
        document.getElementById('dot' + i).innerText = "";
}


$(document).ready(function () {
    canvas.addEventListener('click', function (event) {
        ctx_rect = canvas.getBoundingClientRect();
        offsetX = ctx_rect.left;
        offsetY = ctx_rect.top;
        var x = event.pageX - offsetX,
            y = event.pageY - offsetY;
        if (dots.length < 3) {
            drawDot(x, y);
            dots.push({ x, y });
            document.getElementById('dot' + dots.length).innerText = "x = " + dots[dots.length - 1].x + " y = " + dots[dots.length - 1].y;
        }
        if (dots.length == 3) {
            drawLastDot();

        }
    }, false);
    $("#canvas").mousedown(function (e) {
        handleMouseDown(e);
    });
    $("#canvas").mousemove(function (e) {
        handleMouseMove(e);
    });
    $("#canvas").mouseup(function (e) {
        handleMouseUp(e);
    });
    $("#canvas").mouseout(function (e) {
        handleMouseOut(e);
    });
})

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}
//completes parallelogram and sorts array of dots
function drawLastDot() {
    var x = 0,
        y = 0,
        k = 0;
    var distToCenter = 0;
    for (var i = 0; i < dots.length; i++) {
        var otherDots = dots.filter(function (x) { return x !== dots[i]; });
        //vector 1
        var x1 = otherDots[0].x,
            y1 = otherDots[0].y;

        //vector 2
        var x2 = otherDots[1].x,
            y2 = otherDots[1].y;
        var X = x1 + x2 - dots[i].x,
            Y = y1 + y2 - dots[i].y;

        //vector to center of canvas
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var dist = Math.sqrt((centerX - x) ^ 2 + (centerY - y) ^ 2);
        if (dist < distToCenter || distToCenter == 0) {
            x = X;
            y = Y;
            distToCenter = dist;
            k = i;
        }
    }
    console.log(dots);
    drawDot(x, y);
    var index = 0;
    if (k == 0)
        index = 2;
    else if (k == 1)
        index = 3;
    else if (k == 2)
        index = 0;
    dots.splice(index, 0, { x, y });
    oppositeDot = 1;
    selectedDot = 3;
    redraw();
    selectedDot = -1;

}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dot = dots[selectedDot];
    var otherDots = dots.filter(function (x) { return x !== dots[oppositeDot] && x !== dot; });

    var x = otherDots[0].x + otherDots[1].x - dot.x,
        y = otherDots[0].y + otherDots[1].y - dot.y

    dots[oppositeDot].x = x;
    dots[oppositeDot].y = y;

    //mass centre of circle
    var circleX = (x + dot.x) / 2,
        circleY = (y + dot.y) / 2;

    var area = polygonArea(dots);
    var radius = Math.sqrt(area / Math.PI);
    document.getElementById('area').innerHTML = area;
    document.getElementById('dot1').innerText = "x = " + dots[0].x + " y = " + dots[0].y;
    document.getElementById('dot2').innerHTML = "x = " + dots[1].x + " y = " + dots[1].y;
    document.getElementById('dot3').innerHTML = "x = " + dots[2].x + " y = " + dots[2].y;
    document.getElementById('dot4').innerHTML = "x = " + dots[3].x + " y = " + dots[3].y;


    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    for (var i = 0; i < dots.length; i++) {
        drawDot(dots[i].x, dots[i].y);
        var index = 0;
        if (i + 1 == 4) {
            index = 0
        }
        else index = i + 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[index].x, dots[index].y);
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }
}

var startX;
var startY;


var selectedDot = -1;
var oppositeDot = -1;

function dotsHittest(x, y, dotIndex) {
    var dot = dots[dotIndex];
    return (x >= dot.x - 11 && x <= dot.x + 11 && y >= dot.y - 11 && y <= dot.y + 11);
}

function polygonArea(coords) {
    area = 0;
    j = coords.length - 1;

    for (i = 0; i < coords.length; i++) {
        area = area + (dots[j].x + dots[i].x) * (dots[j].y - dots[i].y);
        j = i;
    }
    return Math.abs(area / 2);
}

function handleMouseDown(e) {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);


    for (var i = 0; i < dots.length; i++) {
        if (dotsHittest(startX, startY, i)) {
            selectedDot = i;

            if (i >= 2)

                oppositeDot = i - 2;
            else oppositeDot = i + 2;
            console.log(i);
        }
    }
}

function handleMouseUp(e) {
    e.preventDefault();
    selectedDot = -1;
}

function handleMouseOut(e) {
    e.preventDefault();
    selectedDot = -1;
}

function handleMouseMove(e) {
    if (selectedDot < 0 || dots.length != 4) {
        return;
    }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    var dx = mouseX - startX,
        dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var dot = dots[selectedDot];
    dot.x += dx;
    dot.y += dy;
    redraw();
}


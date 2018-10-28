const color_white2 = '#fafafa';
const color_gray1 = '#f0f0f0';
const color_gray2 = '#e0e0e0';
const color_gray3 = '#cccccc';
const color_dark1 = '#212121';

var canvas;
var context;
let W;
let H;
let xGap = 1;
let yGap = 1;
let xRange = [0, 12];
let yRange = [0, 8];
let points = [
	[1, 3, '#0072BB', false],
	[3, 7, '#8FC93A', false],
	[7, 2, '#E4CC37', false],
	[9, 4, '#E18335', false]
]; // x, y, color, is_hover_now

let equations = [
	[(x) => linearPolynomial(x, 0.5, 3), '#aa0000'],
	[(x) => quadraticPolynomial(x, 0.5, -4, 10), '#00aa00'],
	[(x) => quadraticPolynomial(x, -2, 4, 1), '#0000aa']
];

init = (canvas_obj) =>
{
	canvas = canvas_obj;
	if (canvas.length == 0) return;

	context = canvas.get(0).getContext('2d');
	W = canvas.width();
	H = canvas.height();

	drawGrid(context);
	drawDots(context, points);
	drawPolynomials(context, equations, xRange);
	mouseEvent(context);
};

drawGrid = (context) =>
{
	const xLines = (xRange[1] - xRange[0]) / xGap;
	const yLines = (yRange[1] - yRange[0]) / yGap;
	let i;

	context.fillStyle = color_white2;
	context.fillRect(0, 0, W, H);
	context.lineWidth = 1;
	context.strokeStyle = color_gray2;
	context.beginPath();

	i = 10;
	do
	{
		context.moveTo(i, 10);
		context.lineTo(i, H - 10);
		i += (W - 20) / xLines;
	}
	while (i <= W - 10);

	i = H - 10;
	do
	{
		context.moveTo(10, i);
		context.lineTo(W - 10, i);
		i -= (H - 20) / yLines;
	}
	while (i >= 10);
	context.stroke(); // draw lines
};

drawDots = (context, point_ar) =>
{
	point_ar.forEach(point =>
	{
		drawDot(context, point[0], point[1], point[2], point[3]);
	});
};

drawDot = (context, x, y, color = color_dark1, hover = false) =>
{
	let pixels = point2pixel([x, y]);
	let r = (hover) ? 6 : 3;

	context.fillStyle = color;
	context.beginPath();
	context.arc(pixels[0], pixels[1], r, 0, Math.PI * 2, true);
	context.fill(); // draw lines
};

drawPolynomials = (context, equation_obj, interval) =>
{
	equation_obj.forEach(equation =>
	{
		drawPolynomial(context, equation[0], interval, equation[1]);
	});
};

drawPolynomial = (context, polynomial, interval, color) =>
{
	let x = interval[0];
	let pixels;
	let pointPerPixel = (xRange[1] - xRange[0]) / (W - 20);

	context.lineWidth = 1;
	context.strokeStyle = color;
	context.moveTo(x, polynomial(x));
	context.beginPath();

	while (x - pointPerPixel < interval[1])
	{
		x += pointPerPixel;
		pixels = point2pixel([x, polynomial(x)]);
		context.lineTo(pixels[0], pixels[1]);
	}
	context.stroke(); // draw lines
};

//

mouseEvent = (context) =>
{
	canvas.on('mousemove', (e) =>
	{
		let needClear = false;
		points.forEach(point =>
		{
			if (needClear) return;
			if (point[3] == is_near([e.offsetX, e.offsetY], point2pixel([point[0], point[1]]), 6)) return;

			point[3] = !point[3];
			drawGrid(context);
			drawDots(context, points);
			drawPolynomials(context, equations, xRange);
			needClear = true;
		});
	});
};

//

log = (o) =>
{
	console.log(o);
};

is_near = (point1, point2, v) =>
{
	if (point1[0] - point2[0] > v) return false;
	if (point1[0] - point2[0] < -v) return false;
	if (point1[1] - point2[1] > v) return false;
	if (point1[1] - point2[1] < -v) return false;
	return true;
};

point2pixel = (point) =>
{
	const xPixel = 10 + (W - 20) / (xRange[1] - xRange[0]) * point[0];
	const yPixel = H - 10 - (H - 20) / (yRange[1] - yRange[0]) * point[1];
	return [xPixel, yPixel];
};

pixel2point = (pixel) =>
{
	const xPoint = (pixel[0] - 10) * (xRange[1] - xRange[0]) / (W - 20);
	const yPoint = (pixel[1] + 10 - H) * (yRange[1] - yRange[0]) / (H - 20);
	return [xPoint, yPoint];
};

//

const linearPolynomial = (x, a, b) => a*x + b;
const quadraticPolynomial = (x, a, b, c) => a*x*x + b*x + c;
function start(){
	var canvas = document.getElementById("canvas");
	
	var n = parseInt(document.getElementById("n").value);
	var length = parseInt(document.getElementById("length").value);
	
	//create vertices equidistant from center
	var x0 = (canvas.width - length) / 2;
	var y0 = (canvas.height / 2) + Math.abs(0.5 * length * Math.tan(Math.PI/6));	
	var x1 = x0 + length;
	var y1 = y0;
	var x2 = x0 + (length / 2);
	var y2 = y0 - (length * Math.sin(Math.PI/3));

	var ctx = canvas.getContext('2d');
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//ctx.scale(1.5, 1.5);
	ctx.beginPath();
	ctx.strokeStyle = "rgba(" + (Math.floor(Math.random()*200) + 35) + "," + (Math.floor(Math.random()*200) + 35) + ","+ (Math.floor(Math.random()*200) + 35) + ",1)";
	
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1, y1);
	
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2, y2);
	
	ctx.moveTo(x2,y2);
	ctx.lineTo(x0, y0);
	
	//perp-bisectors
	ctx.moveTo(x0 + length/2,y0);
	ctx.lineTo(x2, y2);
	
	ctx.moveTo(x0 + 0.5*length*Math.cos(Math.PI/3),y0 - 0.5*length*Math.sin(Math.PI/3));
	ctx.lineTo(x1, y1);
	
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1 - 0.5*length*Math.cos(Math.PI/3), y1 - 0.5*length*Math.sin(Math.PI/3));
	ctx.stroke();
	
	//center line
	ctx.beginPath();
	ctx.strokeStyle = "rgb(0,0,0)";
	
	ctx.moveTo(canvas.width / 2, canvas.height / 2);
	ctx.lineTo(0, 0);
	
	ctx.stroke();

	//draw fractal
	draw(x0, y0, x1, y1, n, ctx);
	draw(x1, y1, x2, y2, n, ctx);
	draw(x2, y2, x0, y0, n, ctx);

	start2(0, length);
}

function draw(x0, y0, x1, y1, n, ctx){
	if(n == 0){
		ctx.beginPath();
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.moveTo(x0,y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		
		return;
	}
	
	var theta = Math.PI / 2;
	var x2 ,y2, x3, y3, x4, y4;
	var dist = (1/3) * Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2));
	
	
	if(x1 != x0){
		theta = Math.atan(Math.abs(y1-y0)/Math.abs(x1-x0));
		if(x1 < x0){
			if(y1 < y0)
				theta += Math.PI;
			else
				theta = Math.PI - theta;
		}else
			if(y1 < y0)
				theta = (2 * Math.PI) - theta;
	}
	else
		if(y1 < y0)
			theta += Math.PI;
			
	//find (x2,y2)
	x2 = (dist * Math.cos(theta)) + x0;
	y2 = (dist * Math.sin(theta)) + y0;
	
	//find (x3,y3)
	x3 = (2* dist * Math.cos(theta)) + x0;
	y3 = (2* dist * Math.sin(theta)) + y0;
	
	//find (x4,y4)
	var phi = theta + (Math.PI / 3);
	
	x4 = (dist * Math.cos(phi)) + x2;
	y4 = (dist * Math.sin(phi)) + y2;
	
	draw(x0, y0, x2, y2, n-1, ctx);
	draw(x2, y2, x4, y4, n-1, ctx);
	draw(x4, y4, x3, y3, n-1, ctx);
	draw(x3, y3, x1, y1, n-1, ctx);
	
	return;		
}










function start2(m, length){
	if(m <= 0)
		return;
	var canvas = document.getElementById("canvas");	
	var n = parseInt(document.getElementById("n").value);
	length -= (length / 4);
	
	//create vertices equidistant from center
	var x0 = (canvas.width - length) / 2;
	var y0 = (canvas.height / 2) + Math.abs(0.5 * length * Math.tan(Math.PI/6));	
	var x1 = x0 + length;
	var y1 = y0;
	var x2 = x0 + (length / 2);
	var y2 = y0 - (length * Math.sin(Math.PI/3));

	var ctx = canvas.getContext('2d');
	
	
	//ctx.scale(1.5, 1.5);
	ctx.beginPath();
	ctx.strokeStyle = "rgba(" + (Math.floor(Math.random()*200) + 35) + "," + (Math.floor(Math.random()*200) + 35) + ","+ (Math.floor(Math.random()*200) + 35) + ",1)";
	
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1, y1);
	
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2, y2);
	
	ctx.moveTo(x2,y2);
	ctx.lineTo(x0, y0);
	

	//draw fractal
	draw(x0, y0, x1, y1, n, ctx);
	draw(x1, y1, x2, y2, n, ctx);
	draw(x2, y2, x0, y0, n, ctx);

	start2(m-1, length);
}

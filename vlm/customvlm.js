/* 
	customvlm.js
        
        Copyright 2013 Derrick Streng <siristreng@gmail.com>
        
        This program is free software; you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation; either version 2 of the License, or
        (at your option) any later version.
        
        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.
        
        You should have received a copy of the GNU General Public License
        along with this program; if not, write to the Free Software
        Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
        MA 02110-1301, USA.

 */

var canvas;
var ctx;
var inputs = [];  //array of input objects

/* Input Object Definition & Associated Methods */
function input(){
	this.width = 160;
	this.height = 120;
	this.posx = 0;
	this.posy = 0;
	this.audioEnabled = false;
	this.alpha=255;
	this.color =  ("" + (Math.floor(Math.random()*220) + 35) + "," + (Math.floor(Math.random()*220) + 35) + "," + (Math.floor(Math.random()*220) + 35) );
	this.source;
	
	this.display = function(index){	
		var sourceName = "Source " + index;
		ctx.beginPath();
		
		ctx.fillStyle = "rgba(" + this.color + "," + (this.alpha / 255) + ")";	
		ctx.fillRect(this.posx,this.posy,this.width,this.height);
		
		//draw stretch marks
		ctx.strokeStyle = "rgba(235,235,255,235.20)";
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 3);
		ctx.lineTo(this.posx + this.width -3, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 7);
		ctx.lineTo(this.posx + this.width -7, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 11);
		ctx.lineTo(this.posx + this.width -11, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 15);
		ctx.lineTo(this.posx + this.width -15, this.posy + this.height);
		
		ctx.stroke();
		
		ctx.strokeStyle = "rgba(0,0,0,0.20)";
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 1);
		ctx.lineTo(this.posx + this.width -1, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 5);
		ctx.lineTo(this.posx + this.width -5, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 9);
		ctx.lineTo(this.posx + this.width -9, this.posy + this.height);
		ctx.moveTo(this.posx + this.width, this.posy + this.height - 13);
		ctx.lineTo(this.posx + this.width -13, this.posy + this.height);
		
		ctx.stroke();
		
		ctx.font = "bold 8px sans-serif";
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillText(sourceName, (this.posx + (this.width - (sourceName.length * 4)) / 2), (this.posy + this.height / 2));
		ctx.fillText(this.source, (this.posx + (this.width - (this.source.length * 4)) / 2), (this.posy + 9 + this.height / 2));
		
		return;
	};
	
	
	/* change the source's input */
	this.changeSource = function(e){
		var source = document.getElementById('source').value;
		source = source.replace("file://","");
		document.getElementById('source').value = source;
		inputs[currentIndex() - 1].source = source;
		draw();
	};
	
	
	/* Change a source's X-position */
	this.changePosX = function (e) {
		var temp = parseInt(e.target.value);
		
		if(temp + inputs[currentIndex() - 1].width > canvas.width)
			inputs[currentIndex() - 1].posx = canvas.width - inputs[currentIndex() - 1].width;
		else if(temp < 0)
			inputs[currentIndex() - 1].posx = 0;
		else
			inputs[currentIndex() - 1].posx = temp;
			
		boundsCheck(currentIndex() - 1);
	};
	
	
	/* Change a source's Y-position */
	this.changePosY = function(e){
		var temp = parseInt(e.target.value);
		
		if(temp + inputs[currentIndex() - 1].height > canvas.height)
			inputs[currentIndex() - 1].posy = canvas.height - inputs[currentIndex() - 1].height;
		else if(temp < 0)
			inputs[currentIndex() - 1].posy = 0;
		else
			inputs[currentIndex() - 1].posy = temp;
			
		boundsCheck(currentIndex() - 1);
	};
	
	
	/* Change a source's width */
	this.changeWidth = function(e){
		var value = parseInt(e.target.value);
		if(value + inputs[currentIndex() - 1].posx > canvas.width)
			inputs[currentIndex() - 1].width = canvas.width - inputs[currentIndex() - 1].posx;
		else if(value < 40){
			inputs[currentIndex() - 1].width = 40;
			e.target.value = 40;
		}
		else
			inputs[currentIndex() - 1].width = value;
		
		boundsCheck(currentIndex() - 1);
	};
	
	
	/* Change a source's height */
	this.changeHeight = function(e){
		var value = parseInt(e.target.value);
		if(value + inputs[currentIndex() - 1].posy > canvas.height)
			inputs[currentIndex() - 1].height = canvas.height - inputs[currentIndex() - 1].posy;
		else if(value < 30){
			inputs[currentIndex() - 1].height = 30;
			e.target.value = 30;
		}
		else
			inputs[currentIndex() - 1].height = value;
		
		boundsCheck(currentIndex() - 1);
	};
	
	
	/* Modify a source's a opacity */
	this.changeAlpha = function(e){
		var value = parseInt(e.target.value);
		if(value < 0){
			inputs[currentIndex() - 1].alpha = 0;
			e.target.value = 0;
		}
		else if(value > 255){
			inputs[currentIndex() - 1].alpha = 255;
			e.target.value = 255;
		}
		else
			inputs[currentIndex() - 1].alpha = value;
		
		draw();
	};
	
	
	/* Enable/Disable audio pass-through for a source */
	this.changeAudio = function(e){
		if(e.target.checked == true)
			inputs[currentIndex() - 1].audioEnabled = true;
		else
			inputs[currentIndex() - 1].audioEnabled = false;
	};
	
}


/* Initialize The Wizard */
function init(){
	document.getElementById("transcode").value = "transcode{venc=x264{keyint=60,profile=baseline,threads=8},vcodec=h264,acodec=mp3,ab=128,threads=8,width=640,height=480,sfilter=\"mosaic\"}:std{access=http,mux=ts,dst=192.168.1.102:1234/test2.mpg}";
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	
	/* Create Source Menu */
	createMenu();	//create the source Menu
	updateMenu();	//link the fields to the selected source
	
	/* Setup BG Fields */
	document.getElementById('bgheight').value = canvas.height;
	document.getElementById('bgwidth').value = canvas.width;
	document.getElementById('bgsource').oninput = function(e){e.target.value = e.target.value.replace("file://","");};
	document.getElementById('bgsource').ondragenter = function(e){e.target.value = "";};
	
	/* Setup Canvas Events and data members*/
	canvas.onmouseover = mouseover;
	canvas.onmouseout = mouseout;
	
	canvas.x = 0;
	canvas.x1 = 0;
	canvas.y = 0;
	canvas.y1 = 0;
	canvas.timer;
	canvas.timer2;
	canvas.refreshRate = 20; // in fps
	
	
	draw();
	createVLM();
	return;
}


/* Get the current index of the drop down menu*/
function currentIndex(){
	var i;
	var menu = document.getElementById("currentSourceMenu");
		for(i = 0; i < menu.length; ++i)
			if(menu[i].selected == true)
				return i;
	return -1;
}


/* Create the Dropdown menu */
function createMenu(){
	var i;
	var menu = document.getElementById("currentSourceMenu");
	menu.onchange = updateMenu;
	menu.innerHTML="<option>Choose A Source</option>";
	if(inputs.length > 0)
		for(i = 0; i < inputs.length; ++i)
			menu.innerHTML += "<option>Source" + i + "</option>";
}


/* Link current selection to fields */
function updateMenu(){
	var temp = currentIndex() - 1;
	if(temp < 0){
		/* unlink from all sources */
		document.getElementById("source").onchange = "";
		document.getElementById("source").onchange = "";
		document.getElementById("posx").onchange = "";
		document.getElementById("posy").onchange = "";
		document.getElementById("width").onchange = "";
		document.getElementById("height").onchange = "";
		document.getElementById("alpha").onchange = "";
		document.getElementById("audio").onchange = "";	
		
		document.getElementById("source").value = "";
		document.getElementById("posx").value = "";
		document.getElementById("posy").value = "";
		document.getElementById("width").value = "";
		document.getElementById("height").value = "";
		document.getElementById("alpha").value = "";
		document.getElementById("audio").value = "";
		
		//debug();
	}
	else{
		/* link to Current Source 
		 * Apply Values to Fields */
		document.getElementById("source").value = inputs[temp].source;
		document.getElementById("posx").value = inputs[temp].posx;
		document.getElementById("posy").value = inputs[temp].posy;
		document.getElementById("width").value = inputs[temp].width;
		document.getElementById("height").value = inputs[temp].height;
		document.getElementById("alpha").value = inputs[temp].alpha;
		document.getElementById("audio").checked = inputs[temp].audioEnabled;
		
		/* Link Functions to Fields */
		document.getElementById("source").onchange = inputs[temp].changeSource;
		document.getElementById("source").oninput = inputs[temp].changeSource;
		document.getElementById("source").ondragenter = function(e){e.target.value = null;};
		document.getElementById("posx").onchange = inputs[temp].changePosX;
		document.getElementById("posy").onchange = inputs[temp].changePosY;
		document.getElementById("width").onchange = inputs[temp].changeWidth;
		document.getElementById("height").onchange = inputs[temp].changeHeight;
		document.getElementById("alpha").onchange = inputs[temp].changeAlpha;
		document.getElementById("audio").onchange = inputs[temp].changeAudio;
	}
}


/* Change the canvas's width */
function changeBgWidth(value){
	if(value >= 160){
		document.getElementById("canvasContainer").style.width = (value + "px");
		document.getElementById("sidebar").style.left = (parseInt(value) + 20) + 'px';
		canvas.width = value;
	}
	else{
		canvas.width = 160;
		document.getElementById("canvasContainer").style.width = (160 + "px");
		document.getElementById("sidebar").style.left = ( 180 + "px");
	}
	document.getElementById("bgwidth").value = canvas.width;
	
	//change width of launchContainer to match
	document.getElementById("launchContainer").style.width = canvas.width + "px";
	document.getElementById("transcode").style.width = (parseInt(canvas.width) - 25) + "px";
	document.getElementById("vlm.conf").style.width = (parseInt(canvas.width) - 25) + "px";
	document.getElementById("launchCode").style.width = (parseInt(canvas.width) - 25) + "px";
	//resize/move sources whose attributes are too large
	if(inputs.length == 0){
		draw();
		return;
	}
	var i;
	for(i = 0; i < inputs.length ; ++i){
		if(inputs[i].width > canvas.width)
			inputs[i].width = canvas.width;
		if(inputs[i].height > canvas.height)
			inputs[i].height = canvas.height;
		boundsCheck(i);
	}
}


/* Change the canvas's height */
function changeBgHeight(value){
	if(value >= 120)
		canvas.height = value;
	else
		canvas.height = 120;
	document.getElementById("bgheight").value = canvas.height;
	
	//resize sources whose attributes are too large
	if(inputs.length == 0){
		draw();
		return;
	}
	var i;
	for(i = 0; i < inputs.length ; ++i){
		if(inputs[i].height > canvas.height)
			inputs[i].height = canvas.height;
		if(inputs[i].width > canvas.width)
			inputs[i].width = canvas.width;
		boundsCheck(i);
	}
	
	
}


/* Make sure that a source doesn't leave the canvas */
function boundsCheck(i){
	if(inputs[i].height > canvas.height)
		inputs[i].height = canvas.height;
	if(inputs[i].width > canvas.width)
		inputs[i].width = canvas.width;
	if(inputs[i].posx < 0)
		inputs[i].posx = 0;
	if(inputs[i].posx + inputs[i].width > canvas.width)
		inputs[i].posx = canvas.width - inputs[i].width;
	if(inputs[i].posy < 0)
		inputs[i].posy = 0;
	if(inputs[i].posy + inputs[i].height > canvas.height)
		inputs[i].posy = canvas.height - inputs[i].height;
		
	updateMenu();
	draw();
}


/* Create a new source */
function add(){
	if((canvas.width * canvas.height / inputs.length) < 1200)
		return;
	inputs.push(new input());
	inputs[inputs.length - 1].source = "v4l2:///dev/video" + (inputs.length - 1); 
	createMenu();
	document.getElementById("currentSourceMenu")[document.getElementById("currentSourceMenu").length - 1].selected = true;
	updateMenu();
	draw();
}


/* Remove a source */
function remove(){
	var temp = currentIndex() - 1;
	var next = temp;
	if(inputs.length && temp >= 0){
		for(temp; temp < inputs.length - 1; ++temp)
			inputs[temp] = inputs[temp + 1];
		inputs.pop();
		createMenu();
		if(inputs.length == next)
			document.getElementById("currentSourceMenu")[next].selected = true;
		else
			document.getElementById("currentSourceMenu")[next + 1].selected = true;
		updateMenu();
		draw();
	}
}


function clearCanvas(){
	canvas.width = canvas.width;
	canvas.height =canvas.height;
}

/* Canvas Non-event Functions */
/* Draw everything that is supposed to be on the canvas */	
function draw(){
	
	//Draw on a hidden canvas
	var n_canvas = document.createElement('canvas');
	n_canvas.width = canvas.width;
	n_canvas.height = canvas.height;
	ctx = n_canvas.getContext('2d');
	clearCanvas();
	
	
	/* Draw A Grid */
	ctx.strokeStyle = "rgb(240,240,240)";
	var i;
	
	for(i = 0; i <= canvas.width || i <= canvas.height; i += 10){
		if( i <= canvas.width){
			ctx.moveTo(i,0);
			ctx.lineTo(i, canvas.height);
		}
		if( i <= canvas.height){
			ctx.moveTo(0,i);
			ctx.lineTo(canvas.width, i);
		}
	}
	ctx.stroke();
	
	/* Draw Individual Sources */
	if(inputs.length)
		for(i = 0; i < inputs.length; ++i)
			inputs[i].display(i);
		
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,1)";
	
	/* Draw Markers */
	for(i = 0; i <= canvas.width || i <= canvas.height; i += 10){
		if(i <= canvas.width)
			if(i  == canvas.width / 2){
				ctx.moveTo(i,canvas.height);
				ctx.lineTo(i, canvas.height - 20);
			}
			else{
				ctx.moveTo(i,canvas.height);
				ctx.lineTo(i, canvas.height - 10);
			}
		if(i <= canvas.height)
			if(i  == canvas.height / 2){
				ctx.moveTo(0,i);
				ctx.lineTo(20, i);
			}
			else{
				ctx.moveTo(0,i);
				ctx.lineTo(10, i);
			}
	}
	ctx.stroke();
	
	/* X Marks The Spot */
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,0,0,0.8)";
	ctx.moveTo((canvas.width / 2) - 7, ((canvas.height / 2) - 7));
	ctx.lineTo((canvas.width / 2) + 7, ((canvas.height / 2) + 7));
	ctx.moveTo((canvas.width / 2) - 7, ((canvas.height / 2) + 7));
	ctx.lineTo((canvas.width / 2) + 7, ((canvas.height / 2) - 7));
	ctx.stroke();
	
	//Copy onto visible canvas
	ctx = canvas.getContext('2d');
	clearCanvas();
	ctx.drawImage(n_canvas, 0, 0);
}


/* Canvas Event Functions */
/* Start animating and linking stuff */
function mouseover(){
	canvas.timer = setInterval(draw, 1000 / canvas.refreshRate);
	canvas.timer2 = setInterval(updateMenu, 1000 / (canvas.refreshRate / 2));
	
	//some of the following could moved elsewhere.
	canvas.onmousemove = mousemove;
	canvas.onmousedown= clicker;
	canvas.onmouseup = function(e){
		e.target.style.cursor = 'default';
		canvas.onmousemove = mousemove;
		boundsCheck(currentIndex() - 1);
	}
}


/* Clear the timers and update everything onece more just in case */
function mouseout(){
	clearInterval(canvas.timer);
	clearInterval(canvas.timer2);
	
	//may not need the following, but better safe than sorry.
	draw();
	updateMenu();
}


/* changes the cursor image when in a clickable area*/
function mousemove(e){
	i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= inputs[i].posx && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
			if((e.pageY - canvas.offsetTop) >= inputs[i].posy && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
				
				if((e.pageX - canvas.offsetLeft) >= (inputs[i].posx + inputs[i].width - 15) && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width)){
					if((e.pageY - canvas.offsetTop) >= (inputs[i].posy + inputs[i].height - 15)  && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
						e.target.style.cursor = 'se-resize';	//if hovering over bottom right of input, resize cursor
						return;
					}
				}
				else{
					e.target.style.cursor = 'pointer';			//if over input not bottom right, hand cursor
					return;
				}
			}
	}
	e.target.style.cursor = 'default';
}


/* Prepares and links cursor movement to appropriate action based on location of click */
function clicker(e){
	//detect and hook resize
	var i = inputs.length - 1;
	
	//detect and hook drag
	i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= inputs[i].posx && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
			if((e.pageY - canvas.offsetTop) >= inputs[i].posy && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
				
				if((e.pageX - canvas.offsetLeft) >= (inputs[i].posx + inputs[i].width - 15) && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width)){
					if((e.pageY - canvas.offsetTop) >= (inputs[i].posy + inputs[i].height - 15)  && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
						document.getElementById("currentSourceMenu")[i + 1].selected = true;
						canvas.x = inputs[i].width;
						canvas.y = inputs[i].height;
						canvas.x1 = (e.pageX - canvas.offsetLeft);
						canvas.y1 = (e.pageY - canvas.offsetTop);
						canvas.onmousemove = resize;
						e.target.style.cursor = 'se-resize';
						return;
					}
				}
				else{
				document.getElementById("currentSourceMenu")[i + 1].selected = true;
				canvas.x = inputs[i].posx;
				canvas.y = inputs[i].posy;
				canvas.x1 = (e.pageX - canvas.offsetLeft);
				canvas.y1 = (e.pageY - canvas.offsetTop);
				canvas.onmousemove = drag;
				e.target.style.cursor = 'move';
				return;
			}
		}
	}	
}


/* Resize on drag within constraints */
function resize(e){
	var newWidth = canvas.x + (e.pageX - canvas.offsetLeft) - canvas.x1;
	var newHeight = canvas.y + (e.pageY - canvas.offsetTop) - canvas.y1;
	
	if(newWidth < 40)
		inputs[currentIndex() - 1].width = 40;
	else if(inputs[currentIndex() - 1].posx + inputs[currentIndex() - 1].width > canvas.width)
		inputs[currentIndex() - 1].width = canvas.width - inputs[currentIndex() - 1].posx;
	else
		inputs[currentIndex() - 1].width =  newWidth;
		
	if(newHeight < 30)
		inputs[currentIndex() - 1].height = 30;
	else if(inputs[currentIndex() - 1].posy + inputs[currentIndex() - 1].height > canvas.height)
		inputs[currentIndex() - 1].height = canvas.height - inputs[currentIndex() - 1].posy;
	else
		inputs[currentIndex() - 1].height =  newHeight;
}


/* move a source when it has been clicked */
function drag(e){
	inputs[currentIndex() - 1].posx =  canvas.x + (e.pageX - canvas.offsetLeft) - canvas.x1;
	inputs[currentIndex() - 1].posy = canvas.y + (e.pageY - canvas.offsetTop) - canvas.y1;
}


/* Create the vlm.conf and launch code */		//Holy Crap this function needs to be reorganized and cleaned up!!!!!!!!
function createVLM(){
	var passAudio = "";
	var launchCode;
	
	//set physical dimensions
	document.getElementById("launchContainer").style.width = canvas.width + "px";
	document.getElementById("transcode").style.width = (parseInt(canvas.width) - 25) + "px";
	document.getElementById("vlm.conf").style.width = (parseInt(canvas.width) - 25) + "px";
	document.getElementById("launchCode").style.width = (parseInt(canvas.width) - 25) + "px";
	document.getElementById("vlm.conf").innerHTML = " ";
	
	/* Sources Section */
	var i;
	var text = "#######################\n##Simple Mosaic Setup##\n#######################\n\ndel all\n\n";
	for(i = 0; i < inputs.length; ++i){
		text += "new Source" + i + " broadcast\n";
		text += "setup Source" + i + " input " + inputs[i].source + "\n";
		
		/* Pass Audio? */
		if(inputs[i].audioEnabled ==  true){
			text += "setup Source" + i + " output #duplicate{dst=mosaic-bridge{width=" + inputs[i].width + ",height=" + inputs[i].height + ",id="+ i + ",alpha=" + inputs[i].alpha + "},select=video,dst=bridge-out{id=" + i + "},select=audio}\n";
			passAudio = "bridge-in{id-offset=100}:";
		}
		else{
			text += "setup Source" + i + " option no-audio\n";
			text += "setup Source" + i + " output #mosaic-bridge{width=" + inputs[i].width + ",height=" + inputs[i].height + ",id="+ i + ",alpha=" + inputs[i].alpha + "}\n";
		}
		text += "setup Source" + i + " enabled\n\n"
	}
	
	/* Background Section */
	text += "new Background broadcast\n";
	text += "setup Background input " + document.getElementById("bgsource").value + "\n";
	
	for(i = 0; i < 5; ++i)
		if(document.getElementById("option" + i).value.trim() != "" )
			text += "setup Background option " + document.getElementById("option" + i).value + "\n";
	
	
	text += "setup Background output #" + passAudio + document.getElementById("transcode").value + "\n";
	text += "setup Background enabled\n\n";
	
	text += "new QUIT broadcast\nsetup QUIT input vlc://quit\nsetup QUIT enabled\n\n"
	text += "## Start the Mosaic ##\n"
	
	//Start everything
	for(i = 0; i < inputs.length; ++i)
		text += "control Source" + i + " play\n";
		
	text += "control Background play\n\n ## End ##";
	
	/* Setup Launch Code */
	launchCode = "vlc -I http --mosaic-position=2 --mosaic-keep-picture ";
	launchCode += "--mosaic-width=" + canvas.width + " ";
	launchCode += "--mosaic-height=" + canvas.height + " ";
	
	launchCode += "--mosaic-order=";
	for(i = inputs.length - 1; i >= 0; --i)
		launchCode += i + ",";
	launchCode = launchCode.substring(0, launchCode.length - 1) + " ";
	
	launchCode += "--mosaic-offsets=";
	for(i = inputs.length - 1; i >= 0; --i)
		launchCode += inputs[i].posx + "," + inputs[i].posy + ",";
	launchCode = launchCode.substring(0, launchCode.length - 1) + " --vlm-conf=vlm.conf";

	document.getElementById("launchCode").value = launchCode;
	document.getElementById("vlm.conf").value = text;
}


/* start over from scratch */
function reset(){
	var i = inputs.length;
	for( i; i > 0; --i)
		inputs.pop();
	
	document.getElementById("option0").value = "screen-follow-mouse";
	document.getElementById("option1").value = "screen-width=640";
	document.getElementById("option2").value = "screen-height=480";
	document.getElementById("option3").value = "screen-fps=30";
	document.getElementById("option4").value = "input-slave=alsa://hw:0,0";
	document.getElementById("bgsource").value = "screen://";
	changeBgWidth(640);
	changeBgHeight(480);
	document.getElementById("vlm.conf").innerHTML = "";
	init();
}
	
	

function launch(){
	alert("Sorry, this function no longer works with vlc 2.0.4");
	//no longer works in vlc 2.0.4
	return;
	/* the entirety of the this function's code
	 * has been adapted from the original VLC Mosaic Wizard */
	function loadXMLDoc( url, callback ){
	  // branch for native XMLHttpRequest object
	  if ( window.XMLHttpRequest ){
		req = new XMLHttpRequest();
		req.onreadystatechange = callback;
		req.open( "GET", url, true );
		req.send( null );
	  // branch for IE/Windows ActiveX version
	  }
	  else if ( window.ActiveXObject ){
		req = new ActiveXObject( "Microsoft.XMLHTTP" );
		if ( req ){
		  req.onreadystatechange = callback;
		  req.open( "GET", url, true );
		  req.send();
		}
	  }
	};
	
	function dummy(){};
	
	var i;
    var commands = document.getElementById("vlm.conf").value.split( '\n' );
    for( i = 0; i < commands.length; i++ )
        loadXMLDoc( 'http://localhost:8080/requests/vlm_cmd.xml?command='+commands[i].replace(/\#/g, '%23'), dummy );
}


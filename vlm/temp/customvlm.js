/*Global Variable Definitions. I know, right?*/
var canvas;
var ctx;
var inputs = [];  //array of input objects
/* ************************** */


/* Input Object Definition & Associated Methods */
function input(){
	//Attributes of Source (Fields)
	this.width = 160;
	this.height = 120;
	this.posx = 0;
	this.posy = 0;
	this.audioEnabled = false;
	this.alpha=255;
	this.color =  ("" + (Math.floor(Math.random()*220) + 35) + "," + (Math.floor(Math.random()*220) + 35) + "," + (Math.floor(Math.random()*220) + 35) );
	this.source;
	
	
	//Source Attribute Methods
	this.display = display;		//note: this could also be an internally defined member function, but it is pretty big. 
	
	
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


/* Used to display individual sources (a method of "input") */
function display(index){	
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
}
/* ******************************************** */


/* Initialize The Wizard */
function init(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	
	/* Create Source Menu */
	createMenu();	//create the source Menu
	updateMenu();	//link the fields to the selected source
	changeOutput();	//Make sure output section displays correctly.
	
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
	canvas.refreshRate = 22; // in fps
	
	
	draw();
	
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
		document.getElementById("sidebar").style.left = document.getElementById("canvasContainer").style.width;
		canvas.width = value;
	}
	else{
		canvas.width = 160;
		document.getElementById("canvasContainer").style.width = (160 + "px");
		document.getElementById("sidebar").style.left = ( 180 + "px");
	}
	document.getElementById("bgwidth").value = canvas.width;
	
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


/* Canvas Non-event Functions */
/* Draw everything that is supposed to be on the canvas */	
function draw(){
	/* Clear the canvas */
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height);
	
	//the following slows everything down too much.
	/* Draw a Background Image */
	//var background = new Image();
	//background.src= "background.png";
	//ctx.drawImage(background, (canvas.width - background.width ) / 2, (canvas.height - background.height ) / 2);
	
	/* Draw A Grid */
	ctx.strokeStyle = "rgba(0,0,255,.10)";
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
	
	//is this redundant code?  Investigate further...
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,1)";
	
	/* Draw Individual Sources */
	if(inputs.length)
		for(i = 0; i < inputs.length; ++i)
			inputs[i].display(i);
		
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,1)";
	/* Draw Markers */
	for(i = 0; i <= canvas.width || i <= canvas.height; i += 10){
		if(i <= canvas.width)
			if(i  == canvas.width / 2)
			{
				ctx.moveTo(i,canvas.height);
				ctx.lineTo(i, canvas.height - 20);
			}
			else
			{
				ctx.moveTo(i,canvas.height);
				ctx.lineTo(i, canvas.height - 10);
			}
		if(i <= canvas.height)
			if(i  == canvas.height / 2)
			{
				ctx.moveTo(0,i);
				ctx.lineTo(20, i);
			}
			else
			{
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
	//stretch cursor
	var i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= (inputs[i].posx + inputs[i].width - 15) && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
			if((e.pageY - canvas.offsetTop) >= (inputs[i].posy + inputs[i].height - 15)  && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
				e.target.style.cursor = 'se-resize';
				return;
			}
	}
	//drag cursor
	i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= inputs[i].posx && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
			if((e.pageY - canvas.offsetTop) >= inputs[i].posy && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
				e.target.style.cursor = 'pointer';
				return;
			}
	}
	e.target.style.cursor = 'default';
}


/* Prepares and links cursor movement to appropriate action based on location of click */
function clicker(e){
	//detect and hook resize
	var i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= (inputs[i].posx + inputs[i].width - 15) && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
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
	
	//detect and hook drag
	i = inputs.length - 1;
	for(i; i >= 0; i--){
		if((e.pageX - canvas.offsetLeft) >= inputs[i].posx && (e.pageX - canvas.offsetLeft) <= (inputs[i].posx + inputs[i].width))
			if((e.pageY - canvas.offsetTop) >= inputs[i].posy && (e.pageY - canvas.offsetTop) <= (inputs[i].posy + inputs[i].height)){
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


/* Hide the vlm.conf in the DOM */
function hideVLM(){
	document.getElementById("vlm.conf").innerHTML="";
	document.getElementById("vlm.conf").style.border = "0px";
}


/* Create the vlm.conf */		//Holy Crap this function needs to be reorganized and cleaned up!!!!!!!!
function createVLM(){
	var passAudio = "";
	var output = "";
	if(inputs.length == 0){
		alert("You must add sources first.");
		return;
	}
	
	document.getElementById("vlm.conf").style.zIndex = "2";
	document.getElementById("vlm.conf").style.border = "1px solid black";
	document.getElementById("vlm.conf").innerHTML = "<div id=\"vlm.conf.content\" class=\"title\">The vlm.conf</div>" +"<textarea class=\"canvas\" type=\"text\" id=\"testArea\"></textarea>"
	
	document.getElementById("testArea").style.width = "630px";
	document.getElementById("testArea").style.height = "480px";
	
	/* Sources Section */
	var i;
	var text = "#######################\n##Simple Mosaic Setup##\n#######################\n\ndel all\n\n";
	for(i = 0; i < inputs.length; ++i){
		text += "new Source" + i + " broadcast\n";
		
		text += "setup Source" + i + " input " + inputs[i].source + "\n";
		
		/* Pass Audio? */
		if(inputs[i].audioEnabled ==  true){
			text += "setup Source" + i + " output #duplicate{dst=mosaic-bridge{width=" + inputs[i].width + ",height=" + inputs[i].height + ",id="+ i + ",alpha=" + inputs[i].alpha + "},select=video,dst=bridge-out{id=" + i + "},select=audio}\n";
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
			
	//check to see if audio needs passed through
	for(i = 0; i < inputs.length; i++)
		if(inputs[i].audioEnabled ==  true){
			passAudio = "bridge-in{id-offset=100}:";
			break;
		}
	
	//check to see output type.
	if(document.getElementById("outPutTo")[0].selected == true)
		output = "display";
	else if(document.getElementById("outPutTo")[1].selected == true)
		output = "standard{access=file,mux=ogg,dst=" + document.getElementById("File").value + "}"
	else
		output = "duplicate{dst=standard{access=file,mux=ogg,dst=" + document.getElementById("File").value + "},dst=display}"
	
	text += "setup Background output #" + passAudio +"transcode{audio-sync,venc=theora,vcodec=theora,acodec=vorb,vb=1024,fps=22,width=" + canvas.width + ",height=" + canvas.height + ",channels=2,sfilter=\"mosaic\"}:"+ output +"\n\n";
	
	text += "## Mosaic Options ##\n\n## For Info on Each Option, see http://wiki.videolan.org/Documentation:Modules/mosaic ## \n";
	
	text += "setup Background option mosaic-position=2\nsetup Background option mosaic-keep-picture=1\n";
	text += "setup Background option mosaic-width=" + canvas.width + "\n";
	text += "setup Background option mosaic-height=" + canvas.height + "\n";
	
	text += "setup Background option mosaic-order=";
	for(i = 0; i < inputs.length; ++i)
		text += i + ",";
	text = text.substring(0, text.length - 1) + "\n";
	
	text += "setup Background option mosaic-offsets=";
	for(i = 0; i < inputs.length; ++i)
		text += inputs[i].posx + "," + inputs[i].posy + ",";
	text = text.substring(0, text.length - 1) + "\n";
	
	text += "setup Background option sout-vorbis-quality=5\n";
	text += "setup Background enabled\n\n";
	
	text += "new QUIT broadcast\nsetup QUIT input vlc://quit\nsetup QUIT enabled\n\n"
	text += "## Start the Mosaic ##\n"
	
	//Start everything
	for(i = 0; i < inputs.length; ++i)
		text += "control Source" + i + " play\n";
		
	text += "control Background play\n\n ## End ##";
	
	document.getElementById("testArea").value = text;
}


/* start over from scratch */
function reset(){
	var i = inputs.length;
	for( i; i > 0; --i)
		inputs.pop();
	
	document.getElementById("option0").value = "fake-file=black.jpg";
	document.getElementById("option1").value = "fake-width=640";
	document.getElementById("option2").value = "fake-height=480";
	document.getElementById("option3").value = "fake-duration=0";
	document.getElementById("option4").value = "input-slave=alsa://hw:0,0";
	document.getElementById("bgsource").value = "fake://";
	changeBgWidth(640);
	changeBgHeight(480);
	document.getElementById("vlm.conf").innerHTML = "";
	init();
}
	
	
/* Save current project locally */
function save(){
	localStorage.clear();  
	var i;
	for (i = 0; i < inputs.length; ++i){
		localStorage.setItem(("Source" + i + ": source"), inputs[i].source);
		localStorage.setItem(("Source" + i + ": posx"), inputs[i].posx);
		localStorage.setItem(("Source" + i + ": posy"), inputs[i].posy);
		localStorage.setItem(("Source" + i + ": width"), inputs[i].width);
		localStorage.setItem(("Source" + i + ": height"), inputs[i].height);
		localStorage.setItem(("Source" + i + ": alpha"), inputs[i].alpha);
		localStorage.setItem(("Source" + i + ": audio"), inputs[i].audioEnabled);
		localStorage.setItem(("Source" + i + ": color"), inputs[i].color);
	}
	
	localStorage.setItem("bgsource", document.getElementById("bgsource").value);
	localStorage.setItem("bgwidth", document.getElementById("bgwidth").value);
	localStorage.setItem("bgheight", document.getElementById("bgheight").value);
	localStorage.setItem("option0", document.getElementById("option0").value);
	localStorage.setItem("option1", document.getElementById("option1").value);
	localStorage.setItem("option2", document.getElementById("option2").value);
	localStorage.setItem("option3", document.getElementById("option3").value);
	localStorage.setItem("option4", document.getElementById("option4").value);
	
	localStorage.setItem("#inputs", inputs.length);
}


/* Load saved project */
function load(){
	reset();
	var i;
	/* Source Data */
	for( i = 0; i < parseInt(localStorage.getItem("#inputs")) ; ++i){
		inputs.push(new input());
		
		inputs[i].source = localStorage.getItem(("Source" + i + ": source"));
		inputs[i].posx = parseInt(localStorage.getItem(("Source" + i + ": posx")));
		inputs[i].posy = parseInt(localStorage.getItem(("Source" + i + ": posy")));
		inputs[i].width = parseInt(localStorage.getItem(("Source" + i + ": width")));
		inputs[i].height = parseInt(localStorage.getItem(("Source" + i + ": height")));
		inputs[i].alpha = parseInt(localStorage.getItem(("Source" + i + ": alpha")));
		inputs[i].color = localStorage.getItem(("Source" + i + ": color"));
		if(localStorage.getItem(("Source" + i + ": audio")) == "true")
			inputs[i].audioEnabled = true;
		else
			inputs[i].audioEnabled = false;
	}
	/* Background Data */
	document.getElementById("bgsource").value = localStorage.getItem("bgsource");
	document.getElementById("bgwidth").value = parseInt(localStorage.getItem("bgwidth"));
	document.getElementById("bgheight").value = parseInt(localStorage.getItem("bgheight"));
	document.getElementById("option0").value = localStorage.getItem("option0");
	document.getElementById("option1").value = localStorage.getItem("option1");
	document.getElementById("option2").value = localStorage.getItem("option2");
	document.getElementById("option3").value = localStorage.getItem("option3");
	document.getElementById("option4").value = localStorage.getItem("option4");
	
	canvas.width = parseInt(localStorage.getItem("bgwidth"));
	canvas.height = parseInt(localStorage.getItem("bgheight"));
	
	/* remake and populate everything */
	createMenu();
	updateMenu();
	draw();
}

function launch(){
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
	
	function dummy(){/*I don't even...*/};
	
	var i;
    var commands = document.getElementById("testArea").value.split( '\n' );
    for( i = 0; i < commands.length; i++ )
        loadXMLDoc( 'http://localhost:8080/requests/vlm_cmd.xml?command='+commands[i].replace(/\#/g, '%23'), dummy );
}

function changeOutput(){
	if(document.getElementById("outPutTo")[1].selected == true || document.getElementById("outPutTo")[2].selected == true)
		document.getElementById("outputFile").innerHTML = "<td class=\"alt\">Filename</td><td><input id=\"File\" type=\"text\" value=\"./testvideo.ogg\"></td>";
	else
		document.getElementById("outputFile").innerHTML = "";
}

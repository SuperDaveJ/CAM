function MM_openBrWindow(theURL,winName,features) { //v2.0
  viewer = window.open(theURL,winName,features);
  viewer.focus();
}

/*************** SONIFICATION CODE ****************/
// generate chord permutations
chordList = new Array("C_F","D_G","D_Glow","Eb_Ab","F_Bb");
prevRandomNum = randomNum = 0;
var currentChord;
var uitimer;
function randomChord(){
	if(theme.IsPlaying()){ return; }
	while(randomNum == prevRandomNum){ // prevent two in a row
		randomNum = Math.round(Math.random() * (chordList.length - 1));
	}
	prevRandomNum = randomNum;
	currentChord = chordList[randomNum];
	this.timer = setTimeout("uisounds.gotoAndPlay(currentChord,'start')",100);

	fname = "_root." + currentChord + ".so.setVolume"; values = "100";
	uisounds.executeAS(fname,values);
}

function stopCurrentChord(){
	if(theme.IsPlaying()){ return; }
	if(FlashSound.playerVersion > 4){ // fade out for sound object players
		clearTimeout(this.timer);
		fname = "_root." + currentChord + ".so.fadeToStop";
		values = "0,700";
		uisounds.executeAS(fname,values);
	} else { // stop for flash 4
		uisounds.gotoAndPlay(currentChord,'stop');
	}
}

echoNoteList = new Array("C5","D","Eb","F","G","A","B","C6");
randomNum2 = prevRandomNum2 = 0;
function randomEchoNote(){
	if(theme.IsPlaying()){ return; }
	while(randomNum2 == prevRandomNum2){ // prevent two in a row
		randomNum2 = Math.round(Math.random() * (echoNoteList.length - 1));
	}
	prevRandomNum2 = randomNum2;
	uisounds.gotoAndPlay(echoNoteList[randomNum2],'start');
}

function playClick(){
	if(theme.IsPlaying()) { return;}
	uisounds.TGotoAndPlay("/clickmc",2);
}

function SetVariable(varname, varvalue){
	if(!this.isPlayerReady()) return;
	window.document[this.playerID].SetVariable(varname,varvalue);
}

function GetVariable(varname){
	if(!this.isPlayerReady()) return;
	return window.document[this.playerID].GetVariable(varname);
}

function executeAS(functionObj,argStr){
	if(!this.isPlayerReady()) return;
	// pass number of arguments to flash
	argArray = argStr.split(","); // split comma separated argument string
	this.SetVariable("/jsexecas:numargs",argArray.length);
	
	// pass function arguments to flash
	for (var i = 0; i <= argArray.length; i++){
		this.SetVariable("/jsexecas:arg" + i,argArray[i]);
	}
	
	if(arguments[2] == null){
		// pass function object name to flash
		this.SetVariable("/jsexecas:functionObj",functionObj);
		// execute actionscript function
		this.TGotoAndPlay("/jsexecas","asfunction");
	} else {
		// pass function object name to flash
		this.SetVariable("/jsexecas:functionObj",functionObj);
		// pass variable object name to flash
		this.SetVariable("/jsexecas:variableObj",arguments[2]);
		this.TGotoAndPlay("/jsexecas","asexpression");
	}
}

FlashSound.prototype.SetVariable = SetVariable;
FlashSound.prototype.GetVariable = GetVariable;
FlashSound.prototype.executeAS = executeAS;

uisounds = new FlashSound();
theme = new FlashSound();

/*************** END SONIFICATION CODE ****************/

var autostart;
function preloadSounds(){
	if(document.cookie.indexOf("insidesite=yes") == -1){ // no cookie, user from outside site
		if(FlashSound.configuredForInteraction()){ // interactive player only
			if(location.search.indexOf("preload=true") == -1){ // not yet redirected
				location.replace("preloadscreen.html?redirect=" + location.href); // do not set cookie, redirect to preload screen
			} else { // coming back from preload screen
				document.cookie = "insidesite=yes;path=/"; // set cookie
				autostart = true; // autostart backing music	
			}	
		} else { // non interactive player
			autostart = true; // autostart backing music
			document.cookie = "insidesite=yes;path=/"; // set cookie
		}	
	} else {
		autostart = false; // no autostart backing music
	}
}

// embed graphical SWF that autoplays on first entering site
function embedTheme(){
	str = "SRC='documentation/swf/theme.swf' PLAY='" + autostart + "'" +
			" BGCOLOR='#6666CC' WIDTH='95' HEIGHT='32'" +
			" QUALITY='high' WMODE='opaque'";
	if(FlashSound.hasMinPlayer() && !FlashSound.configuredForInteraction()){
		FlashSound.customEmbedSWF(str);
	} else if(FlashSound.configuredForInteraction()){
		theme.customEmbedSWF(str);
	}
}

function endLinkGroup(){
	this.endingLinkNum = document.links.length - 1;
	i = this.startingLinkNum;
	while(i >= this.startingLinkNum && i <= this.endingLinkNum){
		if(this.onclick != null) { document.links[i].onclick = this.onclick; }
		if(this.onmouseout != null) { document.links[i].onmouseout = this.onmouseout; }
		if(this.onmouseover != null) { document.links[i].onmouseover = this.onmouseover; }
		i++;
	}
}

// define LinkGroup class
function LinkGroup(){
	this.startingLinkNum = document.links.length;
	this.endingLinkNum = null;
	this.onclick = null;
	this.onmouseout = null;
	this.onmouseover = null;
	this.endLinkGroup = endLinkGroup;
}


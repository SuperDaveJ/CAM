//// JavaScript Document
//
var verNumber = 1; // 1: for LMS; 2: CD.
var closing = true;
//Change menuFile for each module
var menuFile = "../nrcs_demo_mainmenu.htm"

function goNext(pgURL) {
	closing = false;
	window.location = pgURL
}

function refresh() {
	closing = false;
	window.location.reload();
}

function toMenu(pgURL) {
	goNext(menuFile)
}

function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (verNumber != 2) {
		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0
		updateDatabase();
		unloadPage();
	}
	window.close();
}

function updateDatabase() {
	//set to mainmenu
	var pageLocation = menuFile.substring(menuFile.indexOf("/")+1, menuFile.length);
	doLMSSetValue("cmi.core.lesson_location", pageLocation);
	doLMSCommit();
}

//this fuction is for page popup
function transTerm(termNum) {
	var intH = self.screenTop + 50
	var intW = self.screenLeft + 120
	var theURL = getPage()+"pop.htm?popterm=" + termNum
	window.open(theURL, "", "left="+intW+", top="+intH + ",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function getPage() {
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = window.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
}

function PageQuery(q) {
	if(q.length > 1) this.q = q.substring(1, q.length);
	else this.q = null;
	this.keyValuePairs = new Array();
	if(q) {
		for(var i=0; i < this.q.split("&").length; i++) {
			this.keyValuePairs[i] = this.q.split("&")[i];
		}
	}

	this.getKeyValuePairs = function() { return this.keyValuePairs; }

	this.getValue = function(s) {
		for(var j=0; j < this.keyValuePairs.length; j++) {
			if(this.keyValuePairs[j].split("=")[0] == s)
				return this.keyValuePairs[j].split("=")[1];
		}
		return false;
	}

	this.getParameters = function() {
		var a = new Array(this.getLength());
		for(var j=0; j < this.keyValuePairs.length; j++) {
			a[j] = this.keyValuePairs[j].split("=")[0];
		}
		return a;
	}

	this.getLength = function() { return this.keyValuePairs.length; } 
}

function getQueryValue(key){
	var page = new PageQuery(window.location.search); 
	return unescape(page.getValue(key)); 
}

function getCookie(Name) {
	var Mysearch = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(Mysearch);
		if (offset != -1){
			offset += Mysearch.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

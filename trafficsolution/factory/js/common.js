//wwonline
var exitpop=false;
function PopPage(strURL, name, width, height, left, top)
{
    if(width==null) width=800;
    if(height==null) height=500;
    if(left==null) left = ( screen.width - width ) / 2;
    if(top==null) top  = ( screen.height - height ) / 2;
    temp = "width="+width+",height="+height+",left="+left+",top="+top+",scrollbars=1,toolbar=no,location=no,directories=no,status=no,resizable=no";
    w = window.open(strURL,name,temp);
    w.focus();
}
function GetCookie(cookiename)
{
    var thebigcookie = document.cookie;
    var firstchar = thebigcookie.indexOf(cookiename);
    if (firstchar != -1) {
        firstchar += cookiename.length + 1;
        lastchar = thebigcookie.indexOf(";",firstchar);
        if(lastchar == -1) lastchar = thebigcookie.length;
        return unescape(thebigcookie.substring(firstchar, lastchar));
    }
    return "";
}
function setCookie(cookiename,cookievalue,cookieexpdate,domainname)
{
    document.cookie = cookiename + "=" + cookievalue
    + "; domain=" + domainname
    + "; path=" + "/"
    + "; expires=" + cookieexpdate.toGMTString();

}
function unloadpopup(cookiename,popurl,popwidth,popheight,domainname,tr)
{
    //return;
    try {
        if (!tr)
            return;
        if( GetCookie(cookiename) == "" )
        {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + 1 * (24 * 60 * 60 * 1000)); //+1 day
            setCookie(cookiename,"yes",expdate,domainname);
            if( exitpop )
            {
                w = window.open(popurl,cookiename,"width="+popwidth+",height="+popheight+",scrollbars=1,toolbar=yes,location=yes,menubar=yes,status=yes,resizable=yes");
                w.focus;
            }
        }
    }catch (e) {}
}
function setCheckboxes(theForm, elementName, isChecked)
{
	try
	{
		var chkboxes = document.forms[theForm].elements[elementName];
		var count = chkboxes.length;
		if (count)
		{
			for (var i = 0; i < count; i++)
			{
				chkboxes[i].checked = isChecked;
			}
		}
		else
		{
			chkboxes.checked = isChecked;
		}
		return true;
	}catch(exception){}
}

function getCheckboxesValue(theForm, elementName)
{
	try
	{
	    var _value="";
		var chkboxes = document.forms[theForm].elements[elementName];
		var count = chkboxes.length;
		if (count)
		{
			for (var i = 0; i < count; i++)
			{
				if (chkboxes[i].checked)
				{
				    _value=_value+chkboxes[i].value+",";
				}
			}
			_value=_value.substr(0,_value.length-1);
		}
		else
		{
		    if (chkboxes.checked)
            {
                _value=chkboxes.value;
            }
		}
		return _value;
	}catch(exception){return "";}
}

function isCheckboxesChecked(theForm, elementName)
{
	try
	{
		var chkboxes = document.forms[theForm].elements[elementName];
		var count = chkboxes.length;
		if (count)
		{
			for (var i = 0; i < count; i++)
			{
				if (chkboxes[i].checked)
				{
				   return true;
				}
			}
		}
		else
		{
		    if (chkboxes.checked)
            {
                return true;
            }
		}
	}catch(exception){}
	return false;
}

function getCheckboxesTitle(theForm, elementName)
{
	try
	{
	    var _value="";
		var chkboxes = document.forms[theForm].elements[elementName];
		var count = chkboxes.length;
		if (count)
		{
			for (var i = 0; i < count; i++)
			{
				if (chkboxes[i].checked)
				{
				    _value=_value+chkboxes[i].title+",";
				}
			}
			_value=_value.substr(0,_value.length-1);
		}
		else
		{
		    if (chkboxes.checked)
            {
                _value=chkboxes.title;
            }
		}
		return _value;
	}catch(exception){return "";}
}

var imageObject;
function ResizeImage(obj, MaxW, MaxH)
{
    if (obj != null) imageObject = obj;
    var state=imageObject.readyState;
	if(state!='complete') {
        setTimeout("ResizeImage(null,"+MaxW+","+MaxH+")",50);
		return;
    }
    var oldImage = new Image();
    oldImage.src = imageObject.src;
    var dW=oldImage.width; var dH=oldImage.height;
    if(dW>MaxW || dH>MaxH) {
        a=dW/MaxW; b=dH/MaxH;
        if(b>a) a=b;
        dW=dW/a; dH=dH/a;
    }
    if(dW > 0 && dH > 0) {
        imageObject.width=dW;
		imageObject.height=dH;
	}
}

function $(id)
{
   return document.getElementById(id); 
} 

  
function getRadioValue(elementName)
{
	var radios=document.forms[0].elements[elementName];
	for (i=0;i<radios.length;i++)
	{
		if (radios[i].checked)
		{
			return radios[i].value;
		}
	}
	return "-1";
}
function QueryString(paraName){     var url = window.location.search;     var para = url.substr(url.indexOf(paraName));     var andIndex = para.indexOf("&");     var paras;     if(andIndex>-1){         paras = para.substr(0,para.indexOf("&"));     }else{         paras = para;     }     var paraValue = paras.split("=")[1];     if(paraValue){          return decodeURI(paraValue);     }else{return "";}; } 

		/**
		 * 色 
		 * calculate color 
		 */
		function chC(target){
			var clr=dlgHelper.ChooseColorDlg();
			if (clr) {
				var cl=clr.toString(16);
				var z="0";
				var i;
				for (i = cl.length; i < 6; i++) {
					cl = z.toString() + cl;
				}
				target.style.color = "#"+cl;

				var colorValue = 0;
				for(i = 0; i < 3; i++){
					colorValue += (ConvertToInt(cl.substring(i * 2, i * 2 + 1)) * 16 + ConvertToInt(cl.substring(i * 2 + 1, i * 2 + 2))) * Math.pow(16, i * 2);
				}
				target.value = "#"+cl;
			}
		}
		
		function ConvertToInt(c){
			var i;

			if(c.toLowerCase() == "a"){
				i = 10;
			}
			else if(c.toLowerCase() == "b"){
				i = 11;
			}
			else if(c.toLowerCase() == "c"){
				i = 12;
			}
			else if(c.toLowerCase() == "d"){
				i = 13;
			}
			else if(c.toLowerCase() == "e"){
				i = 14;
			}
			else if(c.toLowerCase() == "f"){
				i = 15;
			}
			else{
				i = eval(c);
			}

			return i;
		}

		/**
		 * 元夭薷之 
		 * find element and modify it
		 */
		function SetValue(elementID, data){
			var element = findElement(elementID);
			if(element != null){
				element.value = data;
			}
		}
		function findElement(id){
			var element = null;
			for(var i = 0; i < document.all.length; i++){
				if(document.all.item(i).id.indexOf(id) != -1){	/* 模询  FuzzyFind  */
					element = document.all.item(i);
					break;
				}
			}
			return element;
		}
		
	//	window.document.write('<object id="dlgHelper" height="0px" width="0px" classid="clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b"></object>');
	
function getWindowWidth()
{
     var windowWidth;
    if (self.innerHeight) { // all except Explorer
    windowWidth = self.innerWidth;

    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
    windowWidth = document.documentElement.clientWidth;

    } else if (document.body) { // other Explorers
    windowWidth = document.body.clientWidth;
    }
    return windowWidth;
}
    
function getWindowHeight()
{
     var windowHeight;
    if (self.innerHeight) { // all except Explorer

    windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode

    windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
    windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}    

String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.LTrim = function()
{
    return this.replace(/(^\s*)/g, "");
}
String.prototype.Rtrim = function()
{
    return this.replace(/(\s*$)/g, "");
}

 function ReplaceNullString( str,  err)//空值字符串替换函数
{
    if((str==null)||(str.Trim()==""))
    {
        return err;
    }
    else
    {
        return str;
    }
}


function copyToClipboard(txt) 
{
 if(window.clipboardData) 
 {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text", txt);
 } else if(navigator.userAgent.indexOf("Opera") != -1) {
  //暂时无方法:-(
 } else 
    if (window.netscape) {
      try {
       netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      } catch (e) {
       alert("您的firefox安全限制限制您进行剪贴板*作，请打开’about:config’将signed.applets.codebase_principal_support’设置为true’之后重试");
       return false;
  }
      var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
      if (!clip)
      return;
      var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
      if (!trans)
      return;
      trans.addDataFlavor('text/unicode');
      var str = new Object();
      var len = new Object();
      var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
      var copytext = txt;
      str.data = copytext;
      trans.setTransferData("text/unicode",str,copytext.length*2);
      var clipid = Components.interfaces.nsIClipboard;
      if (!clip)
      return false;
      clip.setData(trans,null,clipid.kGlobalClipboard);
 }
}

<!--
function runScript(srcpath,onReady)
{
  var ScriptId="spc"; //在这里设置Script的ID,以免与别的SCRIPT重名

  var script=document.createElement("script");
  with(script)
   {
   language="javascript";
   src=srcpath;
  charset="utf-8";
  onreadystatechange=function(){if(readyState=="Completed")if(typeof(onReady)=="function")onReady();}
   }
  var head=document.getElementsByTagName("head");
  if(head.length)
  {
 var currscript=document.getElementById(ScriptId);
 if(currscript!=null) head[0].replaceChild(script,currscript);
 else head[0].appendChild(script);
  }
}

function getScript()
{
 var script=document.getElementsByTagName("script");
 for(i=0;i<script.length;i++) alert(script[i].innerHTML);
}
//-->

// 选颜色
var oInputColor;
var oImgColor;
function selColor(obj, oImg)
{
	oInputColor=obj;
	oImgColor=oImg;
	if (document.all){
		var arr = showModalDialog("/js/selcolor.htm", "", "dialogWidth:290px; dialogHeight:280px; status:0; help:0");
		if (arr != null && arr != "")
		{
			obj.value=arr;
			oImg.style.backgroundColor=arr.replace('0x','#');
		}
	}else{
			var fcolorWin = window.open("","fcolorWin","width=290,height=280");
			if (fcolorWin) {
				fcolorWin.focus();
			}else{
				alert("Please turn off your PopUp blocking software");
				return;
			}
		
			launchParameters = new Object();
			launchParameters['wbtb'] = window;
			launchParameters['commandName'] = 'setColor';
			fcolorWin.launchParameters = launchParameters;
			fcolorWin.location.href="selcolor.htm";
	}
}

function KREditor(id)
{
	window.open('/KREditor/editor.aspx?id='+id, '动作编辑器' , 'scrollbars=no');
}
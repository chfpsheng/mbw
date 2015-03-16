//有效的时间范围 
var date_start,date_end,g_object
var today = new Date();
var separator="-";
var inover=false;

//mode :时间变换的类型0-年 1-月 2-直接选择月
function change_date(temp,mode)
{
	var t_month,t_year
    if (mode){
        if(mode==1)
        t_month=parseInt(cele_date_month.value,10)+parseInt(temp,10);
        else
        t_month=parseInt(temp)
        if (t_month<cele_date_month.options(0).text) {
            cele_date_month.value=cele_date_month.options(cele_date_month.length-1).text;
            change_date(parseInt(cele_date_year.value,10)-1,0);
            }
        else{
            if (t_month>cele_date_month.options(cele_date_month.length-1).text){
                cele_date_month.value=cele_date_month.options(0).text;
                change_date(parseInt(cele_date_year.value,10)+1,0);
                }            
            else
                {cele_date_month.value=t_month;
                 set_cele_date(cele_date_year.value,cele_date_month.value);                
                }
        }
    }  
    else{
        t_year=parseInt(temp,10);
        
        if (t_year<cele_date_year.options(0).text) {
            cele_date_year.value=cele_date_year.options(0).text;
            set_cele_date(cele_date_year.value,1);                
            }
        else{
            if (parseInt(t_year,10)>parseInt(cele_date_year.options(cele_date_year.length-1).text,10)){
                cele_date_year.value=cele_date_year.options(cele_date_year.length-1).text;
                set_cele_date(cele_date_year.value,12);                
                }            
            else
                {cele_date_year.value=t_year;
                 set_cele_date(cele_date_year.value,cele_date_month.value);                
                }
        }
    }
    window.cele_date.focus();
}

//初始化日历
function init(d_start,d_end)
{
     var temp_str;
     var i=0
     var j=0
     date_start=new Date(2000,7,1)
     date_end=new Date(2004,8,1)
     
     document.writeln("<div name=\"cele_date\" id=\"cele_date\"  style=\"display:none\" style=\"LEFT: 69px; POSITION: absolute;Z-INDEX:99;\" onClick=\"event.cancelBubble=true;\" onBlur=\"hilayer()\" onMouseout=\"lostlayerfocus()\">&nbsp; </div>");

     window.cele_date.innerHTML="";
     temp_str="<table style=\"background:#ffffff url(/Images/date/datebg.gif) no-repeat left top; width:146px; height:23px;\"><tr colspan=5><td colspan=7 onmouseover=\"overcolor(this)\">";
     temp_str+="<input  type=\"image\" src=\"/Images/date/dateleftbtn.gif\" onclick=\"change_date(-1,1)\" onmouseover=\"getlayerfocus()\" style=\"font-size: 10px;color: #FFFFFF; background-color: #5d7790; cursor: hand\"></td>";//左面的箭头

     temp_str+=""//年
     temp_str+="&nbsp;<td valign=\"top\"><select name=\"cele_date_year\" id=\"cele_date_year\" language=\"javascript\" onchange=\"change_date(this.value,0)\" onmouseover=\"getlayerfocus()\" onblur=\"getlayerfocus()\" style=\"background-color: #D0F1FD;overflow-y:scroll;overflow-x:hidden; outline:hidden; font-family:tahoma; font-size:10px;\">"


     for (i=1900;i<=2020;i++)
     {
     temp_str+="<OPTION value=\""+i.toString()+"\">"+i.toString()+"</OPTION>";
     }
     temp_str+="</select></td>";
     temp_str+=""//月
     temp_str+="<td valign=\"top\"><select  name=\"cele_date_month\" id=\"cele_date_month\" language=\"javascript\" onchange=\"change_date(this.value,2)\" onmouseover=\"getlayerfocus()\" onblur=\"getlayerfocus()\" style=\"background-color: #D0F1FD;   border:0px;height:18px;font:width:8px;overflow-y:scroll;overflow-x:hidden;SCROLLBAR-FACE-COLOR: #E5E9F2;SCROLLBAR-HIGHLIGHT-COLOR: #E5E9F2;SCROLLBAR-SHADOW-COLOR: #A4B9D7; SCROLLBAR-3DLIGHT-COLOR: #A4B9D7; SCROLLBAR-ARROW-COLOR:#000000; SCROLLBAR-TRACK-COLOR:#eeeee6; SCROLLBAR-DARKSHADOW-COLOR: #ffffff; font-family:tahoma; font-size:10px; \">"
     for (i=1;i<=12;i++)
     {
     temp_str+="<OPTION value=\""+i.toString()+"\">"+i.toString()+"</OPTION>";
     }
     temp_str+="</select></div></td>&nbsp;";
     temp_str+=""//右箭头
     temp_str+="<td><input input  type=\"image\" src=\"/Images/date/daterightbtn.gif\" onclick=\"change_date(1,1)\" onmouseover=\"getlayerfocus()\"  style=\"font-size: 10px;color: #FFFFFF; background-color: #5d7790; cursor: hand\">";
     temp_str+="</td></tr></table>";
	 //表格分界
	 temp_str+="<table cellspacing=\"2\" cellpadding=\"3\" style=\"margin-left:1px; margin-top:-1px;width:140px; border:1px solid #000000; background-color:#FFFFFF;\"><tr style=\"font-size: 12px; color:#005825; font-family:\"Arial Black\"\"><td onmouseover=\"overcolor(this)\">"
     temp_str+="<font color=red>Su</font></td><td>";temp_str+="Mo</td><td>"; temp_str+="Tu</td><td>"; temp_str+="We</td><td>"
     temp_str+="Th</td><td>";temp_str+="Fr</td><td>"; temp_str+="Sa</td></tr>";
     for (i=1 ;i<=6 ;i++)
     {
     temp_str+="<tr>";
        for(j=1;j<=7;j++){
            temp_str+="<td name=\"c"+i+"_"+j+"\"id=\"c"+i+"_"+j+"\" style=\"CURSOR: hand;font-size: 12px;\" style=\"COLOR:#0076A3;  font-family:\"Arial Black\"\" language=\"javascript\" onmouseover=\"overcolor(this)\" onmouseout=\"outcolor(this)\" onclick=\"td_click(this)\">&nbsp;</td>"
            }
     temp_str+="</tr>"        
     }
     temp_str+="</td></tr></table>";
     window.cele_date.innerHTML=temp_str;
}
function set_cele_date(year,month)
{
   var i,j,p,k
   var nd=new Date(year,month-1,1);
   event.cancelBubble=true;
   cele_date_year.value=year;
   cele_date_month.value=month;   
   k=nd.getDay()-1
   var temp;
   for (i=1;i<=6;i++)
      for(j=1;j<=7;j++)
      {
      eval("c"+i+"_"+j+".innerHTML=\"\"");
      eval("c"+i+"_"+j+".bgColor=\"#EFEFEF\"");
      eval("c"+i+"_"+j+".style.cursor=\"hand\"");
      eval("c"+i+"_"+j+".align=\"center\"");
      }
   while(month-1==nd.getMonth())
    { j=(nd.getDay() +1);
      p=parseInt((nd.getDate()+k) / 7)+1;
      eval("c"+p+"_"+j+".innerHTML="+"\""+nd.getDate()+"\"");
      if ((nd.getDate()==today.getDate())&&(cele_date_month.value==today.getMonth()+1)&&(cele_date_year.value==today.getYear())){
		 eval("c"+p+"_"+j+".align=\"center\"");
      	 eval("c"+p+"_"+j+".bgColor=\"#cecece\"");
      }
      if (nd>date_end || nd<date_start)
      {
      eval("c"+p+"_"+j+".bgColor=\"#FF9999\"");
      eval("c"+p+"_"+j+".style.cursor=\"text\"");
      }
      nd=new Date(nd.valueOf() + 86400000)
    }
}

//s_object：点击的对象；d_start-d_end有效的时间区段；需要存放值的控件；
function show_cele_date(eP,d_start,d_end,t_object)
{
window.cele_date.style.display="";
window.cele_date.style.zIndex=99;
var s,cur_d;
var eT = eP.offsetTop;  
var eH = eP.offsetHeight+eT;  
var dH = window.cele_date.style.pixelHeight;  
var sT = document.body.scrollTop; 
var sL = document.body.scrollLeft; 
event.cancelBubble=true;
window.cele_date.style.posLeft = event.clientX-event.offsetX+sL-5;  
window.cele_date.style.posTop = event.clientY - 20;//-event.offsetY+eH+sT-2
if (window.cele_date.style.posLeft+window.cele_date.clientWidth>document.body.clientWidth) window.cele_date.style.posLeft+=eP.offsetWidth-window.cele_date.clientWidth;
//if (window.cele_date.style.posTop+window.cele_date.clientHeight>document.body.clientHeight) window.cele_date.style.posTop-=(eP.offsetHeight+window.cele_date.clientHeight+5);
if (d_start!=""){
    if (d_start=="today"){
        date_start=new Date(today.getYear(),today.getMonth(),today.getDate());
    }else{
        s=d_start.split(separator);
        date_start=new Date(s[0],s[1]-1,s[2]);
    }
}else{
    date_start=new Date(1900,1,1);
}

if (d_end!=""){
    s=d_end.split(separator);
    date_end=new Date(s[0],s[1]-1,s[2]);
}else{
    date_end=new Date(3000,1,1);
}

g_object=t_object

cur_d=new Date()
set_cele_date(cur_d.getYear(),cur_d.getMonth()+1);
window.cele_date.style.display="block";
window.cele_date.focus();
}
function td_click(t_object)
{
var t_d
if (parseInt(t_object.innerHTML,10)>=1 && parseInt(t_object.innerHTML,10)<=31 ) 
{ t_d=new Date(cele_date_year.value,cele_date_month.value-1,t_object.innerHTML)
if (t_d<=date_end && t_d>=date_start)
{
var year = cele_date_year.value;
var month = cele_date_month.value;
var day = t_object.innerHTML;
if (parseInt(month)<10) month = "0" + month;
if (parseInt(day)<10) day = "0" + day;

g_object.value=year+separator+month+separator+day;
window.cele_date.style.display="none";};
g_object.focus();g_object.blur();//
}

}
function h_cele_date()
{
window.cele_date.style.display="none";
}

function overcolor(obj)
{
  if (obj.style.cursor=="hand") obj.style.color = "#FF9C00";
  inover=true;
  window.cele_date.focus();
}

function outcolor(obj)
{
  obj.style.color = "#0076A3";
  inover=false;
}


function getNow(o){
    var Stamp=new Date();
    var year = Stamp.getYear();
    var month = Stamp.getMonth()+1;
    var day = Stamp.getDate();
    if(month<10){
	month="0"+month;
    }
    if(day<10){
	day="0"+day;
    }
    o.value=year+separator+month+separator+day;
}

function hilayer()
{
	if (inover==false)
	{
		var lay=document.all.cele_date;
		lay.style.display="none";
	}
}
function getlayerfocus()
{
	inover=true;
}
function lostlayerfocus()
{
	inover=false;
}
init();
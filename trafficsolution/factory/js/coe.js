
var tID=0;
function ShowTabs(ID){
  if(ID!=tID){
    TabTitle[tID].className='tab_disable';
    TabTitle[ID].className='tab_active';
    Tabs[tID].style.display='none';
    Tabs[ID].style.display='';
    tID=ID;
  }
}

function delete_confirm() {
  event.returnValue=confirm("确定是否删除当前记录?");
}
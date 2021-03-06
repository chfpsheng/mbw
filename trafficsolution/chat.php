<?php
/****************************************************************************************
* LiveZilla chat.php
* 
* Copyright 2014 LiveZilla GmbH
* All rights reserved.
* LiveZilla is a registered trademark.
* 
* Improper changes to this file may cause critical errors.
***************************************************************************************/ 

define("IN_LIVEZILLA",true);
if(!defined("LIVEZILLA_PATH"))
	define("LIVEZILLA_PATH","./");
	
@ini_set('session.use_cookies', '0');
@error_reporting(E_ALL);
$static_frames = array("lz_chat_frame.3.2.lgin","lz_chat_frame.3.2.mail","lz_chat_frame.3.2.mail.0.0","lz_chat_frame.3.2.chat.5.0");
$content_frames = array("lz_chat_frame.3.2.lgin.1.0","lz_chat_frame.3.2.mail.1.0","lz_chat_frame.3.2.chat.1.0","lz_chat_frame.3.2.chat.0.0","lz_chat_frame.1.1","lz_chat_frame.3.2.chat.5.0");
$html = "";

require(LIVEZILLA_PATH . "_definitions/definitions.inc.php");
require(LIVEZILLA_PATH . "_lib/functions.global.inc.php");
require(LIVEZILLA_PATH . "_definitions/definitions.protocol.inc.php");
require(LIVEZILLA_PATH . "_definitions/definitions.dynamic.inc.php");
require(LIVEZILLA_PATH . "_lib/objects.global.users.inc.php");

defineURL(FILE_CHAT);
initDataProvider();
languageSelect();

if(!(isset($_GET[GET_EXTERN_TEMPLATE]) && !in_array($_GET[GET_EXTERN_TEMPLATE],$content_frames)))
{
	require(LIVEZILLA_PATH . "_lib/functions.external.inc.php");
	require(LIVEZILLA_PATH . "_lib/objects.external.inc.php");

	@set_time_limit($CONFIG["timeout_chats"]);
	if(!isset($_GET["file"]))
		@set_error_handler("handleError");
	
	$browserId = getId(USER_ID_LENGTH);
	define("SESSION",getSessionId());

	if(empty($CONFIG["gl_om_pop_up"]) && $CONFIG["gl_om_mode"] == 1)
	{
        initData(array("INTERNAL","GROUPS","FILTERS"));
		$groupbuilder = new GroupBuilder($INTERNAL,$GROUPS,$CONFIG);
		$groupbuilder->Generate();
		if(!$groupbuilder->GroupAvailable)
			exit("<html><script language=\"JavaScript\">if(typeof(window.opener != null) != 'undefined')window.opener.location = \"".$CONFIG["gl_om_http"]."\";window.close();</script></html>");
	}
	else
		initData(array("FILTERS"));

	if((isset($_POST["company"]) && !empty($_POST["company"])) || (isset($_POST["email"]) && !empty($_POST["email"])) || (isset($_POST["name"]) && !empty($_POST["name"])) || (isset($_POST["text"]) && !empty($_POST["text"])))
		exit(Filter::CreateFloodFilter(getIP(),null));
}

header("Content-Type: text/html; charset=utf-8");
if(!isset($_GET[GET_EXTERN_TEMPLATE]))
{
	define("IS_FLOOD",Filter::IsFlood(getIP(),null,true));
	define("IS_FILTERED",$FILTERS->Match(getIP(),formLanguages(((!empty($_SERVER["HTTP_ACCEPT_LANGUAGE"])) ? $_SERVER["HTTP_ACCEPT_LANGUAGE"] : "")),SESSION));

    require(LIVEZILLA_PATH . "_lib/trdp/mobde.php");
    $MobileDetect = new Mobile_Detect();
    $small = ($MobileDetect->isMobile() && !$MobileDetect->isTablet());

    initData(array("INTERNAL","DBCONFIG"));
	$html = getFile(TEMPLATE_HTML_CHAT);
	$html = str_replace("<!--extern_script-->",getFile(TEMPLATE_SCRIPT_EXTERN).getFile(TEMPLATE_SCRIPT_DATA).getFile(TEMPLATE_SCRIPT_CHAT).getFile(TEMPLATE_SCRIPT_FRAME),$html);
	$html = str_replace("<!--server_id-->",substr(md5($CONFIG["gl_lzid"]),5,5),$html);
	$html = str_replace("<!--connector_script-->",getFile(TEMPLATE_SCRIPT_CONNECTOR),$html);
	$html = str_replace("<!--group_script-->",getFile(TEMPLATE_SCRIPT_GROUPS),$html);
	$html = str_replace("<!--global_script-->",getFile(TEMPLATE_SCRIPT_GLOBAL),$html);
	$html = str_replace("<!--browser_id-->",$browserId,$html);
	$html = str_replace("<!--extern_timeout-->",min($CONFIG["timeout_chats"],$CONFIG["timeout_track"]),$html);
    $html = str_replace("<!--show_oib-->",parseBool(!empty($CONFIG["gl_soib"])),$html);
	$html = str_replace("<!--window_width-->",$CONFIG["wcl_window_width"],$html);
	$html = str_replace("<!--window_height-->",$CONFIG["wcl_window_height"],$html);
	$html = str_replace("<!--window_resize-->",parseBool($CONFIG["gl_hrol"]),$html);
    $html = str_replace("<!--small-->",parseBool($small || !empty($_GET["s"]) || (empty($CONFIG["gl_cali"]) && empty($CONFIG["gl_cahi"]))),$html);
    $html = str_replace("<!--ticket_file_uploads-->",parseBool(true),$html);
	$html = str_replace("<!--show_waiting_message-->",parseBool(strlen($CONFIG["gl_wmes"])>0),$html);
	$html = str_replace("<!--waiting_message_time-->",$CONFIG["gl_wmes"],$html);
	$html = str_replace("<!--extern_frequency-->",$CONFIG["poll_frequency_clients"],$html);
	$html = str_replace("<!--cbcd-->",parseBool($CONFIG["gl_cbcd"]),$html);
	$html = str_replace("<!--bookmark_name-->",base64_encode($CONFIG["gl_site_name"]),$html);
	$html = str_replace("<!--user_id-->",SESSION,$html);
	$html = str_replace("<!--connection_error_span-->",CONNECTION_ERROR_SPAN,$html);
	$html = str_replace("<!--info_text-->",base64_encode($CONFIG["gl_info"]),$html);
	$html = geoReplacements($html);
	$html = str_replace("<!--requested_intern_userid-->",base64_encode((!empty($_GET[GET_EXTERN_INTERN_USER_ID]) && isset($INTERNAL[Operator::GetSystemId(base64UrlDecode($_GET[GET_EXTERN_INTERN_USER_ID]))])) ? (base64UrlDecode($_GET[GET_EXTERN_INTERN_USER_ID])):""),$html);
    $html = str_replace("<!--requested_intern_fullname-->",base64_encode((!empty($_GET[GET_EXTERN_INTERN_USER_ID]) && isset($INTERNAL[Operator::GetSystemId(base64UrlDecode($_GET[GET_EXTERN_INTERN_USER_ID]))])) ? $INTERNAL[Operator::GetSystemId(base64UrlDecode($_GET[GET_EXTERN_INTERN_USER_ID]))]->Fullname:""),$html);
    $html = str_replace("<!--debug-->",parseBool(!empty($_GET["debug"])),$html);
    $html = str_replace("<!--geo_resolute-->",parseBool(!empty($CONFIG["gl_use_ngl"]) && !empty($CONFIG["gl_pr_ngl"]) && !(getCookieValue("geo_data") != null && getCookieValue("geo_data") > (time()-2592000)) && !isSSpanFile()),$html);
    $html = str_replace("<!--chat_id-->",((!empty($_GET["cid"])) ? getParam("cid") : ""),$html);
	$html = str_replace("<!--gtv2_api_key-->",((strlen($CONFIG["gl_otrs"])>1) ? $CONFIG["gl_otrs"] : ""),$html);
	$html = str_replace("<!--template_message_intern-->",base64_encode(str_replace("<!--color-->",getOParam("epc","#73be28",$nu,FILTER_VALIDATE_REGEXP,array("options"=>array("regexp"=>FILTER_VALIDATE_REGEXP_HEXCOLOR))),str_replace("<!--dir-->",$LANG_DIR,getFile(TEMPLATE_HTML_MESSAGE_INTERN)))),$html);
	$html = str_replace("<!--template_message_extern-->",base64_encode(str_replace("<!--dir-->",$LANG_DIR,getFile(TEMPLATE_HTML_MESSAGE_EXTERN))),$html);
	$html = str_replace("<!--template_message_add-->",base64_encode(str_replace("<!--dir-->",$LANG_DIR,getFile(TEMPLATE_HTML_MESSAGE_ADD))),$html);
	$html = str_replace("<!--template_message_add_alt-->",base64_encode(str_replace("<!--dir-->",$LANG_DIR,getFile(TEMPLATE_HTML_MESSAGE_ADD_ALTERNATE))),$html);
	$html = str_replace("<!--direct_login-->",parseBool((isset($_GET[GET_EXTERN_USER_NAME]) && !isset($_GET[GET_EXTERN_RESET])) || isset($_GET["dl"])),$html);
    $html = str_replace("<!--preselect_ticket-->",parseBool(isset($_GET["pt"])),$html);
    $html = str_replace("<!--is_ie-->",parseBool((!empty($_SERVER['HTTP_USER_AGENT']) && (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))),$html);
	$html = str_replace("<!--setup_error-->",base64_encode(buildLoginErrorField()),$html);
	$html = str_replace("<!--offline_message_mode-->",$CONFIG["gl_om_mode"],$html);
	$html = str_replace("<!--offline_message_http-->",$CONFIG["gl_om_http"],$html);
    $html = str_replace("<!--checkout_url-->",(!empty($CONFIG["db"]["ccpp"]["Custom"])) ? $CONFIG["db"]["ccpp"]["Custom"]->URL : "",$html);
	$html = str_replace("<!--checkout_only-->",parseBool(!empty($_GET["co"]) && !empty($_GET[GET_EXTERN_GROUP])),$html);
	$html = str_replace("<!--checkout_extend_success-->",parseBool(!empty($_GET["co"]) && !empty($_GET["vc"])),$html);
    $html = str_replace("<!--function_callback-->",parseBool(!empty($_GET["cmb"]) || !empty($_GET["ofc"])),$html);
    $html = str_replace("<!--function_ticket-->",parseBool(empty($_GET["nct"])),$html);
    $html = str_replace("<!--function_chat-->",parseBool(empty($_GET["hfc"])),$html);
    $html = str_replace("<!--hide_group_select_chat-->",parseBool(getOParam("hcgs",0,$nu,FILTER_VALIDATE_INT)=="1"),$html);
    $html = str_replace("<!--hide_group_select_ticket-->",parseBool(getOParam("htgs",0,$nu,FILTER_VALIDATE_INT)=="1"),$html);
    $html = str_replace("<!--require_group_selection-->",parseBool(getOParam("rgs",0,$nu,FILTER_VALIDATE_INT)=="1"),$html);
    $html = str_replace("<!--offline_message_pop-->",parseBool(!empty($CONFIG["gl_om_pop_up"]) || empty($CONFIG["gl_om_mode"])),$html);
}
else
{
	if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.lgin.1.0")
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		$html = (isset($CONFIG["gl_site_name"])) ? str_replace("<!--config_name-->",$CONFIG["gl_site_name"],$html) : str_replace("<!--config_name-->","LiveZilla",$html);
		$html = getChatLoginInputs($html,MAX_INPUT_LENGTH);
		$html = str_replace("<!--alert-->",getAlertTemplate(),$html);
		$html = str_replace("<!--com_chats-->",getChatVoucherTemplate(),$html);
		$html = str_replace("<!--ssl_secured-->",((getScheme() == SCHEME_HTTP_SECURE && !empty($CONFIG["gl_sssl"])) ? "" : "display:none;"),$html);
    }
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.lgin.0.0")
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.chat" && isset($_POST[GET_EXTERN_GROUP]))
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		$html = str_replace("<!--intgroup-->",base64UrlEncode($_POST[GET_EXTERN_GROUP]),$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.mail.1.0")
	{
        initData(array("INTERNAL","GROUPS","INPUTS"));
		$groupbuilder = new GroupBuilder($INTERNAL,$GROUPS,NULL);
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		$html = getChatLoginInputs($html,MAX_INPUT_LENGTH);
		$html = str_replace("<!--alert-->",getAlertTemplate(),$html);
		$html = str_replace("<!--ssl_secured-->",((getScheme() == SCHEME_HTTP_SECURE && !empty($CONFIG["gl_sssl"])) ? "" : "display:none;"),$html);
		$html = str_replace("<!--groups-->",$groupbuilder->GetHTML($DEFAULT_BROWSER_LANGUAGE),$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.1.1")
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		if(isset($_GET[GET_EXTERN_USER_HEADER]) && !empty($_GET[GET_EXTERN_USER_HEADER]))
			$html = str_replace("<!--logo-->","<img src=\"".base64UrlDecode($_GET[GET_EXTERN_USER_HEADER])."\" border=\"0\"><br>",$html);
		else if(!empty($CONFIG["gl_cali"]))
			$html = str_replace("<!--logo-->","<img src=\"".$CONFIG["gl_cali"]."\" border=\"0\"><br>",$html);
		if(!empty($CONFIG["gl_cahi"]))
			$html = str_replace("<!--background-->","<img src=\"".$CONFIG["gl_cahi"]."\" border=\"0\"><br>",$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.chat.0.0" && isset($_GET[GET_EXTERN_GROUP]))
	{
        initData(array("GROUPS"));
		$groupid = base64_decode($_GET[GET_EXTERN_GROUP]);
		if(!empty($groupid) && isset($GROUPS[$groupid]))
		{
			$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
			$html = str_replace("<!--SM_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[0])) ? "none" : ""),$html);
			$html = str_replace("<!--SO_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[1])) ? "none" : ""),$html);
			$html = str_replace("<!--PR_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[2])) ? "none" : ""),$html);
			$html = str_replace("<!--RA_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[3])) ? "none" : ""),$html);
			$html = str_replace("<!--FV_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[4])) ? "none" : ""),$html);
			$html = str_replace("<!--FU_HIDDEN-->",((empty($GROUPS[$groupid]->ChatFunctions[5])) ? "none" : ""),$html);
			$html = str_replace("<!--post_chat_js-->",base64_encode($GROUPS[$groupid]->PostJS),$html);
		}
        $html = str_replace("<!--TR_HIDDEN-->",((strlen($CONFIG["gl_otrs"])>1)?"":"none"),$html);
        $html = str_replace("<!--ET_HIDDEN-->",((!empty($CONFIG["gl_retr"]) && !empty($CONFIG["gl_soct"]))? "" :"none"),$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.chat.1.0")
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		if(isset($_POST[POST_EXTERN_USER_USERID]))
		{
			if(STATS_ACTIVE)
				initStatisticProvider();

			$externalUser = new Visitor($_POST[POST_EXTERN_USER_USERID]);
			$externalChat = VisitorChat::FromCache($externalUser->UserId,$_POST[POST_EXTERN_USER_BROWSERID]);
			if(isset($_FILES["userfile"]) && $externalUser->StoreFile($_POST[POST_EXTERN_USER_BROWSERID],$externalChat->DesiredChatPartner,$externalChat->Fullname,$externalChat->ChatId))
				exit("parent.parent.parent.lz_chat_file_ready();");
			else if(isset($_FILES['userfile']))
                exit("parent.parent.parent.lz_chat_file_error(2);");
			else
                exit("");
		}
		else if(isset($_GET["file"]))
			$command = "parent.parent.parent.lz_chat_file_error(2);";
		else
			$command = "";
		$html = str_replace("<!--response-->",$command,$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.3.2.chat.5.0")
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
		$html = str_replace("<!--alert-->",getAlertTemplate(),$html);
        $rate = new RatingGenerator();
        $html = str_replace("<!--rate_1-->",$rate->Fields[0],$html);
        $html = str_replace("<!--rate_2-->",$rate->Fields[1],$html);
        $html = str_replace("<!--rate_3-->",$rate->Fields[2],$html);
        $html = str_replace("<!--rate_4-->",$rate->Fields[3],$html);
        $tlanguages = "";
        if(strlen($CONFIG["gl_otrs"])>1)
        {
            $mylang = getBrowserLocalization();
            $tlanguages = getLanguageSelects(getBrowserLocalization());
        }
        $html = str_replace("<!--languages-->",$tlanguages,$html);
	}
	else if($_GET[GET_EXTERN_TEMPLATE] == "lz_chat_frame.4.1")
	{
		$html = getFile(PATH_FRAMES."lz_chat_frame.4.1.tpl");
		$html = str_replace("<!--param-->",@$CONFIG["gl_cpar"],$html);
	}
	else if(in_array($_GET[GET_EXTERN_TEMPLATE],$static_frames) && strpos($_GET[GET_EXTERN_TEMPLATE],"..") === false)
	{
		$html = getFile(PATH_FRAMES.$_GET[GET_EXTERN_TEMPLATE].".tpl");
	}
}

$html = str_replace("<!--website-->",((empty($CONFIG["gl_root"])) ? "&ws=" . base64UrlEncode($CONFIG["gl_host"]) : ""),$html);
$html = str_replace("<!--server-->",LIVEZILLA_URL,$html);
$html = str_replace("<!--html-->","<html dir=\"".$LANG_DIR."\">", $html);
//$html = str_replace("<!--right-->",(($LANG_DIR=="rtl") ? "left" : "right"), $html);
//$html = str_replace("<!--left-->",(($LANG_DIR=="rtl") ? "right" : "left"), $html);
$html = str_replace("<!--rtl-->",parseBool($LANG_DIR=="rtl"), $html);
$html = str_replace("<!--dir-->",$LANG_DIR, $html);
$html = str_replace("<!--url_get_params-->",getParams(),$html);
unloadDataProvider();
exit(applyReplacements($html));

?>

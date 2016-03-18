var year, month, date, dayNum, day, curYear, curMonth;

//初始化配置
$("body").css({"background-color":config.base_color,"color":config.base_color});
$("#today").css("background-color",config.calendar_bgColor);
$("#date_content").css("background-color",config.calendar_bgColor);
$("#year-month .arrow").css("border-color",config.base_color);
$("#date_content .outerBtn").css("background-color",config.base_color);
$("#date_content .innerBtn").css("background-color",config.calendar_bgColor);
$(".setting_item input").css("background-color",config.base_color);
$("#errorMsg").css("background-color",config.base_color);
$(".title").html(config.title);
//初始化设置页面数据
$("#setYear").val(config.work_year);
$("#setMonth").val(config.work_month);
$("#setDate").val(config.work_date);
$("#setWorkLimit").val(config.work_limit);
$("#setRestLimit").val(config.rest_limit);

//显示当天日历
showNow();

//点击事件委托
//左右箭头改变日历月份并显示
$("#calendar").delegate(".left-a", "click", function(){
	getAlterTime();
	if (curMonth == 1) {
		$(".alter_year").html(Number(curYear)-1);
		$(".alter_month").html("12");
	} else {
		$(".alter_month").html(Number(curMonth)-1);
	}
	showDate();
});
$("#calendar").delegate(".right-a", "click", function(){
	getAlterTime();
	if (curMonth == 12) {
		$(".alter_year").html(Number(curYear)+1);
		$(".alter_month").html("1");
	} else {
		$(".alter_month").html(Number(curMonth)+1);
	}
	showDate();
});

//返回当天
$("#calendar").delegate("#today", "click", function(){
	//日期验证
	if (validate()) {
		showNow();
	}
});

//日历页面和设置页面切换
$("#calendar").delegate("#showSetting", "click", function(){
	showSetting();
});
$("#calendar").delegate("#showDate", "click", function(){
	//日期验证
	if (validate()) {
		$(".alter_year").html($("#setYear").val());
		$(".alter_month").html($("#setMonth").val());
		showDate();
	}
});


function showDate() {
//显示日期

	//填入日期
	getAlterTime();
	getNowTime();
	getWeek(curYear, curMonth-1, 1);
	var monthL = [31,getFebruary(curYear),31,30,31,30,31,31,30,31,30,31];
	var dateLi = "";
	for (i=0; i<dayNum; i++) {
		dateLi += "<li class='disabled'><i class='after'></i></li>";
	}
	for (i=0; i<monthL[curMonth-1]; i++) {
		if (curYear == year && curMonth == month && i+1 == date) {
			dateLi = dateLi + "<li class='nowDate'>" + (i+1) + "<i class='after'></i></li>";
		} else {
			dateLi = dateLi + "<li>" + (i+1) + "<i class='after'></i></li>";
		}
	}
	$("#dates").html(dateLi);
	$("#dates .nowDate .after").css("background-color",config.base_color);

	//添加工作日和休息日类名并设置
	$("#dates li").not(".disabled").each(function(){
		$(this).addClass(setWorkDay(curYear, curMonth, $(this).text()));
	});
	$(".workDay").css("color",config.work_color);
	$(".restDay").css("color",config.rest_color);

	//点击日期改变样式和日历头的显示
	$("#dates li").not(".nowDate").click(function(){
		var selectDate = $(this).text();
		$(this).not(".disabled").addClass("selected").siblings().removeClass("selected");
		$("#dates .selected.workDay .after").css("background-color",config.work_color);
		$("#dates .selected.restDay .after").css("background-color",config.rest_color);
		if (selectDate) {
			getAlterTime();
			getWeek(curYear, curMonth-1, selectDate);
			$(".now_year").html(curYear);
			$(".now_month").html(curMonth);
			$(".now_date").html(selectDate);
			$(".now_day").html(day);
		}
	});

	//设置页面切换至日历页面时渐变
	$(".show_setting").fadeOut("fast",function(){
		$(".show_date").fadeIn("fast");
	});
}

function showNow() {
//显示当天日历
	getNowTime();
	getWeek(year, month-1, date);
	$(".now_year").html(year);
	$(".now_month").html(month);
	$(".now_date").html(date);
	$(".now_day").html(day);
	$(".alter_year").html(year);
	$(".alter_month").html(month);
	showDate();
}

function getNowTime() {
//获取当前日期
	year = new Date().getFullYear();
	month = new Date().getMonth() + 1;
	date = new Date().getDate();
}

function getAlterTime() {
//获取箭头改变后的日期
	curYear = $(".alter_year").html();
	curMonth = $(".alter_month").html();
}

function getWeek(year, month, date) {
//获取指定日期的星期
	dayNum = new Date(year, month, date).getDay();
	switch (dayNum) {
		case 0:
			day = "日";break;
		case 1:
			day = "一";break;
		case 2:
			day = "二";break;
		case 3:
			day = "三";break;
		case 4:
			day = "四";break;
		case 5:
			day = "五";break;
		case 6:
			day = "六";break;
	}
}

function getFebruary(year) {
//返回二月天数
	return (year%100==0) ? (year%400==0?29:28) : (year%4==0?29:28);
}

function setWorkDay(compareY, compareM, compareD) {
//判断工作日和休息日，返回对应类名

	//获取给定日期与设置工作日期的时间差进行判断
	var referenceTime = new Date($("#setYear").val(), $("#setMonth").val()-1, $("#setDate").val()).getTime();
	var compareTime = new Date(compareY, compareM-1, compareD).getTime();
	var	compareNum = Math.abs(compareTime-referenceTime) / 86400000 % (parseInt($("#setWorkLimit").val())+parseInt($("#setRestLimit").val()));
	var condition = "compareNum == 0";
	for (i=1; i<$("#setWorkLimit").val(); i++) {
		if (compareTime >= referenceTime) {
			condition = condition + " || compareNum == " + i;
		} else {
			condition = condition + " || compareNum == " + (i+parseInt($("#setRestLimit").val()));
		}
	}
	return eval(condition) ? "workDay" : "restDay";
}

function showSetting() {
//显示设置页面

	//页面样式
	var showHeight = $(".show_date").height() - $("#showSetting").outerHeight(true);
	$(".setting_1").css("margin-top",showHeight/2-45);
	$(".setting_2").css("margin-bottom",showHeight/2-25);

	//错误消息渐隐
	$("input").focus(function(){
		$("#errorMsg").fadeOut(1000);
	});

	//日历页面切换至设置页面时渐变
	$(".show_date").fadeOut("fast",function(){
		$(".show_setting").fadeIn("fast");
	});
}

function showMsg(msg) {
//错误消息渐显
	$("#errorMsg").text(msg).fadeIn(1000);
}

function validate() {
//表单验证
	var vSetedDate = [31,getFebruary($("#setYear").val()),31,30,31,30,31,31,30,31,30,31][$("#setMonth").val()-1];

	//创建并实例化对象用于验证
	function VInput(vId, vName, vCondition) {
		this.val = document.getElementById(vId).value;
		this.name = vName;
		this.condition = vCondition;
	}
	VInput.prototype.v = function() {
		if (!eval(this.condition)) {
			return false;
		}
		return true;
	};
	var vYear = new VInput("setYear", "年份", "this.val>=1000 && this.val<=9999 && this.val==parseInt(this.val)"),
		vMonth = new VInput("setMonth", "月份", "this.val>=1 && this.val<=12 && this.val==parseInt(this.val)"),
		vDate = new VInput("setDate", "日期", "this.val>=1 && this.val<=vSetedDate && this.val==parseInt(this.val)"),
		vWorkLimit = new VInput("setWorkLimit", "工作时长", "this.val>=1 && this.val==parseInt(this.val)"),
		vRestLimit = new VInput("setRestLimit", "休息时长", "this.val>=1 && this.val==parseInt(this.val)"),
		inputs = [vYear,vMonth,vDate,vWorkLimit,vRestLimit],
		inputsL = inputs.length;

	//循环验证
	for (var i=0; i<inputsL; i++) {
		var curInput = inputs[i];
		if (curInput.val == "") {
			showMsg(curInput.name + "不能为空！");
			return false;
		} else if (!curInput.v()) {
			showMsg("请输入正确的" + curInput.name + "!");
			return false;
		} else if (i === inputsL-1) {
			return true;
		}
	}
}

$(function(){ //when the document is ready... 

	var dfd = $.Deferred();
	var json = new Array();
//Get dataset
var ds = new Miso.Dataset({
	importer : Miso.Dataset.Importers.GoogleSpreadsheet,
	parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
	key : "0Ag-BlnbZq4DXdFZ0c1huYlJ1U1NQSzR2U1NMR1RkdGc",
	worksheet : "1"
});

getDataset = function(){
	
	ds.fetch({ 
	success : function() {
    // console.log(ds.columnNames());
    // console.log("Date data: " + ds.column("Date").data )
    json.date=(ds.column("Date").data);
    console.log(ds.column("Time").data[6])
  	
    $.each(json.date,function(i,val){
    	    	    		
    	json.date[i] =  new Date(val);

    	if (ds.column("Time").data[i]!=null){
    		var ti = parseTime(ds.column("Time").data[i])
    		json.date[i].setHours(ti[0]);
    		json.date[i].setMinutes(ti[1]);
    	}
    })
    // console.log(json.date)
    

    // console.log(json.date);
    json.title=ds.column("Title").data;
    json.content=ds.column("Text").data;
    // console.log(json.date.data);
    // console.log(json.title.data);
    // console.log(json);
    
    dfd.resolve();
    
	},
	error : function() {
		console.log("Are you sure you are connected to the internet?");
	}
	});


}

function parseTime(t){
	//returns Date() object with time t
	//takes time hh:mm:s
	return t.split(":");
}
	//Read JSON file and store in variable "json";

	// var json = (function () {
	// 	var json = null;
	// 	$.ajax({
	// 		// 'async': false,
	// 		'global': false,
	// 		// 'url': "timelinedata.json",
	// 		'url':"https://spreadsheets.google.com/feeds/list/0Ag-BlnbZq4DXdGN3aE5SZmFXY1ZadVhmbV8wTEFVUXc/od6/public/full?alt=json-in-script",
	// 		// 'url':"http://spreadsheets.google.com/feeds/cells/0AonYZs4MzlZbcGhOdG0zTG1EWkVNZ3BKMVNaZXkwUmc/0/public/basic?alt=json-in-script",
	// 		'dataType': "json",
	// 		'success': function (data) {
	// 			json = data;
				
	// 		}
	// 	});
	// 	return json;
	// })();
	

	//find the relative position of a date 
	var coord = (function(firstDate, lastDate, point){
		range = lastDate-firstDate;
		return ((point-firstDate)/range);
	});
	


	//Global Vars
	var dates = new Array();
	var dateCoords=new Array();

	var month=new Array();
	month[0]="Jan.";
	month[1]="Feb.";
	month[2]="Mar.";
	month[3]="Apr.";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="Aug.";
	month[8]="Sept.";
	month[9]="Oct.";
	month[10]="Nov.";
	month[11]="Dec.";

	function collision($div1, $div2) {
		//http://stackoverflow.com/a/5541252
		var x1 = $div1.offset().left;
		var y1 = $div1.offset().top;
		var h1 = $div1.outerHeight(true);
		var w1 = $div1.outerWidth(true);
		var b1 = y1 + h1;
		var r1 = x1 + w1;
		var x2 = $div2.offset().left;
		var y2 = $div2.offset().top;
		var h2 = $div2.outerHeight(true);
		var w2 = $div2.outerWidth(true);
		var b2 = y2 + h2;
		var r2 = x2 + w2;

		if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
		return true;
	}

	// function sortInput(){
	// 	//Sort input in ascending date order
	// 	json = json.sort(function(a, b) {
	// 		// x = new Date();		
	// 		// x = a.date;	
	// 		// y = new Date();
	// 		// y = b.date;
	// 		return a.date>b.date ? 1 : a.date<b.date ? -1 : 0;
	// 		console.log((a.date>b.date));
	// 	});
		 
	// }
	function getTime(d){
		// console.log((d.getHours()==0&&d.getMinutes()==0&&d.getSeconds()==0))
		// var out;
		// if (d.getHours()==0&&d.getMinutes()==0&&d.getSeconds()==0){
		// 	out = "";
		// }
		// else {
		// 	out = d.getHours()+" "+d.getMinutes();
		// }
		var out = (d.getHours()==0&&d.getMinutes()==0&&d.getSeconds()==0)?"":(d.getHours()+":"+(d.getMinutes()<10?'0':'') + d.getMinutes());
		// console.log(out)
		return out;
	}
	function populateDivs(){
	//Go through file, populate divs. 	
	// console.log(json)
	// console.log(json.date);
	$.each(json,function(i,val){

	});

	$.each(json.date, function(i,val){

		var d = new Date();
		d=val;
		// console.log(d);
		dates[i]=d;
		
		//order by date

		//create new timeline item
		$("#content").append(
			$("<div>").attr({"class":"timeline-item","id":"timeline-item-"+i})
			//create new date div, populate	
			.append($("<a>").attr({"class":"timeline-item-date","id":"timeline-item-date-"+i, "name":"#timeline-item-"+i}).text(month[d.getMonth()]+ " " + d.getDate() + ", " + d.getFullYear() + " " + getTime(d)))
			//create new time div, populate
			// .append($("<div>").attr({"class":"timeline-item-time","id":"timeline-item-time-"+i}).text(val.time))			
			//add title
			.append($("<div>").attr({"class":"timeline-item-story-container","id":"timeline-item-story-container-"+i})
				.append($("<div>").attr({"class":"timeline-item-title","id":"timeline-item-title-"+i}).text(json.title[i]))
			//create new story div, populate
				.append($("<div>").attr({"class":"timeline-item-story","id":"timeline-item-story-"+i}).text(json.content[i]))
			)
			);		
	});
}; //End load JSON into divs
function getCoords(){	
	//Find the coordinates for each date;
	// console.log(dates)
	$.each(dates,function(i,val){
		dateCoords[i]=coord(Math.min.apply(Math,dates), Math.max.apply(Math,dates), val);	
	});
};
function drawTimeline(){
	//Draw the timeline & labels
	$.each(dateCoords, function(i,val){
		$("#timeline-events").append(
			$("<li>").attr({
				"class":"timeline-event-dot",
				"id":"timeline-event-dot-" + i,											
			})			
			.css({"position":"absolute", "left":(val*100)+"%"})
			// .css({"position":"absolute", "left":(val*$("#line").width()+"px")})			
			.click(function(){//scroll to appropriate part of the page when click
				$('html, body').animate({
					scrollTop: (Math.floor($("#timeline-item-"+i).offset().top))
				}, 1000);
				$("#timeline-item-label-"+i).addClass("timeline-event-dot-selected");
			})
			.mouseover(function(){
				$(this).addClass("timeline-event-dot-active");		
				//Hide all other labels;
				$(".timeline-label").each(function(i){					
					if (!($(this).attr('id')=="first-timeline-label" || $(this).attr('id')=="last-timeline-label"|| $(this).attr('id')=="timeline-labels")){
						$(this).css("visibility","hidden");
					}
				});	
				
				//Show the mouseover label	
				
				$("#timeline-label-"+i).css("visibility","visible");
			})
			.mouseleave(function(){
				//deactivate and hide label
				$(this).removeClass("timeline-event-dot-active");
				if (!$("#timeline-event-dot-"+i).hasClass("timeline-event-dot-selected")){
					$("#timeline-label-"+i).css("visibility","hidden");
				}

				//show selected label
				$(".timeline-event-dot").each(function(i){
					if ($("#timeline-event-dot-"+i).hasClass("timeline-event-dot-selected")){
						$("#timeline-label-"+i).css("visibility","visible");
					}
				})				
			})
			);
		//draw all timeline labels, set as hidden. 
		$("#timeline-labels").append(
			$("<li>").attr({
				"class":"timeline-label",
				"id":"timeline-label-" +i
			})
				.text(month[dates[i].getMonth()]+ " " + dates[i].getDate() + ", " + dates[i].getFullYear() + " " + getTime(dates[i]))//Display the date on mouseover								
				.css({"visibility":"hidden","position":"absolute", "left":dateCoords[i]*100 + "%"})
				)
	// console.log($("#timeline-event-dot-"+i).offsetParent().width())
	});
};//End Draw timeline;



function currentView(){
	//Sets the currently viewed item as active
	var scrollVals = new Array();
	$(".timeline-item").each(function(i){
		scrollVals[i] = Math.floor($("#timeline-item-"+i).offset().top);
	});
	// console.log(scrollVals);
	//if scroll is below a certain item, make that one active
	var barPos = Math.floor($(document).scrollTop());	
	$.each(scrollVals,function(i,val){
		if ((i+1)<(scrollVals.length)){
			if ((barPos>=(scrollVals[i]-5))&&(barPos<(scrollVals[i+1]-5))){ //5 is a safety value for when it scrolls
				// console.log("HERE")
				$("#timeline-event-dot-"+i).addClass("timeline-event-dot-selected");
				$("#timeline-event-dot-"+i).css("z-index","10");
				$("#timeline-label-"+i).css("visibility","visible");
			}
			else
			{
				$("#timeline-event-dot-"+i).removeClass("timeline-event-dot-selected");
				$("#timeline-event-dot-"+i).css("z-index","1");
				$("#timeline-label-"+i).css("visibility","hidden");
			}
		}
		//last one
		else{
			if (barPos>=(scrollVals[i]-5)){
				$("#timeline-event-dot-"+i).addClass("timeline-event-dot-selected");
				$("#timeline-event-dot-"+i).css("z-index","10");
				$("#timeline-label-"+i).css("visibility","visible");	
			}
			else
			{
				$("#timeline-event-dot-"+i).removeClass("timeline-event-dot-selected");	
				$("#timeline-event-dot-"+i).css("z-index","1");
				$("#timeline-label-"+i).css("visibility","hidden");
			}
		} 
	});

	//show label.  


}// end currentView();

function resizeTimeline(){
	$("#timeline-events").css("width",($("#line").width()*0.8))

	;
	
}

function drawFirstLastLabels(){
	//get the first label
	var first = 0;
	//get the last label
	var last = (json.date.length)-1;

	// $(".timeline-event-dot").each(function(i){
	// 	// console.log($(this).position().left);
	// 	// console.log($("#line").width())
	// 	if($(this).position().left==0){//first
	// 		first = i;

	// 	}
	// 	else if($(this).position().left>=$("#line").width()){//last
	// 		last = i;
	// 		console.log("last " + last);
	// 	}
	// });
	// var output =$("#timeline-event-dot-"+last).position().left/$("#timeline-event-dot-"+last).offsetParent().width();
	// console.log(output);
	//Draw first 
	$("#first-timeline-label").text(month[dates[first].getMonth()]+ " " + dates[first].getDate() + ", " + dates[first].getFullYear())//Display the date on mouseover
	.css({"position":"absolute", "left":100*dateCoords[first] + "%"});
	$("#last-timeline-label").text(month[dates[last].getMonth()]+ " " + dates[last].getDate() + ", " + dates[last].getFullYear())//Display the date on mouseover
	.css({"position":"absolute", "left":100*dateCoords[last] + "%"})

}


getDataset(); //assume sorted
dfd.done(function(){$(window).scroll(function(){currentView();})},
	function(){$(window).resize(function(){resizeTimeline();})},
	populateDivs,
	getCoords,
	drawTimeline,
	drawFirstLastLabels);


// sortInput(); //sort the input by date order
	// populateDivs(); //write that to the page
// getCoords(); //prepare the timeline
// drawTimeline(); //draw it
// drawFirstLastLabels(); //draw the labels
//when stuff happens on the page, change stuff. 
// $(window).resize(function(){resizeTimeline();});
// $(window).scroll(function(){currentView();});
});
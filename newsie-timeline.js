// newsie-timeline.js Version 0.1
// by Farid Rener: proteusvacuum at gmail
// A simple timeline plotter which takes data from a date-ordered google spreadsheet.
// Spreadsheet should have the following column names:
// Date| Time | Title | Text | MediaURL | MediaCredit

	//Variables
	var dfd = $.Deferred(); //JQuery Callback when Dataset is ready
	var json = new Array(); //The data will go in here. 	
	var dates = new Array(); //The dates
	var dateCoords=new Array(); //Where the dates are plot on the timeline
	var scrollVals = new Array(); //The position of each story div within the document
	var curPos = -1;	//The current scrollbar position

	var month=new Array(); //The names of the months. 
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

	//------------------
	//Helper functions:
	//-------------------
	function parseTime(t){ 
		//returns an array of hours, minutes and seconds, parsed from Google Spreadsheet Time format
		//t input is in format "hh:mm:ss"
		return t.split(":");
	}//end parseTime


	var coord = (function(firstDate, lastDate, point){ 
		//returns the relative position, from 0 to 1 of where the timeline dot should be plot
		range = lastDate-firstDate;
		return ((point-firstDate)/range);
	});

	function getCoords(){	
		//Populate dateCoords[]; 
		$.each(dates,function(i,val){
			dateCoords[i]=coord(Math.min.apply(Math,dates), Math.max.apply(Math,dates), val);	
		});
	};

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

	function getTime(d){
		//Tests if there is a time present for the data, returns the time if so. 
		var out = (d.getHours()==0&&d.getMinutes()==0&&d.getSeconds()==0)?"":(d.getHours()+":"+(d.getMinutes()<10?'0':'') + d.getMinutes());
		return out;
	}

	function calculateScrollVals(){
		$(".newsie-timeline-item").each(function(i){
			if ($("#newsie-line").hasClass("stickit")){
				//The timeline is not included...
				scrollVals[i] = Math.floor($("#newsie-timeline-item-"+i).offset().top-80);
			}
			else{
				scrollVals[i] = Math.floor($("#newsie-timeline-item-"+i).offset().top-162);	
			}
		});
	}

	function populateDivs(){
		//Draws the stories on the screen
		$.each(json.date, function(i,val){
			//for each item, create a new div with class=newsie-timeline-item, id=newsie-timeline-item-# 
			//inlude images if it exists. 
			var d = new Date();
			d=val;
			dates[i]=d;
			//create new wrapper 
			$("#newsie-content").append(
			$("<div>").attr({"class":"newsie-timeline-item","id":"newsie-timeline-item-"+i})
			//add the date and time
			.append($("<a>").attr({"class":"newsie-timeline-item-date","id":"newsie-timeline-item-date-"+i, "name":"#newsie-timeline-item-"+i}).html("<h3>"+month[d.getMonth()]+ " " + d.getDate() + ", " + d.getFullYear() + " " + getTime(d)+"</h3>"))
			//add title
			.append($("<div>").attr({"class":"newsie-timeline-item-story-container","id":"newsie-timeline-item-story-container-"+i})
			//add the text
			.append($("<div>").attr({"class":"newsie-timeline-item-story","id":"newsie-timeline-item-story-"+i}).html("<h3>"+((json.title[i]==null)?"":json.title[i])+"</h3>"+"<p>"+((json.content[i]==null)?"":json.content[i])+"</p>"))
				)
			)	
			//Add media if it exists			
			if (json.mediaURL[i]!=null){
				// console.log(json.mediaURL[i])	
				$("#newsie-timeline-item-story-container-"+i).prepend($("<div>").attr({"class":"newsie-timeline-item-image","id":"newsie-timeline-item-image-"+i}).html("<img src="+json.mediaURL[i]+">"))
			}
			if (json.mediaCredit[i]!=null){
				$("#newsie-timeline-item-image-"+i).append($("<p class='newsie-media-credit'>").html(json.mediaCredit[i]))
			}							
		});//end .each(json.date)
	};// end populateDivs()

	function drawTimeline(){
		//Draw the timeline on the bottom of the screen & labels
		$.each(dateCoords, function(i,val){
			//For every point
			$("#timeline-events").append(
				//add a new dot
				$("<li>").attr({
					"class":"newsie-timeline-event-dot",
					"id":"newsie-timeline-event-dot-" + i,											
				})			
				.css({"position":"absolute", "left":(val*100)+"%"})// in its proper position	
				.click(function(){
					//Attach click functionality to scroll -- scroll to the proper place.
					calculateScrollVals(); 
					$('html, body').animate({scrollTop: scrollVals[i]}, 500);
					$("#newsie-timeline-item-label-"+i).addClass("newsie-timeline-event-dot-selected");
				})
				.mouseover(function(){
					//on mousover, change class and show the label of the one we are moused over. 
					$(this).addClass("newsie-timeline-event-dot-active");		
					//Hide all other labels, except the first and last
					$(".newsie-timeline-label").each(function(i){					
						if (!($(this).attr('id')=="first-newsie-timeline-label" || $(this).attr('id')=="last-newsie-timeline-label"|| $(this).attr('id')=="newsie-timeline-labels")){
							$(this).css("visibility","hidden");
						}
					});					
					//Show the mouseover label					
					$("#newsie-timeline-label-"+i).css("visibility","visible");
				})
				.mouseleave(function(){
					//deactivate and hide label
					$(this).removeClass("newsie-timeline-event-dot-active");
					if (!$("#newsie-timeline-event-dot-"+i).hasClass("newsie-timeline-event-dot-selected")){
						$("#newsie-timeline-label-"+i).css("visibility","hidden");
					}
					//show first and last labels
					$("#first-newsie-timeline-label").css("visibility","visible");
					$("#last-newsie-timeline-label").css("visibility","visible");
					//show selected label
					$(".newsie-timeline-event-dot").each(function(i){
						if ($("#newsie-timeline-event-dot-"+i).hasClass("newsie-timeline-event-dot-selected")){
							$("#newsie-timeline-label-"+i).css("visibility","visible");
						}
					})				
				})
				);

			//Previous and next functionality
			$("#newsie-back-button").unbind('click').click(function(){			
				if (curPos>0){				
					$('html,body').animate({
						scrollTop: scrollVals[curPos-1]
					}, 250)
				}
			});
			$("#newsie-forward-button").unbind('click').click(function(){			
				if (curPos<$(".newsie-timeline-event-dot").length-1){					
					$('html,body').animate({
						scrollTop: scrollVals[curPos+1]
					}, 250)
				}
			});

			//draw all timeline labels, set as hidden. 
			$("#newsie-timeline-labels").append(
				$("<li>").attr({
					"class":"newsie-timeline-label",
					"id":"newsie-timeline-label-" +i
				})
				.text(month[dates[i].getMonth()]+ " " + dates[i].getDate() + ", " + dates[i].getFullYear() + " " + getTime(dates[i]))//Display the date on mouseover								
				.css({"visibility":"hidden","position":"absolute", "left":dateCoords[i]*100 + "%"})
			)
		});//end .each(dateCoords)
	};//End Draw timeline;


	function currentView(){
		//Sets the currently viewed item as active
		//if scroll is below a certain item, make that one active
		calculateScrollVals();
		var barPos = Math.floor($(document).scrollTop());	
		var shift = 5;
		$.each(scrollVals,function(i,val){
			if ((i+1)<(scrollVals.length)){				
				if ((barPos>=(scrollVals[i]-shift))&&(barPos<(scrollVals[i+1]-shift))){ //shift is a safety value for when it scrolls
					// console.log("HERE")
					curPos=i;			
					$("#newsie-timeline-event-dot-"+i).addClass("newsie-timeline-event-dot-selected");
					$("#newsie-timeline-event-dot-"+i).css("z-index","10");
					$("#newsie-timeline-label-"+i).css("visibility","visible");				
				}
				else
				{
					$("#newsie-timeline-event-dot-"+i).removeClass("newsie-timeline-event-dot-selected");
					$("#newsie-timeline-event-dot-"+i).css("z-index","1");
					$("#newsie-timeline-label-"+i).css("visibility","hidden");		
				}
			}
			//last one
			else{
				if (barPos>=(scrollVals[i]-shift)){
					curPos=i;
					$("#newsie-timeline-event-dot-"+i).addClass("newsie-timeline-event-dot-selected");
					$("#newsie-timeline-event-dot-"+i).css("z-index","10");
					$("#newsie-timeline-label-"+i).css("visibility","visible");	
				}
				else
				{
					$("#newsie-timeline-event-dot-"+i).removeClass("newsie-timeline-event-dot-selected");	
					$("#newsie-timeline-event-dot-"+i).css("z-index","1");
					$("#newsie-timeline-label-"+i).css("visibility","hidden");
				}
			}
		});
	}// end currentView();

	function resizeTimeline(){
		//resizes the timline when the window resizes
		$("#timeline-events").css("width",($("#newsie-line").width()*0.8));	
	}

	function drawFirstLastLabels(){
	//paints the label for the first and last dot	
		var first = 0;		
		var last = (json.date.length)-1;
		$("#first-newsie-timeline-label").text(month[dates[first].getMonth()]+ " " + dates[first].getDate() + ", " + dates[first].getFullYear())//Display the date on mouseover
		.css({"position":"absolute", "left":100*dateCoords[first] + "%"});
		$("#last-newsie-timeline-label").text(month[dates[last].getMonth()]+ " " + dates[last].getDate() + ", " + dates[last].getFullYear())//Display the date on mouseover
		.css({"position":"absolute", "left":100*dateCoords[last] + "%"})
	}

	function createDOMFramework(){
		$("#newsie-timeline-container")
		.append($("<div>").attr({"id":"newsie-content"})
			.append($("<div>").attr({"id":"newsie-line", "class":"stickem"})
				.append($("<div>").attr({"id":"line-container"})
					.append($("<div>").attr({"id":"newsie-line-bg"}))//line-bg
					.append($("<ul>").attr({"class":"newsie-timeline-label", "id":"newsie-timeline-labels"})
						.append($("<li>").attr({"class":"newsie-timeline-label", "id":"first-newsie-timeline-label"}))
						.append($("<li>").attr({"class":"newsie-timeline-label", "id":"last-newsie-timeline-label"}))
					)//ul newsie-timeline-labels
					.append($("<ul>").attr({"class":"timeline","id":"timeline-events"}))
					.append($("<div>").attr({"id":"newsie-button-container"})
						.append($("<div>").attr({"class":"button", "id":"newsie-back-button"}).html("<h4>Previous</h4>"))
						.append($("<div>").attr({"class":"button", "id":"newsie-forward-button"}).html("<h4>Next</h4>"))
					)//#button container
				)//#line-container
			)//#line
		)//#content
	}


$(function(){ //JQuery - when window is ready. 
//Go for it!
//Load the dataset. The key comes from gsKey property of newsie-timeline-container div
	var ds = new Miso.Dataset({ //Use MISO library to get 
		importer : Miso.Dataset.Importers.GoogleSpreadsheet,
		parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
		key : $("#newsie-timeline-container").attr("gsKey"),
		worksheet : "1"
	});


	getDataset = function(){
		ds.fetch({ 
			success : function() {
				json.date=(ds.column("Date").data);			
				$.each(json.date,function(i,val){
					json.date[i] =  new Date(val);
					if (ds.column("Time").data[i]!=null){
						var ti = parseTime(ds.column("Time").data[i])
						json.date[i].setHours(ti[0]);
						json.date[i].setMinutes(ti[1]);
					}
				})
				json.title=ds.column("Title").data;
				json.content=ds.column("Text").data;
				json.mediaURL=ds.column("MediaURL").data;
				json.mediaCredit=ds.column("MediaCredit").data;

				//Once data is received, call the other functions.
				dfd.resolve();
			},
			error : function() {
				console.log("Are you sure you are connected to the internet?");
			}
		});
	}

	getDataset(); //assume the data is already sorted. 
	dfd.done(createDOMFramework,
		populateDivs,
		getCoords,
		drawTimeline,
		drawFirstLastLabels,
		function(){
			$("#newsie-timeline-container").addClass("newsie-container")
			$("#newsie-content").addClass("stickem-container");
			$('#newsie-timeline-container').imagesLoaded( function() {
  			// images have loaded
  				$('.newsie-container').stickem();
  				currentView();
  				$(window).scroll(function(){currentView()});
			});	

			}
		);

	// console.log($("#newsie-timeline-container").attr("gsKey"))
});
//dojo.require("kisters/builds/kiWidgets");
//dojo.require("kisters/widgets/tsWidget");

//Global Variables.  These are needed in the events so the have to be global
var yValueField = "";
var dimension = "";

var chartingMode = "";
var selectedGraphIndex = -1;
var chartPointSelectedEvent;
var kistersWidget;
var oneItem = false;

function D3Charting() {

	//Properties
	var margin = {top: 10, right: 1, bottom: 30, left: 50};
		
	kistersInitWidget();
		
	//Methods  
	this.remove = chartingRemoveChart;
	this.setYFieldName = d3SetyFieldName;
	this.getYFieldName = d3GetyFieldName;
	this.setDimensionFieldName = d3SetDimensionFieldName;
	this.getDimensionFieldName = d3GetDimensionFieldName;
	this.setChartingMode = d3SetChartingMode;
	this.getChartingMode = d3GetChartingMode;
	this.addPointKisters = kistersAddPoint;
	this.addKistersChart = kistersAddChart;
	this.updateKistersGraphSize = kistersUpdateGraphSize;
	this.updateKistersTimeGraphic = kistersUpdateTimeGraphic;
}


/****** Get/Set Properties *******************************/
function d3GetyFieldName()
{
	return yValueField;
}
function d3SetyFieldName(value)
{
	yValueField = value;
}
function d3GetDimensionFieldName()
{
	return dimension;
}
function d3SetDimensionFieldName(value)
{
	dimension = value;
}
/**
 *Sets the Charting Mode.  Three Types
 *  PointMode:  Point mode is when a user clicks one point on the map.  Graphs that point over time.
 *  TransectLineMode: Graphs a transect at a particular time
 *  TransectPointMode: Graphs a point within the transect over time.
 */
function d3SetChartingMode(mode)
{
	chartingMode = mode;
}
/**
 *Gets the Charting Mode.  Three Types
 *  PointMode:  Point mode is when a user clicks one point on the map.  Graphs that point over time.
 *  TransectLineMode: Graphs a transect at a particular time
 *  TransectPointMode: Graphs a point within the transect over time.
 */
function d3GetChartingMode()
{
	return chartingMode;
}


function chartingRemoveChart()
{
	kistersDeleteGraph();
}

/**
 * Initialize Kisters Widget.  Currently Broken.
 */
function kistersInitWidget(){
	
	chartingMode = "kisters";

		require(["kisters/builds/kiWidgets"],function(){
	
			require(["kisters/widgets/tsWidget"],function(tsWidget){
			try
			{
				var tsWidgetConf = {
	
						floating:true,
                        tslist:[],
                        currentFrom:"1990-01-01T00:00:00Z", 
                        currentTo:new Date().toISOString(),
                        totalFrom:"1990-01-01T00:00:00Z", 
                        totalTo:new Date().toISOString(),
                        width:"500",
                        height:"450",
                        baseUrl:"http://gisweb.kisters.de:8080/dscwidget-servlet/DSCWidgetServlet",
                        customlogo:"",
                        features:["csv","overlaid"]		 
				};
						
				var tsW = new tsWidget(tsWidgetConf,"tsWidget");		
				//var tsW = new tsWidget(tsWidgetConf);	
				
				kistersWidget = tsW;
				
				console.log(map);
			}
			catch(err)
			{
				console.log(err);
			}
				 
			});		
		
		});		

}

function kistersAddChart()
{
		var	timeSliderWidth = window.innerWidth;
		//var timeSliderWidth = 1000;
		//var width = timeSliderWidth - 130;
		//Time Slider bar is 80% the panel, the margin on the left side of graph is 60, and 15 on the right
		var width = timeSliderWidth - 15; //(timeSliderWidth * .8) + 57;
		//var marginWidth = (timeSliderWidth * .1) - 57;
		
		//dojo.byId('panel').style.margin = '0px 0px 25px 0px';
		//dojo.byId('panel').style.padding = '0px 0px 25px 0px';
		//dojo.byId('panel').style.margin = '0px 0px 0px ' + '0px';
		
		dojo.byId('panel').style.width = width+'px';
		//dojo.byId('panel').style.align = 'center';
		
	kistersWidget.placeAt(dojo.byId('panel'));
}
/**
 *Add new point to the kisters widget. 
 * @param {Object} geometry
 */
function kistersAddPoint(feature)
{
	if(kistersWidget != null)
	{
		var tslist = [{srcid:feature["attributes"]["Source"],tsid:feature["attributes"]["tsid"], variable: feature["attributes"]["variable"], servicetype: feature["attributes"]["servicetype"], location: feature["attributes"]["location"],name: feature["attributes"]["SiteName"] }];
				
        kistersWidget.addTsByService(tslist);
	}
}

/**
 *We want to update the Graph size when the web application is resized. 
 */
function kistersUpdateGraphSize()
{
	if(kistersWidget != null)
	{
		/*
		var element = dojo.byId(kistersWidget.id);
		element.remove();
		
		var	timeSliderWidth = document.getElementById('eventSliderPanel').offsetWidth;
		var width = timeSliderWidth - 75; 
		//var	timeSliderWidth = 1200;
		//var width = timeSliderWidth - 130;
		//Time Slider bar is 80% the panel, the margin on the left side of graph is 60, and 15 on the right
		//var width = 1200; //(timeSliderWidth * .8) + 57;
		//var marginWidth = (timeSliderWidth * .1) - 57;
		
		//dojo.byId('panel').style.margin = '0px 0px 0 50px';
		//dojo.byId('panel').style.margin = '0px 0px 0px ' + marginWidth+'px';
		
		dojo.byId('panel').style.width = width+'px';
		
		var dim = new Array();
		dim.w = width;
		dim.h = 145;
		kistersWidget.resize(dim);
		//dojo.byId('panel').style.align = 'center';
		
		kistersWidget.placeAt(dojo.byId('panel')); */
	}
}

/**
 *Removes the Kisters Graph from the application 
 */
function kistersDeleteGraph()
{
	if(kistersWidget != null)
	{
		var	timeSliderWidth = 1000; //document.getElementById('timeSliderDiv').offsetWidth;
		var width = timeSliderWidth;
		dojo.byId('panel').style.margin = '0px 0px 0 0px';
		dojo.byId('panel').style.width = width+'px';
		
		var element = dojo.byId(kistersWidget.id);
		element.remove();
	}
}
/**
 *Updates the Kisters graph to show a marker where the time\extent of the map is at. 
 * @param {Object} timeExtent
 */
function kistersUpdateTimeGraphic(timeExtent)
{
	if(kistersWidget != null)
		kistersWidget.setMarker(timeExtent.startTime,timeExtent.endTime);
}

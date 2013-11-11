/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//  https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

$(function(){
        getQuakes();
});

function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes){
	    //quakes is an array of objects, each of which represents info about a quake
	    //see data returned from:
	    //https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi

	    //set our global variable to the current set of quakes
	    //so we can reference it later in another event
	    gov.usgs.quakes = quakes;
	    $('.message').html('Displaying' + quakes.length + 'earthquakes');
	    addQuakeMarkers(gov.usgs.quakes, map);


	}); //handle returned data function
		map = new google.maps.Map($('.map-container')[0], {
	    center: new google.maps.LatLng(0, 0),
	    zoom: 2,
	    mapTypeId: google.maps.MapTypeId.TERRAIN,
	    streetViewControl: false
	});
	
} //getQuakes()

function addQuakeMarkers(quakes, map) {
    //loop over the quakes array and add a marker for each quake
    var quake;      //current quake data
    var idx;        //loop counter
    var infoWindow; //Info Window for quake 

    for (idx = 0; idx < quakes.length; ++idx) {
        quake = quakes[idx];

        if(quake.location){
		    quake.mapMarker = new google.maps.Marker({
			    map: map,
			    position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
			});
		}
    	//code that runs when user clicks on a marker
		infoWindow = new google.maps.InfoWindow({
			content: new Date(quake.datetime).toLocaleString() + 
			': magnitude ' + quake.magnitude + ' at depth of ' + 
			quake.depth + ' meters'
		});

		registerInfoWindow(map, quake.mapMarker, infoWindow);
		//open the info window
    }
} //addQuakeMarkers()

function registerInfoWindow(map, marker, infoWindow) {
    google.maps.event.addListener(marker, 'click', function(){
		if(gov.usgs.iw){
			gov.usgs.iw.close();
		}
    	gov.usgs.iw = infoWindow;
        infoWindow.open(map, marker);
    });                
} 

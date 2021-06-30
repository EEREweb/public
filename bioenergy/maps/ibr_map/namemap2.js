//Check if any of the items in array1 are in array2
//return true if an item in array1 is in array 2
//return false if no matches are found.
function arrays_have_a_match(array1, array2) {
    function item_in_array($needle, $haystack) {
        try {
            var i;
            for (i in $haystack) {
                if ($haystack[i] === $needle) {
                    return true;
                }
            }
        } catch (e) {
            alert('in_array: ' + e.message);
        }
        return false;
    }
    //var mycount = 0;
    try {
        var x;
        for (x in array1) {
            if (item_in_array(array1[x], array2)) {
                return true;
            }
        }
    } catch (e) {
        alert(e.message);
        //return false;
    }

    return false;
}


//Draw the map and marker layers
function drawnamemap(pnfilter) {

    L.mapbox.accessToken = 'pk.eyJ1IjoiZW5lcmd5IiwiYSI6IkozTG9BZDQifQ.1WKh4U0kKCdknF3gxBOF7Q';
//var mapid = 'energy.nda103il'; //removed this was old classic tiles api, https://docs.mapbox.com/help/troubleshooting/migrate-legacy-static-tiles-api/
var mapid = '';
		var map = L.mapbox.map('map2', mapid,
		{ maxZoom: 9, minZoom: 2, attributionControl: false, legendControl: { position: 'bottomright' } })
		.setView([40, -97], 4)
		.addLayer(L.mapbox.styleLayer('mapbox://styles/energy/ckhc7eaqv0mjm19p3yr4jtlcw'));

	/*
    
        //var map = new L.map('map2').setView([37.8, -96], 4);
	var map = L.map('map2',
		{maxZoom:7, minZoom: 3,attribution: '',styleId: 22677,updateWhenIdle: false,zoomAnimation: false,fadeAnimation: false,reuseTiles: true,watch: true})
		.setView([37.8, -96], 4);
	//L.mapbox.tileLayer('energy.nda103il', 
	
	
	
	L.mapbox.tileLayer('https://api.mapbox.com/styles/v1/energy/ckhc7eaqv0mjm19p3yr4jtlcw.html?fresh=true&title=copy&access_token=pk.eyJ1IjoiZW5lcmd5IiwiYSI6IkozTG9BZDQifQ.1WKh4U0kKCdknF3gxBOF7Q', 
		{maxZoom:7, minZoom: 3,attribution: '',styleId: 22677,updateWhenIdle: false,zoomAnimation: false,fadeAnimation: false,reuseTiles: true,watch: true})
		.addTo(map);
    //        key: 'BC9A493B41014CAABB98F0471D759707',
    */
	
    /*var cloudmade = L.tileLayer('https://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        attribution: '',
        key: 'de1c9cba618949efbf57b379e5c44053',
        styleId: 22677,
        noWrap: true,
        minZoom: 4,
        maxZoom: 6,
        updateWhenIdle: false,
        zoomAnimation: false,
        fadeAnimation: false,
        reuseTiles: true,
        watch: true

    }).addTo(map);
	/**/


    //////////////////////////////////////////////////////////////////// Overlay Shizzle

    // get color depending on value
    //function getColor(d) {
    //    return GlobalVariables.getcolor(d);
    //    //return Global_getColor(d);

    //    //return d > 100 ? '#800026' :
    //    //       d > 75 ? '#BD0026' :
    //    //       d > 50 ? '#E31A1C' :
    //    //       d > 25 ? '#FC4E2A' :
    //    //       d > 1 ? '#FD8D3C' :
    //    //                  '#FFEDA0';
    //}

    function style(feature) {
        return {
            weight: .5,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7,
            fillColor: '#d5e1e7'
        };
    }

    var currentlySelectedLayers;

    function highlightFeature(e) {
        var layer = e.target;

        if (currentlySelectedLayers != null) {
            map._layers[currentlySelectedLayers].resetStyle;
            map._layers[currentlySelectedLayers].setStyle({
                weight: 0.5,
                color: '#FFF',
                dashArray: '0',
                fillOpacity: 0.7
            });
        }

        layer.setStyle({
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        currentlySelectedLayers = this._leaflet_id;

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: highlightFeature
        });
    }
	
    geojson = L.geoJson(statesData, {
        style: style
    }).addTo(map);

	//var popup = new L.Popup({ autoPan: false });

    //Uncomment the following section on zooming if you would like to hide the icon labels based on the zoom level
    /*map.on('zoomend', function () {
        // threshold for zooming
        if (map.getZoom() <= 5) {
            // hide and show the marker title text on the map based on the zoom level
            $("div[title*='markerTitleText']").hide();
        } else {
            $("div[title*='markerTitleText']").show();
        }
    });*/
    //End zooming section


    //////////////////////////////// End of Overlay Shizzle
    
    /////This populates the feedstock list.
    function getfeedstocklisthtml(feedstock) {
        var retval = "<div style='background:#1d759a;color:white;padding:2px 0; text-align:left; margin-bottom:5px'>Feedstocks</div>";
        try {
            var foobar = feedstock.split(','),
                i;
            for (i in foobar) {
                retval += foobar[i] + '<br/>';
            }

        } catch (e) {
            alert('getfeedstocklisthtml error: ' + e.message);
        }
        return retval;

    }

    //Set the information shown when a marker is clicked on the map
    function getpopuptext(company, detailedfeedstock, conversiontechnology, primaryproduct, biofuelcapacity, scale, location, factsheet, feedstock) {
        try {
            var popuptext = "<table><tr><td class='feedstocktd'>" + getfeedstocklisthtml(feedstock) + "</td><td class='popupRightSide'>";
            popuptext += "<b>Company:</b> " + company + "<br/>";
            popuptext += "<b>Detailed Feedstock:</b> " + detailedfeedstock + "<br/>";
            popuptext += "<b>Conversion Technology:</b> " + conversiontechnology + "<br/>";
            popuptext += "<b>Primary Product:</b> " + primaryproduct + "<br/>";
            popuptext += "<b>Biofuel capacity (gal/yr)</b> " + biofuelcapacity + "<br/>";
            popuptext += "<b>Scale</b> " + scale + "<br/>";
            popuptext += "<b>Location</b> " + location + "<br/>";
            //popuptext += "<b>Factsheet</b> <a href='" + factsheet + "' target='_blank'>link</a>";
            popuptext += "</td></tr></table></div>";
            return popuptext;

        } catch (e) {
            alert('popuptext: ' + e.message);
        }
    }

    (function () {
        "use strict";
        try {
            var folder = getFolders();
            //var projectdata = localStorage.getItem('projectdata');
            //var xmldoc = $.parseXML(projectdata);
            $.ajax({
                type: "GET",
                url: folder + "IBR_Project_Data_2016_12_30_newdata.xml",
                dataType: "xml",
                success: function (xml) {
                    var $xml = $(xml);
                    //var $xml = $(xmldoc);
                    var count = 0;
                    var lat = 0;
                    var lon = 0;
                    var skipit = false;
                    var oms = new OverlappingMarkerSpiderfier(map, { keepSpiderfied: true });
					//edit cluster
                    /*var markers = new L.MarkerClusterGroup({
                        maxClusterRadius: 10 //determines the max size of cluster in pixels
                        , spiderfyDistanceMultiplier: 3 //makes clusters spider out a bit further from each other (higher number = further spread)
                        , zoomToBoundsOnClick: true
                        , spiderfyOnMaxZoom: true
                        , showCoverageOnHover: false
                    }); //group points at the same location
                    */
                    $xml.find('Item').each(function () {
                        skipit = false;

                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        //main label text
                        var company = $(this).attr('Company'),
                            detailedfeedstock = $(this).attr('DetailedFeedstock'),
                            feedstock = $(this).attr('Feedstock'),
                            array1, array2,
                            conversiontechnology = $(this).attr('ConversionTechnology'),
                            primaryproduct = $(this).attr('PrimaryProduct'),
                            biofuelcapacity = $(this).attr('BiofuelCapacity'),
                            scale = $(this).attr('Scale'),
                            markericon = $(this).attr('MarkerIcon'),
                            location = $(this).attr('City') + ', ' + $(this).attr('State'),
                            factsheet = $(this).attr('Factsheet'),
                            shortname = $(this).attr('ShortName');
							

						
                        //// Detailed Feedstock
                        if (typeof detailedfeedstock === "undefined") {
                            alert('row: ' + count.toString() + 'company: ' + company + ' has missing Detailed Feedstock!');
                        }

                        //// Primary Feedstock 
                        if (typeof feedstock === "undefined") {
                            alert('row: ' + count.toString() + 'company: ' + company + ' has missing Feedstock!');
                        }
                        if ((pnfilter.pf !== 'ALL')) {
                            try {
                                array1 = feedstock.split(','),
                                array2 = pnfilter.pf.split(',');
                                if (!(feedstock) || (arrays_have_a_match(array1, array2) === false)) {
                                    skipit = true;//alert('skipit');
                                }
                            } catch (e) {
                                alert('feedstock ' + feedstock + ' had a problem: ' + e.message);
                            }
                        }

                        if ((pnfilter.ct !== 'ALL') && (conversiontechnology !== pnfilter.ct)) {
                            skipit = true;//alert('skipit');
                        }
                        if ((pnfilter.pp !== 'ALL') && (primaryproduct.toLowerCase() !== pnfilter.pp.toLowerCase())) {
                            skipit = true;//alert('skipit');
                        }

                        //// Scale Filter
                        if (typeof scale === "undefined") {
                            alert('row: ' + count.toString() + 'company: ' + company + ' has missing scale!');
                        }
                        if ((pnfilter.ps !== 'ALL')) {
                            try {
                                array1 = scale.split(','),
                                array2 = pnfilter.ps.split(',');
                                if (!(scale) || (arrays_have_a_match(array1, array2) === false)) {
                                    skipit = true;//alert('skipit');
                                }
                            } catch (e) {
                                alert('scale ' + scale + ' had a problem: ' + e.message);
                            }
                        }

                        ///scale 

                        //var 
                        var folder = getFolders();
                        var foobarIcon = L.Icon.extend({
                            options: {
                                shadowUrl: '//www1.eere.energy.gov/bioenergy/IBRMap2/js/Leaflet/images/marker-shadow.png',
                                iconSize: [25, 41],
                                shadowSize: [50, 64],
                                iconAnchor: [10, 34],
                                shadowAnchor: [14, 62],
                                popupAnchor: [7, -32],
                            },
                            _createIcon: function () {// override Icon creation to replace
                                var t = document.createElement('div');
                                t.className = "leaflet-marker-icon leaflet-marker-text pinPointMarkerDiv";
                                //var firstWordOfCompany = company.split(' ');  firstWordOfCompany[0]
								
							
                                t.innerHTML = "<img alt='markerImages' style='width: 25px; height: 41px;' src='" + this.options.iconUrl + "' /><div title='markerTitleText' class='markerTextLabels' >" + shortname + "</div>";

                                return t;
                            }

                        }),

                            myIcon;

                        var folder = getFolders();
                        myIcon = new foobarIcon({ iconUrl: "//www1.eere.energy.gov/bioenergy/IBRMap2/js/Leaflet/images/" + markericon })
                        //switch (scale.toLowerCase()) {
                        //    case "commercial": myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-green.png' }); break;
                        //    case "research": myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-orange.png' }); break;
                        //    case "pilot": myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-blue.png' }); break;
                        //    case "demonstration": myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-red.png' }); break;
                        //    case "inactive": myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-grey.png' }); break;
                        //    default: myIcon = new foobarIcon({ iconUrl: 'js/Leaflet/images/marker-icon-black.png' });
                        //}
                        var popuptext = getpopuptext(company, detailedfeedstock, conversiontechnology, primaryproduct, biofuelcapacity, scale, location, factsheet, feedstock);
                        var marker = new L.marker([lat, lon], { icon: myIcon, riseOnHover: true });
                        marker.bindPopup(popuptext).openPopup();

                        if (skipit === false) {
                            oms.addMarker(marker);
							//clustering
                            //markers.addLayer(marker);
                            marker.addTo(map);
                            count += 1;
                        }
						
                    });


					//clustering
                    //map.addLayer(markers);
                    //alert(lat);

                    //if the user currently has marker text hidden, hide the text
                    if (!$('input[id=showHideCheckbox]').is(':checked')) {
                        $('div[title="markerTitleText"]').hide();
                    }

					$( document ).ready(function() {
						$(".leaflet-marker-icon").each( function () {

							//console.log($(this));
							$(this).on( "mouseover", function () {
								//console.log($(this).children('div[title="markerTitleText"]').text());
								$(this).children('div[title="markerTitleText"]').show();
							});
							$(this).on( "mouseleave", function () {
								$(this).children('div[title="markerTitleText"]').hide();
							});
						});
						//$('.leaflet-clickable').trigger();
					});
					
                    /*
                    Here we check the count and if the number of pins = 0 we show the big nodata overlay image.
                    */
                    if (count === 0) {
                        try {
                            var legend = L.control({ position: 'topright' });

                            legend.onAdd = function (map) {

                                var div = L.DomUtil.create('div', 'info legend'),
                                    labels = [];
                                //from, to;
                                //labels.push("<div class='nodatadiv'><img src='images/NoData.PNG' /></div>");

                                div.innerHTML = labels.join('<br>');
                                return div;
                            };

                            legend.addTo(map);
                        } catch (e) {
                            alert('error showing no data image: ' + e.message);
                        }
                    }

                    //end of function
                }
            });			
        } catch (e) {
            alert('Session Storage: ' + e.message);
        }
	}());

}

function redrawnamemap(pn_filter) {
    $('#map2').remove();
    var map = $('<div id="map2" style="width:100%"></div>');
	//map.html('<div id="map_intro"><br/> This interactive map highlights biorefinery projects co-funded by the Bioenergy Technologies Office at pilot, demonstration, and pioneer scales. Adjust the map filters to control the information displayed. You can zoom in and out of the map several ways. <br/> <br/> <ol><li>Double-click on the Map</li><li>Use the +/- buttons on the upper left</li><li>Zoom in by scrolling the mouse wheel away from you. To zoom out, scroll the wheel away toward you.</li></ol> <div id="divCloseIntro"></div> </div>');
	map.insertAfter('#map1');
	
    drawnamemap(pn_filter);
  $(function() {
    $( "#map_intro" ).dialog({  
		height: 352, width: 445, 
		"title": "Integrated Biorefineries Map", 
		modal: true,
            buttons : {
                "Get Started": function() {
                    $(this).dialog("close"); //closing on Ok click
                }
            }
		});
  });
}
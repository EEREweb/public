function drawinvestmentmap(pnfilter) {

    //// This section will fill the data depending on 
    var folder = getFolders();

    function get_grand_total_doegrant() {
        var total = 0;

        $.ajax({
            type: "GET",
            async: false,
            url: folder + "IBR_Project_Data_2014_05_09.xml",
            dataType: "xml",
            success: function (xml) {
                var $xml = $(xml);

                $xml.find('Item').each(function () {
                    DOEGrant = $(this).attr('DOEGrant');
                    total += parseFloat(DOEGrant);
                });
            }
        });
        return total;
    }

    function get_state_total(Code) {
        "use strict";
        var folder = getFolders();
        try {
            //var projectdata = localStorage.getItem('projectdata');
            //var xmldoc = $.parseXML(projectdata);
            $.ajax({
                type: "GET",
                url: folder + "IBR_Project_Data_2014_05_09.xml",
                dataType: "xml",
                success: function (xml) {
                    var $xml = $(xml);
                    //var $xml = $(xmldoc);
                    var count = 0;
                    var skipit = false;
                    var statetotaldoegrant = 0;

                    $xml.find('Item[Code="' + Code + '"]').each(function () {
                        skipit = false;

                        //main label text
                        var detailedfeedstock = $(this).attr('DetailedFeedstock'),
                            feedstock = $(this).attr('Feedstock'),
                            array1, array2,
                            conversiontechnology = $(this).attr('ConversionTechnology'),
                            primaryproduct = $(this).attr('PrimaryProduct'),
                            biofuelcapacity = $(this).attr('BiofuelCapacity'),
                            scale = $(this).attr('Scale'),
                            DOEGrant = $(this).attr('DOEGrant');

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


                        if (skipit === false) {
                            statetotaldoegrant += parseFloat(DOEGrant);
                            count += 1;
                        }
                    
                    });
                    grandtotaldoegrant += statetotaldoegrant;
                        return statetotaldoegrant;
                    
                }
            });

        } catch (e) {
            alert('error on get_state_total: ' + e.message);
        }
    }




    (function () {
        "use strict";
        try {
            var folder = getFolders();
            //var investmentdata = localStorage.getItem('investmentdata');
            //var xmldoc = $.parseXML(investmentdata);
            $.ajax({
                type: "GET",
                url: folder + "IBR_StateInvestment_2014_05_09.xml",
                async: false,
                dataType: "xml",
                success: function (xml) {
                    var $xml = $(xml);
                    //var $xml = $(xmldoc);
                    var code = '';// state code
                    var investment = 0;
                    var investmentlabel = '';

                    $xml.find('properties').each(function () {
                        code = $(this).attr('code');
                        ////// investment = $(this).attr('investment');
                        ////// The investment is now going to have to be calculated from the filter
                        //investment = get_state_total(code);
                        investment = parseFloat($(this).attr('investment')).toString()
                        investmentlabel = $(this).attr('investmentlabel');
                        investmentlabel = '$' + (investment).toString() + ' Million';
                        updatestate(code, investment, investmentlabel);
                    });
                }
            });
        } catch (e) {
            alert('error parsing investment data: ' + e.message);
        }
    }());

    
    //var Lmap = new L.map('map1').setView([37.8, -96], 4);

    L.mapbox.accessToken = 'pk.eyJ1IjoiZW5lcmd5IiwiYSI6IkozTG9BZDQifQ.1WKh4U0kKCdknF3gxBOF7Q';
    var mapid = '';
		var Lmap = L.mapbox.map('map1', mapid,
		{ maxZoom: 9, minZoom: 2, attributionControl: false, legendControl: { position: 'bottomright' } })
		.setView([40, -97], 4)
		.addLayer(L.mapbox.styleLayer('mapbox://styles/energy/ckhc7eaqv0mjm19p3yr4jtlcw'));

    //L.mapbox.accessToken = 'pk.eyJ1IjoiZW5lcmd5IiwiYSI6IkozTG9BZDQifQ.1WKh4U0kKCdknF3gxBOF7Q';
    //mapbox streets default
    //var map = new L.mapbox.map('map1', 'energy.nda103il',{maxZoom:9,attributionControl: false}).setView([37.8, -96], 4);
   

    /*var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        key: 'de1c9cba618949efbf57b379e5c44053',
        styleId: 22677,
        noWrap: true,
        minZoom: 4,
        maxZoom: 6,
        updateWhenIdle: false,
        reuseTiles: true,
        watch: true

    }).addTo(map);*/

    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        //this._lable = L.DomUtil.create('lablel', 'info')
        this.update();
        return this._div;
    };

    /*info.update = function (props) {
        this._div.innerHTML = '<h4>IBR Products</h4>' + (props ?
            '<b>' + props.name + '</b><br /> Program Investment: ' + props.investmentlabel
            : ' Total Investment: $' + grandtotaldoegrant.toFixed(1) + ' Million<br/>Click on a state for individual state information.');
    };*/

    info.update = function (props) {
        var grandtotaldoegrant = get_grand_total_doegrant();
        this._div.innerHTML = (props ?
                '<b>U.S. Total Investment:</b> $' + grandtotaldoegrant.toFixed(1) + ' Million<br/><b>' + props.name + ':</b> ' + props.investmentlabel
                : '<b>U.S. Total Investment:</b> $' + grandtotaldoegrant.toFixed(1) + ' Million');
    };
    info.addTo(Lmap);

    //below info section
    var topright = L.control({ position: 'topright' });
    var divRight = L.DomUtil.create('div', 'middle');
    topright.onAdd = function (map) {
        var divRight = L.DomUtil.create('div', 'middle');
        divRight.innerHTML = 'Click on a state for state information';
        return divRight;
    };
    topright.addTo(Lmap);

    // get color depending on value
    function getColor(d) {
        return GlobalVariables.getcolor(d);
    }

    function style(feature) {
        return {
            weight: .5,
            opacity: 1,
            color: 'white',
            dashArray: '0',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.investment)
        };
    }

    var currentlySelectedLayers;

    function highlightFeature(e) {
        var layer = e.target;
        //var ItemObject = $('path[stroke="#666"]');
        //var prevSelected = ItemObject.prevObject.length;
        /*var itemSelected = $('path[stroke="#666"]').length;

        //if ($('path[stroke="#666"]').length > 0) { //another item has outline
        if (itemSelected > 0) {
            //reset color of other items
           $('path[stroke="#666"]').attr('stroke-width', '0.5');
            $('path[stroke="#666"]').attr('dasharray', '0');
            $('path[stroke="#666"]').attr('stroke', 'white');           
             
        }*/

        if (currentlySelectedLayers != null) {
            Lmap._layers[currentlySelectedLayers].resetStyle;
            Lmap._layers[currentlySelectedLayers].setStyle({
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

    function resetAllHighlight(map) {
        geojson.resetStyle(map);
        info.update();
    }

    function zoomToFeature(e) {
        Lmap.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
       
        layer.on({
            
             click: highlightFeature
            //blur: resetHighlight,
            //mouseover: highlightFeature,
            //mouseout: resetHighlight,
            //click: zoomToFeature
            // mouseout: resetAllHighlight,                     
        });
        /*layer.off({
            click: resetHighlight
        });*/


    }

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(Lmap);
    //map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
    

    //map lengend section
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = GlobalVariables.grades,
            labels = [],
            from, to, i;
        labels.push('BETO BIOREFINERY <BR/> INVESTMENTS BY STATE <BR/> U.S. Dollars, in Millions');
        for (i = grades.length - 1; i > 0 ; i -= 1) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
        labels.push('<i style="background:' + getColor(0) + '"></i> 0');

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(Lmap);

}

function redrawinvestmentmap(pn_filter) {
    //var map = L.map('map');
    //map.redraw();
    $('#map1').remove();
    $('<div id="map1" style="width:100%"></div>').insertBefore('#map2');
    drawinvestmentmap(pn_filter);
}

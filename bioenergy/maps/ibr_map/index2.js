function getFolders() {
    //return "../bioenergy/IBRMap2/";
	//return "/sites/prod/files/";
    return "data/";
    
	//return "//www1.eere.energy.gov/apps/bioenergy/ibrmap2/data/";
}

var pn_filter = {
    ct: "ALL", //Conversion Technology single selection from ddl
    pf: "ALL",  //// Primary Feedstock list
    pp: "ALL", /// Primary Product single selection from ddl 
    ps: "ALL" /// Project Scale list
};

function switchmaps() {
    "use strict";
    if ($('input:radio[name=map]:checked').val() === 'name') {
        redrawnamemap(pn_filter); $('#map1').hide(); $('#map2').show();
    } else {
        redrawinvestmentmap(pn_filter); $('#map2').hide(); $('#map1').show();
    }
}

function bind_scalecheckboxes() {
    "use strict";
    $("input[name='ProjectScale']").bind('change', function () {
        var filter = "";
        if ($(this).attr('value') === 'All') { if ($(this).is(':checked')) { $('input[name=ProjectScale]').prop('checked', true); filter = "ALL"; } }
        else { if ($(this).is(':checked') === false) { $("input[name = 'ProjectScale'][value='All']").prop('checked', false); } }

        if (filter === "") {
            $("input[name='ProjectScale']").each(function () {
                if ($(this).is(':checked')) { filter += $(this).attr('value') + ','; }
            });
            if ((filter === "") || (filter === "All,")) { filter = "ALL"; }
        }
        pn_filter.ps = filter;
        switchmaps(); /// makes sure the right map is visible. We could automatically set the radio button.
    });
}

function bind_feedstockcheckboxes() {
    "use strict";
    $('input[name=PrimaryFeedstock]').bind('change', function () {
        try {
            var filter = "";
            if ($(this).attr('value') === 'All') { if ($(this).is(':checked')) { $('input[name=PrimaryFeedstock]').prop('checked', true); filter = "ALL"; } }
            else { if ($(this).is(':checked') === false) { $("input[name = 'PrimaryFeedstock'][value='All']").prop('checked', false); } }

            if (filter === "") {
                $("input[name=PrimaryFeedstock]").each(function () {
                    if ($(this).is(':checked')) { filter += $(this).attr('value') + ','; }
                });
                if ((filter === "") || (filter === "All,")) { filter = "ALL"; }
            }
            pn_filter.pf = filter;
            switchmaps(); /// makes sure the right map is visible. We could automatically set the radio button.
        } catch (e) {
            alert('error on primaryfeedstock checkboxes: ' + e.message);

        }
    });
}

$('input:radio[name=map]').bind('change', function () {
    var filter = "";
    if ($(this).is(':checked')) {
        $('label[for="' + $(this).attr('id') + '"]').addClass('selectedRadioButton');
    }
    else {
        $('label[for="' + $(this).attr('id') + '"]').addClass('deselectRadioButton');
    }

    switchmaps();
});

$('input[id=showHideCheckbox]').bind('change', function () {
    if ($(this).is(':checked')) {
        //change labels        
        $('div[title="markerTitleText"]').show();
    }
    else {
        $('div[title="markerTitleText"]').hide();
    }
});

$('#ddlConversionTechnology').bind('change', function () {
    "use strict";
    try {
        var foobar = $(this).find('option:selected').text();
        pn_filter.ct = foobar;
        //  redrawnamemap(pn_filter);
        switchmaps(); /// makes sure the right map is visible. We could automatically set the radio button.
    } catch (e) {
        alert('ddlConversionTechnology_change: ' + e.message);
    }
});

$('#ddlPrimaryProduct').bind('change', function () {
    "use strict";
    try {
        var foobar = $(this).find('option:selected').text();
        pn_filter.pp = foobar;
        //redrawnamemap(pn_filter);
        switchmaps(); /// makes sure the right map is visible. We could automatically set the radio button.
    } catch (e) {
        alert('ddlPrimaryProduct_change: ' + e.message);
    }
});

//////////DEBUG ..... Commenting out this clear statement should bump up performance. 
localStorage.clear();
//////////////

var appversionkey = 'appversion';
var pageversionkey = 'pageversion';

function displayversion() {
    "use strict";
    try {
        //alert('dispplayversion');

        var version = "Version: 1.0 - Data updated: " + localStorage.getItem(appversionkey); //+ ' <span style="display:none" >| User Agent:' + navigator.userAgent + ' </span>';
        $('#ibrmapfooter').text(version);
    } catch (e) {
        alert('displayversion: ' + e.Message);
    }
}

////////////////////////DATA Section////////////////////////
function GetIBRMapData(autoredraw) {

    function PopulateLookup(results) {
        if ($('#ddlConversionTechnology').length <= 1) {
            try {
                var folder = getFolders();
                $.ajax({
                    type: "GET",
                    url: folder + "IBR_LookupData_2014_05_09.xml",
                    dataType: "xml",
                    success: function (xml) {
                        var $xml = $(xml);
                        populated = true;
                        //var xmldoc = $.parseXML(results);
                        //var $xml = $(xmldoc);
                        var count = 0;
                        var options = '';

                        /// Conversion Technology
                        $('#ddlConversionTechnology').empty(); ///// empties all contents
                        $xml.find('ConversionTechnology').each(function () {
                            //  employeearray.push($(this).attr('fullname'));
                            options += '<option>' + $(this).attr('Name') + '</option>';
                            //alert($(this).find(key).text()); 
                            count += 1;
                        });
                        options += '<option selected="selected" >ALL</option>';
                        // alert(employeearray);
                        //employeearray.reverse();
                        //alert('federal employee count: ' + count.toString());
                        $('#ddlConversionTechnology').html(options);

                        /////////////////////////// Primary Product
                        count = 0;
                        options = '';
                        $('#ddlPrimaryProduct').empty(); ///// empties all contents
                        $xml.find('Product').each(function () {
                            //  employeearray.push($(this).attr('fullname'));
                            options += '<option>' + $(this).attr('Name') + '</option>';
                            //alert($(this).find(key).text()); 
                            count += 1;
                        });
                        options += '<option selected="selected" >ALL</option>';
                        // alert(employeearray);
                        //employeearray.reverse();
                        //alert('federal employee count: ' + count.toString());
                        $('#ddlPrimaryProduct').html(options);

                        /////////////////////////////////////////////// Primary Feedstock
                        count = 0;
                        options = '';
                        $('#PrimaryFeedstock').empty(); ///// empties all contents
                        $xml.find('Feedstock').each(function () {
                            //  employeearray.push($(this).attr('fullname'));
                            options += '<input type="checkbox" name="PrimaryFeedstock" id="PrimaryFeedstock' + count + '" value="' + $(this).attr('Name') + '" checked="checked"><label for="PrimaryFeedstock' + count + '">' + $(this).attr('Name') + '</label><br/>';
                            // options += '<option>' + $(this).attr('Name') + '</option>';
                            //alert($(this).find(key).text()); 
                            count += 1;
                        });
                        options += '        <input type="checkbox" name="PrimaryFeedstock" id="PrimaryFeedstock' + count + '" value="All" checked="checked"><label for="PrimaryFeedstock' + count + '">All</label><br/>';
                        // alert(employeearray);
                        //employeearray.reverse();
                        //alert('federal employee count: ' + count.toString());
                        $('#PrimaryFeedstock').html(options);

                        bind_feedstockcheckboxes();

                        /////////////////////////////////// Project Scale
                        count = 0;
                        options = '';
                        var lastoptions = ''; ///// the last options are for options that come after the 'all' check box. 
                        $('#ProjectScale').empty(); ///// empties all contents
                        $xml.find('ProjectScale').each(function () {
                            //  employeearray.push($(this).attr('fullname'));
                            if ($(this).attr('ShowLast') === '1') {
                                //                  lastoptions += '<input type="checkbox" name="ProjectScale" id="ProjectScale' + count + '" value="' + $(this).attr('Name') + '" checked="checked"><label for="ProjectScale' + count + '" class="scalenotactive">' + $(this).attr('Label') + '<img class="checkboxmarker" src="js/Leaflet/images/' + $(this).attr('MarkerIcon') + '"></img></label><br/>';
                                lastoptions += '<input type="checkbox" name="ProjectScale" id="ProjectScale' + count + '" value="' + $(this).attr('Name') + '" checked="checked"><label for="ProjectScale' + count + '">' + $(this).attr('Label') + ' &nbsp;<img style="width:18px; height:17px;" class="checkboxmarker" src="//www1.eere.energy.gov/bioenergy/IBRMap2/js/Leaflet/images/' + $(this).attr('MarkerIcon') + '" /></label><br/>';
                            } else {
                                //                    options += '<input type="checkbox" name="ProjectScale" id="ProjectScale' + count + '" value="' + $(this).attr('Name') + '" checked="checked"><label for="ProjectScale' + count + '">' + $(this).attr('Label') + '<img class="checkboxmarker" src="js/Leaflet/images/' + $(this).attr('MarkerIcon') + '"></img></label><br/>';
                                options += '<input type="checkbox" name="ProjectScale" id="ProjectScale' + count + '" value="' + $(this).attr('Name') + '" checked="checked"><label for="ProjectScale' + count + '">' + $(this).attr('Label') + ' &nbsp;<img style="width:18px; height:17px;" class="checkboxmarker" src="//www1.eere.energy.gov/bioenergy/IBRMap2/js/Leaflet/images/' + $(this).attr('MarkerIcon') + '" /></label><br/>';
                            }
                            // options += '<option>' + $(this).attr('Name') + '</option>';
                            //alert($(this).find(key).text()); 
                            count += 1;
                        });
                        options += '        <input type="checkbox" name="ProjectScale" id="ProjectScale' + count + '" value="All" checked="checked"><label for="ProjectScale' + count + '">All</label><br/>';
                        options += lastoptions;
                        // alert(employeearray);
                        //employeearray.reverse();
                        //alert('federal employee count: ' + count.toString());
                        $('#ProjectScale').html(options);

                        bind_scalecheckboxes();

                    },
                    error: function (request, status, errorThrown) {
                        var xmldoc = $.parseXML(results);
                        $xml = $(xmldoc);
                    }
                });
            } catch (e) { alert('PopulateLookup: ' + e.message); }
        }
    }


    function getSucceeded(results) {
        try {
            localStorage.setItem('projectdata', results);
            if (autoredraw) { switchmaps(); }
        } catch (e) {
            alert('getSucceeded: ' + e);
        }
    }

    function getFailed() {
        try {
            //Alert('Failed to get pages!');
            localStorage.setItem(appversionkey, 'Error!');
			//edit
            //alert('get app version data failed!');
        } catch (e) {
            alert('getFailed: ' + e.Message);
        }
    }

    function getStateSucceeded(results) {
        try {
            //var foobar = localStorage.getItem('key');
            //alert(results);
            localStorage.setItem('investmentdata', results);
            if (autoredraw) { switchmaps(); }
        } catch (e) {
            alert('error duringgetStateSucceeded: ' + e);
        }
    }

    function getStateFailed() {
        try {
            //Alert('Failed to get pages!');
            localStorage.setItem(appversionkey, 'Error!');
            alert('get Investment Data Failed!');
        } catch (e) {
            alert('getFailed: ' + e.Message);
        }
    }

    function verifyversion(results) {
        try {
            var currversion = localStorage.getItem(appversionkey);
            var newversion = results;
            if (currversion !== newversion) {
                //              alert('new version');
                localStorage.setItem(appversionkey, newversion);
                var folder = getFolders();

                //iApp.WebService.iGetAllIBRProjectXML(getSucceeded, getFailed);
                $.ajax({
                    type: "GET",
                    url: folder + "IBR_Project_Data_2014_05_09.xml",
                    dataType: "xml",
                    success: function (xml) {
                        var $xml = $(xml);
                        //getSucceeded($xml);
                    },
                    error: function () {
                        getFailed();
                    }
                });

                //iApp.WebService.iGetStateInvestmentXML(getStateSucceeded, getStateFailed);
                $.ajax({
                    type: "GET",
                    url: folder + "IBR_StateInvestment_2014_05_09.xml",
                    dataType: "xml",
                    success: function (xml) {
                        var $xml = $(xml);
                        //getSucceeded($xml);
                    },
                    error: function () {
                        getFailed();
                    }
                });
                //iApp.WebService.iGetLookupXML(PopulateLookup);
                PopulateLookup(results);
            }
            displayversion();
        } catch (e) {
            alert('verifylookupversion: ' + e);
        }
        //    alert(results);
    }

    try {
        verifyversion(new Date());
        //iApp.WebService.iGetAppVersion(verifyversion);
    } catch (e) {
        $('#map1').text('Invoking iGetAppVersion: ' + e.Message);
    }
}

GetIBRMapData(true);


function myTimer() {
    "use strict";
    try {
        var d = new Date();
        var t = d.toLocaleTimeString();
        $('#timer').text(t);
        //alert($('#timer').text(t));
        //alert('here');
        //alert('t:' + t);
        //document.getElementById("timer").innerHTML = t;
        // window.frames['myFrame'].location.href = text;
        GetIBRMapData(false);

        if ($('#map1').is(":visible") && $('#map2').is(":visible")) {
            //alert('both are visible');
            switchmaps();
        }

    }
    catch (e) {
        alert('timer error: ' + e.message);
    }
}

function startTimer(interval) {
    "use strict";
    try {
        setInterval(function () { myTimer(); }, interval);
        return false;
    }
    catch (e) {
        alert(e.message);
    }
}

//startTimer(500);


$(document).ready(function () {
    switchmaps();
});

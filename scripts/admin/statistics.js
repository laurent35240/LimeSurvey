function toggleSection(chevron, section ) {
    section.toggle();
    chevron.toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
}

function hideSection(chevron, section ) {
    section.hide();
    chevron.removeClass('glyphicon-chevron-up');
    chevron.addClass('glyphicon-chevron-down');
}

/**
 * Display chartjs graph
 */
var chartjs = new Array();
var COLORS_FOR_SURVEY = new Array('20,130,200','232,95,51','34,205,33','210,211,28','134,179,129','201,171,131','251,231,221','23,169,161','167,187,213','211,151,213','147,145,246','147,39,90','250,250,201','201,250,250','94,0,94','250,125,127','0,96,201','201,202,250','0,0,127','250,0,250','250,250,0','0,250,250','127,0,127','127,0,0','0,125,127','0,0,250','0,202,250','201,250,250','201,250,201','250,250,151','151,202,250','251,149,201','201,149,250','250,202,151','45,96,250','45,202,201','151,202,0','250,202,0','250,149,0','250,96,0','184,230,115','102,128,64','220,230,207','134,191,48','184,92,161','128,64,112','230,207,224','191,48,155','230,138,115','128,77,64','230,211,207','191,77,48','80,161,126','64,128,100','207,230,220','48,191,130','25,25,179','18,18,125','200,200,255','145,145,255','255,178,0','179,125,0','255,236,191','255,217,128','255,255,0','179,179,0','255,255,191','255,255,128','102,0,153','71,0,107','234,191,255','213,128,255');

/**
 * loadGraphOnScroll jQuery plugin
 * This plugin will load graph on scroll
 */
(function($)
{
    $.fn.loadGraphOnScroll=function()
    {
       this.each(function(){
           var $elem = $(this);
           var $type = $elem.data('type');
           var $qid = $elem.data('qid');

           console.log('QID: '+$elem.data('qid'));

           $(window).scroll(function() {
               var $window = $(window);
               var docViewTop = $window.scrollTop();
               var docViewBottom = docViewTop + $window.height();
               var elemTop = $elem.offset().top;
               var elemBottom = elemTop + $elem.height();

               if((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
               {
                   // chartjs
                   if ( typeof chartjs[$qid] == "undefined" || typeof chartjs == "undefined" ) // typeof chartjs[$qid] == "undefined" || typeof chartjs == "undefined"
                   {
                       if($type == 'Bar' || $type == 'Radar' || $type == 'Line' )
                       {

                           init_chart_js_graph_with_datasets($type,$qid);
                       }
                       else
                       {
                           init_chart_js_graph_with_datas($type, $qid);
                       }
                   }

               };

           });


       });
       return this;
    };
})(jQuery);

(function($)
{
    $.fn.loadGraph=function()
    {
       this.each(function(){
           var $elem = $(this);
           var $type = $elem.data('type');
           var $qid = $elem.data('qid');

           // chartjs

               if($type == 'Bar' || $type == 'Radar' || $type == 'Line' )
               {

                   init_chart_js_graph_with_datasets($type,$qid);
               }
               else
               {
                   init_chart_js_graph_with_datas($type, $qid);
               }


       });
       return this;
    };
})(jQuery);


/**
 * This function load the graph needing datasets (bars, etc.)
 */
function init_chart_js_graph_with_datasets($type,$qid)
{
    var canvasId = 'chartjs-'+$qid;
    var $canvas = document.getElementById(canvasId).getContext("2d");
    var $canva = $('#'+canvasId);
    var $labels = eval("labels_"+$qid);
    var $grawdata = eval("grawdata_"+$qid);
    var $color = $canva.data('color');

    if (typeof chartjs != "undefined") {
        if (typeof chartjs[$qid] != "undefined") {
            window.chartjs[$qid].destroy();
        }
    }

    window.chartjs[$qid] = new Chart($canvas)[$type]({
        labels: $labels,
        datasets: [{
            label: $qid,
            data: $grawdata,
            fillColor: "rgba("+COLORS_FOR_SURVEY[$color]+",0.2)",
            strokeColor: "rgba("+COLORS_FOR_SURVEY[$color]+",1)",
            pointColor: "rgba("+COLORS_FOR_SURVEY[$color]+",1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba("+COLORS_FOR_SURVEY[$color]+",1)",

        }],
    });

    // We need to give a different color to each bar
    if($type=='Bar')
    {
        for (var key in $labels )
        {
            $index = (parseInt(key)+$color);
            window.chartjs[$qid].datasets[0].bars[key].fillColor = "rgba("+COLORS_FOR_SURVEY[$index]+",0.6)";
            window.chartjs[$qid].datasets[0].bars[key].strokeColor= "rgba("+COLORS_FOR_SURVEY[$index]+",1)";
            window.chartjs[$qid].datasets[0].bars[key].highlightFill =  "rgba("+COLORS_FOR_SURVEY[$index]+",0.9)";
        }
        chartjs[$qid].update();
    }
}

/**
 * This function load the graphs needing datas (pie chart, etc)
 */
function init_chart_js_graph_with_datas($type,$qid)
{
    var canvasId = 'chartjs-'+$qid;
    var $canvas = document.getElementById(canvasId).getContext("2d");
    var $canva = $('#'+canvasId);
    var $color = $canva.data('color');
    var $labels = eval("labels_"+$qid);
    var $grawdata = eval("grawdata_"+$qid);
    var $chartDef = new Array();

    $.each($labels, function($i, $label) {
        $colori = (parseInt($i)+$color);
        $chartDef[$i] = {
            value: $grawdata[$i],
            color:"rgba("+COLORS_FOR_SURVEY[$colori]+",0.6)",
            highlight: "rgba("+COLORS_FOR_SURVEY[$colori]+",0.9)",
            label: $label,
        };
    });

    if (typeof chartjs != "undefined") {
        if (typeof chartjs[$qid] != "undefined") {
            window.chartjs[$qid].destroy();
        }
    }

    console.log($type);
    window.chartjs[$qid] = new Chart($canvas)[$type](
        $chartDef
    );
}

$(document).ready(function() {


    if($('#showGraphOnPageLoad').length>0)
    {
        $('#statisticsoutput .row').first().find('.chartjs-container').loadGraph();
    }

    $('#generalfilters-chevron').click(function(){
        toggleSection($('#generalfilters-chevron'), $('#statisticsgeneralfilters') );
    });

    $('#responsefilters-chevron').click(function(){
        toggleSection($('#responsefilters-chevron'), $('#filterchoices'));
    });

    $('#statistics-render-chevron').click(function(){
        toggleSection($('#statistics-render-chevron') ,$('#statisticsoutput') );
    });

    $('#generate-statistics').submit(function(){

        hideSection($('#generalfilters-chevron'), $('#statisticsgeneralfilters') );
        hideSection($('#responsefilters-chevron'), $('#filterchoices'))
        $('#statisticsoutput').show();
        $('#statistics-render-chevron').removeClass('glyphicon-chevron-up');
        $('#statistics-render-chevron').addClass('glyphicon-chevron-down');
        $('#view-stats-alert-info').hide();
        $('#statsContainerLoading').show();
        //alert('ok');
    });

    $('.group-question-chevron').click(function(){
        //alert('ok');
        $group_to_hide = $('#'+$(this).data('grouptohide'));
        toggleSection($(this), $group_to_hide )
        //$('#'+group_to_hide).hide();
    });

    // If the graph are displayed
    if($('.chartjs-container').length>1){

        // On scroll, display the graph
        $('.chartjs-container').loadGraphOnScroll();

        // Buttons changing the graph type
        $('.chart-type-control').click(function() {
            $type = $(this).data('type');
            $qid = $(this).data('qid');

            // chartjs
            if($type == 'Bar' || $type == 'Radar' || $type == 'Line' )
            {
                init_chart_js_graph_with_datasets($type,$qid);
            }
            else
            {
                init_chart_js_graph_with_datas($type, $qid);
            }
        });

    }

    /**
     * Load responses for one question.
     * Used at question summary.
     */
    var loadBrowse = (function() {

        // Static variable for function loadBrowse, catched through closure
        // Use this to track if we should hide/show responses
        var toggle = {};

        var fn = function loadBrowse(id,extra) {

            var destinationdiv=$('#columnlist_'+id);

            // First time initialization
            if (toggle[id] === undefined) {
                toggle[id] = 0;
            }
            toggle[id] = 1 - toggle[id];  // Switch between 1 and 0

            if (toggle[id] === 0) {
                $('#' + id).parent().find('.statisticscolumndata, .statisticscolumnid').remove();
                return;
            }

            if(extra=='') {
                destinationdiv.parents("td:first").toggle();
            } else {
                destinationdiv.parents("td:first").show();
            }

            if(destinationdiv.parents("td:first").css("display") != "none") {
                $.post(listColumnUrl+'/'+id+'/'+extra, function(data) {
                    $('#' + id).parent().append(data);
                });
            }
        };

        // Closure return function
        return fn;
    })();

    if(showTextInline==1) {
        /* Enable all the browse divs, and fill with data */
        $('.statisticsbrowsebutton').each( function (){
            if (!$(this).hasClass('numericalbrowse')) {
                loadBrowse(this.id,'');
            }
        });
    }
     $('.statisticsbrowsebutton').click( function(){
         if($(this).hasClass('numericalbrowse')) {
             var destinationdiv=$('#columnlist_'+this.id);
             var extra='';
             if(destinationdiv.parents("td:first").css("display") == "none") {
                 extra='sortby/'+this.id+'/sortmethod/asc/sorttype/N/';
             }
             loadBrowse(this.id, extra);
         } else {
            loadBrowse(this.id,'');
         }

     });
     $(".sortorder").click( function(e) {
         var details=this.id.split('_');
         var order='sortby/'+details[2]+'/sortmethod/'+details[3]+'/sorttype/'+details[4];
         loadBrowse(details[1],order);
     });

     $('#usegraph').click( function(){
        if ($('#grapherror').length>0)
        {
            $('#grapherror').show();
            $('#usegraph').prop('checked',false);
        }
     });

    /***
     * Select all questions
     */
    $("[name='viewsummaryall']").on('switchChange.bootstrapSwitch', function(event, state) {

           if (state==true)
           {
               $('#filterchoices input[type=checkbox]').prop('checked', true);
           }
           else
           {
               $('#filterchoices input[type=checkbox]').prop('checked', false);

           }
    });

    /* Show and hide the three major sections of the statistics page */
    /* The response filters */
    $('#hidefilter').click( function(){
        $('#statisticsresponsefilters').hide();
        $('#filterchoices').hide();
        $('#filterchoice_state').val('1');
        $('#vertical_slide2').hide();
    });
    $('#showfilter').click( function(){
        $('#statisticsresponsefilters').show();
        $('#filterchoices').show();
        $('#filterchoice_state').val('');
        $('#vertical_slide2').show();
    });
    /* The general settings/filters */
    $('#hidegfilter').click( function(){
        $('#statisticsgeneralfilters').hide();
    });
    $('#showgfilter').click( function(){
        $('#statisticsgeneralfilters').show();
    });
    /* The actual statistics results */
    $('#hidesfilter').click( function(){
        $('#statisticsoutput').hide(1000);
    });
    $('#showsfilter').click( function(){
        $('#statisticsoutput').show(1000);
    });
    function showhidefilters(value) {
     if(value == true) {
       hide('filterchoices');
     } else {
       show('filterchoices');
     }
    }
     /* End of show/hide sections */

     if (typeof aGMapData == "object") {
         for (var i in aGMapData) {
             gMapInit("statisticsmap_" + i, aGMapData[i]);
         }
     }

     if (typeof aStatData == "object") {
        for (var i in aStatData) {
            statInit(aStatData[i]);
        }
     }

     $(".stats-hidegraph").click (function ()
     {

        var id = statGetId(this.parentNode);
        if (!id) {
            return;
        }

        $("#statzone_" + id).html(getWaiter());
        graphQuery(id, 'hidegraph', function (res) {
            if (!res) {
                ajaxError();
                return;
            }

            data = JSON.parse(res);

            if (!data || !data.ok) {
                ajaxError();
                return;
            }

            isWaiting[id] = false;
            aStatData[id].sg = false;
            statInit(aStatData[id]);
        });
     });

     $(".stats-showgraph").click(function ()
     {
        var id = statGetId(this.parentNode);
        if (!id) {
            return;
        }

        $("#statzone_" + id).html(getWaiter()).show();
        graphQuery(id, 'showgraph', function (res) {
            if (!res) {
                ajaxError();
                return;
            }
            data = JSON.parse(res);

            if (!data || !data.ok || !data.chartdata) {
                ajaxError();
                return;
            }

            isWaiting[id] = false;
            aStatData[id].sg = true;
            statInit(aStatData[id]);

            $("#statzone_" + id).append("<img border='1' src='" + temppath +"/"+data.chartdata + "' />");

            if (aStatData[id].sm) {
                if (!data.mapdata) {
                    ajaxError();
                    return;
                }

                $("#statzone_" + id).append("<div id=\"statisticsmap_" + id + "\" class=\"statisticsmap\"></div>");
                gMapInit('statisticsmap_' + id, data.mapdata);
            }

            $("#statzone_" + id + " .wait").remove();

        });
     });

     $(".stats-hidemap").click (function ()
     {
        var id = statGetId(this.parentNode);
        if (!id) {
            return;
        }

        $("#statzone_" + id + ">div").replaceWith(getWaiter());

        graphQuery(id, 'hidemap', function (res) {
            if (!res) {
                ajaxError();
                return;
            }

            data = JSON.parse(res);

            if (!data || !data.ok) {
                ajaxError();
                return;
            }

            isWaiting[id] = false;
            aStatData[id].sm = false;
            statInit(aStatData[id]);

            $("#statzone_" + id + " .wait").remove();
        });
     });

     $(".stats-showmap").click(function ()
     {
        var id = statGetId(this.parentNode);
        if (!id) {
            return;
        }

        $("#statzone_" + id).append(getWaiter());

        graphQuery(id, 'showmap', function (res) {
            if (!res) {
                ajaxError();
                return;
            }

            data = JSON.parse(res);

            if (!data || !data.ok || !data.mapdata) {
                ajaxError();
                return;
            }

            isWaiting[id] = false;
            aStatData[id].sm = true;
            statInit(aStatData[id]);

            $("#statzone_" + id + " .wait").remove();
            $("#statzone_" + id).append("<div id=\"statisticsmap_" + id + "\" class=\"statisticsmap\"></div>");

            gMapInit('statisticsmap_' + id, data.mapdata);
        });
     });

     $(".stats-showbar").click(function ()
     {
        changeGraphType('showbar', this.parentNode);
     });

     $(".stats-showpie").click(function ()
     {
        changeGraphType('showpie', this.parentNode);
     });
});

var isWaiting = {};

function getWaiter()
{
    return "<img style='margin:auto;display:block;'class='wait' src='"+imgpath+"/ajax-loader.gif'/>";
}

function graphQuery (id, cmd, success) {
    $.ajax({
        type: "POST",
        url: graphUrl,
        data: {
            'id': id,
            'cmd': cmd,
            'sStatisticsLanguage': sStatisticsLanguage
        },
        success: success,
        error: function (res)
        {
                ajaxError();
        }
    });
}

function ajaxError()
{
    alert ("An error occured! Please reload the page!");
}

function selectCheckboxes(Div, CheckBoxName, Button)
{
    var aDiv = document.getElementById(Div);
    var nInput = aDiv.getElementsByTagName("input");
    var Value = document.getElementById(Button).checked;
    //alert(Value);

    for(var i = 0; i < nInput.length; i++)
    {
        if(nInput[i].getAttribute("name")==CheckBoxName)
        nInput[i].checked = Value;
    }
}

function nographs()
{
    document.getElementById('usegraph').checked = false;
}

function gMapInit(id, data)
{
    if (!data || !data["coord"] || !data["zoom"] ||
        !data.width || !data.height || typeof google == "undefined")
    {
        return;
    }

    $("#" + id).width(data.width);
    $("#" + id).height(data.height);

    var latlng;
    if (data["coord"].length > 0) {
        var c = data["coord"][0].split(" ");
        latlng = new google.maps.LatLng(parseFloat(c[0]), parseFloat(c[1]));
    } else {
        latlng = new google.maps.LatLng(0.1, 0.1);
    }

    var myOptions = {
        zoom: parseFloat(data["zoom"]),
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById(id), myOptions);

    for (var i = 0; i < data["coord"].length; ++i) {
        var c = data["coord"][i].split(" ");

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(c[0]), parseFloat(c[1])),
            map: map
        });
    }
}

function statGetId(elem)
{
    var id = $(elem).attr("id");

    if (id.substr(0, 6) == "stats_") {
        return id.substr(6, id.length);
    }

    if (id == '' || isWaiting[id]) {
        return false;
    }

    isWaiting[id] = true;
    return id;
}

function statInit(data)
{
    var elem = $("#stats_" + data.id);

    elem.children().hide();

    if (data.sg) {
        $("#statzone_" + data.id).show();
        $(".stats-hidegraph", elem).show();

        if (data.ap) {
            $(".stats-" + (data.sp ? "showbar" : "showpie"), elem).show();
        }

        if (data.am) {
            $(".stats-" + (data.sm ? "hidemap" : "showmap"), elem).show();
        }
    } else {
        $("#statzone_" + data.id).hide();
        $(".stats-showgraph", elem).show();
    }
}

function changeGraphType (cmd, id) {
    id = statGetId(id);
    if (!id) {
        return;
    }

    if (!aStatData[id]) {
        alert('Error');
    }

    if (!aStatData[id].ap) {
        return;
    }

    $("#statzone_" + id).append(getWaiter());

    graphQuery(id, cmd, function (res) {
        if (!res) {
            ajaxError();
            return;
        }

        data = JSON.parse(res);

        if (!data || !data.ok || !data.chartdata) {
            ajaxError();
            return;
        }

        isWaiting[id] = false;
        aStatData[id].sp = (cmd == 'showpie');
        statInit(aStatData[id]);

        $("#statzone_" + id + " .wait").remove();
        $("#statzone_" + id + ">img:first").attr("src", temppath +"/"+data.chartdata);
    });

}

//Here we are declaring the projection object for Web Mercator
var projection = ol.proj.get('EPSG:3857');

//Define Basemap
//Here we are declaring the raster layer as a separate object to put in the map later
var baseLayer = new ol.layer.Tile({
    source: new ol.source.MapQuest({layer: 'osm'})
});

//Define all WMS Sources:

var AHPS_Source =  new ol.source.TileWMS({
        url:'http://geoserver.byu.edu/arcgis/services/NWC/AHPS_Gauges/MapServer/WmsServer?',
        params:{
            LAYERS:"0",
//            FORMAT:"image/png", //Not a necessary line, but maybe useful if needed later
        },
        crossOrigin: 'Anonymous' //This is necessary for CORS security in the browser
        });

var USGS_Source =  new ol.source.TileWMS({
        url:'http://geoserver.byu.edu/arcgis/services/NWC/USGS_Gauges/MapServer/WmsServer?',
        params:{
            LAYERS:"0",
//            FORMAT:"image/png", //Not a necessary line, but maybe useful if needed later
        },
        crossOrigin: 'Anonymous'
        });


//Define all WMS layers
//The gauge layers can be changed to layer.Image instead of layer.Tile (and .ImageWMS instead of .TileWMS) for a single tile
var AHPS_Gauges = new ol.layer.Tile({
    source:AHPS_Source
    }); //Thanks to http://jsfiddle.net/GFarkas/tr0s6uno/ for getting the layer working

var USGS_Gauges = new ol.layer.Tile({
    source:USGS_Source
    }); //Thanks to http://jsfiddle.net/GFarkas/tr0s6uno/ for getting the layer working

sources = [AHPS_Source,USGS_Source];
layers = [baseLayer,AHPS_Gauges, USGS_Gauges];

//Establish the view area. Note the reprojection from lat long (EPSG:4326) to Web Mercator (EPSG:3857)
var view = new ol.View({
        center: [-11500000, 4735000],
        projection: projection,
        zoom: 4
    })

//Declare the map object itself.
var map = new ol.Map({
    target: document.getElementById("map"),
    layers: layers,
    view: view,
});

var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});

map.addOverlay(popup);


map.on('singleclick', function(evt) {
    $(element).popover('destroy');
        if (map.getTargetElement().style.cursor == "pointer"){

            var clickCoord = evt.coordinate;
            popup.setPosition(clickCoord);

            var view = map.getView();
            var viewResolution = view.getResolution();
            var source = AHPS_Gauges.get('visible') ? AHPS_Gauges.getSource() : USGS_Gauges.getSource();
            var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(),
              {'INFO_FORMAT': 'text/xml', 'FEATURE_COUNT': 50});

                if (url) {
        //      console.log(url)
        //      document.getElementById('popup').innerHTML = '<iframe src="' + url + '"></iframe>';
        //        var parser = new ol.format.GeoJSON();
                $.ajax({
                  url: url,
//                  dataType: 'html'
                }).then(function(response) {
//                console.log(response);

//                The following 3 lines are to remove the included header if an html is returned
//                var start = response.indexOf('<h5>');
//                var end = response.indexOf('</h5>');
//                response = response.substring(0,start-1)+response.substring(end+5)

//                The following console.log commands were used in determining how to parse the returned XML
//                console.log(response);
//                console.log(response.documentElement);
//                console.log(response.documentElement.nodeName);
//                console.log(response.documentElement.childElementCount);
//                console.log(response.documentElement.children);
//                console.log(response.documentElement.children[0].attributes['GaugeLID'].value);

//                var displayContent = "Gauge ID     Waterbody     Link\n";
                var displayContent = '<table border="1"><tbody><tr><th>Gauge ID</th><th>Waterbody</th><th>Link</th></tr>'

                var xmlResponse = response.documentElement
                var gaugesSelected = xmlResponse.childElementCount;
//                console.log(gaugesSelected);
                for (i = 0; i < gaugesSelected; i++) {
                    var gaugeID = xmlResponse.children[i].attributes['GaugeLID'].value;
                    var waterbody = xmlResponse.children[i].attributes['Waterbody'].value;
                    var urlLink = xmlResponse.children[i].attributes['URL'].value;
//                    console.log(gaugeID);
//                    displayContent += gaugeID +'  '+ waterbody + '   Go to Website'.link(urlLink)+'\n';
//                    displayContent += gaugeID +'  '+ waterbody + '<a href="'+urlLink+'" target="_blank">     Go to Website</a>'+'\n';
                    displayContent += '<tr><td>'+gaugeID +'</td><td>'+ waterbody + '</td><td><a href="'+urlLink+'" target="_blank">Go to Website</a></td></tr>';

                    }
                    displayContent += '</table>';

                $(element).popover({
                'placement': 'top',
                'html': true,
                'content': displayContent
                  });
                $(element).popover('show');
                });
            }
        }
    });


  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function(layer) {
    if (layer != baseLayer){
      return true;}
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

//This function is ran to set a listener to update the map size when the navigation pane is opened or closed
(function () {
    var target, observer, config;
    // select the target node
    target = $('#app-content-wrapper')[0];

    observer = new MutationObserver(function () {
        window.setTimeout(function () {
            map.updateSize();
        }, 350);
    });

    config = {attributes: true};

    observer.observe(target, config);
}());
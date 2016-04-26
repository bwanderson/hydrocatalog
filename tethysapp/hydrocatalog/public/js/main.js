//Here we are declaring the projection object for Web Mercator
var projection = ol.proj.get('EPSG:3857');

//Here we are declaring the raster layer as a separate object to put in the map later
var rasterLayer = new ol.layer.Tile({
    source: new ol.source.MapQuest({layer: 'osm'})
});

var AHPS_Gauges = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url:'http://geoserver.byu.edu/arcgis/services/NWC/AHPS_Gauges/MapServer/WmsServer?',
        params:{
            LAYERS:"0",
//            FORMAT:"image/png", //Not a necessary line, but maybe useful if needed later
        }
        })
    }); //Thanks to http://jsfiddle.net/GFarkas/tr0s6uno/ for getting the layer working

var USGS_Gauges = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url:'http://geoserver.byu.edu/arcgis/services/NWC/USGS_Gauges/MapServer/WmsServer?',
        params:{
            LAYERS:"0",
//            FORMAT:"image/png", //Not a necessary line, but maybe useful if needed later
        }
        })
    }); //Thanks to http://jsfiddle.net/GFarkas/tr0s6uno/ for getting the layer working

    layers = [rasterLayer,AHPS_Gauges, USGS_Gauges];

//Declare the map object itself.
var map = new ol.Map({
    target: document.getElementById("map"),

    //Set up the layers that will be loaded in the map
    layers: layers,

    //Establish the view area. Note the reprojection from lat long (EPSG:4326) to Web Mercator (EPSG:3857)
    view: new ol.View({
        center: [-11500000, 4735000],
        projection: projection,
        zoom: 4
    })
});


var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});

map.addOverlay(popup);

// display popup on click

map.on('click', function(evt) {
  //try to destroy it before doing anything else...s
  $(element).popover('destroy');
  var clickCoord = evt.coordinate;

  //Try to get a feature at the point of interest
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });

  //if we found a feature then create and show the popup.
  if (feature) {
    popup.setPosition(clickCoord);
    if (feature.get('name') == "0") {
    var displaycontent = "This is a common Underground Railroad Route";
    }
    else {
    var displaycontent = feature.get('description');
    }

    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': displaycontent
    });

    $(element).popover('show');

  } else {
    $(element).popover('destroy');
  }
});

// change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(element).popover('destroy');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
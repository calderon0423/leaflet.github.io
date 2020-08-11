// Creating map object
var myMap = L.map("map", {
    // center: [36.7783, -119.4179],
    center: [0, 0],
    zoom: 2.5
  });
  
  // Adding tile layer
  L.tileLayer(MAP_URL, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Use this link to get the geojson data.
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // set legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magToColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
  legend.addTo(myMap);

  //change circle color based off of magnitude color 
  function magToColor(magnitude) {
    switch(true) {
        case magnitude > 5:
            // return 'white'
            return '#f00';
        case magnitude > 4: 
            return '#ff4d00';
        case magnitude > 3:
            return '#ff8d00';
        case magnitude > 2: 
            return '#ffdb00';
        case magnitude > 1: 
            return '#fdff00'
        case magnitude > 0: 
            return '#15ff00'
    }
  }

  function circleStyle(feature) {
    return {
        radius: feature.properties.mag*2,
        fillColor: magToColor(feature.properties.mag),
        color: magToColor(feature.properties.mag),
        opacity: 1, 
        fillOpacity: 1
    };
  };

  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    console.log(data)
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle
    }).addTo(myMap);
  });
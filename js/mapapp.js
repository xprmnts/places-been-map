var map;
var markers = [];
function initMap() {

  // Create a new StyledMapType object, passing it an array of styles,
  // and the name to be displayed on the map type control.
  var styledMapType = new google.maps.StyledMapType(
    [
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#e9e9e9',
              },
            {
                lightness: 17,
              },
        ],
      },
    {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
            {
                color: '#f5f5f5',
              },
            {
                lightness: 20,
              },
        ],
      },
    {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#ffffff',
              },
            {
                lightness: 17,
              },
        ],
      },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#ffffff',
              },
            {
                lightness: 29,
              },
            {
                weight: 0.2,
              },
        ],
      },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
            {
                color: '#ffffff',
              },
            {
                lightness: 18,
              },
        ],
      },
    {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
            {
                color: '#ffffff',
              },
            {
                lightness: 16,
              },
        ],
      },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            {
                color: '#f5f5f5',
              },
            {
                lightness: 21,
              },
        ],
      },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
            {
                color: '#dedede',
              },
            {
                lightness: 21,
              },
        ],
      },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                visibility: 'on',
              },
            {
                color: '#ffffff',
              },
            {
                lightness: 16,
              },
        ],
      },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                saturation: 36,
              },
            {
                color: '#333333',
              },
            {
                lightness: 40,
              },
        ],
      },
    {
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off',
              },
        ],
      },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [
            {
                color: '#f2f2f2',
              },
            {
                lightness: 19,
              },
        ],
      },
    {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#fefefe',
              },
            {
                lightness: 20,
              },
        ],
      },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#fefefe',
              },
            {
                lightness: 17,
              },
            {
                weight: 1.2,
              },
        ],
      },
],
    { name: 'Styled Map' });

  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map'],
          },
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < initialPlaces.length; i++) {
    // Get the position from the location array.
    var position = initialPlaces[i].location;
    var title = initialPlaces[i].name;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
    });

    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function (x) {
      populateInfoWindow(this, infowindow, initialPlaces[this.id]);
    });

    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

  // Use markerclustererplus community repo to cluster markers if appropriate
  // var markerCluster = new MarkerClusterer(map, markers,
  //   { imagePath: '/images/m' });

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow, placeItem) {
  infowindow.marker = marker;
  var flickrAPI = 'https://api.flickr.com/services/rest/?';
  $.getJSON(flickrAPI, {
    format: 'json',
    nojsoncallback: 1,
    method: 'flickr.photos.search',
    api_key: '853e0dd9b4740b927b87214711cc40f8',
    tags: placeItem.tags,
    per_page: 1,
    sort: 'relevance',
  }).done(function (json) {
    data = json.photos.photo[0];
    var src = 'https://farm' +
    data.farm +
    '.staticflickr.com/' +
    data.server +
    '/' +
    data.id +
    '_' +
    data.secret +
    '.jpg';
    var infoWindowImage = '<img src="' + src + '" alt="' + data.title + '">';
    infowindow.setContent(infoWindowImage);
    infowindow.open(map, marker);

    // infowindow.addListener('closeclick', function () {
    //   infowindow.setMarker = null;
    // });
  }).fail(function () {
    infowindow.setContent('Sorry! Something went wrong & no image was found');
    infowindow.open(map, marker);
  });

}

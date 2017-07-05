var map;
var markers = [];
var currentInfoWindow;
var currentMarker;

function initMap() {

  // Style the map
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

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('444');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('ccc');

  google.maps.InfoWindow.prototype.isOpen = function () {
      var map = this.getMap();
      return (map !== null && typeof map !== 'undefined');
    };

  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map'],
          },
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var infowindow = new google.maps.InfoWindow({

    // Set max width for consistency (also set image width to avoid img clipping)
    maxWidth: 320,
  });
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
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i,
    });

    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function () {
      clearBounce();

      // Check if current marker is = to the selected marker
      // if the same item in the lsit was clicked close infowindow and stop animation
      // also set current marker to null so the "third" click will
      // restart animation and open infowindow
      if (currentMarker !== null && currentMarker == this) {
        currentInfoWindow.close();
        currentInfoWindow = null;
        currentMarker = null;
      } else {
        currentMarker = this;
        populateInfoWindow(this, infowindow, initialPlaces[this.id]);
      }

    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function () {
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function () {
      this.setIcon(defaultIcon);
    });

    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow, placeItem) {
  currentMarker.setAnimation(google.maps.Animation.BOUNCE);
  if (currentInfoWindow != null && currentInfoWindow.getMap() != null) {
    console.log('closing current window');
    currentInfoWindow.close();
    currentInfoWindow = null;
  }

  infowindow.marker = marker;
  var position = '';
  if (typeof placeItem.location == 'function') {
    position = { lat: placeItem.location()[0].lat, lng: placeItem.location()[0].lng };
  } else {
    position = { lat: placeItem.location.lat, lng: placeItem.location.lng };
  }

  infowindow.setPosition(position);
  var flickrAPI = 'https://api.flickr.com/services/restx/?';
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
    var infoWindowImage = '<img src="' + src + '" width="320" alt="' + data.title + '">';
    infowindow.setContent(infoWindowImage);
    currentInfoWindow = infowindow;
    currentInfoWindow.open(map, marker);

    infowindow.addListener('closeclick', function () {
      infowindow.setMarker = null;
      marker.setAnimation(null);
      currentMarker = null;
    });

  }).fail(function () {
    infowindow.setContent('Sorry! Something went wrong & no image was found');
    infowindow.open(map, marker);
  });

}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
  '|40|_|%E2%80%A2',
  new google.maps.Size(21, 34),
  new google.maps.Point(0, 0),
  new google.maps.Point(10, 34),
  new google.maps.Size(21, 34));
  return markerImage;
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    console.log('stop animation');
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function errorHandFunc() {
  console.log('Error!');
  $('#map').html('<p><strong>Uh Oh!</strong> Something/Someone(?) messed up!</p>');
}

function clearBounce() {
  for (i = 0; i < markers.length; i++) {
    markers[i].setAnimation(null);
  }
}

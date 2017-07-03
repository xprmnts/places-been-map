var map;
var markers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {});

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
    marker.addListener('click', function () {
      populateInfoWindow(this, infowindow, initialPlaces[this.id]);
    });

    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

  // Use markerclustererplus community repo to cluster markers if appropriate
  var markerCluster = new MarkerClusterer(map, markers,
    { imagePath: '/images/m' });

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

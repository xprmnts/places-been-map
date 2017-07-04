// Define Place as an object with properties of a place
var Place = function (data) {
  this.name = ko.observable(data.name);
  this.city = ko.observable(data.city);
  this.country = ko.observable(data.country);
  this.continent = ko.observable(data.continent);
  this.tags = ko.observable(data.tags);
  this.location = ko.observableArray([
    data.location,
  ]);
  this.picture = ko.observable(data.picture);
  this.liked = ko.observable(data.liked);
};

// Define City Object
var City = function (data) {
  this.city = ko.observable(data.city);
};

// Define ViewModel
var ViewModel = function () {

  var _this = this;
  this.cities = ko.observable([]);
  this.places = ko.observableArray([]);

  this.showAllPlaces = function () {
    _this.places.removeAll();

    // For each place in list create a list of unique cities to display in filter
    initialPlaces.forEach(function (placeItem) {
      console.log(placeItem.name);

      // Render all places at once when app loads
      _this.places.push(new Place(placeItem));
    });

    // adjust the bounds of the map to fit the newly filtered list of places
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);

    // adjust the zoom to a minimum level of 13 to avoid super zoom
    var zoom = map.getZoom();
    map.setZoom(zoom > 13 ? 13 : zoom);
  };

  // For each place in list create a list of unique cities to display in filter
  initialPlaces.forEach(function (placeItem) {

    // Render all places at once when app loads
    _this.places().push(new Place(placeItem));

    // If city already exist in list don't push current place as a new city
    var match = ko.utils.arrayFirst(_this.cities(), function (item) {
      return placeItem.city === item.city();
    });

    if (!match) {
      _this.cities().push(new City(placeItem));
    }

  }); // End function to create list of unique cities for dropdown filter

  // If a city is clicked in the dropdown render maerkers fo all the associated
  // places and enable its info window
  this.placesByCity = function (cityName) {
    //var markers = [];// Create empty array to hold marker for current city
    _this.places.removeAll();// Clear places observableArray of history

    var infowindow = new google.maps.InfoWindow();

    // Add each place to the places observableArray that fits the current
    // city criteria
    var titles = [];
    initialPlaces.forEach(function (placeItem) {
      if (placeItem.city === cityName.city()) {

        // Push place into places if city criteria matches
        _this.places().push(new Place(placeItem));
        titles.push(placeItem.name);
      }
    });

    // set places observableArray to the newly filtered list of places
    _this.places(_this.places());

    // adjust the bounds of the map to fit the newly filtered list of places
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      if (titles.indexOf(markers[i].title) > 0) {
        bounds.extend(markers[i].getPosition());
      }
    }

    map.fitBounds(bounds);

    // adjust the zoom to a minimum level of 13 to avoid super zoom
    var zoom = map.getZoom();
    map.setZoom(zoom > 13 ? 13 : zoom);
  };

  // When a place is clicked on the navigation menu center the map on it
  // and then open up the infowindow related to it
  this.mapLocation = function (placeItem) {
    // center map on place coordinates
    var plat = placeItem.location()[0].lat;
    var plng = placeItem.location()[0].lng;
    var center = new google.maps.LatLng(plat, plng);
    map.panTo(center);

    // clear infowindow and set marker poisition
    infowindow = new google.maps.InfoWindow({});

    var markerToPop = markers.forEach(function (marker) {
      if (placeItem.name() === marker.title) {
        return marker;
      }
    });

    // using currently clicked place, an empty infowindow and marker associated
    // to place populate the infowindow and show it - this is equivalent to
    // clicking the marker (with the exception of centering the map on coords)
    populateInfoWindow(markerToPop, infowindow, placeItem);
  };

};

ko.applyBindings(new ViewModel());

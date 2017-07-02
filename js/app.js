//TODO: KnockOut
var initialPlaces = [
{
  name: 'Soho',
  city: 'London',
  country: 'United Kingdom',
  continent: 'Europe',
  location: { lat: '51.5131699', lng: '-0.144318515' },
  picture: '',
  liked: 'false',
},
{
  name: 'Eiffel Tower',
  city: 'Paris',
  country: 'France',
  continent: 'Europe',
  location: { lat: '48.8583701', lng: '2.2922926' },
  picture: '',
  liked: 'false',
},
];

var Place = function (data) {
  this.name = ko.observable(data.name);
  this.city = ko.observable(data.city);
  this.country = ko.observable(data.country);
  this.continent = ko.observable(data.continent);
  this.location = ko.observableArray([
    data.location,
  ]);
  this.picture = ko.observable(data.picture);
  this.liked = ko.observable(data.liked);
};

var ViewModel = function () {
  var _this = this;
  this.placeList = ko.observable([]);
  this.places = ko.observableArray([]);
  initialPlaces.forEach(function (placeItem) {
    _this.placeList().push(new Place(placeItem));
  });

  this.placesByCity = function (cityName) {
    _this.places.removeAll();//clear list
    initialPlaces.forEach(function (placeItem) {
      if (placeItem.city === cityName.city()) {
        _this.places().push(new Place(placeItem));
      }
    });

    _this.places(_this.places());
  };

  this.mapLocation = function (placeName) {
    lat = placeName.location()[0].lat;
    lng = placeName.location()[0].lng;
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(14);
    var marker = new google.maps.Marker({
      position: {
        lat: parseFloat(placeName.location()[0].lat),
        lng: parseFloat(placeName.location()[0].lng),
      },
      map: map,
      title: 'Hi!',
    });
    var infowindow = new google.maps.InfoWindow({
      content: 'Test InfoWindow',
    });
    marker.addListener('click', function () {
      var flickrAPI = 'https://api.flickr.com/services/rest/?';
      $.getJSON(flickrAPI, {
        format: 'json',
        nojsoncallback: 1,
        method: 'flickr.photos.search',
        api_key: '853e0dd9b4740b927b87214711cc40f8',
        tags: 'camden, london, market',
        per_page: 1,
        sort: 'relevance',
      }).done(function (data) {
        data = data.photos.photo[0];
        console.log(data);
        var src = 'https://farm' +
        data.farm +
        '.staticflickr.com/' +
        data.server +
        '/' +
        data.id +
        '_' +
        data.secret +
        '.jpg';
        infowindow.setContent('<img src="' + src + '" alt="' + data.title + '">');
        infowindow.open(map, marker);
      }).fail(function (data) {
        console.log('fail');
        console.log(data);
      });
    });
  };

};

ko.applyBindings(new ViewModel());

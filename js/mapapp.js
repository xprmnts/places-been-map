var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 40.7413549,
          lng: -73.99802439999996,
        },
        zoom: 13,
      });
  var tribeca = {
        lat: 40.719526,
        lng: -74.0089934,
      };
  var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: 'First Marker!',
      });
  var infowindow = new google.maps.InfoWindow({
        content: 'Test InfoWindow',
      });
  marker.addListener('click', function () {
        infowindow.open(map, marker);
      }); // we used, 40.7413549, -73.99802439999996 or your own!
}

let addPin = [];
let newArray = [];

// Initializes the Google Maps display
window.initMap = function() {
  console.log('~~~~ initMap fired');
  const centerCoords = { lat: addPin[0][0], lng: addPin[0][1] };
  const startingPos = { zoom: 10, center: centerCoords };
  const map = new google.maps.Map(document.getElementById('map-canvas'), startingPos);

  // this determines that the loop will run for the premade
  if (newArray.length === 0) {
    // This beautiful loop adds multiple markers to the map
    for (i = 0; i < addPin.length; i++) {
      const marker = new google.maps.Marker({
        position: { lat: addPin[i][0], lng: addPin[i][1] },
        map: map,
        icon: "../../assets/images/bar.png",
        title: addPin[i][2]
      });

      marker.addListener('click', zoomOnMarker);
    }
  } else {
    for (i = 0; i < newArray.length; i++) {
      const marker = new google.maps.Marker({
        position: { lat: newArray[i][0], lng: newArray[i][1] },
        map: map,
        icon: "../../assets/images/bar.png",
        title: newArray[i][2]
      });

      marker.addListener('click', zoomOnMarker);
    }
  }
}

function zoomOnMarker() {
  map.setZoom(15);
  map.setCenter(this.getPosition());
}

// Variable to hold the Google Maps script tag
const mapScriptHtml = `<script async defer src="https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS_KEY}&callback=initMap" id="script" class="googlemap-script"></script>`;

// Adds the Google Maps script to the HTML
function addMapToHtml() {
  // if ($('.googlemap-script').length) $('.googlemap-script').remove();
  console.log('~~~~ map added');
  $('body').append(mapScriptHtml);
}

import { API_KEYS } from '../../apiKeys';
import { getMapCoordinates } from '../utils/mapCoordinates';

const MAP_SCRIPT_HTML = `<script async defer src='https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS_KEY}&callback=initMap' id='script' class='googlemap-script'></script>`;

export function displayPremadeMapAndList() {
  $('.wrapper').fadeOut(500, () => {
    initGoogleMapScript();
    $('.premade, .returned-list').fadeIn(500);
  });
}

export function displayBuildYourOwnMapAndList() {
  $('.selectBrew').fadeOut(500, () => {
    initGoogleMapScript();
    $('.checkbox-inline').text('Visited');
    $('input').prop('checked', false);
    $('.premade, .returned-list').fadeIn(500);
  });
}

function initGoogleMapScript() {
  if ($('.googlemap-script').length) return window.initMap();
  $('body').append(MAP_SCRIPT_HTML);
}

window.initMap = () => {
  const markerCoordinates = getMapCoordinates();
  const centerCoords = { lat: markerCoordinates[0][0], lng: markerCoordinates[0][1] };
  const startingPos = { zoom: 10, center: centerCoords };
  const map = new window.google.maps.Map(document.getElementById('map-canvas'), startingPos);

  markerCoordinates.forEach(coordinateArr => {
    const marker = new window.google.maps.Marker({
      position: { lat: coordinateArr[0], lng: coordinateArr[1] },
      map: map,
      icon: 'app/assets/images/bar.png',
      title: coordinateArr[2],
    });

    marker.addListener('click', function() {
      map.setZoom(15);
      map.setCenter(this.getPosition());
    });
  });
};

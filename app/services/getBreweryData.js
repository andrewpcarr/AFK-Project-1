import { API_KEYS } from '../../apiKeys';

export function getBreweryData(callback) {
  $.get(getBreweryUrl())
    .done(response => callback(JSON.parse(response)))
    .fail(error => console.error('AJAX request failed, ', error));
}

function getBreweryUrl() {
  const city = $('#city-input').val();
  return `https://www.brewerydb.com/browse/map/get-breweries?lat=30.267153&lng=-97.74306079999997&radius=25&search=${city}`;
}

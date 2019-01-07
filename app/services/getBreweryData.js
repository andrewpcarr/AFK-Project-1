import { API_KEYS } from '../../apiKeys';

export function getBreweryData(callback) {
  $.get(getBreweryUrl())
    .done(callback)
    .fail(error => console.error('AJAX request failed, ', error));
}

function getBreweryUrl() {
  const city = $('#city-input').val();
  return `http://api.brewerydb.com/v2/locations/?key=${API_KEYS.BREWERY_DB_KEY}&locality=${city}`;
}

import { getBreweryData } from '../services/getBreweryData';
import { updateCoordinatesArray, emptyCoordinatesArray } from '../utils/mapCoordinates';
import { displayPremadeMapAndList } from './googleMaps';

const FADE_TIME = 500;

export function createPremadeList() {
  getBreweryData(breweryData => {
    trimPremadeBreweryListArray(breweryData).forEach(brewery => {
      const latLongName = [brewery.latitude, brewery.longitude, brewery.brewery.name];
      const breweryHtml = getPremadeBreweryListHtml(brewery);
      updateCoordinatesArray(latLongName);
      $('.list-items').append(breweryHtml);
    });

    displayPremadeMapAndList();
  });
}

export function createBuildYourOwnList() {
  getBreweryData(breweryData => {
    $('.wrapper').fadeOut(FADE_TIME, () => $('.selectBrew').fadeIn(FADE_TIME));
    breweryData.data.forEach(brewery => {
      const breweryHtml = getBuildYourOwnBreweryListHtml(brewery);
      $('.listItems').append(breweryHtml);
    });
  });
}

export function addSelectionToUserList() {
  const $this = $(this);
  const $fixed = $('.fixed');
  const latLongName = [Number($this.attr('latitude')), Number($this.attr('longitude')), $this.attr('name')];
  updateCoordinatesArray(latLongName);

  $this.parent('div').fadeOut(750, function() {
    $(this).appendTo('.userList');
  });
  $fixed.fadeIn(FADE_TIME, () => $fixed.fadeOut(2000));
}

export function returnToStartAndEmptyLists() {
  const breweryListSelector = this.id === 'start-over' ? '.selectBrew' : '.premade';
  $(breweryListSelector).fadeOut(FADE_TIME, () => {
    $('.wrapper').fadeIn(FADE_TIME);
    $('.list-items, .listItems, .userList').empty();
    emptyCoordinatesArray();
  });
}

function trimPremadeBreweryListArray(response) {
  const breweryArray = response.data;
  if (breweryArray.length > 20) breweryArray.length = 20;
  return breweryArray;
}

function getPremadeBreweryListHtml(breweryData) {
  return `
    <div class='returned-list'>
      <input id='checker' type='checkbox'>
      <label class='checkbox-inline'>Visited</label>
      <h3 class='headline'><img src='${getImageSrc(breweryData.brewery.images)}' class='img'>${breweryData.brewery.name}</h3>
      ${getWebsiteHtml(breweryData.website)}
    </div>
  `;
}

function getBuildYourOwnBreweryListHtml(breweryData) {
  return `
    <div class='returned-list'>
      <input type='checkbox' id='brewChoice' class='brewChoice' latitude='${breweryData.latitude}' longitude='${breweryData.longitude}' name='${breweryData.brewery.name}'>
      <label class="checkbox-inline">Add to list</label>
      <h3 class="headline"><img src='${getImageSrc(breweryData.brewery.images)}' class="img">${breweryData.brewery.name}</h3>
      ${getWebsiteHtml(breweryData.website)}
    </div>
  `;
}

function getWebsiteHtml(website) {
  return website ? `<a href='${website}' target='_blank'>${website}</a>` : '';
}

function getImageSrc(image) {
  return image ? image.icon : 'app/assets/images/default.png';
}

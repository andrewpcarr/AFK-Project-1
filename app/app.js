import { initBrewGraphic } from './components/brewGraphic';
import { displayBuildYourOwnMapAndList } from './components/googleMaps';
import { updateCoordinatesArray } from './utils/mapCoordinates';
import {
  createPremadeList,
  createBuildYourOwnList,
  addSelectionToUserList,
  returnToStartAndEmptyLists,
} from './components/breweryLists';

// Creates the bizarre graphic at the top welcome screen
initBrewGraphic();

// Scrolls down to CTAs
$('.scroll-down').on('click', () => {
  $('html, body').animate({
    scrollTop: $('section.city-scroll').offset().top,
  }, 'slow');
});

// Builds brewery lists for premade and build-your-own
$('#getPremadeBreweries').on('click', createPremadeList);
$('#getBrewList').on('click', createBuildYourOwnList);
$('#createList').on('click', displayBuildYourOwnMapAndList);

// Add brewery selection to the user-created list
$('.listItems').on('click', '.brewChoice', addSelectionToUserList);

// Returns to the welome screen
$('#start-over, #start-over2').on('click', returnToStartAndEmptyLists);

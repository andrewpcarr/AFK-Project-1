import { API_KEYS } from '../apiKeys';
import { initBrewGraphic } from './components/brewGraphic/brewGraphic';

// Declaring variables for the map
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
    for (let i = 0; i < addPin.length; i++) {
      const marker = new google.maps.Marker({
        position: { lat: addPin[i][0], lng: addPin[i][1] },
        map: map,
        icon: "app/assets/images/bar.png",
        title: addPin[i][2]
      });

      marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(this.getPosition());
      })
    }
  } else {
    for (let i = 0; i < newArray.length; i++) {
      const marker = new google.maps.Marker({
        position: { lat: newArray[i][0], lng: newArray[i][1] },
        map: map,
        icon: "app/assets/images/bar.png",
        title: newArray[i][2]
      });

      marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(this.getPosition());
      });
    }
  }
}

// Click event to bring up build-your-own list
$('.choose-list2').on('click', () => {
  $('.load-screen').fadeOut(500, () => { $('.selectBrew').fadeIn(500); });
});

// Object for myList function
// var detailsStorer = [];

// THIS IS FOR THE PREMADE LIST
$("#getPremadeBreweries").on("click", () => {
  const city = $('#city-input').val();

  $.get(`https://www.brewerydb.com/browse/map/get-breweries?lat=30.267153&lng=-97.74306079999997&radius=25&search=${city}`, (data) => {
    const response = JSON.parse(data);

    for (let i = 0; i < 20; i++) {
      // These put the API responses into the premade list
      if (response.data[i] && response.data[i].brewery) {
        if (typeof response.data[i].brewery.images !== "undefined") {
          img = $('<img>').attr('src', response.data[i].brewery.images.icon).attr('class', 'img');
        } else {
          img = $('<img>').attr('src', 'default.png').attr('class', 'img');
        }
        var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
        var input = $('<input>').attr('id', 'checker').attr('type', 'checkbox').attr('value', 'Visited');
        var label = $('<label></label>').attr('class', 'checkbox-inline').html('Visited');
        var name = $("<h3></h3>").attr("class", "headline").html(response.data[i].brewery.name).prepend(img);
        var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
        var breweryObject = $("<div></div>").attr("class", "returned-list");
        var latLong = [response.data[i].latitude, response.data[i].longitude, response.data[i].brewery.name]
        var img;
        addPin.push(latLong);
        breweryObject.append(input, label, name, website);
        $(".list-items").append(breweryObject);
      }
    }

    displayMap();
  });
});

// Work in progress
// console.log(detailsStorer);

// Triggers the screen switch and addMap function
function displayMap() {
  $('.load-screen').fadeOut(500, () => { $('.premade').fadeIn(500, addMap); });
}

// Variable to hold the Google Maps script tag
const mapAdder = `<script async defer src="https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS_KEY}&callback=initMap" id="script" class="googlemap-script"></script>`;

// Adds the Google Maps script to the HTML
function addMap() {
  console.log('~~~~ map added');
  $('body').append(mapAdder);
}

// Click function for the "build your own list" button
$("#getBrewList").on("click", () => {
  // e.preventDefault();
  const city = $('#city-input').val()
  $.get(`http://api.brewerydb.com/v2/locations/?key=${API_KEYS.BREWERY_DB_KEY}&locality=${city}`, (response) => {

    // });
    // $.ajax({
    //   url: `http://api.brewerydb.com/v2/locations/?key=${API_KEYS.BREWERY_DB_KEY}&locality=${city}`,
    //   method: "GET"
    // }).done(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      console.log(response);

      // These format the API responses into the list
      if (typeof response.data[i].brewery.images != "undefined") {
        img = $('<img>').attr('src', response.data[i].brewery.images.icon).attr('class', 'img');
      } else {
        img = $('<img>').attr('src', 'default.png').attr('class', 'img');
      }
      var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
      var input = $('<input>').attr('type', 'checkbox').attr('value', 'add-to-list').attr('id', 'brewChoice').attr('class', 'brewChoice').attr('latitude', response.data[i].latitude).attr('longitude', response.data[i].longitude).attr('name', response.data[i].brewery.name);
      var label = $('<label></label>').attr('class', 'checkbox-inline').html('Add to list');
      var name = $("<h3></h3>").attr("class", "headline").html(response.data[i].brewery.name).prepend(img);
      var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
      var latLong = [response.data[i].latitude, response.data[i].longitude];
      var breweryObject = $("<div></div>").attr("class", "returned-list").attr('id', 'toggle');
      var img;

      addPin.push(latLong);

      breweryObject.append(input, label, name, website);
      $(".listItems").append(breweryObject);
    }
  });
});

// This click function adds the user choices onto their list and map
$('.listItems').on('click', '#brewChoice', function() {
  const geolocArr = [Number($(this).attr("latitude")), Number($(this).attr("longitude")), $(this).attr("name")];
  newArray.push(geolocArr);

  $(this).parent('div').fadeOut(750, function() { 
    $(this).appendTo('.userList'); 
  });
  $('.fixed').fadeIn(500, () => { $('.fixed').fadeOut(2000); });
});

// This click goes to the user-made list
$('#createList').on('click', showList);

// This function transitions to the user's list
function showList() {
  $('.selectBrew').fadeOut(500, () => { $('.premade').fadeIn(500, addMap); });
  $('.checkbox-inline').html('Visited');
  $('input').prop('checked', false);
  $('.returned-list').fadeIn(1500);
}

// Click function for the scroll button on the load screen
$('.scroll-down').on('click', () => {
  $('html, body').animate({
    scrollTop: $('section.city-scroll').offset().top
  }, 'slow');
});

// Click functions takes you back to the start screen
$('#start-over, #start-over2').on('click', returnToStartAndEmptyLists);
// $('#start-over2').on('click', returnToStartAndEmptyLists);

function returnToStartAndEmptyLists() {
  const breweryListSelector = this.id === 'start-over' ? '.selectBrew' : '.premade';
  $(breweryListSelector).fadeOut(500, () => {
    $('.load-screen').fadeIn(500);
    $('.list-items, .listItems, .userList').empty();
  });
  addPin = [];
  newArray = [];
}

initBrewGraphic();

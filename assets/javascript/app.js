// Declaring variables for the map
var city;
var uluru;
var map;
var marker;
var addPin = [];
var newArray = [];
var location;
var map;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDjhyI-o4hIeBJmMi2PXfv9uCkqzUP3vg0",
  authDomain: "afk-project.firebaseapp.com",
  databaseURL: "https://afk-project.firebaseio.com",
  storageBucket: "afk-project.appspot.com",
  messagingSenderId: "846672298002"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initializes the Google Maps display
var initMap = function() {
  var uluru = { lat: addPin[0][0], lng: addPin[0][1] };
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 10,
    center: uluru
  });

  // this determines that the loop will run for the premade
  if (newArray.length === 0) {
    // This beautiful loop adds multiple markers to the map
    for (i = 0; i < addPin.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: addPin[i][0], lng: addPin[i][1] },
        map: map,
        icon: "bar.png",
        title: addPin[i][2]
      });

      marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(this.getPosition());
      })
    }
  } else {
    for (i = 0; i < newArray.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: newArray[i][0], lng: newArray[i][1] },
        map: map,
        icon: "bar.png",
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
$('.choose-list2').on('click', function() {
  $('.load-screen').fadeOut(500, function() {
    $('.selectBrew').fadeIn(500);
  })
});

// Object for myList function
// var detailsStorer = [];

// THIS IS FOR THE PREMADE LIST
$("#getPremadeBreweries").on("click", function(e) {
  e.preventDefault();
  city = $('#email').val()
  $.ajax({
    url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=" + city,
    method: "GET"
  }).done(function(response) {
    for (var i = 0; i < 20; i++) {

      // Work in progress
      // console.log(response);       
      // var detailsObject = {
      //     elPic: response.data[i].brewery.images, 
      //     nombre: response.data[i].brewery.name, 
      //     elwebsito: response.data[i].website, 
      //     elLatitude: response.data[i].latitude, 
      //     elLongitutde: response.data[i].longitude
      // } 

      // detailsStorer.push(detailsObject);
      // console.log(detailsObject); 

      // These put the API responses into the premade list
      if (typeof response.data[i].brewery.images != "undefined") {
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
      $('#checker').click(function() {
        if (this.checked) {
          database.ref().set({
            storedObject: [i, response.data[i].brewery.name, response.data[i].website],
            storedlatLong: [response.data[i].latitude, response.data[i].longitude, response.data[i].brewery.name]
          });
        }
      });
    }

    displayMap();

  });
});

// Work in progress
// console.log(detailsStorer);

// Triggers the screen switch and addMap function
function displayMap() {
  $('.load-screen').fadeOut(500, function() {
    $('.premade').fadeIn(500);
    setTimeout(addMap, 500);
  });
}

// Variable to hold the Google Maps script tag
var mapAdder = '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNTnfxOvqHInX65qwCMEMsBPtHFj_vtWc&callback=initMap" id="script"></script>';

// Adds the Google Maps script to the HTML
function addMap() {
  $('body').append(mapAdder)
}

// Click function for the "build your own list" button
$("#getBrewList").on("click", function(e) {
  e.preventDefault();
  city = $('#email').val()
  $.ajax({
    url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=" + city,
    method: "GET"
  }).done(function(response) {
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

// Holds temporary lat and long
var geoloc;

// This click function adds the user choices onto their list and map
$('.listItems').on('click', '#brewChoice', function() {

  geoloc = [Number($(this).attr("latitude")), Number($(this).attr("longitude")), $(this).attr("name")];
  newArray.push(geoloc);
  geoloc = '';

  $(this).parent('div').fadeOut(750, function() {
    $(this).appendTo('.userList');
  });

  $('.fixed').fadeIn(500, function() {
    $('.fixed').fadeOut(2000)
  });
});

// This click goes to the user-made list
$('#createList').on('click', function() {
  showList();
});

// This function transitions to the user's list
function showList() {
  $('.selectBrew').fadeOut(500, function() {
    $('.premade').fadeIn(500);
    setTimeout(addMap, 500);
  });
  $('.checkbox-inline').html('Visited');
  $('input').prop('checked', false);
  $('.returned-list').fadeIn(1500);
}

// Click function for the scroll button on the load screen
$(function() {
  $('.scroll-down').click(function() {
    $('html, body').animate({ scrollTop: $('section.ok').offset().top }, 'slow');
    return false;
  });
});

// Click functions takes you back to the start screen
$('#start-over').on('click', function() {
  $('.selectBrew').fadeOut(500, function() {
    $('.load-screen').fadeIn(500);
  });
  $('.list-items').empty();
  $('.listItems').empty();
  $('.userList').empty();
  console.log($("#script"));
  addPin = [];
  newArray = [];
});

$('#start-over2').on('click', function() {
  $('.premade').fadeOut(500, function() {
    $('.load-screen').fadeIn(500);
  });
  $('.list-items').empty();
  $('.listItems').empty();
  $('.userList').empty();
  console.log($("#script"));
  addPin = [];
  newArray = [];
});

// This click function is in progress
// $("#myList").on("click", function() {
//    for (var i = 0; i <= detailsStorer.length; i++) { 
//       if (typeof detailsStorer[i].elPic != "undefined") {
//             img = $('<img>').attr('src', detailsStorer[i].elPic).attr('class', 'img');
//         } else {
//             img = $('<img>').attr('src', 'default.png').attr('class', 'img');
//         }
//         var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
//         var input = $('<input>').attr('type', 'checkbox').attr('value', 'add-to-list').attr('id', 'brewChoice').attr('class', 'brewChoice').attr('latitude', response.data[i].latitude).attr('longitude', response.data[i].longitude).attr('name', response.data[i].brewery.name);
//         var label = $('<label></label>').attr('class', 'checkbox-inline').html('Add to list');
//         var name = $("<h3></h3>").attr("class", "headline").html(detailsStorer[i].nombre);  
//         var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
//         var latLong = [response.data[i].latitude, response.data[i].longitude];
//         var breweryObject = $("<div></div>").attr("class", "returned-list").attr('id', 'toggle');
//         var img;
//     }
// }); 

// $('#myList').on('click', function() {
//     $('.load-screen').fadeOut(500, function() {
//         $('.premade').fadeIn(500);
//     });
// });

// anime.js code for the animation of the landing page
anime({
  targets: 'path',
  strokeDashoffset: function(el) {
    var pathLength = el.getTotalLength();
    el.setAttribute('stroke-dasharray', pathLength);
    return [-pathLength, 0];
  },
  stroke: {
    value: function(el, i) {
      return 'rgb(255,' + i * 8 + ', 0)';
    },
    easing: 'linear',
    duration: 2000,
  },
  strokeWidth: {
    value: 6,
    easing: 'linear',
    delay: function(el, i) {
      return 1200 + (i * 40);
    },
    duration: 800,
  },
  delay: function(el, i) {
    return i * 60;
  },
  duration: 1200,
  easing: 'easeOutExpo',
  loop: true,
  direction: 'alternate'
});

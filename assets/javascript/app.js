// // THIS CHUNK IS AN EXPERIMENT
// $(document).ready(function () { 
//   $('#map-canvas').on('shown', function () { 
//     google.maps.event.trigger(map, 'resize');  
//   });   
// }); 

var city;
// This gets our basic map up and running on the premade list
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


var initMap = function() {
    var uluru = {lat: addPin[0][0], lng: addPin[0][1]};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 10,
      center: uluru
    });

    // this determines that the loop will run for the premade
    if (newArray.length === 0) {
        // This beautiful loop adds multiple markers to the map
        for (i = 0; i < addPin.length; i++) {
            var marker = new google.maps.Marker({
            position: {lat: addPin[i][0], lng: addPin[i][1]},
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
            position: {lat: newArray[i][0], lng: newArray[i][1]},
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
    // THIS PIECE IS AN EXPERIMENT
    // google.maps.event.trigger(map, "resize");
}
// Click event to bring up pre-made list
// $('.choose-list1').on('click', function() {
//     $('.load-screen').fadeOut(1000, function() {
//         $('.premade').fadeIn(1000);
//     });
//     //$('.premade').fadeIn(2000);
// });
// Click event to bring up build-your-own list
$('.choose-list2').on('click', function() {
    $('.load-screen').fadeOut(500, function() {
    $('.selectBrew').fadeIn(500);
    })
});



// ??
function retrieve() {
    var messagesRef = new Firebase("https://the-beer-search-1489024741674.firebaseio.com");
    messagesRef.once('child_added', function (snapshot) {
        var data = snapshot.val();
        var lat = data.latitude;
        var lng = data.longitude;
        var rad = data.radius;
        initMap(lat, lng, rad);
    });
}





// This map function was messing up the display; just commented it out for now
// function initMap(lat, lng, radius) {
//     // Create the map.
//     var latLng = new google.maps.LatLng(lat, lng);
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: latLng
//     });
//     // create the circle
//     var circle = new google.maps.Circle({
//         strokeColor: '#FF0000',
//         strokeOpacity: 0.8,
//         strokeWeight: 2,
//         fillColor: '#FF0000',
//         fillOpacity: 0.35,
//         map: map,
//         center: {
//             lat: lat,
//             lng: lng
//         },
//         radius: parseFloat(radius)
//     });
// }
// Begining of the code for the Beer API
// var queryURL = "http://api.brewerydb.com/v2/search/?key="; 
// var apiKey = "29c36b203d700ec0ec3b05fcd30ec36a";
// var name = "&format=json&q="
// var term = "amber"
// var combinedURL = queryURL + apiKey + name + term;
// console.log(combinedURL);
// // Not sure if we need this code anymore
// //compiles a list of breweries based on the url
// function makeBreweryList() {    
//     var breweryObject = $("<div></div>").attr("class", "returned-list");
//     var name = response.data[1].brewery.name;
//     breweryObject.html(name);
//     console.log(name);
//     $(".list-items").append(breweryObject);
// };
//Object that stores the data 
var detailsStorer = [];
// THIS IS FOR THE PREMADE LIST
$("#getPremadeBreweries").on("click", function(e) {
    e.preventDefault(); 
    city = $('#email').val()
    $.ajax({
        url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=" + city,
        method: "GET"
    }).done(function(response) {
    for (var i = 0; i < 20; i++) {
        console.log(response);       
        var detailsObject = {
            elPic: response.data[i].brewery.images, 
            nombre: response.data[i].brewery.name, 
            elwebsito: response.data[i].website, 
            elLatitude: response.data[i].latitude, 
            elLongitutde: response.data[i].longitude
        } 
        detailsStorer.push(detailsObject);
        console.log(detailsObject);              
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

      //  var timeline = data.timelineList ? data.timelineList[0].name : "not available";
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


console.log(detailsStorer);

// These two functions set the callback to initialize the google maps
function displayMap() {
    // $('.premade').css('display', 'block');
    $('.load-screen').fadeOut(500, function() {
        $('.premade').fadeIn(500);
        // setTimeout(removeMap, 200);
        setTimeout(addMap, 500);
    });
    
}

/* function removeMap() {
    $("#script").remove();
} */ 

var mapAdder = '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNTnfxOvqHInX65qwCMEMsBPtHFj_vtWc&callback=initMap" id="script"></script>';
function addMap() {
    $('body').append(mapAdder)
}
// Code for create-your-own list
// $('.choose-list2').on('click', function() {
//     $('.loadscreen').fadeOut(500, function)
// });
// THIS IS FOR THE USER BUILT LIST
$("#getBrewList").on("click", function(e) {
    e.preventDefault(); 
    city = $('#email').val()
    $.ajax({
        url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=" + city,
        method: "GET"
    }).done(function(response) {
    for (var i = 0; i < response.data.length; i++) {
        console.log(response); 
        
        // These put the API responses into the premade list
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
 var holderArray = [];
 var geoloc;

// This click function adds the user choices onto their list
$('.listItems').on('click', '#brewChoice', function() { 

    geoloc = [Number($(this).attr("latitude")), Number($(this).attr("longitude")), $(this).attr("name")];
    newArray.push(geoloc);
    geoloc = '';

    $(this).parent('div').fadeOut(750, function() {
        $(this).appendTo('.userList');
    });

    $('.fixed').fadeIn(500, function() {
        $('.fixed').fadeOut(2000)
    })
    
    // $(this).next().animate({width: 'toggle'})


    // var lat = Number($(this).attr("latitude"));
    // var long = Number($(this).attr("longitude"));

    // console.log(lat); 
    // console.log(long);
    
    // holderArray.push(lat);
    // holderArray.push(long);
    // console.log(holderArray);
    
    // newArray.push(holderArray);
    // holderArray = [];
    // console.log(holderArray);
    // console.log(newArray); 

})
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
    $('.scroll-down').click (function() {
      $('html, body').animate({scrollTop: $('section.ok').offset().top }, 'slow');
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


  //Starting to get the myList stuff to work.
$("#myList").on("click", function() {

   for (var i = 0; i <= detailsStorer.length; i++) { 

      if (typeof detailsStorer[i].elPic != "undefined") {
            img = $('<img>').attr('src', detailsStorer[i].elPic).attr('class', 'img');
        } else {
            img = $('<img>').attr('src', 'default.png').attr('class', 'img');
        }
        var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
        var input = $('<input>').attr('type', 'checkbox').attr('value', 'add-to-list').attr('id', 'brewChoice').attr('class', 'brewChoice').attr('latitude', response.data[i].latitude).attr('longitude', response.data[i].longitude).attr('name', response.data[i].brewery.name);
        var label = $('<label></label>').attr('class', 'checkbox-inline').html('Add to list');
        var name = $("<h3></h3>").attr("class", "headline").html(detailsStorer[i].nombre);  
        var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
        var latLong = [response.data[i].latitude, response.data[i].longitude];
        var breweryObject = $("<div></div>").attr("class", "returned-list").attr('id', 'toggle');
        var img;

    }
}); 


$('#myList').on('click', function() {
    $('.load-screen').fadeOut(500, function() {
        $('.premade').fadeIn(500);
    });
});

// THIS IS THE ANIME.JS CODE
anime({
  targets: 'path',
  strokeDashoffset: function(el) {
    var pathLength = el.getTotalLength();
    el.setAttribute('stroke-dasharray', pathLength);
    return [-pathLength, 0];
  },
  stroke: {
    value: function(el, i) {
      return 'rgb(255,'+ i * 8 +', 0)'; 
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











// THIS CHUNK IS AN EXPERIMENT
$(document).ready(function () { 
  $('#map-canvas').on('shown', function () { 
    google.maps.event.trigger(map, 'resize');  
  });   
}); 

// This gets our basic map up and running on the premade list
var uluru;
var map;
var marker;
var addPin = [];
var location;

function initMap() {
    var uluru = {lat: 30.2002471, lng: -97.7677763};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 10,
      center: uluru
    });
        // This beautiful loop adds multiple markers to the map
        for (i = 0; i < addPin.length; i++) {
            var marker = new google.maps.Marker({
            position: {lat: addPin[i][0], lng: addPin[i][1]},
            map: map,
            icon: "bar.png"
        });
    }
    // THIS PIECE IS AN EXPERIMENT
    google.maps.event.trigger(map, "resize");
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
    $('.load-screen').fadeOut(1000);
    $('#set-list').fadeIn(2000);
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
var queryURL = "http://api.brewerydb.com/v2/search/?key="; 
var apiKey = "29c36b203d700ec0ec3b05fcd30ec36a";
var name = "&format=json&q="
var term = "amber"
var combinedURL = queryURL + apiKey + name + term;
console.log(combinedURL);

// Not sure if we need this code anymore
//compiles a list of breweries based on the url
function makeBreweryList() {    
    var breweryObject = $("<div></div>").attr("class", "returned-list");
    var name = response.data[1].brewery.name;
    breweryObject.html(name);
    console.log(name);
    $(".list-items").append(breweryObject);
};

// This creates the premade list of breweries
$("#getPremadeBreweries").on("click", function(e) {
    e.preventDefault(); 

    $.ajax({
        url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=austin",
        method: "GET"
    }).done(function(response) {

    for (var i = 0; i < 7; i++) {
        console.log(response); 
        
        // These put the API responses into the premade list
        var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
        var input = $('<input>').attr('type', 'checkbox').attr('value', 'Visited');
        var label = $('<label></label>').attr('class', 'checkbox-inline').html('Visited');
        var name = $("<h3></h3>").attr("class", "headline").html(response.data[i].brewery.name).prepend(img);   
        var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
        var img = $('<img>').attr('src', response.data[i].brewery.images.icon).attr('class', 'img');
        var breweryObject = $("<div></div>").attr("class", "returned-list");
        var latLong = [response.data[i].latitude, response.data[i].longitude]

        addPin.push(latLong);
        breweryObject.append(input, label, name, website);
        console.log(name);
        $(".list-items").append(breweryObject);
        }

        displayMap();
    }); 
});

// These two functions set the callback to initialize the google maps
function displayMap() {
    // $('.premade').css('display', 'block');
    $('.load-screen').fadeOut(500, function() {
        $('.premade').fadeIn(500);
        setTimeout(addMap, 500);
    });
    
}

function addMap() {
    $('body').append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNTnfxOvqHInX65qwCMEMsBPtHFj_vtWc&callback=initMap"></script>')
}
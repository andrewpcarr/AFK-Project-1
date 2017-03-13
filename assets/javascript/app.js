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

function initMap() {
    var uluru = {lat: 39.7214236, lng: -104.9870303};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 10,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
    // THIS PIECE IS AN EXPERIMENT
    google.maps.event.trigger(map, "resize");

}

// Click event to bring up pre-made list
$('.choose-list1').on('click', function() {
    $('.load-screen').fadeOut(1000, function() {
        $('.premade').fadeIn(1000);
    });
    //$('.premade').fadeIn(2000);
});

// Click event to bring up build-your-own list
$('.choose-list2').on('click', function() {
	$('.load-screen').fadeOut(1000);
	$('#set-list').fadeIn(2000);
});


// ??
$(function () {
    $('.list-group.checked-list-box .list-group-item').each(function () {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
    
    $('#get-checked-data').on('click', function(event) {
        event.preventDefault(); 
        var checkedItems = {}, counter = 0;
        $("#check-list-box li.active").each(function(idx, li) {
            checkedItems[counter] = $(li).text();
            counter++;
        });
        $('#display-json').html(JSON.stringify(checkedItems, null, '\t'));
    });
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

/* This map function was messing up the display; just commented it out for now

function initMap(lat, lng, radius) {
    // Create the map.
    var latLng = new google.maps.LatLng(lat, lng);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: latLng
    });
    // create the circle
    var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: {
            lat: lat,
            lng: lng
        },
        radius: parseFloat(radius)
    });
}

*/

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
		url: combinedURL, 
		method: "GET"
	}).done(function(response) {
		console.log(response);
		
	});
	$.ajax({
		url: "http://api.brewerydb.com/v2/locations/?key=29c36b203d700ec0ec3b05fcd30ec36a&locality=denver",
		method: "GET"
	}).done(function(response) {
	for (var i = 0; i < 20; i++) {
		console.log(response); 
		
        // These put the API responses into the premade list
		var number = $("<span></span>").attr("class", "label label-primary number").html(i + 1);
		var input = $('<input>').attr('type', 'checkbox').attr('value', 'Visited');
		var label = $('<label></label>').attr('class', 'checkbox-inline').html('Visited');
		var name = $("<h3></h3>").attr("class", "headline").html(response.data[i].brewery.name).prepend(img);	
		var website = $('<a></a>').attr('href', response.data[i].website).attr('target', '_blank').html(response.data[i].website);
		var img = $('<img>').attr('src', response.data[i].brewery.images.icon).attr('class', 'img');
		var breweryObject = $("<div></div>").attr("class", "returned-list");


		breweryObject.append(input, label, name, website);
		console.log(name);
		$(".list-items").append(breweryObject);
		}
	}); 




});



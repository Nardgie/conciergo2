
var gloablLat;
var globalLon;
var venue;
var map;
var service;
var infowindow;
var venueLat;
var venueLng;
var item;
var userCity;
var globalVenues;
var tiles;

const button = document.getElementById("runaway-btn");

const animateMove = (element, prop, pixels) =>
  anime({
    targets: element,
    [prop]: `${pixels}px`,
    easing: "easeOutCirc",
  });

["mouseover", "click"].forEach(function (el) {
  button.addEventListener(el, function (event) {
    const top = getRandomNumber(window.innerHeight - this.offsetHeight);
    const left = getRandomNumber(window.innerWidth - this.offsetWidth);

    animateMove(this, "left", left).play();
    animateMove(this, "top", top).play();
  });
});

const getRandomNumber = (num) => {
  return Math.floor(Math.random() * (num + 1));
};

//SHOW POSITION FUNCTION showPosition() of the user
function showPosition(data) {
var token = "6417bd03e4fe33";
// API endpoint for geolocation
var apiEndpoint = `https://ipinfo.io/json?token=${token}`;

// Make a request to the API
fetch(apiEndpoint)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    // Log the API response to the console
    // use the data to pull specifics
    gloablLat = data.loc.split(",")[0];
    globalLon = data.loc.split(",")[1];
    userCity = data.city;
    console.log(userCity);
    var latlon = data.loc.split(",");
    console.log(latlon);
    console.log("Latitude: " + gloablLat);
    console.log("Longitude: " + globalLon);
    console.log("Geolocation API Response:", data);
//API request to TicketMaster
    $.ajax({
        type: "GET",
        url:
            "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong=" +
            latlon +
            "&radius=50&unit=miles&size=25",
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            console.log(json.page.totalElements + " events found.");
            initMap(data, json);
            fetchNearbyPlaces(latlon);
            },
            error: function (xhr, status, err) {
            console.log(err);
            },
        });
    })
    .catch(function (error) {
        console.error("Error fetching geolocation data:", error);
    });
}









//DISPLAY EVENT CARDS!!


function displayEventCard(place) {
    // Clear existing card or tile if you want only one at a time
    //   $("#eventCardContainer").empty();
    console.log("Event data received:", place); // Debugging log

    // Check if the necessary properties exist in the event object
    if (!place.geometry || !place.geometry.location || !place.name) {

        console.error("Invalid place data structure:", place);
        return; // Exit if the data structure is not as expected
    }

    var lat = place.geometry.location.lat;
    var lng = place.geometry.location.lng;

    var name = place.name;
    var address = place.formatted_address

    // var cardHtml = `
    //     <div class="tile is-ancestor has-text-centered ">

    //         <div class="tile is-parent">
    //             <article class="tile is-child box" style="background-image: url('${imageUrl}'); background-size: cover;">
    //                     <p class="subtitle">${event.name}</p>
    //                     <p class="subtitle">${venue.name}</p>
    //                     <p class="subtitle">${date}</p>
    //             </article>
    //         </div>
    //     </div>
    //     `;

    // $("#tileContainer").append(cardHtml); // Make sure to have a div with id="eventCardContainer" in your HTML
    // Fetch nearby places
    fetchNearbyBars(lat, lng);
}








//ADD PLACE TO PLAN FUNCTION!!


function addPlaceToPlan(place) {
    console.log("Event data received:", place);

    if (!place.name || !place.vicinity) {
        console.error("Invalid event data structure:", place);
        return; // Exit the function if the data structure is not as expected
    }
}





//   $(document).on("click", ".add", function (e) {

$(document).on("click", ".add.club", function (e) {
    e.preventDefault();
    var placeData = $(this).data("place");

    // var place = JSON.parse(placeData);
    if (placeData) {
        addPlaceToPlan(placeData); // Function to display the event card
        // fetchNearbyPlaces(venueLat, venueLng);
        $(this).text("Added").attr("disabled", true); // Change button text and disable it
        console.log(placeData);
    } else {
        console.error("No event data found for the clicked button.");
    }
        console.log(placeData);
});









//HAVESINE DISTANCE FUNCTION
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distance in meters
    const dInMiles = d / 1609.34; // Convert meters to miles
    return dInMiles;
}








//FETCH!!
//FETCH NEARBY PLACES FUNCTION!!!!!!

function fetchNearbyPlaces(lat, lon, userCity) {
    var apiKey = "F9EC0B209B9C53B8421482D4B8C2F651";

    var request = {
        query: [
        `concert hall in ${userCity}`,
        `music venue in ${userCity}`,
        `stadium in ${userCity}`,
        `arena in ${userCity}`,
        `amphitheater in ${userCity}`,
        `live music in ${userCity}`,
        `event venue in ${userCity}`,
        ].join(", "),
        types: ["concert_hall", "music_venue", "stadium", "parking"].join(
        ", "
        ),
        fields: [
        "name",
        "photos",
        "icon",
        "vicitinty",
        "opening_hours",
        "utc_offset_minutes",
        ]
    };
        service = new google.maps.places.PlacesService(map);

        service.textSearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results = results.filter((place) => place.name !== "Pick up Kia Center");
            
        // Calculate distances and store venues with distances
            var venuesWithDistances = results.map(function (place) {
                        var lat = place.geometry.location.lat();
                        var lng = place.geometry.location.lng();
                        console.log(lat, lng);
                        console.log(place)

                        // if (typeof lat === "Object" && typeof lng === "Object") {
                            var distance = haversineDistance(
                                gloablLat,
                                globalLon,
                                lat, // lat()?
                                lng //lng()??
                            ).toFixed(2);

                            return {
                                place: place,
                                distance: distance,
                            };
                        
            });

        
        // Sort venues by distance
        venuesWithDistances.sort(function (a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        console.log(results);
        console.log(venuesWithDistances);

        venuesWithDistances.forEach(function (item) {
            var place = item.place;
            var name = place.name;
            var address = place.formatted_address;
            var distance = place.distance;
            console.log(distance);
            var icon = place.icon;
            var lat = place.geometry.location.lat;
            var lng = place.geometry.location.lng;
            var photo = place.photos[0].getUrl({maxWidth: 250, maxHeight: 250});
            // var att = place.photos[0].html_attributions[0];
            // if (!photo) {
            //     return;
            // }
            var tileHTML = `
                    <div class="tile has-text-centered is-horizontal is-hidden">
                        <div class="tile is-parent">
                            <article class="tile is-child" style="display: flex; align-items: center; justify-content: center; background-image: url('${photo}'); background-size: cover;" >
                                <button type="submit" class="open add js-modal-trigger"style="display: flex; align-items: center; justify-content: center; background-image: url('${photo}'); background-size: cover;" data-place="${JSON.stringify(place).replace(/'/g, "&apos;")}">
                                    <p class="subtitle is-4">${name}</p>
                                </button>
                            </article>
                            
                        </div>
                    </div>
                    `;
                    console.log(JSON.stringify(place).replace(/'/g, "&apos;"));
            var $grid =  $(tileHTML).appendTo("#venues");
            $grid.find("button.open").data("place", place);

            // document.addEventListener("DOMContentLoaded", () => {
            //     // Suppose you have the center of the page as centerX and centerY
            //     // var centerX = window.innerWidth/2;
            //     // var centerY = window.innerHeight/2;
            //     // var tiles = document.querySelectorAll(".tile.is-horizontal");

            //     // tiles.forEach((tile) => {
            //     //     // Logic to calculate final position goes here
            //     //     // For example, if they are to be spread in a grid:
                    
            //     //     // var tileRect = tile.getBoundingClientRect();
            //     //     // var translateX = tileRect.left - centerX + tileRect.width / 2;
            //     //     // var translateY = tileRect.top - centerY + tileRect.height / 2;
            //     //     // example x-coordinate
            //     //     // tile.style.transform = `translate(${translateX}px, ${translateY}px)`;
            //     // });
            // });


                $(document).on("click", "button.submit", function (e) {
                    e.preventDefault();
                    // var centerX = window.innerWidth / 2;
                    // var centerY = window.innerHeight / 2;
                    
                    $("button.submit").addClass("is-hidden");
                    $(".tile.is-horizontal").removeClass("is-hidden");
    //                 tiles.forEach((tile) => {
    //                     tile.classList.remove("is-hidden");
    //                     var tileRect = tile.getBoundingClientRect();
    //                     var translateX = tileRect.left - centerX + tileRect.width / 2;
    //                     var translateY = tileRect.top - centerY + tileRect.height / 2;

    // // Set CSS variables for the translation
    //                     tile.style.setProperty('--translate-x', `${translateX}px`);
    //                     tile.style.setProperty('--translate-y', `${translateY}px`);

    // // Add the class to start the animation
    //                     tile.classList.add('moveFromCenter');
                    });
                });
                $(document).on("click", "button.delete", function (e) {
                    e.preventDefault();
                    $("#col-2").addClass("is-hidden");
                });
            //   moveToCenter()
            //   console.log(results);
                $(document).on("click", "button.open", function (e) {
                    e.preventDefault();
                    $("#col-2").removeClass("is-hidden");
                    const LatLng = $(this).data("place", item.place.geometry.location);
                    console.log(LatLng);
                    var lat = $(this).data("place", place.geometry.location.lat);
                    var lng = $(this).data("place", place.geometry.location.lng);
                    fetchNearbyBars(lat, lng);
                    console.log(lat);
                    console.log(lng);
                });
    
        // fetchNearbyBars(item.place.geometry.location.lat(), item.place.geometry.location.lng());
        } else {
            console.error("Error fetching nearby places:", status);
        }
        const isOpenNow = place.opening_hours.isOpen();
        if (isOpenNow) {
            console.log("The place is open now");
        }
    });
}
//END OF FETCH NEARBY PLACES FUNCTION!!!!!!

$(document).on("click", "button.add", function (e) {
    e.preventDefault();
    $("#col-2").removeClass("is-hidden");
    console.log(LatLng);
    var lat = $(this).data("place", place.geometry.location.lat());
    var lng = $(this).data("place", place.geometry.location.lng());
    fetchNearbyBars(lat, lng);
});

$(document).on("click", ".add.club", function (e) {
    e.preventDefault();
    var placeData = $(this).data("place", place);

    // var place = JSON.parse(placeData);
    if (placeData) {
        addPlaceToPlan(placeData); // Function to display the event card
        $(this).text("Added").attr("disabled", true); // Change button text and disable it
        console.log(placeData);
    } else {
        console.error("No place data found for the clicked button.");
    }
});




//   function displayPlaces(places) {

function addPlaceToPlan(place) {
    console.log("Place data received:", place);
    if (!place.name || !place.vicinity) {
        console.error("Invalid event data structure:", place);
        return; // Exit the function if the data structure is not as expected
    }
}



//TABLE DISPLAY FUNCTION

function displayPlaces(places) {
    var $placesList = $("#clubs");
    $placesList.empty(); // Clear previous results using jQuery
    places.forEach((place) => {
        var tableHTML = `
        <tr>
            <td>${place.name}</td>
            
            <td><button class="button is-small is-primary add" data-place='${JSON.stringify(place).replace(/'/g,"&apos;")}'>Add To Plan</button></td>
        </tr>
        `
        var $table = $(tableHTML).appendTo("#clubs");
        $table.find(".add").data("place", place);
    });
}




async function fetchNearbyBars(lat, lon) {
    var apiKey = "AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY";
    globalVenues = [];
    var request = {
        location: new google.maps.LatLng(lat, lon),
        radius: "500",
        type: ["bar", "night_club"].join(", "),
        fields: [
        "name",
        "vicinity",
        "rating",
        "opening_hours",
        "utc_offset_minutes",
        ]
    };
    service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            $("#clubs").empty();
            console.log(results);
            displayPlaces(results[i]);
            // Display nearby places
            results.forEach(function (place) {
                if (!globalVenues.find((v) => v.place.name === place.name)) {
                    globalVenues.push(place);
                    console.log(globalVenues);
                    displayPlaces(globalVenues);
                }
            });
        } else {
            console.error("Error fetching nearby places:", status);
        }
        const isOpenNow = place.opening_hours.isOpen();
        if (isOpenNow) {
            console.log("The place is open now");
        }
    });
    
}





//INIT MAP



async function initMap(position, json) {
    var location = new google.maps.LatLng(Math.round(gloablLat),Math.round(globalLon));
    console.log(location);
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, {
        center: { lat: Math.round(gloablLat), lng: Math.round(globalLon) },
        zoom: 11,
    });

    const { LatLng } = await google.maps.importLibrary("core");

    var request = {
      location: location,
      radius: "1000",
      query: [
        `concert hall in ${userCity}`,
        `music venue in ${userCity}`,
        `stadium in ${userCity}`,
        `arena in ${userCity}`,
        `amphitheater in ${userCity}`,
        `live music in ${userCity}`,
      ].join(", "),
      types: ["bar", "restaurant", "nightclub"].join(", "),
      fields: [
        "name",
        "photos",
        "vicinity",
        "rating",
        "opening_hours",
        "utc_offset_minutes",
      ],
    };
    console.log(request);
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();
    service.textSearch(request, callback);

    for (var i = 0; i < json.page.size; i++) {
        addMarker(map, json._embedded.events[i]);
    }
}






//CALLBACK FUNCTION



function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            createPhotoMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
        if (map) {
            map.setCenter(results[0].geometry.location);
        } else {
            console.error("Map is not initialized");
        }
    }
    console.log(results);
}
















function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}








function createPhotoMarker(place) {
    var photos = place.photos;
    if (!photos) {
        return;
    }

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
    });
}





window.initMap = initMap;





function addMarker(map, place) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place._embedded.venues[0].location.latitude, place._embedded.venues[0].location.longitude),
        map: map,
    });

    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
    console.log(marker);
}





// function createPhotoMarker(place) {
//     var photos = place.photos;
//     if (!photos) return;

//     var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location,
//         title: place.name,
//         icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 }),
//     });
// }


showPosition();


//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY

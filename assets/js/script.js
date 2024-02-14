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

// function getLocation() {
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
// }

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

      // var x = document.getElementById("location");
      // x.innerHTML = "Latitude: " + gloablLat +
      // "<br>Longitude: " + globalLon;

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
          //   console.log(response.json)
          var e = document.getElementById("events");
          //   e.innerHTML = " events found";
          //   json.page.totalElements + " events found.";
          //   showPosition();
          showEvents(json);
        //   initMap(data, json);
          //   fetchNearbyPlaces(latlon);
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

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}
var item;

function showEvents(json) {
  // Calculate distances and store events with distance
  var eventsWithDistances = json._embedded.events.map(function (event) {
    var venue = event._embedded.venues[0];
    var distance = haversineDistance(
      gloablLat,
      globalLon,
      venue.location.latitude,
      venue.location.longitude
    ).toFixed(2);
    item = {
      event: event,
      distance: distance,
    };

    return item;
  });

  // Sort events by distance
  eventsWithDistances.sort(function (a, b) {
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  //sort by date
  eventsWithDistances.sort(function (a, b) {
    return (
      new Date(a.event.dates.start.dateTime) -
      new Date(b.event.dates.start.dateTime)
    );
  });

  // Append sorted events to the DOM
  eventsWithDistances.forEach(function (item) {
    var event = item.event;
    var venue = event._embedded.venues[0];
    var distance = item.distance;
    var date = new Date(event.dates.start.dateTime).toLocaleDateString();
    var imageUrl = event.images[1].url;
    var priceRange = "";
    var id = event.id;
    console.log(id);
    if (event.priceRanges && event.priceRanges.length > 0) {
      priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
    } else {
      priceRange = "Price range not available";
    }
    var parkingInfo = venue.parking
      ? venue.parking.summary
      : "Parking information not available";

    var eventHtml = `
            <div class="tile is-parent carousel-item">
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                                <img src="${imageUrl}" alt="${event.name}">
                            </figure>
                    </div>
                    <div class="card-content is-flex-wrap-wrap">
                        <p class="title is-4">${event.name}</p>
                        <p class="subtitle is-6">${distance} Miles away</p>
                        <p class="title is-6">${venue.name}</p>
                        
                        <p class="title is-6">${venue.city.name}, ${venue.state.name}</p>
                        <p class="subtitle is-6">${date}</p>
                    </div>
                    <footer class="card-footer is-centered">
                        <nav class="level is-mobile">
                            <div class="level-item">
                                <span>
                                    <a class="button is-info card-footer-item" href="${event.url}" target="_blank">Get Tickets</a>
                                    <small class="card-footer-item">Price Range: ${priceRange} </small>
                                </span>

                            </div>
                        </nav>
                    </footer>
                </div>
            </div>
        `;
        


    $("#carousel").append(eventHtml);
    
  });

  //init bulma carousel
  bulmaCarousel.attach(".carousel", {
    slidesToShow: 1,
    slidesToScroll: 1,
    duration: 500,
    loop: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    pagination: true,
    navigation: true,
    navigationSwipe: true,
    pauseOnHover: false,
  });

}

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

function initMap(position, json) {
  var mapDiv = document.getElementById("map");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: gloablLat, lng: globalLon },
    zoom: 11,
  });

  for (var i = 0; i < json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }
}

function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      event._embedded.venues[0].location.latitude,
      event._embedded.venues[0].location.longitude
    ),
    map: map,
  });
  marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
  console.log(marker);
}
// var data;

// function getWeather(lat, lon, callback){
//     var apiKey = '9fda455ae9137822224a160754647dd2';
//     var forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

//     var lat = venue.location.latitude
//     var lon = venue.location.longitude

//     fetch(forecastApi)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         // Example of logging the forecast data
//         console.log(data);
//         data.forEach(function(forecastEntry) {
//             // Get the weather description and icon code
//             var weatherDescription = forecastEntry.weather[0].description;
//             var iconCode = forecastEntry.weather[0].icon;

//             // Construct the icon URL using the icon code
//             var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

//             // Create an HTML element to display the weather icon and description
//             var weatherElement = document.createElement('div');
//             weatherElement.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}"> ${weatherDescription}`;

//             // Add the weather element to the DOM where you want to display the forecast
//         });

//         // Extract and display the forecast information here
//         // For instance, you could loop through the list array and create HTML elements to display the forecast
//     });
// }

// // Assuming `forecastData` is the JSON object returned from the API call
// // data.forEach(function(forecastEntry) {
// //     // Get the weather description and icon code
// //     var weatherDescription = forecastEntry.weather[0].description;
// //     var iconCode = forecastEntry.weather[0].icon;

// //     // Construct the icon URL using the icon code
// //     var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

// //     // Create an HTML element to display the weather icon and description
// //     var weatherElement = document.createElement('div');
// //     weatherElement.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}"> ${weatherDescription}`;

// //     // Add the weather element to the DOM where you want to display the forecast
// // });

showPosition();
// getWeather(venue.location.latitude, venue.location.longitude)

//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY

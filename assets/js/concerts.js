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
        //   showEvents(json);
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

// function showEvents(json) {
//   // Calculate distances and store events with distance
//   var eventsWithDistances = json._embedded.events.map(function (event) {
//     var venue = event._embedded.venues[0];
//     var distance = haversineDistance(
//       gloablLat,
//       globalLon,
//       venue.location.latitude,
//       venue.location.longitude
//     ).toFixed(2);
//     item = {
//       event: event,
//       distance: distance,
//     };

//     return item;
//   });

//   // Sort events by distance
//   eventsWithDistances.sort(function (a, b) {
//     return parseFloat(a.distance) - parseFloat(b.distance);
//   });

//   //sort by date
//   eventsWithDistances.sort(function (a, b) {
//     return (
//       new Date(a.event.dates.start.dateTime) -
//       new Date(b.event.dates.start.dateTime)
//     );
//   });

//   // Append sorted events to the DOM
//   eventsWithDistances.forEach(function (item) {
//     var event = item.event;
//     var venue = event._embedded.venues[0];
//     var distance = item.distance;
//     var date = new Date(event.dates.start.dateTime).toLocaleDateString();
//     var imageUrl = event.images[1].url;
//     var priceRange = "";
//     if (event.priceRanges && event.priceRanges.length > 0) {
//       priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
//     } else {
//       priceRange = "Price range not available";
//     }
//     var parkingInfo = venue.parking
//       ? venue.parking.summary
//       : "Parking information not available";

//     var eventHtml = `
//            <div id="app" class="row columns is-multiline">
//           <div v-for="card in cardData" key="card.id" class="column is-4">
//             <div class="card large">
//               <div class="card-image">
//                 <figure class="image is-16by9">
//                   <img src="${imageUrl}" alt="Image">
//                 </figure>
//               </div>
//               <div class="card-content">
//                 <div class="media">
//                   <div class="media-left">
//                     <a><button class="button is-info">Get Your Tickets!</button></a>
//                   </div>
//                   <div class="media-content">
//                     <p class="title is-4 no-padding">${event}</p>
//                     <p>
//                       <span class="title is-6">
//                         <p> ${date} </p> </span> </p>
//                     <p class="subtitle is-6">${venue}</p>
//                   </div>
//                 </div>
//                 <div class="content">
//                     <p>${date}</p>
//                     <p>${venue.name}</p>
//                     <p>${venue.address.line1}</p>
//                     <p>${venue.city.name}, ${venue.state.stateCode}</p>
//                     <p>${distance} miles away</p>
//                     <p>${priceRange}</p>
//                   <div class="background-icon"><span class="icon-twitter"></span></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//         `;



//     $("#events").append(eventHtml);
//   });

  //init bulma carousel
//   bulmaCarousel.attach(".carousel", {
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     duration: 500,
//     loop: true,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     infinite: true,
//     pagination: true,
//     navigation: true,
//     navigationSwipe: true,
//     pauseOnHover: false,
//   });


// function haversineDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth's radius in meters
//   const phi1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
//   const phi2 = (lat2 * Math.PI) / 180;
//   const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
//   const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
//     Math.cos(phi1) *
//       Math.cos(phi2) *
//       Math.sin(deltaLambda / 2) *
//       Math.sin(deltaLambda / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const d = R * c; // Distance in meters
//   const dInMiles = d / 1609.34; // Convert meters to miles
//   return dInMiles;
// }

// function initMap(position, json) {
//   var mapDiv = document.getElementById("map");
//   var map = new google.maps.Map(mapDiv, {
//     center: { lat: gloablLat, lng: globalLon },
//     zoom: 11,
//   });

//   for (var i = 0; i < json.page.size; i++) {
//     addMarker(map, json._embedded.events[i]);
//   }
// }

// function addMarker(map, event) {
//   var marker = new google.maps.Marker({
//     position: new google.maps.LatLng(
//       event._embedded.venues[0].location.latitude,
//       event._embedded.venues[0].location.longitude
//     ),
//     map: map,
//   });
//   marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
//   console.log(marker);
// }


showPosition();
// getWeather(venue.location.latitude, venue.location.longitude)

//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY

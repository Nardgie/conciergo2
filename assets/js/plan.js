

$(document).ready(function () {
    var gloablLat;
    var globalLon;
    var venue;
    var map;
    var service;
    var infowindow;
    var venueLat;
    var venueLng;

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
                    url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong=" + latlon + "&radius=50&unit=miles&size=25",
                    async: true,
                    dataType: "json",
                    success: function (json) {
                        console.log(json);
                        console.log(json.page.totalElements + " events found.");
                        // console.log(response.json)
                        var e = document.getElementById("events");
                        // e.innerHTML = " events found";
                        // json.page.totalElements + " events found.";
                        // showPosition();
                        showEvents(json);
                        // initMap(data, json);
                    },
                    error: function (xhr, status, err) {
                        console.log(err);
                    }
                });
            })
            .catch(function (error) {
                console.error('Error fetching geolocation data:', error);
            });

    }


    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }
    var item;
    // function addPlan() {
    //     $(document).on("click", ".add", function (event) {
    //         var eventData = {
    //           date:
    //             event.dates && event.dates.start
    //               ? new Date(event.dates.start.dateTime).toLocaleDateString()
    //               : null,
    //           name: event.name ? event.name : null,
    //           venue: event.venue,
    //           images:
    //             event.images && event.images.length > 0
    //               ? event.images[0].url
    //               : null,
    //           _embedded: event._embedded,
    //         };
    //         // var event = JSON.parse(JSON.stringify(eventData)); 
    //         $(this).data("eventData", eventData);

    //         // if (e.target.className === 'button') {
    //         //     console.log("button clicked");
    //         // }
    //         // if (eventString) {
    //         //     try {
    //         //     var event = JSON.parse(eventString); // Parse the string back into a JavaScript object
    //         //     // ... rest of your event handling code ...
    //         //     } catch (error) {
    //         //     console.error("Error parsing JSON:", error);
    //         //     }
    //         // } else {
    //         //     console.error("No data-event attribute found on the button.");
    //         // }
    //         // console.log(event); // Log the event object to the console
    //         var venue = event.venue;
    //         var date = event.dates && event.dates.start ? new Date(event.dates.start.dateTime).toLocaleDateString() : null;
    //         var images = event.images && event.images.length >  0 ? event.images[0].url : null;

    //         var tileHTML = `
    //                     <div class="tile is-parent">
    //                                 <article class="tile is-child box">
    //                                     <div class="media-content">
    //                                         <div class="content">
    //                                             <p class="title">${event}</p>
    //                                             <p class="subtitle">${venue}</p>
    //                                         </div>
    //                                     </div>
    //                                 </article>
    //                             </div>`;

    //         $(".info-tiles .is-ancestor").append(tileHTML);
    //         console.log(eventData);
    //     });
    // }

    function showEvents(json) {
        // Calculate distances and store events with distance
        var eventsWithDistances = json._embedded.events.map(function (event) {
            var venue = event._embedded.venues[0];
            var distance = haversineDistance(gloablLat, globalLon, venue.location.latitude, venue.location.longitude).toFixed(2);
            item = {
                event: event,
                distance: distance
            }


            return item;
        });

        // Sort events by distance
        eventsWithDistances.sort(function (a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        //sort by date
        eventsWithDistances.sort(function (a, b) {
            return new Date(a.event.dates.start.dateTime) - new Date(b.event.dates.start.dateTime);
        });

        // $(document).on("click", ".add", function (e) {
        //     e.preventDefault();
        //     var eventData = $(this).data("event");
        //     // //     // var eventsString = JSON.stringify(event);
        //     //     var item = JSON.parse(JSON.stringify(event)); // Retrieve the event object from the data attribute
        //     // //     // if (e.target.className === "button") {
        //     // //     //     console.log("button clicked");
        //     // //     // }
        //     // //     // if (eventString) {
        //     // //     //     try {
        //     // //     //     var event = JSON.parse(eventString); // Parse the string back into a JavaScript object
        //     // //     //     // ... rest of your event handling code ...
        //     // //     //     } catch (error) {
        //     // //     //     console.error("Error parsing JSON:", error);
        //     // //     //     }
        //     // //     // } else {
        //     // //     //     console.error("No data-event attribute found on the button.");
        //     // //     // }
        //     // //     console.log(item); // Log the event object to the console
        //     //     var venue = item._embedded.venues[0];
        //     //     var date = new Date(item.dates.start.dateTime).toLocaleDateString();
        //     //     var imageUrl = item.images[1].url;
        // if (eventData) {
        // // Clear existing tiles

        //     var tileHTML = `
        //     <div class="tile is-parent">
        //         <div class="card">
        //             <div class="card-image">
        //                 <figure class="image is-4by3">
        //                 </figure>
        //             </div>
        //             <div class="card-content is-flex-wrap-wrap">
        //                 <p class="title is-4">${event.name}</p>
        //                 <p class="title is-6">${venue.name}</p>
                        
        //                 <p class="title is-6">${venue.city.name}, ${venue.state.name}</p>
        //                 <p class="subtitle is-6">${date}</p>
        //             </div>
        //             <footer class="card-footer is-centered">
        //                 <nav class="level is-mobile">
        //                     <div class="level-item">
        //                         <span>
        //                             <a class="button is-info card-footer-item" href="${event.url}" target="_blank">Get Tickets</a>
        //                             <small class="card-footer-item">Price Range: ${priceRange} </small>
        //                         </span>

        //                     </div>
        //                 </nav>
        //             </footer>
        //         </div>
        //     </div>
        //                         `;

        //     $("#events").append(tileHTML);

        // // Create the tile HTML using the event data
        
        //     } else {
        // console.error("No event data found for the clicked button.");
        // }
        // });
            
            
        

        // Append sorted events to the DOM
        eventsWithDistances.forEach(function (item) {
            var event = item.event;
            console.log(event);
            var venue = event._embedded.venues[0];
            // console.log(venue);
            var distance = item.distance;
            var date = new Date(event.dates.start.dateTime).toLocaleDateString();
            var imageUrl = event.images[1].url;
            var priceRange = '';
            if (event.priceRanges && event.priceRanges.length > 0) {
                priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
            } else {
                priceRange = 'Price range not available';
            }
            var parkingInfo = venue.parking ? venue.parking.summary : 'Parking information not available';
            // <td>${venue.city.name}, ${venue.state.name}</p>
            var eventHtml = `
                        <tr class="card-content is-flex-wrap-wrap">
                            <td>${event.name}</td>
                            
                            <td>${venue.name}</td>
                            
                            
                            <td>${date}</td>
                            <td>${distance} Miles away</td>
                            <td class="level-right"><button class="button is-small is-primary add" data-event='${JSON.stringify(event
                            ).replace(/'/g,
                            "&apos;")}'>Add To Plan</button></td>
                        </tr>
            `;

            // console.log(JSON.stringify(event));
            // console.log(JSON.parse(JSON.stringify(event)));

            // <article class="media">
            //     <figure class="media-left">
            //         <p class="image is-128x128">
            //             <img src="${imageUrl}" alt="${event.name}">
            //         </p>
            //     </figure>
            //     <div class="media-content">
            //         <div class="content">
            //             <p>
            //                 <strong>${event.name}</strong><br>
            //                 <small>${venue.name}, ${venue.city.name}</small><br>
            //                 <small>${distance} Miles away</small><br>
            //                 <small>${date}</small><br>
            //                 <small>Price Range: ${priceRange}</small><br>
            //                 <small>${parkingInfo}</small>
            //             </p>
            //         </div>
            //         <nav class="level is-mobile">
            //             <div class="level-right">
            //                 <a class="button is-info" href="${event.url}" target="_blank">Get Tickets</a>
            //             </div>
            //         </nav>
            //     </div>
            // </article>`;
            // $(".add").on("click", addPlan);


            var $eventRow = $(eventHtml).appendTo("#concerts");
            $eventRow.find(".add").data("event", event);
            // $("tbody").append(eventHtml);
            

            // $("button.add").on("click", function() {
            //         var event = item.event; // Assuming each button has a data-event attribute with the event object
            //         var venue = event._embedded.venues[0];
            //         var date = new Date(event.dates.start.dateTime).toLocaleDateString();
            //         var imageUrl = event.images[1].url;

            //         var tileHTML = `
            //         <div class="tile is-parent">
            //                     <article class="tile is-child box">
            //                         <div class="media-content">
            //                             <div class="content">
            //                                 <p class="title">${event.name}</p>
            //                                 <p class="subtitle">${venue.name}</p>
            //                             </div>
            //                         </div>
            //                     </article>
            //                 </div>`;

            //         $(".info-tiles .tile").append(tileHTML);
            //         console.log(event);
            //     })
            // $(document).ready(function () {
            // Use event delegation to handle clicks on dynamically added buttons

            // });


        });
        $(document).on("click", ".add", function (e) {
          e.preventDefault();
          var eventData = $(this).data("event");
          //Change the class of col-2 from is-hidden to is-visible
          $("#col-2").removeClass("is-hidden");
          $("#planH1", "#planH2").addClass("is-hidden");
          $("#planH1").addClass("is-hidden");
        //   var placeData = $(this).data("place");
          if (eventData) {
            displayEventCard(eventData); // Function to display the event card
            $(this).text("Added").attr("disabled", true); // Change button text and disable it
            console.log(eventData);
          } else {
            console.error("No event data found for the clicked button.");
          }

          //For Place Data
        //   if (placeData) {
        //     displayEventCard(placeData); // Function to display the event card
        //     $(this).text("Added").attr("disabled", true); // Change button text and disable it
        //     console.log(placeData);
        //   } else {
        //     console.error("No event data found for the clicked button.");
        //   }
        });
    }

//  DISPLAY EVENT CARD: PLACES CARD IN TILE ABOVE

    function displayEventCard(event) {
      // Clear existing card or tile if you want only one at a time
      //   $("#eventCardContainer").empty();
      console.log("Event data received:", event); // Debugging log

      // Check if the necessary properties exist in the event object
      if (
        !event._embedded ||
        !event._embedded.venues ||
        !event._embedded.venues[0]
      ) {
        console.error("Invalid event data structure:", event);
        return; // Exit the function if the data structure is not as expected
      }

      var venue = event._embedded.venues[0];

      var venue = event._embedded.venues[0];
      var date = new Date(event.dates.start.dateTime).toLocaleDateString();
      var imageUrl = event.images[1].url;
      var priceRange = event.priceRanges
        ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
        : "Price range not available";

      venueLat = event._embedded.venues[0].location.latitude;
      venueLng = event._embedded.venues[0].location.longitude;

     

      var cardHtml = `
        <div class="tile is-ancestor has-text-centered ">

            <div class="tile is-parent">
                <article class="tile is-child box" style="background-image: url('${imageUrl}'); background-size: cover;">
                        <p class="subtitle">${event.name}</p>
                        <p class="subtitle">${venue.name}</p>
                        <p class="subtitle">${date}</p>
                </article>
            </div>
        </div>
        `;

        

      $("#tileContainer").append(cardHtml); // Make sure to have a div with id="eventCardContainer" in your HTML
      // Fetch nearby places
        fetchNearbyPlaces(venueLat, venueLng);
    }

    $("#view-all").on("click", function () {
        $(".event-card .card-table").attr("style", "overflow: visible");
    });



function displayPlaces(Parr) {
  // places.preventDefault();
  // var placesList = document.getElementById('placesList');
  // placesList.innerHTML = ''; // Clear previous results

  Parr.forEach(function (place) {
    
    var createEventTableHTML = `
            
            <tr class="card-content is-flex-wrap-wrap">
                <td>${place.name}</td>
                <td>${place.vicinity}</td>
                <td>${place.rating}</td>
                <td class="level-right"><button class="button is-small is-primary add club" data-place='${JSON.stringify(
                  place
                ).replace(/'/g, "&apos;")}'>Add To Plan</button></td>
            </tr>`;

    var $clubRow = $("#clubs").append(createEventTableHTML);
    $clubRow.find(".add").data("place", place);
  });
}





    function addPlaceToPlan(place) {
        console.log("Place data received:", place);
        if (
          !place.name) {
          console.error("Invalid event data structure:", place);
          return; // Exit the function if the data structure is not as expected
        }
        var name = place.name;
        var vicinity = place.vicinity;
        var rating = place.rating;

        var photo = place.photos[0].getUrl({maxWidth: 250, maxHeight: 250});
        if (!photo) {
            console.error("No photo found for the place:", place);
            return;
        }


        // Add place to plan
        clubTileHtml = `
        <div class="tile is-ancestor has-text-centered ">

            <div class="tile is-parent">
                <article class="tile is-child box" style="background-image: getUrl("${photo}"); baclground-size: cover;">
                        <p class="subtitle">${name}</p>
                        <p class="subtitle">${vicinity}</p>
                        <p class="subtitle">${rating}</p>
                </article>
            </div>
        </div>
        `;
            $("#tileContainer").append(clubTileHtml);
    }
    $(document).off("click", ".add.club").on("click", ".add.club", function (e) {
        e.preventDefault();
        var placeData = $(this).data("place");

        // var place = JSON.parse(placeData);
        if (placeData) {
            addPlaceToPlan(placeData); // Function to display the event card
            $(this).text("Added").attr("disabled", true); // Change button text and disable it
            console.log(placeData);
        } else {
            console.error("No event data found for the clicked button.");
        }
        console.log(placeData);
        });

    function haversineDistance(lat1, lon1, lat2, lon2) {
                const R = 6371e3; // Earth's radius in meters
                const phi1 = lat1 * Math.PI / 180; // Convert degrees to radians
                const phi2 = lat2 * Math.PI / 180;
                const deltaPhi = (lat2 - lat1) * Math.PI / 180;
                const deltaLambda = (lon2 - lon1) * Math.PI / 180;

                const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                    Math.cos(phi1) * Math.cos(phi2) *
                    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const d = R * c; // Distance in meters
                const dInMiles = d / 1609.34; // Convert meters to miles
                return dInMiles;
            }

    async function fetchNearbyPlaces(lat, lon) {
        var arr = [];
        var mapDiv = document.getElementById("map");
        map = new google.maps.Map(mapDiv, {
          center: { lat: Math.round(gloablLat), lng: Math.round(globalLon) },
          zoom: 11,
        });
        var apiKey = "AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY";

        var request = {
            location: new google.maps.LatLng(lat, lon),
            radius: "500",
            type: ["bar"],
            fields: [
            "name",
            "vicinity",
            "rating",
          
            ],
        };
        var i;
        service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, function callback (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                
            console.log(results);
            for (i = 0; i < results.length; i++) {
                arr.push(results[i]);
            }
            // Display nearby places
            displayPlaces(arr);
            } else {
            console.error("Error fetching nearby places:", status);
            }
            // results.forEach((result)=>{ 
            //     const isOpenNow = result.opening_hours.isOpen(result);
            //         if (isOpenNow) {
            //         console.log("The place is open now");
            //     }

            // })
            
        });
    }

    

    
    // function initMap(position, json) {
    //     var location = new google.maps.LatLng(venueLat, venueLng);
    //             var mapDiv = document.getElementById('map');
    //             map = new google.maps.Map(mapDiv, {
    //                 center: { lat: gloablLat, lng: globalLon },
    //                 zoom: 11
    //             });
       
    //             var request = {
    //               location: location,
    //               radius: "500",
    //               type: ["restaurant"],
    //               fields: [
    //                 "name",
    //                 "vicinity",
    //                 "rating",
    //                 "opening_hours",
    //                 "utc_offset_minutes",
    //               ]
    //             };
    //             console.log(request);
    //             service = new google.maps.places.PlacesService(map);
    //             service.nearbySearch(request, callback);

    //             for (var i = 0; i < json.page.size; i++) {
    //                 addMarker(map, json._embedded.events[i]);
    //             }
    //         }

            // function callback(results, status) {
            //     if (status == google.maps.places.PlacesServiceStatus.OK) {
            //         for (var i = 0; i < results.length; i++) {
            //             createMarker(results[i]);
            //         }
            //         map.setCenter(results[0].geometry.location);
            //         if (map) {
            //             map.setCenter(results[0].geometry.location);
            //         } else {
            //             console.error("Map is not initialized");
            //         }
            //     }

            //     console.log(results);
            // }

    //         function createMarker(place) {
    //             if (!place.geometry || !place.geometry.location) return;

    //             var marker = new google.maps.Marker({
    //                 map: map,
    //                 position: place.geometry.location
    //             });

    //             google.maps.event.addListener(marker, 'click', function () {
    //                 infowindow.setContent(place.name || '');
    //                 infowindow.open(map);
    //             });
    //         }

    // window.initMap = initMap;


    // function addMarker(map, event) {
    //             var marker = new google.maps.Marker({
    //                 position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    //                 map: map
    //             });
    //             marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    //             console.log(marker);
    //         }
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
});

// getWeather(venue.location.latitude, venue.location.longitude)





//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY


// //init bulma carousel
// bulmaCarousel.attach(".carousel", {
//     slidesToShow:  1,
//     slidesToScroll:  1,
//     duration: 500,
//     loop: true,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     infinite: true,
//     pagination: true,
//     navigation: true,
//     navigationSwipe: true,
//     pauseOnHover: false
// });

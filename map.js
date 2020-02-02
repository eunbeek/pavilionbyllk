// var map, infoWindow;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     zoom: 6
//   });
//   infoWindow = new google.maps.InfoWindow;

//   // Try HTML5 geolocation.
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };

//       infoWindow.setPosition(pos);
//       infoWindow.setContent('Current Location');
//       infoWindow.open(map);
//       map.setCenter(pos);
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
//   }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
//   infoWindow.open(map);
// }

// function getUsersNearby() {
//   Radar.setUserId("test");
//   Radar.trackOnce((status, location, user, events) => {
//       const url = "https://api.radar.io/v1/geofences/venue/1";
//       if (status === Radar.STATUS.SUCCESS) {
//         let data = {
//           "live": true,
//           "description": "user's location",
//           "type": "circle",
//           "coordinates": user.location.geometry.coordinates,
//           "radius": 50
//         }
//         const request = new Request(url, {
//     			method: 'PUT',
//     			body: JSON.stringify(data),
//     			headers: {
//     				'Accept': 'application/json, text/plain, */*',
//     				'Content-Type': 'application/json'
//     			},
//     		});

//     		// Send the request
//     		fetch(request)
//     			.then((res) => {
//     				//// Do not write any code here
//     				// Logs success if server accepted the request
//     				//   You should still check to make sure the blocking was saved properly
//     				//   to the text files on the server.
//     				console.log('Success')
//     				return res.json()
//     				////
//     			})
//     			.then((jsonResult) => {
//     				// Although this is a post request, sometimes you might return JSON as well
//     				console.log('Result:', jsonResult)

//     			}).catch((error) => {
//     				// if an error occured it will be logged to the JavaScript console here.
//     				console.log("An error occured with fetch:", error)
//     			})
//     	}
//   });
//}

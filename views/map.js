function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function getUsersNearby() {
 // Radar.setUserId("test");
  Radar.trackOnce((status, location, user, events) => {
      const url = "https://api.radar.io/v1/geofences/venue/1";
     // if (status === Radar.STATUS.SUCCESS) {
       if(true){
        let data = {
          "live": true,
          "description": "user's location",
          "type": "circle",
          "coordinates": user.location.geometry.coordinates,
          "radius": 50 };
          
        const request = new Request(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            });
            let temp = [];
                        // Send the request
                        fetch(request)
                            .then((res) => {
                              res.json();
                            })
                            .then((jsonResult) => {
                                // Although this is a post request, sometimes you might return JSON as well
                                temp = jsonResult;

                            }).catch((error) => {
                                // if an error occured it will be logged to the JavaScript console here.
                                console.log("An error occured with fetch:", error)
                            })
                    }
              });
            }

	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM

const listing = require("../../models/listing");

	// https://account.mapbox.com
    let mapToken = mapToken // public api key 
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v-12', 
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const marker = new mapboxgl.Marker()
    .setLngLat([coordinates]) //coming from show.ejs script atg
    .setPopup(new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
    .setHTML(`<h4>${location}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);
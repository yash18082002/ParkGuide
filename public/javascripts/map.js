mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parkmap.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(parkmap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${parkmap.title}</h3>`
            )
    )
    .addTo(map)
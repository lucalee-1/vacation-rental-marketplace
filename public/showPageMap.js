mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: rental.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker2 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(rental.geometry.coordinates)
  .addTo(map);

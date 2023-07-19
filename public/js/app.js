import { OpenStreetMapProvider } from 'leaflet-geosearch';
import assistance from './assistance.js';
import deleteComment from './deleteComment.js';

// Get data from db
const geoApiKey = process.env.GEOAPIFY_API_KEY;
const lat = document.querySelector('#lat')?.value || 37.770679;
const lng = document.querySelector('#lng')?.value || -122.47059;
const address = document.querySelector('#address').value || '';
// add to leaflet
const map = L.map('map').setView([lat, lng], 17)
let markers = new L.FeatureGroup().addTo(map);
let marker;
// put marker for the edition view
if( lat && lng ){
    map.setView([lat, lng], 17 );
    marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    }).addTo(map).bindPopup(address).openPopup();
    markers.addLayer(marker);
    marker.on('moveend', function(e) {
        marker = e.target;
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng));
        // reverse
        const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${geoApiKey}`;
        fetch(reverseGeocodingUrl).then(result => result.json())
        .then(featureCollection => {
          const foundAddress = featureCollection.features[0];
          fillInput(foundAddress);
          marker.bindPopup(`${foundAddress.properties.address_line1}, ${foundAddress.properties.city}`);
        });
    })
}
document.addEventListener('DOMContentLoaded', () => {
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="#">PartySeeker</a>'
}).addTo(map);
const seeker = document.querySelector('#seeker-input');
seeker.addEventListener('input', searchLocation)
});
const searchLocation= function(e){
    if (marker) {
        marker.remove();
      }
    if(e.target.value.length > 8){
        // If pin exist
        markers.clearLayers();
        // Use provider
        const provider = new OpenStreetMapProvider();
            provider.search({query: e.target.value}).then((r)=>{
                if(r.length === 0){
                    return map.setView([lat, lng], 17)
                /* marker = L.marker([lat, lng], {
                    draggable: true,
                    autoPan: true,
                }).addTo(map) */
                } else {

                let ltlg = r[0].bounds[1];

                // Reverse
                const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${ltlg[0]}&lon=${ltlg[1]}&apiKey=${geoApiKey}`;
                fetch(reverseGeocodingUrl).then(result => result.json())
                .then(featureCollection => {
                  const foundAddress = featureCollection.features[0];
                  fillInput(foundAddress);
                });
                // Show map
                map.setView(ltlg, 17 );
                // Add marker
                marker = L.marker(ltlg, {
                    draggable: true,
                    autoPan: true,
                }).addTo(map).bindPopup(r[0].label).openPopup();
                markers.addLayer(marker);


                // Detect marker position
                marker.on('moveend', function(e) {
                    marker = e.target;
                    const position = marker.getLatLng();
                    map.panTo(new L.LatLng(position.lat, position.lng));
                    // reverse
                    const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${geoApiKey}`;
                    fetch(reverseGeocodingUrl).then(result => result.json())
                    .then(featureCollection => {
                      const foundAddress = featureCollection.features[0];
                      fillInput(foundAddress);
                      marker.bindPopup(`${foundAddress.properties.address_line1}, ${foundAddress.properties.city}`);
                    });
                })
            }
        })
    }
}


function fillInput(foundAddress) {
    /* console.log(foundAddress); */
    document.querySelector('#address').value = foundAddress.properties.address_line1 || '';
    document.querySelector('#city').value = foundAddress.properties.city || '';
    document.querySelector('#state').value = foundAddress.properties.state || '';
    document.querySelector('#country').value = foundAddress.properties.country || '';
    document.querySelector('#lat').value = foundAddress.properties.lat || '';
    document.querySelector('#lng').value = foundAddress.properties.lon || '';
}

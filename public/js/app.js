import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat= 37.770679;
const lng = -122.47059;
// add to leaflet
const map = L.map('map').setView([lat, lng], 17)
let markers = new L.FeatureGroup().addTo(map);
let marker;
document.addEventListener('DOMContentLoaded', () => {
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="#">PartySeeker</a>'
}).addTo(map);
const seeker = document.querySelector('#seeker-input');
seeker.addEventListener('input', searchLocation)
})
const searchLocation= function(e){
    if(e.target.value.length > 8){
        // If pin exist
        markers.clearLayers();
        // Use provider
        const provider = new OpenStreetMapProvider();
        provider.search({query: e.target.value}).then((r)=>{
            if(r.length === 0){
                console.log(r)
                return map.setView([lat, lng], 17),
                marker = L.marker([lat, lng], {
                    draggable: true,
                    autoPan: true,
                }).addTo(map)
            } else {
            let ltlg = r[0].bounds[0];
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
            })
        }
        })
    }
}
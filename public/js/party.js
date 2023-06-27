document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#party-location')){
        showMap();
    }
});

const lat = document.querySelector('#lat').value || 37.770679;
const lng = document.querySelector('#lng').value || -122.47059;
const address = document.querySelector('#address').value || '';


function showMap() {

    var map = L.map('party-location').setView([lat, lng], 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="#">PartySeeker</a>'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
    .bindPopup(address)
    .openPopup();
}

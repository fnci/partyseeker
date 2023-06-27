import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const assistance = document.querySelector('#confirm-assistance');
    if(assistance) {
        assistance.addEventListener('submit', confirmAssistance);
    }
});

function confirmAssistance(e){
    e.preventDefault();
    const btn = document.querySelector('#confirm-assistance input[type="submit"]');
    let check = document.querySelector('#check').value;
    const message = document.querySelector('#message');
    // Clean previous response message
    while(message.firstChild){
        message.removeChild(message.firstChild);
    }
    // Get hidden value

    const data = {
        check
    }
    axios.post(this.action, data).then(response => {
        const responseData = document.createTextNode(response.data);
        if(check === 'confirm'){
            // Modify elements on the button
            document.querySelector('#check').value = 'cancel';
            btn.value = 'Nope';
            btn.classList.remove('btn-blue');
            btn.classList.add('btn-red');
        }else{
            document.querySelector('#check').value = 'confirm';
            btn.value = 'Yeah';
            btn.classList.remove('btn-red');
            btn.classList.add('btn-blue');
        }
        // Show message
        message.appendChild(responseData);
    });
}
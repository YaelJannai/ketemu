document.addEventListener('DOMContentLoaded', onloadfn, false);

function onloadfn() {
    console.log('questions onload');
    var data = JSON.parse(httpGet('/sign_up'));
    document.getElementById('name').value = data.name;
    document.querySelector('#user-details > h2').innerHTML = 'היי ' + data.name.split(' ')[0] + '!';
};
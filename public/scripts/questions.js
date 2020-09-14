document.addEventListener('DOMContentLoaded', onloadfn, false);

function onloadfn() {
    console.log('questions onload');
    var data = JSON.parse(httpGet('/sign_up'));
    document.getElementById('name').value = data.name;
};
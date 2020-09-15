document.addEventListener('DOMContentLoaded', onloadfn, false);

function onloadfn() {
    console.log('questions onload');
    var data = JSON.parse(httpGet('/sign_up'));
    document.getElementById('name').value = data.name;
    document.getElementById('user-details').children[0].innerHTML = 'היי ' + data.name.split(' ')[0] + '!<BR>הנה כמה שאלות כדי שנוכל להכיר טוב יותר :)';
};
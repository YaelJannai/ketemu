// ==UserScript==
// @name         Jitsi modifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Edit Jitsi client for our hackbgu2020 hackathon
// @author       You
// @match        */hackbgu2020/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

let bUpdatedUserTexts = false;

(function() {
    'use strict';

    let stylesIntervalID = setInterval(setStyles, 500);

    setTimeout(() => {
//         $('.displayname').each(function(i,x) {
//             //x.innerHTML += '<BR>לומד עיצוב קרמי וזכוכית<BR>אוהב עוגיות<BR>מתכנת<BR>🍪';
//             console.log(localStorage.getItem('myCat'));
//         });

        clearInterval(stylesIntervalID);
        console.log('stopped updating styles');
    }, 15000);


})();

function setStyles() {
    GM_addStyle('.subject { background-image: linear-gradient(to bottom,rgba(0,0,0,.01),rgba(0,0,0,0)); color: #5e6d7a; }');
    GM_addStyle('.new-toolbox .toolbox-background { background-image: linear-gradient(to top,rgba(0,0,0,.01),rgba(0,0,0,0)); }');

    GM_addStyle('.new-toolbox .toolbox-content .toolbox-icon { border-radius: 20px; background-color: rgba(255, 192, 203, .7); border: 1px solid #ffbcbc; }');
    GM_addStyle('.new-toolbox:hover .toolbox-content:hover .toolbox-icon:hover { border-radius: 20px; background-color: rgba(255, 192, 203, .3); border: 1px solid #ffbcbc; }');
    GM_addStyle('.new-toolbox .toolbox-content .toolbox-icon.toggled { border-radius: 20px; background-color: rgba(255, 192, 203, .3); border: 1px solid #ffbcbc; }');
    GM_addStyle('.participants-count { background-color: rgba(255, 192, 203, .1); border: 1px solid rgba(255, 192, 203, .4); }');
    GM_addStyle('.subject .subject-text { font-size: 0px; }');
    GM_addStyle('.subject-conference-timer { display: revert; vertical-align: middle; }');
    GM_addStyle('.participants-count { margin-right: 16px; }');
    GM_addStyle('body { font-family: calibri !important }');
    GM_addStyle('#largeVideoContainer { background: linear-gradient(125deg, #ffc0cb44, 2%, #ffc0cb09) fixed; }');

    var buttonsLR = $('.button-group-left, .button-group-right');
    buttonsLR.find('.toolbox-icon .jitsi-icon > svg > path').each((i,x) => { x.setAttribute('fill', '#966482'); });
    buttonsLR.find('.toolbox-icon.toggled .jitsi-icon > svg > path').each((i,x) => { x.setAttribute('fill', '#966482'); });
    buttonsLR.find('.toolbox-icon .jitsi-icon > svg > path').each((i,x) => { x.setAttribute('fill', '#966482'); });

    updateUsersText();
}

function updateUsersText() {
    if (!bUpdatedUserTexts && ($('span.videocontainer') !== null) && ($('span.videocontainer') !== undefined) && ($('span.videocontainer').length == 3)) {
        console.log('3 people are here!');
        $('span.videocontainer').find('.displayNameContainer').each(function(i,x) {
            var currentName = x.children[0].innerHTML;
            var e1 = document.createElement('span');
            var e2 = document.createElement('span');
            e1.classList.add('displayname');
            e2.classList.add('displayname');
            e1.setAttribute('style', 'margin: -25% 0 0 0;');
            e2.setAttribute('style', 'top: 89%; white-space: unset;');
            x.setAttribute('dir', 'auto');
            x.insertAdjacentElement('afterbegin', e1);
            x.insertAdjacentElement('beforeend', e2);

            var studies, displayName, extraInfo;

            if (currentName.startsWith('אריאל') || x.children[1].id === 'localDisplayName') {
                studies = 'סטודנט לעיצוב קרמי וזכוכית, בצלאל, שנה ג';
                currentName = 'אריאל (אני)';
                extraInfo = 'אוהב שוקולד ועוגות גבינה, וגם תכנות, עוגיות ובועות סבון';
            } else if (currentName.startsWith('דניאל')) {
                studies = 'סטודנט לתואר שני במדעי המחשב, העברית, שנה ב';
                currentName = 'דניאל';
                extraInfo = 'אוהב לתכנת, לטייל ולראות סרטים';
            } else if (currentName.startsWith('יעל')) {
                studies = 'סטודנטית למדעי המחשב, אב"ג, שנה ג';
                currentName = 'יעל';
                extraInfo = 'אוהבת לטייל, לאפות, לתכנת ולקרוא';
            }

            x.children[0].innerHTML = studies;
            x.children[1].innerHTML = currentName;
            x.children[2].innerHTML = extraInfo;

            //         var u = JSON.parse(localStorage.getItem('users'))[0];

            //         x.children[0].innerHTML = u['university'] + ', ' + u['studies']['fields'][0] + ', שנה ' + numberToHebrewYear(u['studies']['year']);
            //         x.children[1].innerHTML = u['given-name'];
            //         x.children[2].innerHTML = u['extra-info'];

        });
        bUpdatedUserTexts = true;
        console.log('updated all');
    } else {
        console.log('no 3 people');
    }
}

function numberToHebrewYear(number) {
	if 		(number == 1) return 'א'
	else if (number == 2) return 'ב'
	else if (number == 3) return 'ג'
	else if (number == 4) return 'ד'
	else if (number == 5) return 'ה'
	else if (number == 6) return 'ו'
	else return 'אחר'
}
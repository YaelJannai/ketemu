//let userInfoProto = require('./user-info-prototype.json');
const userInfoProto = {
	"id": "generated-jitsi-id",
	"given-name": "The name the user gives himself",
	"social": {
		"email": "Email address (should be verified)",
		"facebook": "https://facebook.com/me",
		"mobile": "054-111-2222"
	},
	"university": "University name",
	"studies": {
		"fields": [],
		"year": 3
	},
	"hobbits": [],
	"extra-info": "More textual information"
}

function startMeeting() {
	const domain = 'meet.jit.si';
	const options = {
	    roomName: 'hackbgu2020/tekemu-team-talk-124oqfkasn',
	    parentNode: document.querySelector('#meet'),
	    interfaceConfigOverwrite: {
			DEFAULT_BACKGROUND: '#ffffff',
			DEFAULT_LOCAL_DISPLAY_NAME: 'אני',
			// DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',
	        HIDE_INVITE_MORE_HEADER: true,
	        MOBILE_APP_PROMO: false,
	        SHOW_CHROME_EXTENSION_BANNER: false,
	        onload: oniframeload,
	        TOOLBAR_BUTTONS: [
		        'microphone', 'camera', 'profile', 'chat',
		        'settings', 'videoquality', 'shortcuts', 'tileview'
		    ],
		    SETTINGS_SECTIONS: [ 'devices', 'language', 'profile' ],
		    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
		    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
		    RECENT_LIST_ENABLED: false,
		    INITIAL_TOOLBAR_TIMEOUT: 5000,
		    TOOLBAR_TIMEOUT: 1500,
		    ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 7000,
		    INDICATOR_FONT_SIZES: true
	    },
	    configOverwrite: {
	    	hideLobbyButton: true,
	    	prejoinPageEnabled: false,
			remoteVideoMenu: {
				disableKick: true
			},
			disableRemoteMute: true
	    }
	};

	console.log(domain);
	console.log(options);

	const api = new JitsiMeetExternalAPI(domain, options);

	api.executeCommand('toggleTileView');

	api.addEventListener('videoConferenceJoined', () => {
		console.log('Local User Joined');
		api.executeCommand('displayName', 'אריאל'/*makeid(10)  document.getElementById("username").value*/);
		console.log('videoConferenceJoined', event);
	});

	api.addEventListener('displayNameChange', function(event) {
		console.log('displayNameChange', event);
	});

	api.addEventListener('participantJoined', function(event) {
		console.log('participantJoined', event);
		localStorage.setItem('myCat', 'Tom');
		console.log(users);
	});
}

function oniframeload(x,y,z) {
	console.log('abcabc', x,',',y,',',z);
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function createUserObject() {
	return JSON.parse(JSON.stringify(userInfoProto));
}

let users = [];
addUsers(3);

function addUsers(number) {
	let userAriel = {};//createUserObject();
	userAriel['id'] = 'idddd';//makeid(5);
	userAriel['given-name'] = 'אריאל';
	userAriel['social'] = {};
	userAriel['social']['email'] = 'ariel@gmail.com';
	userAriel['social']['facebook'] = 'https://facebook.com/me';
	userAriel['social']['mobile'] = '054-111-2222';
	userAriel['university'] = 'בצלאל';
	userAriel['studies'] = {};
	userAriel['studies']['fields'] = ['עיצוב קרמי וזכוכית'];
	userAriel['studies']['year'] = 3;
	userAriel['hobbits'] = ['בועות סבון', 'עוגיות'];
	userAriel['extra-info'] = 'אני אוהב בועות סבון ועוגיות, וגם לתכנת. אני כותב עוד דברים כדי שזה יחרוג משורה ויהיה כאן יותר טקסט';

	users.push(userAriel);
	localStorage.setItem('users', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', onloadfn, false);

function onloadfn() {
    // console.log('meeting onload');
	// var data = JSON.parse(httpGet('/details'));
	// console.log('data is coming!!!');
	// console.log(data);
	// localStorage.setItem('users', [data]);
    // document.getElementById('name').value = data.name;
    // document.querySelector('#user-details > h2').innerHTML = 'היי ' + data.name.split(' ')[0] + '!';
};

// $('.displayname').each((i,x) => x.innerHTML += '<BR>לומד עיצוב קרמי וזכוכית<BR>אוהב עוגיות<BR>מתכנת<BR>🍪')

//<span class="displayname" style="margin: 25% 0 0 0;">hello</span>

// $('span.videocontainer')
// $('[id^=participant]')
// #localVideoTileViewContainer

// $('span.videocontainer').find('.displayNameContainer').each(function(i,x) {
//     var e1 = document.createElement('span');
//     var e2 = document.createElement('span');
//     e1.classList.add('displayname');
//     e2.classList.add('displayname');
//     e1.setAttribute('style', 'margin: -25% 0 0 0;');
//     e2.setAttribute('style', 'top: 89%; white-space: unset;');
//     x.setAttribute('dir', 'auto');
//     x.insertAdjacentElement('afterbegin', e1);
// 	x.insertAdjacentElement('beforeend', e2);
	
// 	var u = JSON.parse(localStorage.getItem('users'))[0];

// 	x.children[0].innerHTML = u['university'] + ', ' + u['studies']['fields'][0] + ', שנה ' + numberToHebrewYear(u['studies']['year']);
// 	x.children[1].innerHTML = u['given-name'];
// 	x.children[2].innerHTML = u['extra-info'];
// });

// function numberToHebrewYear(number) {
// 	if 		(number == 1) return 'א'
// 	else if (number == 2) return 'ב'
// 	else if (number == 3) return 'ג'
// 	else if (number == 4) return 'ד'
// 	else if (number == 5) return 'ה'
// 	else if (number == 6) return 'ו'
// 	else return 'אחר'
// }
function startMeeting() {
	const domain = 'meet.jit.si';
	const options = {
	    roomName: 'hackbgu2020/ariel-ariel-meet-124refjmkslw3',
	    parentNode: document.querySelector('#meet'),
	    interfaceConfigOverwrite: {
	    	DEFAULT_BACKGROUND: '#ffffff',
	        HIDE_INVITE_MORE_HEADER: true,
	        MOBILE_APP_PROMO: false,
	        SHOW_CHROME_EXTENSION_BANNER: false,
	        // onload: oniframeload,
	        TOOLBAR_BUTTONS: [
		        'microphone', 'camera', 'profile', 'chat',
		        'settings', /*'raisehand',*/
		        'videoquality', 'shortcuts', 'tileview'
		    ],
		    SETTINGS_SECTIONS: [ 'devices', 'language', 'profile' ],
		    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
		    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
		    RECENT_LIST_ENABLED: false,
		    INITIAL_TOOLBAR_TIMEOUT: 5000,
		    TOOLBAR_TIMEOUT: 1500,
		    ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 7000,
		    INDICATOR_FONT_SIZES: true
		    // DISPLAY_WELCOME_PAGE_CONTENT: true,
    		// DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: true,
	    },
	    configOverwrite: {
	    	// enableWelcomePage: false,
	    	hideLobbyButton: true,
	    	prejoinPageEnabled: false,
	    	// backgroundColor: '#fcfcfc',
	    	// backgroundImageUrl: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
	    	// logoClickUrl: 'https://github.com/jitsi/jitsi-meet/blob/master/config.js',
	    	// logoImageUrl: 'https://avatars3.githubusercontent.com/u/6494922?v=4'
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
		api.executeCommand('displayName', makeid(10)/*document.getElementById("username").value*/);
		console.log('videoConferenceJoined', event);
	});

	api.addEventListener('displayNameChange', function(event) {
		console.log('displayNameChange', event);
	});

	api.addEventListener('participantJoined', function(event) {
		console.log('participantJoined', event);
		    localStorage.setItem('myCat', 'Tom');
	});
}

function oniframeload(x,y,z) {
	console.log(x,',',y,',',z);
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



// $('.displayname').each((i,x) => x.innerHTML += '<BR>לומד עיצוב קרמי וזכוכית<BR>אוהב עוגיות<BR>מתכנת<BR>🍪')

//<span class="displayname" style="margin: 25% 0 0 0;">hello</span>


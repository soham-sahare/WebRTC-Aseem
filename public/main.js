//const { config } = require("dotenv/types")
function reload() {
    window.location.reload();
}

document.getElementById("go").onclick = () => {

    room_name = document.getElementById("room").value
    username = document.getElementById("name").value
    // console.log(room_name)

    if (username == "") {
        alert("Username cannot be null. Please try again.")
    }
    else if (room_name == "") {
        alert("Room name cannot be null. Please try again")
    }
    else {

        document.getElementById("names").style.display = "none"
        document.getElementById("main").style.display = "block"

        const domain = 'meet.jit.si';

        const options = {

            roomName: room_name,
            userInfo: {
                displayName: username
            },
            width: '100%',
            height: 700,
            parentNode: document.querySelector('#meet'),

            interfaceConfigOverwrite: {
                MOBILE_APP_PROMO: false,
                OPEN_IN_MOBILE_BROWSER: true,
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_LOGO_URL: '',
                DEFAULT_REMOTE_DISPLAY_NAME: 'Aseem User',
                DEFAULT_WELCOME_PAGE_LOGO_URL: '',
                DISPLAY_WELCOME_PAGE_CONTENT: false,
                DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
                JITSI_WATERMARK_LINK: '',
                SHOW_DEEP_LINKING_IMAGE: false,
                SHOW_JITSI_WATERMARK: false,
                SHOW_POWERED_BY: false,
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            }

        };

        const api = new JitsiMeetExternalAPI(domain, options);


        document.getElementById("numberOfParticipants").onclick = function () { myFunction() };

        function myFunction() {
            const info = api.getParticipantsInfo();

            const numberOfParticipants = api.getNumberOfParticipants();
            // const displayName = api.getDisplayName(participantId);

            console.log("+++++++++++++++++++++++++++++++++ This is info: ");
            console.log(info);
            console.log(numberOfParticipants);
            // console.log(displayName);

        }

        api.addListener('readyToClose', () => {
            console.log('opaaaaa');
            window.location.reload();
        });

        api.on('readyToClose', () => {
            console.log('opaaaaa');
            window.location.reload();
        });

        // api.executeCommand('overwriteConfig',

        //     {
        //         config: {
        //             toolbarButtons: ['chat'],
        //             disableInviteFunctions: true
        //         }

        //     }
        // );

        api.executeCommands({
            displayName: ['nickname'],
            toggleAudio: []
        });

    }
}



const socket = io.connect(location.origin)

function reload() {
    window.location.reload();
}
let attendance = ''
function attendance_func() {
    // var pass = prompt("Please enter moderator password", "Here");
    // if (pass!= null) {
    //     socket.emit('moderator_check',pass);
    // }
    socket.emit('attendance', attendance, room_name)
}

function duration_func() {
    // var pass = prompt("Please enter moderator password", "Here");
    // if (pass!= null) {
    //     socket.emit('moderator_check',pass);
    // }
    socket.emit('att_duration', attendance, room_name)
}



//participant class to store info (attendance)
class P {
    name;
    time_join;
    time_end;

}

let i = 0;
participants = [];




document.getElementById("go").onclick = () => {

    room_name = document.getElementById("room").value
    username = document.getElementById("name").value
    console.log(room_name)
    //socket.emit(r)

    if (username == "") {
        alert("Username cannot be null. Please try again.")
    }
    else if (room_name == "") {
        alert("Room name cannot be null. Please try again")
    }
    else {

        document.getElementById("names").style.display = "none"
        document.getElementById("main").style.display = "block"

        // const domain = '34.196.4.214';
        const domain = 'meet.jit.si';
        console.log(room_name)
        const options = {
            roomName: room_name,
            userInfo: {
                // email: 'email@jitsiexamplemail.com',
                displayName: username
            },
            width: '100%',
            height: 700,
            parentNode: document.querySelector('#meet'),
            configOverwrite:
            {
                toolbarButtons:
                    [
                        'microphone', 'chat'
                    ]
            },
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

        document.getElementById("participantsinfo").onclick = function () { myFunction() };




        function myFunction() {
            const info = api.getParticipantsInfo();


            console.log("+++++++++++++++++++++++++++++++++ This is info: ");
            console.log(info);
            // console.log(numberOfParticipants);
            // console.log(displayName);

        }





        api.on('readyToClose', () => {
            console.log('opaaaaa');
            window.location.reload();
        });
        let participantCount = 0;
        api.addEventListener('participantJoined', function (event) {
            //alert('joined')
            if (participants[event.id] == null) {
                participants[event.id] = new P();
                participants[event.id].name = event.displayName;
            }
            if (participants[event.id].time_join != null)
                participants[event.id].time_join = participants[event.id].time_join + ' ' + new Date().toLocaleTimeString();
            else
                participants[event.id].time_join = new Date().toLocaleTimeString();
            date_long = new Date();
            //fs.writeFileSync('/tmp/test-sync', participants[event.id].name+ ' Time Joined: '  + participants[event.id].time_join );
            attendance += participants[event.id].name + ' Time Joined: ' + participants[event.id].time_join + ' ' + date_long + '\n';

            //alert(participants[event.id].name+ ' '  + participants[event.id].time_join);
            // alert(participants[event.id].time_join);
            participantCount++;


        });


        api.addEventListener('participantLeft', function (event) {
            //alert('left')
            participants[event.id].time_left = new Date().toLocaleTimeString();
            //fs.writeFileSync('test', participants[event.id].name+ ' Time Left: '  + participants[event.id].time_left );
            //fs.appendFile('attendance.txt', participants[event.id].name+ ' Time Left: '  + participants[event.id].time_left, 'utf8');
            Date_long = new Date();
            //alert(participants[event.id].name+ ' '  + participants[event.id].time_left);
            attendance += participants[event.id].name + ' Time Left: ' + participants[event.id].time_left + ' ' + Date_long + '\n';

        });





    }
}







//////////////////////////////////////////////////////////////
  //    api.on('readyToClose', () => {
    //     console.log('opaaaaa');
    //     window.location.reload();
   //});

    //     api.addListener('readyToClose',  () => {
    //         console.log('opaaaaa');
    //         window.location.reload();
    //    } );

        // api.executeCommand('overwriteConfig',

        //         {
        //             config: {
        //         toolbarButtons: ['chat'],
        //         disableInviteFunctions: true
        //         }

        //     }
        //     );


const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and rom from URL

const{ username,room}
const socket = io();


//Message from Server
socket.on('message', message=>{ 
    outputMessage(message);

//Scroll down
chatMessages.scrollTop=chatMessages.scrollHeight;
})
//Sending Message 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get message text
const msg = e.target.elements.msg.value;

//Emmit message to server
socket.emit('chatMessage'.msg)
//Clear input
e.target.elements.msg.value=""

});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.user}<span>${message.time}<`
    document.querySelector('.chat-messages').appendChild(div)
}
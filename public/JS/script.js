const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and rom from URL

const{ username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
const socket = io();

//Join chatroom
socket.emit('joinRoom',{ username,room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  
  

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
//Clear inputs
e.target.elements.msg.value=""
e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }

  //Add room Name to DOM

  function outputRoomName(room){
    roomName.innerText = rooms;
  }

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}

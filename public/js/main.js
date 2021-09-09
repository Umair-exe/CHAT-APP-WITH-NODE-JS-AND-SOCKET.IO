const socket = io();
const chatmsg = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

socket.emit("join-room",{username,room});

socket.on('roomUsers',({room,users})=> {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message",msg => {
    outputMessage(msg);
  //  chatMessages.scrollTop = chatMessages.scrollHeight;
})


chatmsg.addEventListener('submit',(e)=> {
    e.preventDefault();

    let msg = e.target.msg.value;

    msg = msg.trim();
    if(!msg) {
        return false;
    }

    socket.emit("chatMessage",msg);

    e.target.msg.value= "";
})

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = msg.username + " ";
    p.innerHTML += `<span>${msg.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = msg.msg;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}


function outputRoomName(room) {
    roomName.innerText = room;
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
  
  /*//Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });*/
  
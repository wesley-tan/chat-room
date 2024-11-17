i want to make a simple chat room with authentication. 
you can enter the chat room and give yourself a username -- and there is a password to enter the chat room.

the chat room should have a list of all the users currently in the chat.

when you send a message, it should say who sent it.

when you connect, you should get all the previous messages in the chat.

chat-room/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Login.js
│       │   ├── ChatRoom.js
│       │   ├── MessageList.js
│       │   └── UserList.js
│       ├── App.js
│       └── index.js
│
├── server/
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── config/
│   │   └── db.js
│   ├── package.json
│   └── server.js
│
└── README.md

ok when i login, i should get all the previous messages in the chat. and the users, and who sent the message.

ok when i send a message, it should say who sent it.

ok when i connect, i should get all the previous messages in the chat.

ok when i send a message, it should say who sent it.

ok when i connect, i should get all the previous messages in the chat.

i should also be able to enter a message, and it should say who sent it. 
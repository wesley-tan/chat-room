import React from 'react';

function UserList({ users }) {
  return (
    <div className="user-list">
      <h3>Online Users ({users.length})</h3>
      <div className="users-container">
        {users.map((user, index) => {
          const isOnline = !user.lastActive;
          return (
            <div key={index} className="user-item">
              <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
              <span className="username">{user.username}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
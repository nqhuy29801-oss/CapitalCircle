const UserState = {
  users: [],
  setUser: function (newUserArray) {
    this.users = newUserArray;
  },
};

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date()),
  };
}

function activateUser(id, name, room) {
  const user = { id, room, name };
  UserState.setUser([
    ...UserState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  UserState.setUser(UserState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return UserState.users.find((user) => user.id === id);
}

function getUserInRoom(room) {
  return UserState.users.filter((user) => user.room === room);
}

function getAllActiveInRoom() {
  return Array.from(new Set(UserState.users.map((user) => user.room)));
}

module.exports = {
  UserState,
  buildMsg,
  activateUser,
  getAllActiveInRoom,
  getUser,
  getUserInRoom,
  userLeavesApp,
};

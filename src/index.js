const ws = new ReconnectingWebSocket(
  'ws://localhost:19960',
  null,
  {
    debug: true,
    reconnectInterval: 3000
  }
);

ws.onmessage = (chatItemResponse) => {
  const chatItemResponseBody = JSON.parse(chatItemResponse.data);
  console.log(chatItemResponseBody);
  const chatType = chatItemResponseBody.type;
  const chatItem = chatItemResponseBody.body;

  if (!chatItem?.message) return;

  // 通知全体
  const notification = document.createElement('div');
  notification.classList.add('notification');

  // サムネイル
  const thumbnail = document.createElement('img');
  thumbnail.classList.add('thumbnail');
  thumbnail.src = chatItemResponseBody.body.author.thumbnail.url;
  notification.append(thumbnail);

  // 通知body
  const notificationBody = document.createElement('div');
  notificationBody.classList.add('notification-body');

  // 名前
  const name = document.createElement('div');
  name.classList.add('name');
  name.append(chatItemResponseBody.body.author.name);

  // 今
  const now = document.createElement('div');
  now.classList.add('now');
  now.append('今');

  const nameWrapper = document.createElement('div');
  nameWrapper.classList.add('name-wrapper');
  nameWrapper.append(name)
  nameWrapper.append(now);

  notificationBody.append(nameWrapper);

  // 本文
  const messages = document.createElement('div');
  messages.classList.add('message');
  const message = chatItem.message;
  const messageElement = message.map((item) => {
    if (item.text) return document.createTextNode(item.text);
    const emoji = document.createElement('img');
    emoji.src = item.url;
    return emoji;
  });
  messages.append(...messageElement);

  const messagesWrapper = document.createElement('div');
  messagesWrapper.classList.add('messages-wrapper');
  messagesWrapper.append(messages);
  notificationBody.append(messagesWrapper);

  notification.append(notificationBody);

  printNotification(notification);
};

// 通知を表示する
const printNotification = (notification) => {
  const notification_viewer = document.getElementById('font-family-setting-container');
  notification_viewer.append(notification);

  // 5秒後に消す
  setTimeout(() => {
    notification.remove();
    console.log('delete');
  }, 5000);
};

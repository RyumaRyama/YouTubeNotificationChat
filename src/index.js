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

  const notification_viewer = document.getElementById('font-family-setting-container');

  // 通知全体
  const notification = document.createElement('div');
  notification.classList.add('notification');

  // サムネイル
  const thumbnail = document.createElement('img');
  thumbnail.classList.add('thumbnail');
  thumbnail.src = chatItemResponseBody.body.author.thumbnail.url;
  notification.append(thumbnail);

  // 名前
  const name = document.createElement('div');
  name.classList.add('name');
  name.append(chatItemResponseBody.body.author.name);
  notification.append(name);

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
  notification.append(messages);

  notification_viewer.append(notification);
};

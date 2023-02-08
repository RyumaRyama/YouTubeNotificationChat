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
  const name = chatItemResponseBody.body.author.name;
  name.classList.add('name');
  notification.append(name);

  // 本文
  const message = chatItem.message;
  message.classList.add('message');
  const messageElement = message.map((item) => {
    if (item.text) return document.createTextNode(item.text);
    const emoji = document.createElement('img');
    emoji.src = item.url;
    return emoji;
  });
  notification.append(...messageElement);

  notification_viewer.append(notification);
};

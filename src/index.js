const ws = new ReconnectingWebSocket(
  'ws://localhost:19960',
  null,
  {
    debug: true,
    reconnectInterval: 3000
  }
);

// メッセージ管理用のキュー
const chatItemResponseBodyQueue = [];

// ここに処理を書くと、チャット取得をきっかけとして動く
ws.onmessage = (chatItemResponse) => {
  // スパチャなどをはじく
  // 通常チャットのみを処理
  const chatItemResponseBody = JSON.parse(chatItemResponse.data);
  const chatItem = chatItemResponseBody.body;

  if (!chatItem?.message) return;

  chatItemResponseBodyQueue.push(chatItemResponseBody);
  // createNotification(chatItem);
};

// 1秒に1回メッセージを確認する
setInterval(() => {
  const newChatItemResponseBody = chatItemResponseBodyQueue.shift();
  if (newChatItemResponseBody === undefined) {
    return;
  }
  createNotification(newChatItemResponseBody);
}, 1200);


let notification;

// 通知風チャットを作成する
const createNotification = (chatItemResponseBody) => {
  const chatItem = chatItemResponseBody.body;

  // 事前に通知があればそれは消す
  if (notification !== undefined) {
    notification.remove();
  }

  // 通知全体
  notification = document.createElement('div');
  notification.classList.add('notification');

  // 通知音
  const audio = document.createElement('audio');
  audio.src = './teroren.mp3';
  audio.autoplay = true;

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
  }, 3000);
};

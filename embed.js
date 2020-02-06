const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://player.video' : 'http://localhost:1234';

const getTemplate = (player, queryParams) => {
  const template = document.createElement('template');

  template.innerHTML = `
    <style>
    .wrapper {
      position: relative;
      padding-top: 56.26%;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;

      border: none;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    </style>

    <div class="wrapper">
      <iframe
        src="${BASE_URL}/${player}/embed.html?${queryParams}"
        allowfullscreen
        frameborder="0"
      ></iframe>
    </div>
  `;

  return template;
};

import { attrsToQuery } from './common/utils';

class MuxPlayer extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const player = this.player();
    const queryParams = attrsToQuery(this.attributes);
    const template = getTemplate(player, queryParams);

    shadow.appendChild(template.content.cloneNode(true));
  }

  player() {
    return this.getAttribute('player') || 'videojs';
  }
}

if (!window.customElements.get('video-player')) {
  window.customElements.define('video-player', MuxPlayer);
  window.VideoPlayer = MuxPlayer;
}

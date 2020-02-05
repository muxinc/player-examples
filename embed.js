const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://player.video' : 'http://localhost:1234';

const styles = `
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
`;

import { attrsToQuery } from './common/utils';

class MuxPlayer extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    const iframe = document.createElement('iframe');

    const queryParams = attrsToQuery(this.attributes);

    iframe.setAttribute(
      'src',
      `${BASE_URL}/${this.player()}/embed.html?${queryParams}`
    );
    iframe.setAttribute('allowfullscreen', '');

    const style = document.createElement('style');

    style.textContent = styles;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.setAttribute('class', 'wrapper');
    wrapper.appendChild(iframe);
  }

  player() {
    return this.getAttribute('player') || 'videojs';
  }
}

customElements.define('video-player', MuxPlayer);

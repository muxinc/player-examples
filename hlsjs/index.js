import Hls from 'hls.js';

import { queryToAttrs } from '../common/utils';
import '../common/style.scss';
import './hlsjs.css';

const qs = new URLSearchParams(window.location.search.substring(1));
const params = queryToAttrs(qs);

const container = document.getElementById('player-container');
const video = document.createElement('video');

Object.keys(params).forEach(key => {
  video[key] = params[key];
});

if (Hls.isSupported()) {
  var hls = new Hls();
  hls.loadSource(params.src);
  hls.attachMedia(video);
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = params.src;
}

container.appendChild(video);

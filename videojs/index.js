import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../common/examples.css';

import { queryToAttrs } from '../common/utils';
import '../common/style.scss';

const qs = new URLSearchParams(window.location.search.substring(1));
const params = queryToAttrs(qs);

if (params['mux-playback-id']) {
  params.sources = [{
    src: `https://stream.mux.com/${params['mux-playback-id']}.m3u8`,
    type: 'application/x-mpegurl',
  }];

  params.poster = params.poster || `https://image.mux.com/${params['mux-playback-id']}/thumbnail.jpeg`;
}

console.log(params);

videojs('player', params);

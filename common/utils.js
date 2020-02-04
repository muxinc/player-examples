export function queryToAttrs(querystring) {
  const params = new URLSearchParams(querystring);

  const attrs = {};

  for (const [key, value] of params) {
    value = value === '' ? true : value;
    attrs[key] = value;
  }

  if (attrs['mux-playback-id']) {
    attrs.src = `https://stream.mux.com/${attrs['mux-playback-id']}.m3u8`;
    attrs.sources = [{
      src: `https://stream.mux.com/${attrs['mux-playback-id']}.m3u8`,
      type: 'application/x-mpegurl',
    }];
    attrs.poster = `https://image.mux.com/${attrs['mux-playback-id']}/thumbnail.jpeg`;
  }

  if (attrs['mux-poster-time']) {
    attrs.poster = `https://image.mux.com/${attrs['mux-playback-id']}/thumbnail.jpeg?time=${attrs['mux-poster-time']}`;
  }

  if (attrs.autoplay) {
    attrs.muted = true;
  }

  return attrs;
}

export function attrsToQuery(attrs) {
  const params = {};

  for (const {name, value} of attrs) {
    params[name] = value;
  }

  return (new URLSearchParams(params)).toString();
}

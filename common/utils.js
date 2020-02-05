function parseParam(param) {
  switch(param) {
    case 'true':
    case '':
      return true;

    case 'false':
      return false;

    default:
      return param;
  }
}

export function queryToAttrs(querystring) {
  const params = new URLSearchParams(querystring);

  const attrs = {};

  for (const [key, value] of params) {
    value = parseParam(value);
    attrs[key] = value;
  }

  if (attrs['mux-playback-id']) {
    attrs.src = `https://stream.mux.com/${attrs['mux-playback-id']}.m3u8`;
    attrs.poster = `https://image.mux.com/${attrs['mux-playback-id']}/thumbnail.jpeg`;
  }

  if (attrs['mux-poster-time']) {
    attrs.poster = `https://image.mux.com/${attrs['mux-playback-id']}/thumbnail.jpeg?time=${attrs['mux-poster-time']}`;
  }

  // Force people to explicitly shoot themselves in the foot around autoplay and muted.
  if (attrs.autoplay && typeof attrs.muted === 'undefined') {
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

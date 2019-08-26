import Hls from "hls.js";

function serializeQuerystring(obj) {
  let str =
    "?" +
    Object.keys(obj)
      .reduce(function(a, k) {
        a.push(k + "=" + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join("&");
  return str;
}

const muxManifestUrl = playbackId =>
  `https://stream.mux.com/${playbackId}.m3u8`;

const muxThumbnail = (playbackId, options = {}) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg${serializeQuerystring(
    options
  )}`;

const videos = document.querySelectorAll("video[data-playback-id]");
videos.forEach(video => {
  const playbackId = video.getAttribute("data-playback-id");
  const posterTime = video.getAttribute("data-poster-time");
  video.setAttribute(
    "poster",
    video.poster || muxThumbnail(playbackId, { time: posterTime })
  );
  const manifest = muxManifestUrl(playbackId);

  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(manifest);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = muxManifestUrl(playbackId);
  }
});

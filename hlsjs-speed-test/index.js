import './index.scss';
import Hls from 'hls.js';

const videoContainer = document.getElementById('videoContainer');
const controlsContainer = document.getElementById('controlsContainer');
const runButton = document.getElementById('runButton');
const resultsContainer = document.getElementById('resultsContainer');

let muxPlaybackIds = [
  'RXH3soO2g17b00j1B01NW9wfbZMaPTz00cj',
  '71x3ig00j01bqt3vPhXh2Dw5oXeYsg019HS',
  'FgxIu2KcZ4pH3vBchjPJeu74wWxeCZx01',
  'RawKiv202jbboINlaJQBXxiV6iWP02QySb',
  'F00fwc991xeqOabpOLO02GYFOf8MLsAy8T',
  'izCpm4ir01IJ23rWefm02Qt01nDhOR02KSPP',
  'mmnaSWku1b01jkNp02fJglbEnlUPXQhqjB',
  'zQXsKpiD027acvpeBHVoRErzBJaxxaJW02',
  'uCNxS01U4ubGhtTvgaFKhdiD6YM02gIez4',
  'Q003cyIc01xXk5In00VbKJHK01wrF7ERjaII',
];

if (!Hls.isSupported()) {
  resultsContainer.innerHTML =
    '<div class="error">HLS.js is not supported in this browser</div>';
  runButton.disabled = true;
}

const runSingleTest = (playbackId, callback) => {
  let startLevel = document.querySelector('#startLevelSelect').value;
  if (startLevel == 'default') {
    startLevel = undefined;
  } else {
    startLevel = Number(startLevel);
  }

  let maxLevel = document.querySelector('#maxLevelSelect').value;

  const startTime = performance.now();
  const video = document.createElement('video');
  const resultDetails = {
    playbackId: playbackId,
    levelsUsed: [],
  };

  videoContainer.appendChild(video);
  video.controls = true;
  video.muted = true;
  video.addEventListener('playing', function() {
    resultDetails.startupTime =
      Math.round(performance.now() - startTime) / 1000;
    console.log('Playback has started.');

    hls.destroy();
    video.pause();
    video.removeAttribute('src'); // empty source
    video.load();
    videoContainer.removeChild(video);

    callback(resultDetails);
  });

  var hls = new Hls({
    debug: true,
    startLevel: startLevel,
    // maxBufferLength: 2,
  });
  console.log('maxLevel', maxLevel);

  if (maxLevel > -1) {
    hls.autoLevelCapping = maxLevel;
  }

  hls.loadSource(`https://stream.mux.com/${playbackId}.m3u8?${Math.random()}`);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    console.log('Maniest parsed. Attempting to play.');
    video.play();
    resultDetails.levels = hls.levels;
    console.log(hls.levels);
  });
  hls.on(Hls.Events.LEVEL_LOADING, (e, data) => {
    if (!(resultDetails.startLevel >= 0)) {
      resultDetails.startLevel = data.level;
    }
    resultDetails.endLevel = data.level;
    resultDetails.levelsUsed.push(data.level);
  });
};

const runMultiTest = () => {
  const textCount = 10;
  let testNumber = 0;
  const startupTimes = [];

  resultsContainer.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>Playback ID</th>
        <th>Startup Time (s)</th>
        <!-- <th>Levels</th> -->
        <th>Start Level</th>
        <th>End Level</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>`;

  const resultsBody = document.querySelector('tbody');

  function runNextTest(results) {
    if (results) {
      startupTimes.push(results.startupTime);

      const resultTr = document.createElement('tr');
      resultTr.innerHTML = `
        <td>${results.playbackId}</td>
        <td>${results.startupTime}</td>
        <!-- <td>${results.levelsUsed.join(', ')}</td> -->
        <td>
          ${results.levels[results.startLevel].height}p
          (${Math.round(
            results.levels[results.startLevel].bitrate / 1024
          )} Kbps)
        </td>
        <td>
        ${results.levels[results.endLevel].height}p
        (${Math.round(results.levels[results.endLevel].bitrate / 1024)} Kbps)
        </td>
      `;
      resultsBody.appendChild(resultTr);
    }

    if (++testNumber > textCount) {
      startupTimes.sort();
      console.log(startupTimes);

      const medianTr = document.createElement('tr');
      medianTr.innerHTML = `
        <th>Median Video Startup Time</th>
        <th>${startupTimes[4]}</th>
        <th></th>
      `;
      resultsBody.appendChild(medianTr);
      return;
    }

    const playbackId = muxPlaybackIds[testNumber - 1];
    runSingleTest(playbackId, runNextTest);
  }

  runNextTest();
};

runButton.addEventListener('click', runMultiTest);

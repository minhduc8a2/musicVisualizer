const audioFile = document.getElementById("audio-file");
const audioPlayer = document.getElementById("audio-player");
function letPlay() {
  let files = audioFile.files;
  if (files.length) audioPlayer.src = URL.createObjectURL(files[0]);

  audioPlayer.load();
  audioPlayer.play();
  //audio context
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaElementSource(audioPlayer);
  const analyzer = audioContext.createAnalyser();

  audioSource.connect(analyzer);
  analyzer.connect(audioContext.destination);

   analyzer.fftSize = 256;

  let bufferLength = analyzer.frequencyBinCount;

  console.log(bufferLength);

  const dataArray = new Uint8Array(bufferLength);
  console.log(dataArray);
  //canvas
  const visualizer = document.getElementById("visualizer");
  visualizer.width = window.innerWidth;
  visualizer.height = window.innerHeight;
  const visualizerContext = visualizer.getContext("2d");

  const WIDTH = visualizer.width;
  const HEIGHT = visualizer.height;

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  function renderFrame() {
    requestAnimationFrame(renderFrame);
    x = 0;
    analyzer.getByteFrequencyData(dataArray);

    visualizerContext.fillStyle = "#000";
    visualizerContext.fillRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < bufferLength; i++) {
      barHeight =  dataArray[i] ;
      var r = barHeight + 25 * (i / bufferLength);
      var g = 250 * (i / bufferLength);
      var b = 50;
      visualizerContext.fillStyle = `rgb(${r},${g},${b})`;
      visualizerContext.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  audioPlayer.play();
  renderFrame();
}

audioFile.onchange = () => letPlay();

function readBlob(blob, callback) {
	var reader=null;
	reader = new FileReader();
	reader.onload = function (e) {
		var data = new Uint8Array(e.target.result);
		callback(data);
	};
	reader.readAsArrayBuffer(blob);
}

function playAmrBlob( blob, callback) {
	readBlob(blob, function(data) {
	  playAmrArray(data);
	});
}

function convertAudioBlob(blob) {
	readBlob(blob, function(data) {
	  var ctx = new AudioContext();
	  ctx.decodeAudioData(data.buffer, function(audioBuffer) {
		var pcm = new Float32Array(audioBuffer.length);
		audioBuffer.copyFromChannel(pcm, 0, 0);
		var amr = AMR.encode(pcm, audioBuffer.sampleRate, 7);
		playAmrArray(amr);
	  });
	});
}

function playAmrArray(array) {
  var samples = AMR.decode(array);
  if (!samples) {
	  console.log('Failed to decode!');
	  return;
  }
  playPcm(samples);
}
var ctx = new AudioContext();
function playPcm(samples) {
	var src = ctx.createBufferSource();
	var buffer = ctx.createBuffer(1, samples.length, 8000);
	buffer.copyToChannel(samples, 0, 0);
	src.buffer = buffer;
	src.connect(ctx.destination);
	src.start();
}
console.clear();

function openForm() {
  document.getElementById("signinForm").style.display = "block";
}

function closeForm() {
  document.getElementById("signinForm").style.display = "none";
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
//start of copy and paste
var analyser = audioCtx.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

//src.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]*1.5;
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

//end of paste

//switch aria attribute on click
const pads = document.querySelectorAll('.pads');
const allPadButtons = document.querySelectorAll('#drums button');

allPadButtons.forEach(el => {
  el.addEventListener('click', () => {
    if (el.getAttribute('aria-checked') === 'false') {
      el.setAttribute('aria-checked', 'true');
    } else {
      el.setAttribute('aria-checked', 'false');
    }
  }, false)
})

//script to clear the selected buttons
function clearButton(){
    console.log("clear");
    allPadButtons.forEach(el => {
        el.setAttribute('aria-checked', 'false');
    })
	//also stop the drum machine
	//isPlaying = !isPlaying;
        playButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';	
        audioCtx.suspend();
	
};

const allHihatButtons = document.querySelectorAll('.drum-one .pads button');
const allSnareButtons = document.querySelectorAll('.drum-two .pads button');
const allKickButtons = document.querySelectorAll('.drum-three .pads button');

function clearHihat(){
	console.log("clear hihat");
	allHihatButtons.forEach(el => {
        el.setAttribute('aria-checked', 'false');
    })
}

function clearSnare(){
	console.log("clear snare");
	allSnareButtons.forEach(el => {
        el.setAttribute('aria-checked', 'false');
    })
}

function clearKick(){
	console.log("clear kick");
	allKickButtons.forEach(el => {
        el.setAttribute('aria-checked', 'false');
    })
}

let mutedHihat = 0;
let mutedSnare = 0;
let mutedKick = 0;

var unmuteHihatButton = document.getElementById("unmuteHihatButton");
var muteHihatButton = document.getElementById("muteHihatButton");

var unmuteSnareButton = document.getElementById("unmuteSnareButton");
var muteSnareButton = document.getElementById("muteSnareButton");

var unmuteKickButton = document.getElementById("unmuteKickButton");
var muteKickButton = document.getElementById("muteKickButton");

function muteHihat(){

	if (mutedHihat == 0){
	muteHihatButton.style.display = 'none';
	unmuteHihatButton.style.display = 'inline-block';
	
	console.log("mute hihat");
	mutedHihat = 1;
	allHihatButtons.forEach(el => {
        el.style.opacity = 0.5;
    })
	}
	
	else{
	muteHihatButton.style.display = 'inline-block';
	unmuteHihatButton.style.display = 'none';
	
	console.log("unmute hihat");
	mutedHihat = 0;
	allHihatButtons.forEach(el => {
		el.style.opacity = 1;
    })
	}
}


function muteSnare(){

	if (mutedSnare == 0){
	muteSnareButton.style.display = 'none';
	unmuteSnareButton.style.display = 'inline-block';
	
	console.log("mute snare");
	mutedSnare = 1;
	allSnareButtons.forEach(el => {
        el.style.opacity = 0.5;
    })
	}
	
	else{
	muteSnareButton.style.display = 'inline-block';
	unmuteSnareButton.style.display = 'none';
	
	console.log("unmute snare");
	mutedSnare = 0;
	allSnareButtons.forEach(el => {
		el.style.opacity = 1;
    })
	}
}

function muteKick(){

	if (mutedKick == 0){
	muteKickButton.style.display = 'none';
	unmuteKickButton.style.display = 'inline-block';
	
	console.log("mute kick");
	mutedKick = 1;
	allKickButtons.forEach(el => {
        el.style.opacity = 0.5;
    })
	}
	
	else{
	muteKickButton.style.display = 'inline-block';
	unmuteKickButton.style.display = 'none';
	
	console.log("unmute kick");
	mutedKick = 0;
	allKickButtons.forEach(el => {
		el.style.opacity = 1;
    })
	}
}

// Loading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// fetch the audio file and decode the data
async function getFile(audioContext, filepath) {
  const response = await fetch(filepath, {mode: 'cors'});
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

let playbackRate = 1;

// create a buffer, plop in data, connect and play 
function playSample(audioContext, audioBuffer) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
  sampleSource.connect(audioContext.destination)
  sampleSource.start();
	//copy
  sampleSource.connect(analyser);
  return sampleSource;
}


let h =0;
let s = 0;
let k = 0;

async function changeHihat(){
	//random # between 1-3
	//var x = Math.floor((Math.random() * 3) + 1);
	if (h>199) {h=0;}
	else{h++;}
	//const Hihat_filePath =  `https://s3.amazonaws.com/astro-drum/VEH_Hihat_${h}.wav` ;
	//const Hihat_filePath =  `https://s3.amazonaws.com/astro-drum/hihat/gen_hihat_${h}.wav` ;
	const Hihat_filePath =  `https://s3.amazonaws.com/astro-drum/gen_20190330/gen_hihat_${h}.wav` ;
	console.log(Hihat_filePath);
	const hihat_sample = await getFile(audioCtx, Hihat_filePath);
	hihat = hihat_sample;
}

async function changeSnare(){
	if (s>199) {s=0;}
	else{s++;}
	
 	//const Snare_filePath =  `https://s3.amazonaws.com/astro-drum/VEH_Snare_${s}.wav` ;
	//const Snare_filePath =  `https://s3.amazonaws.com/astro-drum/snare/gen_snare_${s}.wav` ;
	const Snare_filePath =  `https://s3.amazonaws.com/astro-drum/gen_20190330/gen_snare_${s}.wav` ;
	
	console.log(Snare_filePath);
	const snare_sample = await getFile(audioCtx, Snare_filePath);
	snare = snare_sample;
}

async function changeKick(){
	if (k>199) {k=0;}
	else{k++;}
	//const Kick_filePath = `https://s3.amazonaws.com/astro-drum/kick/gen_kick_${k}.wav` ;
	const Kick_filePath = `https://s3.amazonaws.com/astro-drum/gen_20190330/gen_kick_${k}.wav` ;
	

	console.log(Kick_filePath);
	const kick_sample = await getFile(audioCtx, Kick_filePath);
	kick = kick_sample;
}

async function setupSample() {
	
  //var x = Math.floor((Math.random() * 3) + 1);
	//console.log(x);
 // const filePath = `https://s3.amazonaws.com/astro-drum/GANKick_${x}.wav` ;
	
	const Hihat_filePath = "https://s3.amazonaws.com/astro-drum/gen_20190330/gen_hihat_0.wav" ;
	const Snare_filePath =  "https://s3.amazonaws.com/astro-drum/gen_20190330/gen_snare_0.wav" ;
	const Kick_filePath =  "https://s3.amazonaws.com/astro-drum/gen_20190330/gen_kick_0.wav" ;
		  
  // Here we're `await`ing the async/promise that is `getFile`.
  // To be able to use this keyword we need to be within an `async` function
  const kick_sample = await getFile(audioCtx, Kick_filePath);
	const snare_sample = await getFile(audioCtx, Snare_filePath);
  const hihat_sample = await getFile(audioCtx, Hihat_filePath);
  return [hihat_sample, snare_sample, kick_sample];
}


//preset patterns 
var pattern_chosen = document.getElementById('pattern_choice');
pattern_chosen.onchange = function() {
    pattern = pattern_chosen.value;
	var patternArray;
	if (pattern==1) {
		patternArray = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,
						0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,
						1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
	}
	else if (pattern==2) {
		patternArray = [0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,
						0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,
						0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
	}
	else{
		patternArray = [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,
						0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1
						,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	}
	arrayToButton(patternArray);
};

function arrayToButton(inputArray){
	//inputArray is an array indicating whether a button is turned on or not
	for(let i = 0; i < inputArray.length; i++) {
		if (inputArray[i] == 1) {
				allPadButtons[i].setAttribute('aria-checked', 'true');
		}
		else {
				allPadButtons[i].setAttribute('aria-checked', 'false');
		}
	}
}

// Scheduling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let tempo = 120.0;
const bpmControl = document.querySelector('#bpmchosen');
bpmControl.addEventListener('input', function() {
    tempo = Number(this.value);
}, false);

//BPM dropd own menu	
var select = document.getElementById('bpmchoice');
var input = document.getElementById('bpmchosen');
select.onchange = function() {
    input.value = select.value;
    tempo = select.value;
};
let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
    const secondsPerBeat = 60.0 / tempo / 4;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === 32) {
            currentNote = 0;
    }
}

const notesInQueue = [];

function scheduleNote(beatNumber, time) {

    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

	//if the row is NOTmute and the button is pressed, then play
    if ((pads[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') && (mutedHihat==0)) {
        playSample(audioCtx, hihat);
		//console.log("hihat");
    }
    if ((pads[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') &&(mutedSnare==0)) {
        playSample(audioCtx, snare);
		//console.log("snare");
    }
    if ((pads[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') && (mutedKick==0)) {
        playSample(audioCtx, kick);
		//console.log("kick");
    }
}

let timerID;
function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

let lastNoteDrawn = 31;

function draw() {
    let drawNote = lastNoteDrawn;
    let currentTime = audioCtx.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        drawNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (lastNoteDrawn != drawNote) {
        pads.forEach(function(el, i) {
            el.children[lastNoteDrawn].style.borderColor = 'darkgray';
            el.children[drawNote].style.borderColor = 'lightyellow';
        });

        lastNoteDrawn = drawNote;
    }
    // set up to draw again
    requestAnimationFrame(draw);
}

// when the sample has loaded allow play
//const loadingEl = document.querySelector('.loading');
const playButton = document.querySelector('[data-playing]');
var pauseButton = document.getElementById("stop_button");


let isPlaying = false;
setupSample()
  .then(([hihat_sample, snare_sample, kick_sample]) => {
    //loadingEl.style.display = 'none';
	
	snare = snare_sample;
    kick = kick_sample; // to be used in our playSample function
	hihat = hihat_sample;

    playButton.addEventListener('click', ev => {
      isPlaying = !isPlaying;

      if (isPlaying) { // start playing

        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler(); // kick off scheduling
        requestAnimationFrame(draw); // start the drawing loop.
		//copy
		  renderFrame();
        ev.target.dataset.playing = 'true';
      } else {
        window.clearTimeout(timerID);
        ev.target.dataset.playing = 'false';
      }
    })

    pauseButton.addEventListener('click', ev => {
        isPlaying = !isPlaying;
        playButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';	
        audioCtx.suspend();

    })
  }).catch(error => {
	console.log(error);
  });;
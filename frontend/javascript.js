console.clear();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// script for BPM dropd own menu
var select = document.getElementById('bpmchoice');
var input = document.getElementById('bpmchosen');
select.onchange = function() {
    input.value = select.value;
};

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

// script for play/pause audio
/*	
var myAudio = document.getElementById("myAudio");
var playButton = document.getElementById("play_button");
var pauseButton = document.getElementById("stop_button");

function togglePlay() {
	setupSample();

	if (myAudio.paused) {
	playButton.style.display = 'none';
	pauseButton.style.display = 'inline-block';
		return myAudio.play();
	}
	else{
		playButton.style.display = 'inline-block';
		pauseButton.style.display = 'none';	
		return myAudio.pause();
	}
	
}
*/

//script to clear the selected buttons
function clearButton(){
    console.log("clear");
    allPadButtons.forEach(el => {
        el.setAttribute('aria-checked', 'false');
    })
};

// Loading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// fetch the audio file and decode the data
async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  console.log("getFile");
  return audioBuffer;
}

let playbackRate = 1;

// create a buffer, plop in data, connect and play -> modify graph here if required
function playSample(audioContext, audioBuffer) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
  sampleSource.connect(audioContext.destination)
  sampleSource.start();
  return sampleSource;
}

async function setupSample() {
  const filePath = "https://s3.amazonaws.com/astro-drum/GANKick_1.wav" ;
  // Here we're `await`ing the async/promise that is `getFile`.
  // To be able to use this keyword we need to be within an `async` function
  const sample = await getFile(audioCtx, filePath);
  return sample;
}

// Scheduling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let tempo = 60.0;
const bpmControl = document.querySelector('#bpmchosen');
bpmControl.addEventListener('input', function() {
    tempo = Number(this.value);
}, false);

let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === 4) {
            currentNote = 0;
    }
}

const notesInQueue = [];

function scheduleNote(beatNumber, time) {

    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    if (pads[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playSample(audioCtx, sound);
    }
    if (pads[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playSample(audioCtx, sound);
    }
    if (pads[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playSample(audioCtx, sound);
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

let lastNoteDrawn = 3;

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
            el.children[lastNoteDrawn].style.borderColor = 'hsla(0, 0%, 10%, 1)';
            el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
        });

        lastNoteDrawn = drawNote;
    }
    // set up to draw again
    requestAnimationFrame(draw);
}

// when the sample has loaded allow play
//const loadingEl = document.querySelector('.loading');
const playButton = document.querySelector('[data-playing]');
let isPlaying = false;
setupSample()
  .then((sample) => {
    //loadingEl.style.display = 'none';

    sound = sample; // to be used in our playSample function

    playButton.addEventListener('click', ev => {
      isPlaying = !isPlaying;

      if (isPlaying) { // start playing

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler(); // kick off scheduling
        requestAnimationFrame(draw); // start the drawing loop.
        ev.target.dataset.playing = 'true';
      } else {
        window.clearTimeout(timerID);
        ev.target.dataset.playing = 'false';
      }
    })
  });
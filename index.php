<html>
<head>
<style type="text/css">
body {
  font-family: monospace;
  background: gray;
}
canvas {
  border: 1px solid white;
  background: black;
  width: 100%;
  height: 200px;
}
input[type=range] {
  -webkit-appearance: none;
  vertical-align: middle;
}
input[type=range]::-webkit-slider-runnable-track {
  background: black;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 32px;
  width: 32px;
  border: 2px solid mediumspringgreen;
  background: black;
}
.controls {
  margin-top: 10px;
  width: 100%;
  float: left;
}
.controls button {
  height: 32px;
  position: relative; /* only on specific elements */
  background: white;
  color: black;
  font-style: italic;
  border-radius: 4px;
  box-shadow: 0px 2px black;
}
.controls button:active {
  top: 2px;
  box-shadow: 0 0;
}
#virtual-keyboard button {
  width: 32px;
  height: 32px;
  position: relative;
  background: white;
  color: black;
  font-style: italic;
  border-radius: 4px;
  box-shadow: 0px 2px black;
  margin-right: 4px;
}
#virtual-keyboard button:active {
  top: 2px;
  box-shadow: 0 0;
}
#virtual-keyboard #toprow button {
  background: black;
  color: white;
  z-index: 101;
}
#virtual-keyboard #toprow button:first-child,
#virtual-keyboard #bottomrow button:first-child {
  margin-left: 18px;
} 
#virtual-keyboard #toprow button.spacer {
  visibility: hidden;
  /* margin-right: 4px; */
}
#virtual-keyboard #middlerow button {
  height: 52px;
  margin-top: -20px;
  padding-top: 22px;
  z-index: 100;
}
#virtual-keyboard #bottomrow button {
  background: lightgray;
  margin-top: 4px;
}
.flex-box {
  display: flex;
  float: left;
  width: 100%;
}
.flex-item {
  flex: 1;
}
.flex-item:last-child {
  text-align: right;
}
</style>

<script type="text/javascript" src="waveform.js"></script>

<script type="text/javascript">
var audioCtx;

// Create Oscillator node
var oscillator;

var gainNode;

// to build out note buttons.
var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// to store global variable for current octave for keyboard presses.
var octaveNum = 3;

var latestKeyPressed;
var gainTimeout;

// Takes string of Note + Octave
// Example:
// var frequency = getFrequency('C3');
var getFrequency = function (note) {
    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        octave,
        keyNumber;

    if (note.length === 3) {
        octave = note.charAt(2);
    } else {
        octave = note.charAt(1);
    }

    keyNumber = notes.indexOf(note.slice(0, -1));

    if (keyNumber < 3) {
        keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1; 
    } else {
        keyNumber = keyNumber + ((octave - 1) * 12) + 1; 
    }

    // Return frequency of note
    return 440 * Math.pow(2, (keyNumber- 49) / 12);
};

window.onload = function() {

  var btnStart = document.getElementById("start");
  btnStart.addEventListener("click", function() {
    // Create web audio API context
    audioCtx = new AudioContext();
    
    // Create Oscillator node
    oscillator = audioCtx.createOscillator();
    
    // The type property can be set to one of the following values: "sine", "square", "sawtooth", or "triangle".
    oscillator.type = "sine"; // Set waveform type
    
    // The frequency property can be dynamically changed while the oscillator is playing by using methods like setValueAtTime or linearRampToValueAtTime
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Set frequency in hertz
    
    // Create GainNode to control volume
    gainNode = new GainNode(audioCtx, { gain: rangeV.value }); // Set initial gain
    
    // Connect nodes in the audio graph
    oscillator.connect(gainNode).connect(audioCtx.destination);

    // Start the oscillator to play sound
    oscillator.start();
  
    // Start and connect oscilloscope.
    oscilloscope();
  });
  
  var btnStop = document.getElementById("stop");
  btnStop.addEventListener("click", function() {
    oscillator.stop();
  });
 
  // @todo switch to radio buttons or assign variable onclick.
  var btnSine = document.getElementById("sine");
  btnSine.addEventListener("click", function() {
    oscillator.type = "sine";
  });
  
  var btnSquare = document.getElementById("square");
  btnSquare.addEventListener("click", function() {
    oscillator.type = "square";
  });

  var btnSawtooth = document.getElementById("sawtooth");
  btnSawtooth.addEventListener("click", function() {
    oscillator.type = "sawtooth";
  });

  var btnTriangle = document.getElementById("triangle");
  btnTriangle.addEventListener("click", function() {
    oscillator.type = "triangle";
  });
  
  var rangeY = document.getElementById("y");
  var spanY = document.getElementById ("freq");
  rangeY.addEventListener("input", function() {
    if (gainNode.gain.value > 0) {
      gainNode.gain.value = rangeV.value;
    }
    //oscillator.frequency.setValueAtTime(this.value, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(this.value, audioCtx.currentTime + 0.1);
    //gainNode.gain.value = rangeV.value;
    spanY.innerHTML = this.value;
  });

  var rangeV = document.getElementById("v");
  rangeV.addEventListener("input", function() {
    gainNode.gain.value = this.value;
  });

  var rangeX = document.getElementById("x");
  var spanOctave = document.getElementById("octave");

  // create note buttons in each octave.
  // var noteTarget = document.getElementById("notes");
  // for (const octave of Array(8).keys()) {
  //   notes.forEach(note => {
  //     var btn = document.createElement('button');
  //     btn.innerHTML = note;
  //     btn.id = note + octave;
  //     btn.addEventListener("click", function() {
  //       var freq = getFrequency(this.innerHTML + octave);
  //       oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  //       rangeY.value = freq;
  //       spanY.innerHTML = freq.toFixed(2);
  //     });
  //     noteTarget.append(btn);
  //   });
  //   var br = document.createElement("br");
  //   noteTarget.append(br);
  // }

  var topNotes = [
    {
      key: 'W',
      note: 'C#',
      octave: 0,
    },
    {
      key: 'E',
      note: 'D#',
      octave: 0,
    },
    {
      key: 'spacer',
    },
    {
      key: 'T',
      note: 'F#',
      octave: 0,
    },
    {
      key: 'Y',
      note: 'G#',
      octave: 0,
    },
    {
      key: 'U',
      note: 'A#',
      octave: 0,
    },
    {
      key: 'spacer',
    },
    {
      key: 'O',
      note: 'C#',
      octave: 1,
    },
    {
      key: 'P',
      note: 'D#',
      octave: 1,
    },
  ];
  var middleNotes = [
    {
      key: 'A',
      note: 'C',
      octave: 0,
    },
    {
      key: 'S',
      note: 'D',
      octave: 0,
    },
    {
      key: 'D',
      note: 'E',
      octave: 0,
    },
    {
      key: 'F',
      note: 'F',
      octave: 0,
    },
    {
      key: 'G',
      note: 'G',
      octave: 0,
    },
    {
      key: 'H',
      note: 'A',
      octave: 0,
    },
    {
      key: 'J',
      note: 'B',
      octave: 0,
    },
    {
      key: 'K',
      note: 'C',
      octave: 1,
    },
    {
      key: 'L',
      note: 'D',
      octave: 1,
    },
    {
      key: ';',
      note: 'E',
      octave: 1,
    },
    {
      key: '"',
      note: 'F',
      octave: 1,
    },
  ];
  var bottomNotes = [
    {
      key: 'Z',
    },
    {
      key: 'X',
    },
  ];

  var setupButton = function(item) {
    var btn = document.createElement('button');
    if (item.key == "spacer") {
      btn.classList.add("spacer");
      return btn;
    }
    btn.id = item.note;
    btn.dataset.octave = item.octave;
    btn.innerHTML = item.key;
    btn.addEventListener("click", keyCallback);
    return btn;
  };

  var keyCallback = function(item) {
    var note = this.id + (parseInt(this.dataset.octave) + parseInt(octaveNum));
    var freq = getFrequency(note);
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.value = rangeV.value;
    // use lastKeyPressed to end note on mouseup?
    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);
  };

  var setupOctaveButton = function(item) {
    var btn = document.createElement('button');
    btn.id = item.key;
    btn.innerHTML = item.key;

    btn.addEventListener("click", function() {
      switch (this.id) {
        case 'Z':
          octaveNum--;
          spanOctave.innerHTML = octaveNum;
          return;
        case 'X':
          octaveNum++;
          spanOctave.innerHTML = octaveNum;
          return;
      }
    });
    return btn;
  };

  // dynamically create virtual keyboard.
  var vkTarget = document.getElementById("virtual-keyboard");
  var topNoteTarget = document.createElement("div");
  topNoteTarget.id = "toprow";
  topNotes.forEach(item => {
    var btn = setupButton(item);
    topNoteTarget.append(btn);
  });
  vkTarget.append(topNoteTarget);

  var middleNoteTarget = document.createElement("div")
  middleNoteTarget.id = "middlerow";
  middleNotes.forEach(item => {
    var btn = setupButton(item);
    middleNoteTarget.append(btn);
  });
  vkTarget.append(middleNoteTarget);
  
  var bottomNoteTarget = document.createElement("div");
  bottomNoteTarget.id = "bottomrow";
  bottomNotes.forEach(item => {
    var btn = setupOctaveButton(item);
    bottomNoteTarget.append(btn);
  });
  vkTarget.append(bottomNoteTarget);

  // add event listeners to virtual keyboard.
  // var keys = document.querySelectorAll("#keyboard button");
  // for (let i = 0; i < keys.length; i++) {
  //   keys[i].addEventListener("click", function() {
  //     console.log(this.id);

  //     switch (this.id) {
  //       case 'Z':
  //         octaveNum--;
  //         spanOctave.innerHTML = octaveNum;
  //         return;
  //       case 'X':
  //         octaveNum++;
  //         spanOctave.innerHTML = octaveNum;
  //         return;
  //     }

  //     var tmpOctave = octaveNum;
  //     if (this.dataset.octave) {
  //       tmpOctave = octaveNum + parseInt(this.dataset.octave);
  //     }
  //     freq = getFrequency(this.id + tmpOctave);
  //     gainNode.gain.value = rangeV.value;
  //     oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  //     rangeY.value = freq;
  //     spanY.innerHTML = freq.toFixed(2);
  //   });
  // }

  var body = document.querySelector("body");
  body.addEventListener("keydown", function(e) {
    // if (e.target.nodeName == "INPUT" && e.target.type == "text") {
    //   console.log(e.srcElement);
    //   return false;
    // }
    // console.log(e.code);
    latestKeyPressed = e.code;

    var note;
    switch (e.code) {
      case 'KeyZ':
        octaveNum--;
        spanOctave.innerHTML = octaveNum;
        return;
      case 'KeyX':
        octaveNum++;
        spanOctave.innerHTML = octaveNum;
        return;
      case 'KeyA':
        note = 'C' + octaveNum;
        break;
      case 'KeyS':
        note = 'D' + octaveNum;
        break;
      case 'KeyD': 
        note = 'E' + octaveNum;
        break;
      case 'KeyF':
        note = 'F' + octaveNum;
        break;
      case 'KeyG':
        note = 'G' + octaveNum;
        break;
      case 'KeyH':
        note = 'A' + octaveNum;
        break;
      case 'KeyJ':
        note = 'B' + octaveNum;
        break;
      case 'KeyK':
        note = 'C' + (octaveNum + 1);
        break;
      case 'KeyL':
        note = 'D' + (octaveNum + 1);
        break;
      case 'Semicolon':
        note = 'E' + (octaveNum + 1);
        break;
      case 'Quote':
        note = 'F' + (octaveNum + 1);
        break;

      case 'KeyW':
        note = 'C#' + octaveNum;
        break;
      case 'KeyE':
        note = 'D#' + octaveNum;
        break;
      case 'KeyT':
        note = 'F#' + octaveNum;
        break;
      case 'KeyY':
        note = 'G#' + octaveNum;
        break;
      case 'KeyU':
        note = 'A#' + octaveNum;
        break;
      case 'KeyO':
        note = 'C#' + (octaveNum + 1);
        break;
      case 'KeyP':
        note = 'D#' + (octaveNum + 1);
        break;
    }

//     var mapping = {
//       'KeyA': 'C' + octaveNum,
//       'KeyS': 'D' + octaveNum,
//       'KeyD': 'E' + octaveNum,
//       'KeyF': 'F' + octaveNum,
//       'KeyG': 'G' + octaveNum,
//       'KeyH': 'A' + octaveNum,
//       'KeyJ': 'B' + octaveNum,
//       'KeyK': 'C' + (octaveNum + 1),
//       'KeyL': 'D' + (octaveNum + 1),
//       'Semicolon': 'E' + (octaveNum + 1),
//       'Quote': 'F' + (octaveNum + 1),
// 
//       'KeyW': 'C#' + octaveNum,
//       'KeyE': 'D#' + octaveNum,
//       'KeyT': 'F#' + octaveNum,
//       'KeyY': 'G#' + octaveNum,
//       'KeyU': 'A#' + octaveNum,
//       'KeyO': 'C#' + (octaveNum + 1),
//       'KeyP': 'D#' + (octaveNum + 1),
//     };

    // clearTimeout to lower volume
    clearTimeout(gainTimeout);

    var freq = getFrequency(note);
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    //gainNode.gain.value = rangeV.value;
    gainNode.gain.linearRampToValueAtTime(rangeV.value, audioCtx.currentTime + parseFloat(rangeX.value));

    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);

    //var btn = document.getElementById(note);
    //btn.style.fontWeight = "bold";

    e.preventDefault();
    
  });

  body.addEventListener("keyup", function(e) {
    if (e.code != latestKeyPressed) {
      return;
    }
    // setTimeout to lower volume
    gainTimeout = setTimeout(function() { 
      // gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + parseFloat(rangeX.value));
    }, 100);
  });

};
</script>
</head>

<body>

<h1>Oscilloscope</h1>
<canvas id="oscilloscope"></canvas>

<div class="controls">
  <div style="float: left">
    Oscillator
    <button id="start">Start</button>
    <button id="stop">Stop</button>
  </div>
  <div style="float:right">
    <button id="sine">Sine</button>
    <button id="square">Square</button>
    <button id="sawtooth">Sawtooth</button>
    <button id="triangle">Triangle</button>
  </div>
</div>

<div class="controls">
  <p>
    <input id="y" type="range" min="0" max="20000" value="440" step="1" style="width: 100%;" />
    <span id="freq">440</span> Hz
  </p>
</div>

<div class="flex-box">
  <div class="flex-item">
    Gain: <input id="v" type="range" min="0" max="1" step="0.01" value="0.1" />
    Octave: <span id="octave">3</span>
  </div>
  <div id="virtual-keyboard"></div>
  <div class="flex-item">
    Decay: <input id="x" type="range" min="0" max="1" value="0.1" step="0.1" />
  </div>
</div>

<input type="text" placeholder="Type here on mobile" />

<!--
<div id="keyboard">
  <div id="toprow">
    <button id="C#">W</button>
    <button id="D#">E</button>
    <button class="spacer">
    <button id="F#">T</button>
    <button id="G#">Y</button>
    <button id="A#">U</button>
    <button class="spacer">
    <button id="C#" data-octave="1">O</button>
    <button id="D#" data-octave="1">P</button>
  </div>
  <div id="middlerow">
    <button id="C">A</button>
    <button id="D">S</button>
    <button id="E">D</button>
    <button id="F">F</button>
    <button id="G">G</button>
    <button id="A">H</button>
    <button id="B">J</button>
    <button id="C" data-octave="1">K</button>
    <button id="D" data-octave="1">L</button>
    <button id="E" data-octave="1">;</button>
    <button id="F" data-octave="1">"</button>
  </div>
  <div id="bottomrow">
    <button id="Z">Z</button>
    <button id="X">X</button>
  </div>
</div>

<p>
<h2>Input by mouse/keyboard</h2>
<div id="notes"></div>
<a onclick="window.open('iJ4XT.png', 'name', 'height=288,width=706,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no');return false">How to play</a>
</p>
-->


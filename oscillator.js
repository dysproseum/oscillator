// Create web audio API context
var audioCtx;

// Create Oscillator node
var oscillators = [];

var gainNode;

// to build out note buttons.
//var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// to store global variable for current octave for keyboard presses.
var octaveNum = 3;

var gainTimeout;

var waveType = "sine";

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
    
    // Create GainNode to control volume
    gainNode = new GainNode(audioCtx, { gain: rangeV.value }); // Set initial gain
    
    // Start and connect oscilloscope.
    oscilloscope();
  });
  
  var btnStop = document.getElementById("stop");
  btnStop.addEventListener("click", function() {
    for (i in oscillators) {
      oscillators[i].stop();
      delete oscillators[i];
    }
  });
 
  // Assign waveType variable onclick.
  var btnSine = document.getElementById("sine");
  btnSine.addEventListener("click", function() {
    waveType = "sine";
  });
  
  var btnSquare = document.getElementById("square");
  btnSquare.addEventListener("click", function() {
    waveType = "square";
  });

  var btnSawtooth = document.getElementById("sawtooth");
  btnSawtooth.addEventListener("click", function() {
    waveType = "sawtooth";
  });

  var btnTriangle = document.getElementById("triangle");
  btnTriangle.addEventListener("click", function() {
    waveType = "triangle";
  });
  
  var rangeY = document.getElementById("y");
  var spanY = document.getElementById ("freq");
  rangeY.addEventListener("input", function() {
    if (gainNode.gain.value > 0) {
      gainNode.gain.value = rangeV.value;
    }
    // Create Oscillator node
    if (!oscillators["slider"]) {
      oscillators["slider"] = audioCtx.createOscillator();
      oscillators["slider"].connect(gainNode).connect(audioCtx.destination);
      oscillators["slider"].start();
    }

    oscillators["slider"].type = waveType; // Set waveform type
    oscillators["slider"].frequency.setValueAtTime(this.value, audioCtx.currentTime);
    //oscillator.frequency.setValueAtTime(this.value, audioCtx.currentTime);
    //oscillator.frequency.linearRampToValueAtTime(this.value, audioCtx.currentTime + 0.1);
    //gainNode.gain.value = rangeV.value;
    spanY.innerHTML = this.value;
  });

  var rangeV = document.getElementById("v");
  rangeV.addEventListener("input", function() {
    gainNode.gain.value = this.value;
  });

  var rangeX = document.getElementById("x");
  var spanOctave = document.getElementById("octave");

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

    btn.addEventListener("mousedown", btnPress);
    btn.addEventListener("touchstart", btnPress);
    btn.addEventListener("mouseup", btnRelease);
    btn.addEventListener("mouseout", btnRelease);
    btn.addEventListener("touchend", btnRelease);
    btn.addEventListener("selectstart", function() {
      return false;
    });
    return btn;
  };

  var btnPress = function(e) {
    // Ignore right clicks. Touch presses are e.button == undefined.
    if (e.button == 2) {
      return;
    }

    oscillators[this.id] = audioCtx.createOscillator();
    oscillators[this.id].type = waveType; // Set waveform type
    oscillators[this.id].connect(gainNode).connect(audioCtx.destination);

    var note = this.id + (parseInt(this.dataset.octave) + parseInt(octaveNum));
    var freq = getFrequency(note);
    oscillators[this.id].frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillators[this.id].start();
    //gainNode.gain.value = rangeV.value;

    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);
  };

  var btnRelease = function(e) {
    //console.log(e);
    if (oscillators[this.id]) {
      oscillators[this.id].stop();
    }
    //delete oscillators[this.id];
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

  var body = document.querySelector("body");
  body.addEventListener("keydown", function(e) {
    if (e.target.nodeName == "INPUT" && e.target.type == "text") {
      //e.preventDefault();
      // return false;
      //console.log(e.code);
    }
    // console.log(e.code);

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

    // clearTimeout to lower volume
    //clearTimeout(gainTimeout);

    if (!note) {
      return;
    }

    // Create Oscillator node
    if (oscillators[e.code]) {
      return;
    }

    if (!audioCtx) {
      return;
    }
    oscillators[e.code] = audioCtx.createOscillator();
    oscillators[e.code].type = waveType; // Set waveform type
    oscillators[e.code].connect(gainNode).connect(audioCtx.destination);

    var freq = getFrequency(note);
    oscillators[e.code].frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillators[e.code].start();
    //gainNode.gain.value = rangeV.value;
    //gainNode.gain.linearRampToValueAtTime(rangeV.value, audioCtx.currentTime + parseFloat(rangeX.value));

    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);

    e.preventDefault();
    
  });

  body.addEventListener("keyup", function(e) {
    // this event fires right away on mobile keyboard input.
    var timeout = 0;
    if (e.target.nodeName == "INPUT" && e.target.type == "text") {
      timeout = 100;
    }

    // setTimeout to lower volume
    gainTimeout = setTimeout(function() { 
      if (oscillators[e.code]) {
        oscillators[e.code].stop();
        delete oscillators[e.code];
      }
      // gainNode.gain.value = 0;
      // gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + parseFloat(rangeX.value));
    }, timeout);
  });

};

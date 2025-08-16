// Create web audio API context
var audioCtx;

// Create Oscillator node
var oscillators = [];
var gainNode;
var gainNodes = [];
var keyData = [];

// to store global variable for current octave for keyboard presses.
var octaveNum = 3;
var spanOctave;

var waveType = "sine";
let delay;

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
    var baseNote = document.querySelector("input[name=base]:checked").value;
    return baseNote * Math.pow(2, (keyNumber- 49) / 12);
};

function mapKeyToNote(key) {

    var note;
    switch (key) {
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
    return note;
}

function toggleKeyPress() {
    // @todo get button by id and add class "active"
    var btnId = note.slice(0, -1);
    var dataOctave = note.slice(1) - numOctave;
    var btn = document.getElementById(btnId);
    btn.classList.add("active");
}

function getCombFilter(audioCtx){
  const node = audioCtx.createGain()
  const lowPass = new BiquadFilterNode(audioCtx, {type: 'lowpass', frequency: 440})
  delay = new DelayNode(audioCtx, {delayTime: 0.25})
  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.5, audioCtx.currentTime)

  node
    .connect(delay)
    .connect(lowPass)
    .connect(gain)
    .connect(node)

  return node
}

window.onload = function() {

  var btnStart = document.getElementById("start");
  btnStart.addEventListener("click", function() {
    // Create web audio API context
    audioCtx = new AudioContext();
    
    // Create GainNode to control volume
    gainNode = new GainNode(audioCtx, { gain: rangeV.value }); // Set initial gain

    // Reverb
    var reverb = document.getElementById("reverb");
    reverb.addEventListener("change", function() {
      delay.delayTime.value = this.value;
    });

    // https://itnext.io/convolution-reverb-and-web-audio-api-8ee65108f4ae
    const combFilter = getCombFilter(audioCtx);
    const output = audioCtx.destination;
    gainNode
      .connect(combFilter)
      .connect(output);

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

  var rangeA = document.getElementById("a");
  var rangeD = document.getElementById("d");
  var rangeS = document.getElementById("s");
  var rangeR = document.getElementById("r");
  spanOctave = document.getElementById("octave");

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

    var note = this.id + (parseInt(this.dataset.octave) + parseInt(octaveNum));
    var freq = getFrequency(note);

    // Use keyData array with gainNodes.
    if (keyData[this.id]) {
      if (keyData[this.id]['oscillator'].frequency.value.toFixed(2) != freq.toFixed(2)) {
        keyData[this.id]['oscillator'].frequency.setValueAtTime(freq, audioCtx.currentTime);
      }
      if (keyData[this.id]['oscillator'].type != waveType) {
        keyData[this.id]['oscillator'].type = waveType;
      }

      // Ramp quickly up - attack.
      keyData[this.id]['gain'].gain.setTargetAtTime(parseFloat(rangeV.value) + 0.2, audioCtx.currentTime, parseFloat(rangeA.value));
      // Then decay down to a sustain level
      keyData[this.id]['gain'].gain.setTargetAtTime(parseFloat(rangeS.value), audioCtx.currentTime + parseFloat(rangeA.value), parseFloat(rangeD.value));
    }
    else {
      keyData[this.id] = [];
      keyData[this.id]['gain'] = new GainNode(audioCtx, { gain: 0 });
      keyData[this.id]['oscillator'] = audioCtx.createOscillator();
      keyData[this.id]['oscillator'].connect(keyData[this.id]['gain']).connect(gainNode).connect(audioCtx.destination);
      keyData[this.id]['oscillator'].type = waveType; // Set waveform type
      keyData[this.id]['oscillator'].frequency.setValueAtTime(freq, audioCtx.currentTime);
      keyData[this.id]['oscillator'].start();

      // Ramp quickly up - attack.
      keyData[this.id]['gain'].gain.setTargetAtTime(parseFloat(rangeV.value) + 0.2, audioCtx.currentTime, parseFloat(rangeA.value));
      // Then decay down to a sustain level
      keyData[this.id]['gain'].gain.setTargetAtTime(parseFloat(rangeS.value), audioCtx.currentTime + parseFloat(rangeA.value), parseFloat(rangeD.value));
    }

    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);
  };

  var btnRelease = function(e) {
    var release = parseFloat(rangeR.value);
    // lower volume immediately.
    keyData[this.id]['gain'].gain.cancelScheduledValues(audioCtx.currentTime);
    keyData[this.id]['gain'].gain.setTargetAtTime(0, audioCtx.currentTime, release);
    console.log("start gain lowering");
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
    console.log(e.keyCode);
    if (e.target.nodeName == "INPUT" && e.target.type == "text") {
      // e.preventDefault();
      // return false;
      // console.log(e.code);
    }
    // console.log(e.code);

    if (!audioCtx) {
      return;
    }

    var note = mapKeyToNote(e.code);
    if (!note) {
      return;
    }
    var freq = getFrequency(note);

    // Oscillator and gainNode are reused.
    if (keyData[e.code] && keyData[e.code]['timeout']) {
      clearTimeout(keyData[e.code]['timeout']);
      delete keyData[e.code]['timeout'];

      //keyData[e.code]['gain'].gain.cancelScheduledValues(audioCtx.currentTime);
      if (keyData[e.code]['oscillator'].frequency.value.toFixed(2) != freq.toFixed(2)) {
        keyData[e.code]['oscillator'].frequency.setValueAtTime(freq, audioCtx.currentTime);
      }
      if (keyData[e.code]['oscillator'].type != waveType) {
        keyData[e.code]['oscillator'].type = waveType;
      }

      // Ramp quickly up - attack.
      keyData[e.code]['gain'].gain.setTargetAtTime(parseFloat(rangeV.value) + 0.2, audioCtx.currentTime, parseFloat(rangeA.value));
      // Then decay down to a sustain level
      keyData[e.code]['gain'].gain.setTargetAtTime(parseFloat(rangeS.value), audioCtx.currentTime + parseFloat(rangeA.value), parseFloat(rangeD.value));
    }
    else if (keyData[e.code]) {
      // this event keeps getting fired while the key is held down.
      return;
    }
    else {
      keyData[e.code] = [];
      keyData[e.code]['gain'] = new GainNode(audioCtx, { gain: 0 });
      keyData[e.code]['oscillator'] = audioCtx.createOscillator();
      keyData[e.code]['oscillator'].connect(keyData[e.code]['gain']).connect(gainNode).connect(audioCtx.destination);
      keyData[e.code]['oscillator'].type = waveType; // Set waveform type
      keyData[e.code]['oscillator'].frequency.setValueAtTime(freq, audioCtx.currentTime);
      keyData[e.code]['oscillator'].start();

      // Ramp quickly up - attack.
      keyData[e.code]['gain'].gain.setTargetAtTime(parseFloat(rangeV.value) + 0.2, audioCtx.currentTime, parseFloat(rangeA.value));
      // Then decay down to a sustain level
      keyData[e.code]['gain'].gain.setTargetAtTime(parseFloat(rangeS.value), audioCtx.currentTime + parseFloat(rangeA.value), parseFloat(rangeD.value));
    }

    rangeY.value = freq;
    spanY.innerHTML = freq.toFixed(2);

    e.preventDefault();
    
  });

  body.addEventListener("keyup", function(e) {

    var release = parseFloat(rangeR.value);
    // this event fires right away on mobile keyboard input.
    // delay stopping oscillators otherwise no sound is heard.
    if (e.target.nodeName == "INPUT" && e.target.type == "text") {
      keyData[e.code]['timeout'] = setTimeout(function() {
        // oscillators[e.code].stop();
        // delete oscillators[e.code];
        keyData[e.code]['gain'].gain.cancelScheduledValues(audioCtx.currentTime);
        keyData[e.code]['gain'].gain.setTargetAtTime(0, audioCtx.currentTime, release);
      }, release * 1000);
      return;
    }

    if (!keyData[e.code]) {
      return;
    }

    // lower volume immediately.
    keyData[e.code]['gain'].gain.cancelScheduledValues(audioCtx.currentTime);
    keyData[e.code]['gain'].gain.setTargetAtTime(0, audioCtx.currentTime, release);
    // console.log("start gain lowering");

    // then setTimeout to kill oscillator.
    keyData[e.code]['timeout'] = setTimeout(function() {
      if (keyData[e.code]['oscillator']) {
        // console.log("end gain lowering");
        // @todo keep all nodes?
        // keyData[e.code]['gain'].disconnect();
        // keyData[e.code]['oscillator'].stop();
        // delete keyData[e.code];
      }
    }, release * 1000);

  });

};

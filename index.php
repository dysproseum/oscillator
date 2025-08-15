<html>
<head>
<link rel="stylesheet" href="style.css" type="text/css">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
<link rel="stylesheet" media="only screen and (max-width: 768px)" href="mobile.css" type="text/css">
<script type="text/javascript" src="oscilloscope.js"></script>
<script type="text/javascript" src="oscillator.js"></script>
</head>

<body>
  <h1>Oscilloscope</h1>
  <canvas id="oscilloscope"></canvas>
  
  <div class="controls">
    <div style="float: left">
      Oscillator
      <button id="start">Start</button>
      <button id="stop">Stop</button>
      <input type="radio" name="base" value="440" checked="checked" /> 440Hz
      <input type="radio" name="base" value="432" /> 432Hz
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
      Gain: <input id="v" type="range" min="0" max="1" step="0.1" value="0.5" />
      Octave: <span id="octave">3</span>
    </div>
    <div id="virtual-keyboard"></div>
    <div class="flex-item">
      <div class="flex-row" style="margin-right: 0.5rem;">
        Attack: <input id="a" type="range" min="0" max="1" value="0.01" step="0.01" />
        Decay: <input id="d" type="range" min="0" max="1" value="0.25" step="0.01" />
      </div>
      <div class="flex-row">
        Sustain: <input id="s" type="range" min="0" max="1" value="0.25" step="0.01" />
        Release: <input id="r" type="range" min="0" max="1" value="0.01" step="0.01" />
      </div>
    </div>
  </div>
  
  <input type="text" placeholder="Type here on mobile" />

</body>
</html>

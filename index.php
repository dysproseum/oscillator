<html>
<head>
<link rel="stylesheet" href="style.css">
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

</body>
</html>

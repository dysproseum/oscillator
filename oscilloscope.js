function oscilloscope() {
  const analyser = audioCtx.createAnalyser()
  gainNode.connect(analyser)
  
  const waveform = new Float32Array(analyser.frequencyBinCount)
  analyser.getFloatTimeDomainData(waveform)
  
  // At this point, the waveform array will contain values from -1 to 1 corresponding to the audio waveform playing through the masterGain node. This is just a snapshot of whatever’s currently playing. In order to be useful, we need to update the array periodically. It’s a good idea to update the array in a requestAnimationFrame callback.
  
  ;(function updateWaveform() {
    requestAnimationFrame(updateWaveform)
    analyser.getFloatTimeDomainData(waveform)
  })()
  
  // The waveform array will now be updated 60 times per second, which brings us to the final ingredient: some drawing code. In this example, we simply plot the waveform on the y-axis like an oscilloscope.
  
  const scopeCanvas = document.getElementById('oscilloscope')
  scopeCanvas.width = waveform.length
  // scopeCanvas.width = 320;
  scopeCanvas.height = 200
  const scopeContext = scopeCanvas.getContext('2d')

  scopeContext.strokeStyle = "mediumspringgreen";
  scopeContext.lineWidth = 3;
  
  ;(function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope)
    scopeContext.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height)
    scopeContext.beginPath()
    for (let i = 0; i < waveform.length; i++) {
      const x = i
      const y = (0.5 + waveform[i] / 2) * scopeCanvas.height;
      if (i == 0) {
        scopeContext.moveTo(x, y)
      } else {
        scopeContext.lineTo(x, y)
      }
    }
    scopeContext.stroke()
  })()
}

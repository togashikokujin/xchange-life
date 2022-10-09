/* Create an unique private namespace to contain custom code. */
if (!window.GE) {
  window.GE = {};
};

window.GE.detachVideos = function () {
  var videoList = document.getElementsByTagName("video");
  for (var videoElement of videoList) {
    videoElement.pause();
    // Handle "src" attribute
    videoElement.removeAttribute("src");
    // Handle <source> children
    while (videoElement.hasChildNodes()) {
      videoElement.removeChild(videoElement.firstChild);
    }
    videoElement.load();
  }
};

window.GE.detachAudio = function () {
  var audioList = document.getElementsByTagName("audio");
  for (var audioElement of audioList) {
    audioElement.pause();
    // Handle "src" attribute
    audioElement.removeAttribute("src");
  }
};

if (typeof window.CustomScripts == "undefined") {
  window.CustomScripts = {
    updateVariable(inputName) {
      // Get the value from the input textbox at time of click.
      var value = $("input[name='" + inputName + "']")[0].value;
      // Update the variable.
      State.variables[inputName] = value;
    }
  };
};

window.getStoragePrefix = function () {
  return "(Saved Game " + Engine.options.ifid + ") ";
}

window.deleteSaveSlot = function (slotName) {
  localStorage.removeItem(getStoragePrefix() + slotName);
}
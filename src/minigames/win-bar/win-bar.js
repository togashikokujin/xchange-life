window.GE.updateStats = function(win_threshold, win) {
  var
      winClamped = Math.min(Math.max(win, 0), win_threshold),
      winBar = $('#win-bar'),
      winProgress = winBar.find('.bar'),
      winBarWidth = (winClamped / win_threshold) * 100;

  winBar.data('total', win_threshold);
  winBar.data('value', winClamped);
  winProgress.css('width', winBarWidth + "%");
};
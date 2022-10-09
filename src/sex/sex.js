/* Update Chance Bar elements. */
window.GE.updateChance = function(chance) {
  var
      chanceBar = $('#chance-bar'),
      chanceProgress = chanceBar.find('.chance-bar'),
      chanceBarWidth = chance;

  chanceBar.data('total', 100);
  chanceBar.data('value', chance);
  chanceProgress.css('width', chanceBarWidth + "%");
};

/* Update Health Bar elements. */
window.GE.updateYourPleasure = function(yourPleasure) {
  var
      yourPleasureBar = $('#your-pleasure-bar'),
      yourPleasureProgress = yourPleasureBar.find('.your_pleasure_bar'),
      yourPleasureBarWidth = (yourPleasure / 10) * 100;

  yourPleasureBar.data('total', 10);
  yourPleasureBar.data('value', yourPleasure);
  yourPleasureProgress.css('width', yourPleasureBarWidth + "%");
};

/* Update Health Bar elements. */
window.GE.updateHisPleasure = function(hisPleasure,hisPleasureMax) {
  var
      hisPleasureBar = $('#his-pleasure-bar'),
      hisPleasureProgress = hisPleasureBar.find('.his_pleasure_bar'),
      hisPleasureBarWidth = (hisPleasure / hisPleasureMax) * 100;

  hisPleasureBar.data('total', hisPleasureMax);
  hisPleasureBar.data('value', hisPleasure);
  hisPleasureProgress.css('width', hisPleasureBarWidth + "%");
};
jQuery(document).ready(function($) {
  $(document).on('lemmapopupWord', function (e, word, $content) {
    // console.log(docs.plugins.morphology.morphWindow.rows);
    
    $('<button class="lemma-button search-button">Search</button>').prependTo($content).button({
      icons: {
        primary: "ui-icon-search"
      }
    }).on('click', function () {
      $(this).siblings('.find-links').slideToggle();
    });
    
    $('<button class="lemma-button highlight-button">Highlight</button>').prependTo($content).button({
      icons: {
        primary: "ui-icon-tag"
      }
    }).on('click', function () {
      if (!docs.plugins.morphology.morphWindow.rows.find('.morph-row[data-selector="' + word.strongKey + '"]').length) {
        //Create new morph highlighter if one for this strongs number doesn't exist yet.
  			var row = docs.plugins.morphology.createRow(word.strongKey);
  			row.find('.morph-data input').val();
  			docs.plugins.morphology.morphWindow.rows.append(row);        
      }
      docs.plugins.morphology.morphWindow.rows.children('div').removeClass('selected')
        .filter('.morph-row[data-selector="' + word.strongKey + '"]').addClass('selected');
      docs.plugins.morphology.morphWindow.show();
    });
    
    
  });
});
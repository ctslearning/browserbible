jQuery(document).ready(function($) {
  $(document).on('lemmapopupWord', function (e, word, $content) {
    console.log(docs.plugins.morphology.morphWindow.rows);
    
    $('<a class="lemma-button search-button">Search</a>').prependTo($content).button({
      icons: {
        primary: "ui-icon-search"
      }
    }).on('click', function () {
      $(this).siblings('.find-links').toggle();
      return false;
    });
    
    $('<a class="lemma-button highlight-button">Highlight</a>').prependTo($content).button({
      icons: {
        primary: "ui-icon-tag"
      }
    }).on('click', function () {
      if (!docs.plugins.morphology.morphWindow.rows.find('.morph-row[data-selector="' + word.strongKey + '"]').length) {
        //Create new morph highlighter if one for this strongs number doesn't exist yet.
  			var row = docs.plugins.morphology.createRow();
  			row.find('.morph-data input').val(word.strongKey);
  			docs.plugins.morphology.morphWindow.rows.append(row);        
      }
      docs.plugins.morphology.morphWindow.show();
      
      return false;
    });
    
    
  });
});
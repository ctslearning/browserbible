jQuery(document).ready(function($) {
  
  
  $(document).on('resourceLoad', function (e, resource, wrapper) {
    /*
    * Verse utility links requiring new windows
    */
    wrapper.find('a.utility').attr('href', function () {
      return verseUtilityURL($(this));
    }).not('.blank').on('click', function () {
      lightBox($(this).attr('href'));
      return false;
    });
    
  });
  
  $(document).on('historyUpdate', function (e) {
    $('a.utility').attr('href', function () {
      return verseUtilityURL($(this));
    });
  });
  
});

function verseUtilityURL($anchor) {
  var parts = History.getState().data.verse.split('.');
  var pattern = $anchor.attr('rel');
  var book = parts[0].toLowerCase();
  var fullbook = bible.BOOK_DATA[parts[0]].names['eng'][0].replace(' ' , '_').toLowerCase();
  fullbook = (fullbook == 'psalm') ? fullbook + 's' : fullbook; //Add s to end of Psalms
  var chapter = parts[1];
  var verse = parts[2];
  var link = _.template(pattern, {book: book, fullbook: fullbook, chapter: chapter, verse: verse});
  return link;
}

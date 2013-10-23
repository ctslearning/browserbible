jQuery(document).ready(function($) {
  
  
  $(document).on('resourceLoad resourcePopupLoad', function (e, resource, wrapper) {

    //Make verse direct open synced bibles to the verse.
    wrapper.find('a.verse').on('click', function () {
      syncVerse($(this).text());
      return false;
    });


  });
  
  
});

function syncVerse(verse) {
  docs.DocManager.sync(null, bible.BibleNavigator.parseString(verse));
}
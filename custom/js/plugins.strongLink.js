jQuery(document).ready(function($) {
  $(document).on('lemmapopupWord', function (e, word, $content) {
    $content.find('a.strong-link').on('click', function () {
      lightBox(strongLink(word));
      return false;
    });
  });
});

function strongLink(word) {
  var lang, num = word.strongKey.slice(1);
  switch (word.strongLetter) {
    case 'H':
      lang = 'hebrew';
      break;
    case 'G':;
      lang = 'greek';
      break;
  }
    
  return 'http://biblesuite.com/' + lang + '/' + num + '.htm';
}
/**
 * Highlights verses on mouseover and attempts to find similar verses in other panes
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.matchverses = {

	init: function( docManager ) { 
	
		var verseClass = 'verse-highlight',
			highlightTimer = null,
			clearTimer = function() {
				if (highlightTimer !== null) {
					clearTimeout(highlightTimer);
					highlightTimer = null;
				}				
			},
			startTimer = function() {
				clearTimer();
				highlightTimer = setTimeout(function() {
					removeHighlights();
				}, 500);
			},
			removeHighlights = function() {
				$('.' + verseClass).removeClass(verseClass);
			}
		
		if (docs.Features.hasTouch) {
      docManager.content.on('doubletap', 'span.verse', function() {
        hoverVerse($(this));
        e.stopPropagation();
      });
		} else {
		
			docManager.content.on('mouseover', 'span.verse', function() {
        hoverVerse($(this));
			}).on('mouseout', 'span.verse', function() {				
				startTimer();
			});
		}
        

    
    
    function hoverVerse(verse) {
			removeHighlights();
			clearTimer();
			
			var verseId = verse.attr('data-osis');
				
			$('.' + verseClass).removeClass( verseClass );
			
			//$('span.verse[data-osis="' + verseId + '"]').addClass(verseClass);
			
			$('span.' + verseId.replace(/\./gi,'_') ).addClass(verseClass);
    }
	}
};

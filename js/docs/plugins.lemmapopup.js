	
/**
 * Original language options
 *
 * @author John Dyer (http://j.hn/)
 */
 
docs.plugins.lemmapopup = {

	init: function(docManager) {
		
		// create popup
		var
			wordAwaitingData = null,
			selectedWord = null,
			selectedWordVersion = '',
			lemmaSelectedClass = 'lemma-selected',
			popup = docs.createModal('lemma', docs.Localizer.get('plugin_lemma_title')),
			timer = null,
			startTimer = function() {				
				stopTimer();
				console.log('starting timer');
				timer = setTimeout(function() {
					$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);
					popup.hide().content.scrollTop(0);
				}, 3000);
			},
			stopTimer = function() {
				if (timer != null) {
					clearTimeout(timer);
					timer = null;
				}
			};
			
		popup.size(400,300);
		popup.content.css('overflow','auto');
		
		popup.footer.remove();
		popup.window
			.on('mouseleave', function() {
				startTimer();
			})
			.on('mouseover', function() {
				stopTimer();	
			})
			.on('click', '.strong-search', function() {
				
				//console.log('lemma clikc');
				var strongSearch = $(this),
					strongKey = strongSearch.attr('data-strong');
					
				docs.Search.searchVersion.data("selectBox-selectBoxIt").selectOption( selectedWordVersion );
				docs.Search.searchInput.val( strongKey );
				docs.Search.searchWindow.show();
				docs.Search.doSearch();
			})			
			.find('.popup-close')
				.on('click', function() {
					stopTimer();
					$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);					
				})
			.end();
				
		// force load	
		//loadScripts('G');
		//loadScripts('H');
								
		// finds data on a <span class="word"> and gets its morph and lemma data
		function getWordData(word) {
				
			var lemma = word.attr('data-lemma'),
				lemmaParts = lemma != null ? lemma.split(' ') : [],
				morph = word.attr('data-morph'),
				morphParts = morph != null ? morph.split(' ') : [],
				wordData = [],
				strongLetter = '',
				strongInfo = '',
				strongKey = '',
				outline = '',
				strongNumber = 0, 
				strongData = {};
				
			if (lemmaParts.length > 0) {
			
				for (var i=0, il=lemmaParts.length; i<il; i++) {
					strongInfo = lemmaParts[i].replace('strong:','');
					strongLetter = strongInfo.substring(0,1);
					strongNumber = parseInt(strongInfo.substring(1), 10);
					strongKey = strongLetter + strongNumber.toString();
					morph = (i< morphParts.length) ? morphParts[i].replace('robinson:','') : '';
						
					if (strongLetter == 'H') {
						
						if (typeof strongsHebrewDictionary == 'undefined' || typeof strongsHebrewOutlines == 'undefined') {
							loadScripts('H');
							return null;
						}
						
						strongData = strongsHebrewDictionary[strongKey];
						outline = strongsHebrewOutlines[strongKey];
					} else if (strongLetter == 'G') {
						
						if (typeof strongsGreekDictionary == 'undefined' || typeof strongsGreekOutlines == 'undefined') {
							loadScripts('G');
							return null;
						}
						
						strongData = strongsGreekDictionary[strongKey];
						outline = strongsGreekOutlines[strongKey];
					}
					
					if (typeof strongData != 'undefined') {
						wordData.push({
							strongLetter: strongLetter,
							strongData: strongData,
							strongKey: strongKey,
							outline: outline,
							morph: morph,
							frequency: (strongLetter == 'G') ? strongsGreekFrequencies[strongKey] : strongsHebrewFrequencies[strongKey	],
							formattedMorph: (strongLetter == 'G' && morph != '') ? bible.morphology.Greek.getMorphology( morph ) : []
						});
					}
				}
			}
			
			return wordData;
				
		};
		
	
		// define mouseover and click events for words
		docManager.content.on('mouseover', 'span.w', function() {
			
			var word = $(this);
			
			loadWordIntoFooter(word);
			
		}).on('click', 'span.w', function() {
			
			// remove exising highlight
			$('.' + lemmaSelectedClass).removeClass(lemmaSelectedClass);
			
			var word = $(this);
			
			selectedWordVersion = word.closest('.document-container').find('.document-header select').val();
			
			loadWordIntoPopup(word);
		});
		
		function loadWordIntoPopup(word) {

			// if this word is clicked a second time
			if (selectedWord != null && selectedWord.html() == word.html() && popup.window.is(':visible')) {
				word.removeClass(lemmaSelectedClass);
				popup.hide().content.scrollTop(0);
				return;
			}


			// hghlight this one
			word.addClass(lemmaSelectedClass);

			// get data for word
			var 
				wordData = getWordData(word),
				formattedWords = [];
				
			if (wordData == null) {
				
				popup.content.html( 'Loading data' );
				wordAwaitingData = word;
				
			} else if (wordData.length > 0) {
				
				// store for lemma search
				selectedWord = word;
				
				fillPopup(wordData);
				
			}
				
				
			if (wordData == null || wordData.length > 0) {
				// measure position
				var 
					wordPos = word.offset(),
					wordWidth = word.width(),
					wordHeight = word.height(),
					popupWidth = popup.window.outerWidth(true),
					popupHeight = popup.window.outerHeight(true),
					windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					windowScrollTop = $(window).scrollTop(),
					// default to below and to the right
					top = (wordPos.top + wordHeight + popupHeight - windowScrollTop > windowHeight) ? wordPos.top - popupHeight - 5 : wordPos.top + wordHeight + 4,
					left = (wordPos.left + popupWidth > windowWidth) ? windowWidth - popupWidth : wordPos.left;
				
				console.log(wordPos.top + wordHeight + popupHeight - windowScrollTop, windowHeight);
		
				// place me!	
				popup.window.css({top: top, left: left});
				popup.show().content.scrollTop(0);
				
				stopTimer();
        
				$(document).one('mousemove', function() {
					startTimer();
				});
			}			
			
		}
		
		function loadWordIntoFooter(word) {

			var 
				wordData = getWordData(word),
				formattedWords = [];
			
			if (wordData != null && wordData.length > 0) {
				
				for (var i=0, il=wordData.length; i<il; i++) {
					formattedWords.push(
						'<span class="lex-entry">' +
							'<span class="lemma ' + (wordData[i].strongLetter == 'H' ? 'hebrew' : 'greek') + '">' + wordData[i].strongData.lemma + '</span> (<span class="strongs-number">' + wordData[i].strongKey + '</span>) ' +
							(wordData[i].formattedMorph != '' ? '<span class="morphology">' + wordData[i].formattedMorph.join(', ') + '</span>' : '') +
							' - <span class="definition">' + wordData[i].strongData.strongs_def + '</span>' +
						'</span>'
					);
				}
				
				word
					.closest('.document-container')
					.find('.document-footer')
					.html(formattedWords.join('; '));
			}			
		}
		
		function fillPopup(wordData) {
			
			var formattedWords = $('<div></div>');
			
			// format for popup		
			for (var i=0, il=wordData.length; i<il; i++) {
        var formattedMorph = [];
        for (var x = 0; x < wordData[i].formattedMorph.length; x++) {
          formattedMorph.push('<a href="#term-' + wordData[i].formattedMorph[x].replace(/[^A-Za-z]/g, '-') + '" class="glossary-term">' + wordData[i].formattedMorph[x] + '</a>');
        }
          
        var formattedWord = $(_template('lemmapopup', {
          strongLetter: wordData[i].strongLetter == 'H' ? 'hebrew' : 'greek',
          lemma: wordData[i].strongData.lemma,
          strongKey: wordData[i].strongKey,
          formattedMorph: formattedMorph.join(', '),
          frequency: wordData[i].frequency, 
          definition: wordData[i].strongData.strongs_def,
          outline: wordData[i].outline
        })); 
        
        $.event.trigger('lemmapopupWord', [wordData[i], formattedWord]);

				formattedWords.append(formattedWord).append('<br /><br />');
        
			}
      
      			
			
			// put the content inside
			popup.content.html(formattedWords);
      
      $.event.trigger('lemmapopupPopulated', [$(popup.content)]);
		}
		
		function loadScripts(lang) {
		
			
			var
				loadingIndex = 0,
				
				scripts = lang == 'G' ?
					['strongs-greek-dictionary.js', 'strongs-greek-frequencies.js','strongs-greek-outlines.js'] :
					['strongs-hebrew-dictionary.js', 'strongs-hebrew-frequencies.js','strongs-hebrew-outlines.js'],
			
				objects = lang == 'G' ?
					['strongsGreekDictionary', 'strongsGreekFrequencies', 'strongsGreekOutlines'] :
					['strongsHebrewDictionary', 'strongsHebrewFrequencies', 'strongsHebrewOutlines'];
			
			// start loading data files
			//setTimeout(function() {	
				loadNext();
			//}, 1500);
				
			function loadNext() {
				
				if (loadingIndex >= objects.length) {
					
					if (wordAwaitingData != null) {
						var wordData = getWordData(wordAwaitingData);
						fillPopup(wordData);
						wordAwaitingData = null;
					}
					
					return;
				}
			
				if (typeof window[objects[loadingIndex]] == 'undefined') {
					
					$.ajax({
						url: 'content/lexicons/' + scripts[loadingIndex],
						dataType: 'script',
						cache: true,
						success: function() {
							loadingIndex++;
							loadNext();
						}
						
					});
					
				} else {
					// the script was already loaded so go to next
					loadingIndex++;
					loadNext();
				}
				
			}
		}
		
		
	}
};
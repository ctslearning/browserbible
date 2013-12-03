docs.plugins.search = {
	init: function( docManager ) {
    // search
    docs.Search = (function() {
						
    	var searchWindow = docs.createModal('search', 'Search');
      
      searchWindow.showCallback = function () {
        if (docs.Search.searchInput.val().length) {
          searchButton.button('option', 'disabled', false);
        }
        
        bookResults.hide();
      };
		
    	var searchInput = $('<input type="text" class="search-text" />').appendTo(searchWindow.menu);

    	var searchVersion = $('<select class="search-version" id="search-version" name="search-version">' + bible.BibleNavigator.getOptions() + '</select>')
        .appendTo(searchWindow.menu)
        .selectBoxIt({
          autoWidth: false,
          theme: "jqueryui"
        });
        
        
      var searchButton = $('<button class="search-button" disabled>Search</button>')
        .button({
          icons: {
            primary: "ui-icon-search"
          }
        })
        .on('click', function() {
      		doSearch();	
      	})
        .appendTo(searchWindow.menu);
        
        
      var cancelButton = $('<button type="button" class="cancel-button" disabled>Cancel</button>')
        .button()
        .on('click', function() {
      		bible.BibleSearch.cancelSearch();
          searchButton.button('option', 'disabled', false);
          $(this).button('option', 'disabled', true);
      	})
        .appendTo(searchWindow.menu);
        
        
      var printButton = $('<button class="print-button" disabled>Print</button>')
        .button()
        .on('click', function() {		
          var printWin = window.open('','','letf=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status=0');
          printWin.document.write('<!DOCTYPE html><html><head>' +
          							'<link href="css/studybible.css" rel="stylesheet">' +
          						'</head><body>' + searchWindow.content[0].innerHTML + '</body></html>');
          printWin.document.close();
          printWin.focus();
          printWin.print();
          printWin.close();
      	})
        .appendTo(searchWindow.menu);
        
      var interlinearButton = $('<input type="checkbox" id="interlinear-button" class="interlinear-button" disabled />')
        .on('click', function () {
          //Checks new state.
          if ($(this).is(':checked')) {
            interlinear.show();
          }
          else {
            interlinear.hide();
          }
        });
          
      searchWindow.menu.append(interlinearButton).append('<label for="interlinear-button">Interlinear</label>');
      
      interlinearButton.button({
        icons: {
          primary: "ui-icon-plusthick"
        }
      });

								
    	searchWindow.size(580,400).center();
	
    	$(window).on('resize', function() {
    		searchWindow.center();
    	});
	
    	searchInput.on('keyup', function(e) {
        if ($(this).val().length) {
          searchButton.button('option', 'disabled', false);
        }
        else {
          searchButton.button('option', 'disabled', true);
        }
    		if (e.keyCode === 13)
    			doSearch();
    	});				
	
    	searchWindow.content.on('click', 'span.verse', function() {		
		
    		docs.DocManager.documents[0].navigateById($(this).attr('data-osis') , true);

    		//searchWindow.hide();
    	});
      
      var footer = '<span class="found">found: <span class="value">0</span> <span class="book-results"></span></span>';
      footer += '<span class="time">; time: <span class="value">0</span></span>';
      footer += '<span class="searching">; searching: <span class="value">Genesis 1</span></span>';
      searchWindow.footer.html(footer);
      
      
      
      var bookResultsButton = $('<button id="show-book-results" disabled="disabled" class="hide">(show results by book)</button>')
        .on('click', function () {
          bookResults.show();
          $(this).attr('disabled', 'disabled');
        });
        
      searchWindow.footer.find('.book-results').replaceWith(bookResultsButton);
      
      searchWindow.$visibleResult = null;
      searchWindow.visibleResultIndex = null;
      
      
      searchWindow.getVisibleResult = function () {
        var t = this;
        var popupOffset = this.content.offset().top - 10;
        $.each(this.content.find('.search-result'), function (index, result) {
          if ($(result).offset().top > popupOffset) {
            //This is the first visible result.
            t.$visibleResult = $(result);
            t.visibleResultIndex = index;
            return false; //Stops loop.
          }
        });
        // console.log('visibleResultIndex = ' + this.visibleResultIndex);
      };
      
      searchWindow.centerVisibleResult =  function () {
        if (this.$visibleResult) {
          this.content.scrollTo(this.$visibleResult, {duration:'fast', offsetTop : this.content.offset().top});
        }
      };
      

	
    	function doSearch() {
        searchButton.button('option', 'disabled', true);
        cancelButton.button('option', 'disabled', false);
        printButton.button('option', 'disabled', true);
        interlinear.reset();

        bookResults.hide();
        bookResultsButton.addClass('hide').attr('disabled', 'disabled');
        searchWindow.footer.find('.searching').show();
        
    		var input = searchInput.val(),
    			version = searchVersion.val();
          
        if (!input) {
          return;
        }
		
    		if (window.location.href.indexOf('file:') == -1) {
			
    			console.warn('this will be slow');
			
    		}		

			
    		console.log(input, version);
			
    		searchWindow.content.empty();
    		
		
    		bible.BibleSearch.search( input, version,
			
    			// chapter progress
    			function(bookOsisID, chapterIndex, resultsCount, startDate) {
				
    				//if (showFeedback) {
              searchWindow.footer.find('.found .value').html(resultsCount);
              searchWindow.footer.find('.time .value').html((new Date() - startDate)/1000);
              searchWindow.footer.find('.searching .value').html(bible.BOOK_DATA[ bookOsisID ].names['eng'][0] + ' ' + (chapterIndex+1).toString());
              
    					//searchProgress.width( (bookIndex+1)/66 * sbw );
    				//}
				
    			},
    			// found
          function(match) {
            searchWindow.content.append('<div class="search-result" data-osisbookid="' + match.reference.osisBookID + '"><span class="search-verse">' + match.reference + '</span>' + match.verse + '</div>');
          },
    			// ended
    			function(resultsCount, startDate) {
            searchWindow.footer.find('.found .value').html(resultsCount);
            searchWindow.footer.find('.time .value').html((new Date() - startDate)/1000);
            searchWindow.footer.find('.searching').hide();
				
            searchButton.button('option', 'disabled', false);
    				cancelButton.button('option', 'disabled', true);
            printButton.button('option', 'disabled', false);
            interlinear.enable();
            bookResultsButton.removeClass('hide').prop('disabled', false);

    			}
    		);	
    	};
      
      var interlinear = {
        show: function() {
          interlinearButton.button({
            icons: {
              primary: "ui-icon-closethick"
            }
          });
          this.calculate();
        },
        hide: function() {
          interlinearButton.button({
            icons: {
              primary: "ui-icon-plusthick"
            }
          });
          searchWindow.getVisibleResult();
          $('.interlinear_verse').remove();
          searchWindow.centerVisibleResult();
          bookResults.center();
        },
        reset: function () {
          interlinearButton.removeAttr('checked').button('option', 'disabled', true).button({
            icons: {
              primary: "ui-icon-plusthick"
            }
          });
        },
        enable: function () {
          interlinearButton.button('option', 'disabled', false);
        },
        calculate: function() {
          var t = this;
          var centered = false;
          var versionInfo = bible.versions.getVersion(searchVersion.val());
          //Defaut to English, covers both Greek and Hebrew.
          var destinationVersion = app.en_default;
          
          searchWindow.getVisibleResult();

          $.each(searchWindow.content.find('.search-result'), function (index, result) {
            var verse = $(result).find('.verse').data('osis').split('.');
            var wordResults = $(result).find('.highlight');
          
            if (versionInfo.language == 'en') {
              //This is English so we need to determine which testament we are in.
              if (bible.OT_BOOKS.indexOf(verse[0]) > -1) {
                //Hebrew OT.
                destinationVersion = app.he_default;
              }
              else {
                //Greek NT.
                destinationVersion = app.gr_default;              
              }
            }
          
            var destinationVersionInfo = bible.versions.getVersion(destinationVersion);

            $.ajax({
              url: bible.BibleSearch.baseBiblePath + destinationVersion + '/' + verse[0] + '.' + verse[1] + '.html',
              dataType: "html",
              success: function(data) {
                var newVerse = $(jQuery(data).find('.' + verse.join('_'))).addClass('interlinear_verse ' + destinationVersionInfo.language);
                //Highlight the search results.
                $.each(wordResults, function (index, wordResult) {
                  var strong = typeof $(wordResult).data('lemma') != 'undefined' ? $(wordResult).data('lemma').match(/(G|H)\d{1,5}/)[0] : $(wordResult).parent().data('lemma');
                  newVerse.find('.' + strong).wrapInner( "<span class='highlight'></span>");
                });
                newVerse.appendTo(result);

                //Because we are injecting HTML into the search results, the visible result isn't centered any more. 
                //If this interlinear result is below the visible result, then recenter the results.
                if (!centered && index >= searchWindow.visibleResultIndex) {
                  // console.log('Scrolling to $visibleResult');
                  centered = true;
                  setTimeout(function(){
                    searchWindow.centerVisibleResult();
                  }, 300);
                }

              }
            }); //end jQuery ajax
            
          }); //end jQuery each
        }
      };
      
      var bookResults = {
        $resultsWrapper: $('<div id="book-results"></div>'),
        $selected: null,
        $firstSelectedResult: null,
        show: function () {
          searchWindow.getVisibleResult();
          searchWindow.content.css({'width': 'auto'}).before(this.$resultsWrapper.html(this.calculate()).css({'height': searchWindow.content.height()}));
          this.$resultsWrapper.addClass('show');
          searchWindow.centerVisibleResult();
        },
        hide: function () {
          searchWindow.getVisibleResult();
          this.$resultsWrapper.remove();
          searchWindow.centerVisibleResult();
        },
        center: function () {
          if (this.$selected) {
            this.$selected.click();
          }
        },
        scrollToFirstSelectedResult: function (result) {
          this.$firstSelectedResult = result;
          searchWindow.content.scrollTo(result, {duration:'fast', offsetTop : searchWindow.content.offset().top});
        },
        calculate: function () {
          var t = this;
          var results = [];
          $.each(bible.BibleSearch.searchResultsBooks, function(book, value) {
            value = value != null ? value : '0';
            hasResults = value > 0 ? 'has-results' : '';
            var row = $('<div class="book-result-row clearfix '+ hasResults + '"><span class="book" rel="' + book + '">' + book + ':&nbsp;</span><span class="value">' + value + '</span></div>')
              .on('click', function () {
                if ($(this).find('.value').text() > 0) {
                  $('.book-result-row').removeClass('selected');
                  $(this).addClass('selected');
                  t.$selected = $(this);
                  var book = $(this).find('.book').attr('rel');
                  t.scrollToFirstSelectedResult($('#search .popup-content .search-result[data-osisbookid="' + book + '"]:first'));
                }
              });
            results.push(row);
          });
          return results;
        }
      };      
	
    	return {
    		searchVersion: searchVersion,
    		searchWindow: searchWindow,
    		searchInput: searchInput,
    		doSearch: doSearch,
        bookResults: bookResults
    	}
	
    })(); // search function creation
	}
};
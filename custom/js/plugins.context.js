docs.plugins.context = {
	init: function( docManager ) {
		docManager.addEventListener('changeBibleBook', function(e) {
      var newBook = e[0];
      $.each(docManager.documents, function (index, document) {
        if (document.type == "resource" && document.resource.type == "context") {
          $.event.trigger('contextBook', [document.content, newBook]);
                      console.log("triggered contextBook");    

        }
      });
		});
	}
};


jQuery(document).ready(function($) {
  //Detect when a new Bible Book is navigated to.
  $(document).on('historyUpdate', function (e) {
    if (History.getCurrentIndex() <= 1 || 
        (History.getCurrentIndex() > 1 && History.getStateByIndex(History.getCurrentIndex()-1).data.verse.split('.')[0] != History.getState().data.verse.split('.')[0])) {
      var newBook = History.getState().data.verse.split('.')[0];
      console.log("newBook is " + newBook);
      docs.DocManager.dispatchEvent('changeBibleBook', [newBook]);
    }
  });
  
  $(document).on('resourceLoad resourcePopupLoad', function (e, resource, wrapper) {
    
    //Navigate new context panel to current book.
    if (resource.type == "context") {
      var newBook = History.getState().data.verse.split('.')[0];
      $.event.trigger('contextBook', [wrapper.parent(), newBook]);
    }
    
  });
  


  //Scroll the context panel to the Bible Book.
  $(document).on('contextBook', function (e, $content, newBook) {
    $content.scrollTo('#' + newBook, {duration:'fast', offsetTop : '100'});
    console.log("scrolled to " + newBook);
  });
  
});

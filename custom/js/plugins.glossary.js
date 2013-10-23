docs.plugins.glossary = {
	init: function( docManager ) {
		docManager.addEventListener('loadGlossary', function(e) {
      var openGlossary = false;
      var term = e[0];
      $.each(docManager.documents, function (index, document) {
        if (document.type == "resource" && document.resource.type == "glossary") {
          openGlossary = true;
          $.event.trigger('glossaryTerm', [document.content, term]);
        }
      });
      
      //No glossaries are open to handle this term, so we open all of them to handle it
      if (!openGlossary) {
        var resources = new resourcesClass(docs.DocManager);
        $.each(resources.resources, function (resourceID, resource) {
          if (resource.type == "glossary") {
            resources.loadResource(resourceID, term);
          }
        });
      }
      
		});
	}
};


jQuery(document).ready(function($) {
  
  //A new lemma popup has been populated. Let's capture clicks on glossary term links.
  $(document).on('lemmapopupPopulated', function (e, $content) {
    $content.find('a.glossary-term').on('click', function () {
      console.log($(this).attr('href'));
      docs.DocManager.dispatchEvent('loadGlossary', [$(this).attr('href')]);
      return false;
    });
  });
  
  
  //Scroll the glossary content to the term.
  $(document).on('glossaryTerm', function (e, $content, term) {
    $content.scrollTo(term, {duration:'fast', offsetTop : '100'});
  });
  
});

jQuery(document).ready(function($) {
  
  
  $(document).on('resourceLoad resourcePopupLoad', function (e, resource, wrapper, doc) {
    
    /*
    * Open internal resources in new panel
    */
    wrapper.find('a.resource').on('click', function () {
      var resources = new resourcesClass(docs.DocManager);
      resources.loadResource($(this).attr('href'));
      if (e.type == 'resourceLoad') {
        doc.close();
      }
      return false;
    });


  });
  
  
});
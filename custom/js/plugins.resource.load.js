jQuery(document).ready(function($) {
  
  //Default actions when a resource loads
  
  
  $(document).on('resourceLoad resourcePopupLoad', function (e, resource, wrapper) {

    //By default, open links in new window    
    wrapper.find('a').attr('target', '_blank');
    
  });
  
  
});
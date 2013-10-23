jQuery(document).ready(function($) {
  
  
  // $(document).on('resourceLoad', function (e, resource, wrapper) {
  //   
  //   //Make links with "lightbox" class open in FancyBox.
  //   wrapper.find('a.lightbox').on('click', function () {
  //     var url = $(this).attr('href');
  //     lightBox(url);
  //     return false;
  //   });
  // });
  // 
  // $('#header, #footer').on('click', 'a.lightbox', function () {
  //   var url = $(this).attr('href');
  //   lightBox(url);
  //   return false;
  // });
  // 
  // $(document).on('modalCreated', function (e, $content) {
  //   console.log('modal created');
  //   console.log($content);
  //   //Make links with "lightbox" class open in FancyBox.
  //   $content.find('a.lightbox').on('click', function () {
  //     var url = $(this).attr('href');
  //     lightBox(url);
  //     return false;
  //   });    
  // });
  
  $(document).on("click", "a.lightbox", function () {
    var url = $(this).attr('href');
    lightBox(url);
    return false;
  });
  
  
  
  
});

function lightBox(url) {
  
  var $content = $(_template('iframe_header', {url: url}));
  
  //Closes lightbox when "open in new window" link is clicked
  $content.find('a#iframe-new-window').on('click', function () {
    $.fancybox.close();
  });
  
  $.fancybox($.extend({
    content : $content,
    padding: 0,
    autoSize: false,
    scrolling: 'no'
  }, FancyBoxDefaults));
}

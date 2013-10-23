docs.plugins.header = {
	init: function(docManager) { 	
    var t = this;
    
    $.ajax({
      url: 'content/header.html',
      method: 'GET',
      success: function (data) {
        $('#header-inner').prepend(data);
      }
    });  
	}
};
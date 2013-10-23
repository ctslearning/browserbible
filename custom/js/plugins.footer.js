docs.plugins.footer = {
	init: function(docManager) { 	
    $.ajax({
      url: 'content/footer.html',
      method: 'GET',
      success: function (data) {
        $('#footer').html(data);
      }
    });  
	}
};
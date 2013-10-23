jQuery(document).ready(function($) {
  
  $(document).on('openPopup', function (e, resource, wrapper, doc) {
    ok = true;
    if (typeof resource.expandWarning != 'undefined') {
      ok = confirm(resource.expandWarning);
    }
    if (ok) {
      popups.create(doc);
      doc.close();
    }
  });
  
  
});

popupsClass = function () {
	var t = this;

  this.popups = [];
  this.popupIndex = 0;
  
  this.create = function (doc) {
    this.popups.push(new popup(doc, this.popupIndex));
    t.popupIndex++;
  };

};

popup = function (doc, index) {
  var t = this;
  this.doc = doc;
  this.resources = new resourcesClass(docs.DocManager);
  this.url = 'popup.html';
  this.src = this.doc.resource.url || this.resources.path + this.doc.resource.filename;
  this.window = window.open(this.url, 'popup-' + index, 'width=480, height=640');
  
  this.window.onload = function () {
    t.onload();
  };
  
};

popup.prototype.onload = function () {
  var t = this;
  //Popup title.
  $(t.window.document).find('.resource-title').html(t.doc.resource.title);
  t.window.document.title = t.doc.resource.title;
  
  //Listener for close.
  $(t.window.document).find('.document-close-button').on('click', function () {
    t.close();
  });
  
  //Listener for collapse.
  $(t.window.document).find('.document-collapse-button').on('click', function () {
    t.close();
    t.resources.loadResource(t.doc.resourceID);
  });
  
  
  //Load content
  if (t.doc.resource.type == 'iframe') {
    $(t.window.document).find('body').addClass('iframe');
    t.load('<iframe src="' + t.src + '"></iframe>');      
  }
  else {
    $.ajax({
      url: t.src,
      success: function(data) {
        t.load(data);
      }
    });
  }
  
  //Resize content on window resize
  $(t.window).on('resize', function () {
    t.resize();
  });

};

popup.prototype.load = function (content) {
  $(this.window.document).find('#content').html(content);
  this.resize();
  this.loaded();
};

popup.prototype.resize = function () {
  $(this.window.document).find('#content').height($(this.window).height() - $(this.window.document).find('#header').height());
};

popup.prototype.loaded = function () {
  $.event.trigger('resourcePopupLoad', [this.doc.resource, $(this.window.document)]);      
};

popup.prototype.close = function () {
  this.window.close();
};

popups = new popupsClass();
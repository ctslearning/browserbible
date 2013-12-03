	
/**
 * Option to add additional documents
 *
 * @author John Dyer (http://j.hn/)
 */

resourcesClass = function (docManager, plugin) {
	var t = this;
  this.docManager = docManager;
  this.resources = {};
  this.path = 'content/resources/';
  
  // $.getJSON(t.path + 'resources.json', function(data) {
  //   // console.log(data);
  //   t.resources = data;
  // });
  
  $.ajax({
    url: t.path + 'resources.json',
    method: 'GET',
    async: false,
    dataType: 'json',
    success: function (data) {
      t.resources = data;
    }
  });  

  
  this.toList = function () {
    var $list = $('<nav id="open-resource"></nav>');
    var groups = {};
    $.each(t.resources, function (resourceID, resource) {
      if (resource.menu == undefined || resource.menu == false) {
        return;
      }
      
      if (typeof groups[resource.group] == 'undefined') {
        groups[resource.group] = $('<ul></ul>');
      }
      
      $('<a href="" rel="' + resourceID + '" class="' + resource.type + '">' + resource.title + '</a>').on('click', function () {
        var resourceID = $(this).attr('rel');
        
        var resource = t.getResource(resourceID);
        if (resource.premium != undefined && resource.premium) {
          t.authenticate(function () {
            t.loadResource(resourceID);
          });
        }
        else {
          t.loadResource(resourceID);
        }
        
        plugin.resourcesWindow.hide();
        parent.$.fancybox.close();
        return false;
      }).appendTo($('<li></li>').appendTo(groups[resource.group]));
            // $('<li></li>').append(link).appendTo(list);
      
    });
    
    $.each(groups, function (groupName, $links) {
      $list.append('<h4>' + capitalize(groupName) + '</h4>');
      $list.append($links);
    });
    
    // console.log(groups);
    return $list;
  };
  
  this.getResource = function (resourceID) {
    return t.resources[resourceID];
  };
  
  this.loadResource = function (resourceID, destination) {
    var url = null;
    var resource = t.getResource(resourceID);
    console.log(resource);
    switch (resource.type) {
      case 'bible':
        //Taken from plugins.adddocument.js lines 16-18
				t.docManager.addDocument(bible.BibleNavigator, resourceID);
				t.docManager.documents[docManager.documents.length-1].navigateByString(docManager.documents[0].input.val());
				t.docManager.saveSettings();
        break;
        
      case 'ajax':
        url = resource.url;
      case 'context':
      case 'glossary':
      case 'utility':
      case 'html':
        if (url == null) {
          url = t.path + resource.filename;
        }
        $.ajax({
          url: url,
          success: function(resourceContent) {
            t.newDocument(resource, resourceID, resourceContent, destination);
          }
        });
        break;
        
      case 'iframe':
        t.newDocument(resource, resourceID, '<iframe src="' + resource.url + '"></iframe>');
        break;
      default:
      
    }
    
  };
  
  this.newDocument = function (resource, resourceID, resourceContent, destination) {
		var document = new docs.ResourceDocument(t.docManager, t.docManager.docIndex.toString(), bible.ResourceNavigator, app.en_default, resource, resourceID, resourceContent);

		t.docManager.documents.push(document);
		t.docManager.content.append(document.container);
		t.docManager.resizeDocuments();
		t.docManager.docIndex++;

    var thisDoc = t.docManager.documents[t.docManager.documents.length-1];
    thisDoc.navigateByString(destination);
    t.docManager.saveSettings();
  };
  
  this.authenticate = function (func) {
    var OAuth = new OAuthClass();
    OAuth.authenticate(func);
  };  
  
};

// var resource = new resourcesClass();
 
docs.plugins.resource = {
	init: function(docManager) { 	
    var t = this;

    this.resources = new resourcesClass(docManager, this);
    
  	t.resourcesWindow = docs.createModal('resources', 'Resources');
  	t.resourcesWindow.content.append( t.resources.toList() );	
    
	
		$('<input type="button" id="docs-add-document" />')
			.appendTo(docManager.header.find('#header-nav'))
      .on('click', function () {
        //Inspired by optionsWindow in docs.manager.js line 383.
        t.resourcesWindow.show();
        t.resourcesWindow.window.css({top: $(this).offset().top + 25, left: $(this).offset().left + 25 - t.resourcesWindow.window.width()});
      });
      //Use fancybox instead.
      // .on('click', function() {
      //   $.fancybox($.extend({
      //     content: t.resources.toList()
      //   }, FancyBoxDefaults));
      // });
		
	}
};
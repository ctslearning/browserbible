bible.ResourceNavigator = {
	
	name: 'resource',
	
	sectionSelector: 'div.chapter',
	
	sectionIdAttr: 'data-osis',
	
	fragmentSelector: 'span.verse',
	
	fragmentIdAttr: 'data-osis',
	
	getOptions: function() {
		var html = '',
			langCode,
			language,
			versionCode,
			version;
		
		for (langCode in bible.versions.versionData) {
			language = bible.versions.versionData[langCode];
			
			html += '<optgroup label="' + language.languageName + '">';
			
			for (versionCode in language.versions) {
				version = language.versions[versionCode];
				
				html += '<option value="' + versionCode + '" data-language="' + langCode + '" data-version=\'' + JSON.stringify(version) + '\'>' + version.abbreviation + ' - ' + version.name + '</option>';
				
			}
			
			html += '</optgroup>';
		}
	
		return html;
	},
	
	formatNavigation: function(fragmentId, language) {
		
		var reference = new bible.Reference(fragmentId);
		reference.language = language;
		
		return reference.toString();
		
		//return bible.BibleFormatter.verseCodeToReferenceString(fragmentId, 0);
	},
	
	findFragment: function(fragmentId, content) {
		return content.find('span.verse[data-osis="' + fragmentId + '"]');
	},
	
	parseString: function(input) {
		var reference = new bible.Reference(input);
		
		if (reference != null) {
			// make sure the first verse is seleced
			
			if (reference.verse1 < 1) {
				reference.verse1 = 1;
			}
			return reference.toOsisVerse(); // not to chapter, to verse
		} else {
			return null;
		}
	},
	
	convertFragmentIdToSectionId: function(fragmentId) {
		return '1Chr.1';
	},
	
	getNextSectionId: function(sectionId) {
	},
	
	getPrevSectionId: function(sectionId) {
	},
	
	setupNavigationList: function(document) {
	},
	
	showNavigationList: function(document) {
	}
	
};

docs.ResourceDocument = function(manager, id, navigator, selectedDocumentId, resource, resourceID, resourceContent) {
	var t = this;

	// store
	t.manager = manager;
	t.numeric_id = id;
  t.id = 'doc-' + id;
	t.navigator = navigator;
	t.fragmentId = null;
  t.resource = resource;
  t.resourceID = resourceID;
  t.resourceContent = resourceContent;
  t.type = 'resource';
    
	t.container = $(_template('docs_resource_document_container', {id: t.id, title: t.resource.title, classes: [t.type, t.resource.type, t.resource.group, t.resourceID].join(' ')}));
	
	
	// find DOM elements
	t.header = t.container.find('.document-header');
	t.input = t.container.find('.document-input');
	t.button = t.container.find('.document-button');
	t.selector = t.container.find('.document-selector').val(selectedDocumentId);

	// double check. if the selected version (from memory) isn't there, try the first one
	selectedDocumentId = t.selector.val();
	
  // t.syncList = t.container.find('.document-sync-list'); // currently not being used
  // t.syncCheckbox = t.container.find('.document-sync-checkbox');
  // t.lockBtn = t.container.find('.document-lock-button');
  // t.searchBtn = t.container.find('.document-search-button');
	t.infoBtn = t.container.find('.document-info-button');
	t.closeBtn = t.container.find('.document-close-button');
  
  t.expandBtn = t.container.find('.document-expand-button');
  
  // t.about = t.container.find('.document-about');
	
	// config
	t.optionsBtn = t.container.find('.document-options-button');
	t.optionsWindow = docs.createModal(t.id + 'options', 'Options');
	t.optionsWindow.content.append( t.container.find('.document-header-options') );	
	t.optionsBtn.on('click', function() {
		if (t.optionsWindow.content.is(':visible')) {
			t.optionsWindow.hide();
		} else {
			t.optionsWindow.show();
			t.optionsWindow.window.css({top: t.optionsBtn.offset().top + 25, left: t.optionsBtn.offset().left + 25 - t.optionsWindow.window.width()});
		}
	});
  
  if (t.resource.expand == undefined || !t.resource.expand) {
    t.expandBtn.remove();
  }
	
	t.updateVersion(selectedDocumentId);
	
	// main content aresas
	t.content = t.container.find('.document-content');
	t.wrapper = t.container.find('.document-wrapper');	
	
	t.footer = t.container.find('.document-footer');
	if (docs.Features.hasTouch) {
		t.footer.remove();
	}
	
	// footer resizing
	t.footerHandle = t.container.find('.document-footer-resize');
	
	
	t.navigationWindow = $(
			'<div class="document-navigation-window">' +
			'</div>'
		).appendTo(document.body);
	
	
	// setup events
	t.closeBtn.on('click', function(e) {
		t.close();
	});	
  
	t.expandBtn.on('click', function(e) {
    $.event.trigger('openPopup', [t.resource, t.wrapper, t]);
	});	
	
	t.wrapper.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	
	t.container.on('mouseenter mouseover', function(e) {
		t.setFocus(true);
	});	

};
docs.ResourceDocument.prototype = {
	
	hasFocus: false,
	
	ignoreScrollEvent: false,
	
	log: function(fn, args) {
    // console.log('ResourceDocument', fn, args);
	},
	
	resize: function() {
	  this.log('resize', arguments);
		var t = this,
			availableHeight = t.container.parent().height(),
			containerMargin = t.container.outerHeight(true) - t.container.height(),
			contentMargin = t.content.outerHeight(true) - t.content.height(),
			headerHeight = t.header.outerHeight(true),
			footerHeight = t.footer.outerHeight(true);
			
		t.content.height( availableHeight - containerMargin -contentMargin - headerHeight - footerHeight );
		
		
		// position resizer
		t.footerHandle.css({
				bottom: (t.footer.outerHeight(true) - t.footerHandle.outerHeight(true))+ 'px',
				width: t.footer.outerWidth(true) + 'px'
		});
		
		// TODO save scroll
	},
	
	switchingOver: false,
	
	updateVersion: function(version) {
	  this.log('updateVersion', arguments);
	},
	
	load: function(fragmentId, action) {
		var t = this;
	  this.log('load', arguments);
    this.wrapper.append(t.resourceContent);
    
    /*
    *  Plugins
    */
    $.event.trigger('resourceLoad', [t.resource, t.wrapper, t]);
    
    if (t.resource.type == 'glossary' && fragmentId != undefined) {
      $.event.trigger('glossaryTerm', [t.content, fragmentId]);
    }
	},
	
	checkScrollPosition: function() {
	  this.log('checkScrollPosition', arguments);
	},
	
	scrollTimeout1: null,
	scrollTimeout2: null,
	
	handleScroll: function(e) {
	  this.log('handleScroll', arguments);
	},
	
	setDocumentId: function(documentId) {
	  this.log('setDocumentId', arguments);

		this.selector.val(documentId);
	},
	
	navigateToUserInput: function() {
	  this.log('navigateToUserInput', arguments);
		this.load();
	},
	
	navigateByString: function(someString, getFocus, offset) {
	  this.log('navigateByString', arguments);
		this.load(someString);
	},
	
	navigateById: function(fragmentId, getFocus, offset) {
	  this.log('navigateById', arguments);		
		this.load();
	},
	
	setFocus: function(hasFocus) {
	  this.log('setFocus', arguments);
		this.hasFocus = hasFocus;
		if (hasFocus) {
			this.container.addClass('document-focused');
			this.manager.setFocus(this);
		}
	},
	
	
	
	updateNavigationInput: function(doSync) {
	  this.log('updateNavigationInput', arguments);
	},
	
	scrollToFragmentNode: function(node, offset) {
	  this.log('scrollToFragmentNode', arguments);
	},
	
	close: function() {
	  this.log('close', arguments);
		
		var t = this;
		
		t.container.remove();
		t.manager.remove(this);
		
	}
  
  
};

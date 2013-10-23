// Universal functions and variables, unique to the modified app

//Makes Underscore templates use mustach syntax.
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

//Our defaults for lightbox settings.
var FancyBoxDefaults = {
  openSpeed: 50,
  closeSpeed: 10,
  width: '80%',
  height: '80%'
};

var appTitle = 'CTS Bible Browser';

var historyTitle = function (verse) {
  return verse + ' - ' + appTitle;
};

//Throttles history state pushes during scrolls.
var throttleHistory = _.throttle(function (verse) {
  History.pushState({verse: verse}, historyTitle(verse), '?verse=' + verse);
  $(document).trigger('historyUpdate');
}, 1000);

//Inspired by http://www.gethugames.in/blog/2012/04/authentication-and-authorization-for-google-apis-in-javascript-popup-window-tutorial.html
var OAuthClass = function () {
  var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
  var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
  var SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';


  var CLIENTID = '';
  var REDIRECT = '';

  
  var LOGOUT = 'http://accounts.google.com/Logout';
  var TYPE = 'token';
  var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;

  //Require Calvin email
  _url += '&hd=calvinseminary.edu';
  
  var acToken;
  var tokenType;
  var expiresIn;
  var user;
  var loggedIn = false;
  
  this.authenticate = function (func) {
    if ($.cookie('bible_browser_authenticated') == undefined) {
      login(func);
    }
    else {
      func();
    }
  };

  var login = function (func) {
    var win = window.open(_url, "windowname1", 'width=800, height=600');

    var pollTimer = window.setInterval(function() { 
      // console.log(win);
      // console.log(win.document);
      // console.log(win.document.URL);
      if (win.document.URL.indexOf(REDIRECT) != -1) {
        window.clearInterval(pollTimer);
        var url =   win.document.URL;
        acToken =   urlParm(url, 'access_token');
        tokenType = urlParm(url, 'token_type');
        expiresIn = urlParm(url, 'expires_in');
        win.close();

        validateToken(acToken, func);
      }
    }, 500);
  };

  var validateToken = function (token, func) {
    $.ajax({
      url: VALIDURL + token,
      data: null,
      dataType: "jsonp",
      success: function(responseText){
        complete(func);
      } 
    });
  };
  
  var complete = function (func) {
    loggedIn = true;
    $.cookie('bible_browser_authenticated', '1', { expires: 7, path: '/' });
    func();    
  };

};

//http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
var urlParm = function (url, name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1]
  );
};

// http://lions-mark.com/jquery/scrollTo/
$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    // console.log(options);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

function capitalize(s){
    return s[0].toUpperCase() + s.slice(1);
}

//Taken from http://stackoverflow.com/a/13029597
function _template(templateName, vars) {
  var template = $('#template_' + templateName);
  if (template.length === 0) {
    var tmpl_dir = 'custom/templates';
    var tmpl_url = tmpl_dir + '/' + templateName + '.tmpl';
    var tmpl_string = '';

    $.ajax({
      url: tmpl_url,
      method: 'GET',
      async: false,
      contentType: 'text',
      success: function (data) {
        tmpl_string = data;
      }
    });

    $('head').append('<script id="template_' + templateName + '" type="text/template">' + tmpl_string + '<\/script>');
  }

  return _.template($('#template_' + templateName).html(), vars);
}


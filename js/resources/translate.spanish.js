function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

$('div.es_rv').dblclick(function (e) {

        var myTerm = getSelectionText();
            console.log(myTerm);

        var myquery = 'http://api.mymemory.translated.net/get?q=' + myTerm + '&langpair=es%7Cen';
        console.log("selection is " + myTerm);
        console.log("translating...");

        $.getJSON(myquery, function (data) {
            console.log(data);

            var trans = data.matches[0].translation;

            console.log(trans);
            alert(trans);

        });
    });
    
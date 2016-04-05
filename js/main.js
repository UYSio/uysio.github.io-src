/**
 * I don't like importing jQuery for just one thing, and thanks to
 * http://www.webmuse.co.uk/blog/custom-getelementsbyclassname-function-for-all-browsers/
 */
window.onload = function(){

  if ( !document.getElementsByClassName ) {
    document.getElementsByClassName = function( classname ) {
      var elArray = [];
      var tmp = document.getElementsByTagName("*");
      var regex = new RegExp("(^|\s)" + classname + "(\s|$)");
      for (var i=0; i<tmp.length; i++) {
        if ( regex.test(tmp[i].className) ) {
          elArray.push(tmp[i]);
        }
      }

      return elArray;
    };
  }

  var wordToNumber = function(word) {
    var number = 0;
    for (var i=0; i<word.length; i++) {
      number += word[i].charCodeAt(0);
    }
    //console.log(word, number);
    number = parseFloat('0.' + number);
    //console.log(word, number);
    return number; 
  };

  var colors = ["#48466D", "#D4CEB0", "#FEAA2B", "#FF5757", "#6B3278", "#362999", "#4262C5", "#F6538F", "#BA6C65"];
  var tags = document.getElementsByClassName("post-tag");
  for (var i=0; i<tags.length; i++) {
    var tag = tags[i].className.split(' ')[1];
    var selectedColour = colors[Math.floor(wordToNumber(tag)*colors.length)];
    tags[i].style.backgroundColor = selectedColour;
  }
};

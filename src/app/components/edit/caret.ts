/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/


// code from: https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity

//From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
const voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX', "LATEX-JS"];


//Basic idea from: https://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
function canContainText(node) {
    if(node.nodeType == 1) { //is an element node
        return !voidNodeTags.includes(node.nodeName);
    } else { //is not an element node
        return false;
    }
};

function getLastChildElement(el){
    let lc = el.lastChild;
    while(lc && lc.nodeType != 1) {
      if(lc.previousSibling) {
          lc = lc.previousSibling;
      } else {
          break;
      }
    }
    return lc;
}

//Based on Nico Burns's answer
export function setEndOfContenteditable(contentEditableElement)
{
    while(getLastChildElement(contentEditableElement) &&
          canContainText(getLastChildElement(contentEditableElement))) {
        contentEditableElement = getLastChildElement(contentEditableElement);
    }

    let range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {    
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}
/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

/*
  LaTeX equation examples:
    $f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$
    $$f(n) = \begin{cases} \frac{n}{2}, & \text{if } n\text{ is even} \\ 3n+1, & \text{if } n\text{ is odd} \end{cases}$$
    $f(x) = x^2$
    $g(x) = \frac{1}{x}$
    $F(x) = \int^a_b \frac{1}{3}x^3$
*/

// process a text for pattern .*$.*$.*
function processText(text) {
  const index1 = text.indexOf('$');
  if(index1 !== -1) {
    const index2 = text.indexOf('$', index1+1);
    if(index2 !== -1) {
      const prefix = text.substring(0, index1);
      const body = text.substring(index1+1, index2);
      const suffix = text.substring(index2+1);
      
      return {
        text: prefix 
        + '<latex-js baseURL="https://cdn.jsdelivr.net/npm/latex.js/dist/" hyphenate="false">' 
        + '\\documentclass{article}'
        + '\\begin{document}'
        + '$'
        + body
        + '$'
        + '\\end{document}'
        + '</latex-js>'
        + suffix,
       processed: true
      }
    }
  }
  return { 
    text
  }
}

export function convertLaTeXLine(line) {
  // quickly test whether the line contains a character $
  let index = line.indexOf('$');
  if(index === -1) {
    return line;
  }

  let processed = false;
  let segments = [];

  // identify latex block
  const regexp = RegExp('<latex-js.*?>.*?<\/latex-js>','g');
  let match;
  let text;
  let result;
  let currentIndex = 0;
  while ((match = regexp.exec(line)) !== null) {
    const startIndex = match.index;
    const endIndex = regexp.lastIndex;
    if(startIndex !== currentIndex) {
      text = line.substring(currentIndex, startIndex);
      result = processText(text);
      if(!processed) {
        processed = result.processed;
      }
      segments.push(result.text);
      console.log(text)
    }
    // don't touch a latex block
    text = line.substring(startIndex, endIndex);
    segments.push(text);
    console.log(text);
    currentIndex = endIndex ;
  }

  if(currentIndex < line.length) {
    text = line.substring(currentIndex);
    result = processText(text);
    if(!processed) {
      processed = result.processed;
    }
    segments.push(result.text);
    console.log(text)
  }
  return {
    text: segments.join(''),
    processed
  }
}

export function  convertLaTeXLines(html) {
  const rawLines = html.match(/<p>(.*?)<\/p>/g);
  if(!rawLines) {
    return html;
  }

  let processed = false;
  const processedLines = [];
  for(let i = 0; i < rawLines.length; i++) {
    const result = convertLaTeXLine(rawLines[i]);
    processedLines.push(`<p>${result.text}</p>`);
    if(!processed) {
      processed = result.processed;
    }
  }
  return {
    text: processedLines.join(''),
    processed
  };
}
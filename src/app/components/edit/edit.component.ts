/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { debounce } from 'lodash'
import format from 'format-duration';
import MediumEditor from 'medium-editor'

import projectLogo from '../../services/logo'
import { FirebaseService } from '../../services/firebase.service';
import { convertLaTeXLine } from './latex.helper';

const BUTTONS = [
  'bold'
  ,'italic'
  ,'underline'  
  ,'strikethrough',
  ,'subscript'
  ,'superscript'
  ,'anchor'
  ,'image'
  ,'quote'
  ,'pre'
  ,'orderedlist'
  ,'unorderedlist'
  ,'indent'
  ,'outdent' 
  ,'justifyLeft'
  ,'justifyCenter'
  ,'justifyRight'
  ,'justifyFull'
  ,'h1'
  ,'h2'
  ,'h3'
  ,'h4'
  ,'h5'
  ,'h6'  
  ,'removeFormat'
  ,'html'
];

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  logo: string = projectLogo;
  user: any;

  // auto-save
  startTime: number;
  dirty: boolean = false;
  autoSave;

  // msg
  quickResetMsg;
  slowResetMsg;
  message: string = 'ready';

  // editor
  editor: MediumEditor;
  @ViewChild('medium', {
    static: true
  }) medium: ElementRef;


  constructor(private firebaseService: FirebaseService) { 
    this.autoSave = debounce(this.onSave, 15000);
    this.quickResetMsg = debounce(this.onIdle, 500);
    this.slowResetMsg = debounce(this.onIdle, 2000);
    this.user = this.firebaseService.getUser();
  }

  ngOnInit(): void {
    this.startTime = Date.now();
  }

  ngOnDestroy() {
    // save document right before unmounting so we lose nothing
    if(this.firebaseService.isLoggedin()) {
      this.onSave();
    }
  }

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.medium.nativeElement,{
      paste: {
        /* This example includes the default options for paste,
           if nothing is passed this is what it used */
        forcePlainText: false,
        cleanPastedHTML: true,
        cleanReplacements: [],
        cleanAttrs: ['class', 'style', 'dir','name'],
        cleanTags: ['meta'],
        unwrapTags: []
      },
      toolbar: {
          /* These are the default options for the toolbar,
             if nothing is passed this is what is used */
          allowMultiParagraphSelection: true,
          buttons: BUTTONS,
          diffLeft: 0,
          diffTop: -10,
          firstButtonClass: 'medium-editor-button-first',
          lastButtonClass: 'medium-editor-button-last',
          relativeContainer: null,
          standardizeSelectionStart: false,
          static: false,
          /* options which only apply when static is true */
          align: 'center',
          sticky: false,
          updateOnEmptySelection: false
      },
      autoLink: true
    });

    this.firebaseService.getUserDocument()
    .then(doc=> {
      console.log(`loaded ${doc.length} characters doc`);
      this.editor.setContent(doc);
    });

    this.editor.subscribe('editableInput',(event, editable) => {
      let msg = event.inputType;
      if(event.data) {
        msg += `: "${event.data}"`;
      }

      // replace equation between $..$ with latex-js
      if(event.data === '$' // is a latex delimeter?
        || (event.data === null)) // copy/paste?
      {
        let processed = false;
        const results = [];
        const children = event.currentTarget.children;
        for(let i = 0; i < children.length; i++) {
          const result = convertLaTeXLine(children[i].outerHTML);
          results.push(result.text);
          if(!processed) {
            processed = result.processed;
          }
        }
        if(processed) {
            this.editor.setContent(results.join(''));  
        }
      }

      this.onShowMsg(msg, true)
      this.dirty = true;
      this.autoSave();
    });
  }

  getEditorInfo() {
    const currentTime = Date.now();
    return `elapsed: ${format(currentTime - this.startTime)}, powered by "Medium Editor" `
  }

  
  onIdle() {
    this.message = 'idle';
  }

  onShowMsg(msg, quick) {
    this.message = msg;
    if(quick) {
      this.quickResetMsg();
    } else {
      this.slowResetMsg();
    }
  }

  onSave(): void {
    if(this.dirty) {
      const doc = this.editor.getContent();
      this.firebaseService.saveUserDocument(doc);
      this.dirty = false;
      this.onShowMsg('auto saved', false);
    }
  }

  onLogout(): void {
    console.log('evt: onLogout');

    // save document before logging out
    this.onSave();
    this.firebaseService.logout();
  }
}

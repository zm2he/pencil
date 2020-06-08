/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import projectLogo from '../../services/logo'
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logo: string = projectLogo;
  return: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private firebaseService: FirebaseService) { 
  }

  ngOnInit(): void {
    // if user already logged, navigate to /edit route
    this.route.queryParams.subscribe(params => {
      this.return = params['return'] || '/edit';
      if(this.firebaseService.isLoggedin()) {
        this.go();
      }
    })
  }

  onLogin() {
    console.log(`evt: onLogin`);
    this.firebaseService.login();
  }

  go() {
    this.router.navigateByUrl(this.return);
  }
}

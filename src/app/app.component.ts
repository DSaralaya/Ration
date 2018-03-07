import { Component, OnInit } from '@angular/core';
import { AuthGuard } from './service/AuthGurd';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

declare const Parse: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  Parse:any;
  isLogged=false;
    name:any;
    constructor(private router:Router){}
    ngOnInit()
    {
      if (localStorage.getItem('currentUser')) {
        var usr=JSON.parse(localStorage.getItem('currentUser'));
        this.name=usr.username;
        this.isLogged= true;
    }

   
  }

  Logout()
  {
    localStorage.removeItem('currentUser');
    Parse.User.logOut().then(() => {
      var currentUser = Parse.User.current();  // this will now be null
    });

     window.location.href='/login';
  }
}

import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-cental-home',
	templateUrl: './cental-home.component.html',
	styleUrls: [ './cental-home.component.css' ]
})
export class CentalHomeComponent implements OnInit {
	Parse: any = window['Parse'];
  UsersList: any = [];
  
	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.server.call('getdealers', []).subscribe(
			(result:any[]) => {
        var items=[];
				result.forEach((element) => {
					var elem = element.attributes;
					items.push({
						firstname: elem.firstname || '',
						lastname: elem.lastname || '',
						mobile: elem.mobile,
						username: elem.username,
						city: elem.city,
						adharno: elem.adharno,
            rationno: elem.rationno,
            role:elem.role
					});
        });
       
        var dealers=items.filter(function(t){ return t.role=='dealer'});
        dealers.forEach(elem => {
          const consumers=items.filter(function(t){ return t.role=='consumer' && t.city==elem.city });
          this.UsersList.push({
						firstname: elem.firstname || '',
						lastname: elem.lastname || '',
						mobile: elem.mobile,
						username: elem.username,
						city: elem.city,
						adharno: elem.adharno,
            rationno: elem.rationno,
            role:elem.role,
            users:consumers ||[]
					});
        });
      

			},
			(error) => {}
		);
	}
}

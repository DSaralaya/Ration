import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { HttpService } from '../../service/httpService';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
	selector: 'app-cental-home',
	templateUrl: './cental-home.component.html',
	styleUrls: [ './cental-home.component.css' ]
})
export class CentalHomeComponent implements OnInit {
	Parse: any = window['Parse'];
	UsersList: any = [];
	public gridView: GridDataResult;
	public pageSize = 10;
	public skip = 0;

	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.server.call('getdealers', []).subscribe(
			(result: any[]) => {
				var items = [];
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
						role: elem.role
					});
				});

				var dealers = items.filter(function(t) {
					return t.role == 'dealer';
				});
				dealers.forEach((elem) => {
					const consumers = items.filter(function(t) {
						return t.role == 'consumer' && t.city == elem.city;
					});
					this.UsersList.push({
						firstname: elem.firstname || '',
						lastname: elem.lastname || '',
						mobile: elem.mobile,
						username: elem.username,
						city: elem.city,
						adharno: elem.adharno,
						rationno: elem.rationno,
						role: elem.role,
						users: consumers || []
					});
				});
				this.loadItems();
			},
			(error) => {}
		);
	}
	public pageChange(event: PageChangeEvent): void {
		this.skip = event.skip;
		this.loadItems();
	}

	private loadItems(): void {
		this.gridView = {
			data: this.UsersList.slice(this.skip, this.skip + this.pageSize),
			total: this.UsersList.length
		};
	}
}

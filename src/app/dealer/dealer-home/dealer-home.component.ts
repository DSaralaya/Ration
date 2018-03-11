import { Component, OnInit } from '@angular/core';
import { PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-dealer-home',
	templateUrl: './dealer-home.component.html',
	styleUrls: [ './dealer-home.component.css' ]
})
export class DealerHomeComponent implements OnInit {
	UsersList: any = [];
	public gridView: GridDataResult;
	public pageSize = 10;
	public skip = 0;

	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.server.call('getConsumers', []).subscribe(
			(result: any[]) => {
				var items = [];
				result.forEach((element) => {
					var elem = element.attributes;
					this.UsersList.push({
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

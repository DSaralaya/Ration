import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../service/httpService';
import { PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { aggregateBy, State } from '@progress/kendo-data-query';

@Component({
	selector: 'app-viewreport',
	templateUrl: './viewreport.component.html',
	styleUrls: [ './viewreport.component.css' ]
})
export class ViewreportComponent implements OnInit {
	ProductList = [];
	private editedRowIndex: number;
	public formGroup: FormGroup;
	dataItem: any;
	role: any;
	public gridView: GridDataResult;
	public pageSize = 10;
	public skip = 0;

	constructor(private server: HttpService) {}

	ngOnInit() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		this.role = usr.role;
		this.getReport();
	}

	getReport() {
		this.ProductList = [];
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		this.server.call('viewReport', []).subscribe(
			(result: any[]) => {
				debugger;
				if (usr.role === 'consumer') {
					result = result.filter(function(t) {
						return t.attributes.consumerid.objectId == usr.objectId;
					});
				} else if (usr.role === 'dealer') {
					result = result.filter(function(t) {
						return t.attributes.consumerid.city == usr.city;
					});
				}
				result.forEach((element) => {
					var elem = element.attributes;
					var usr = elem.consumerid.attributes;
					this.ProductList.push({
						appointment: elem.appointment,
						time: elem.time,
						rice: elem.rice,
						sugar: elem.sugar,
						kerosene: elem.kerosene,
						objectId: element.id,
						name: usr.firstname + ' ' + usr.lastname,
						mobile: usr.mobile,
						rationno: usr.rationno,
						status: elem.status,
						month: elem.month,
						year: elem.year,
						city: usr.city
					});
				});
				if (this.role === 'central') {
					const dealerList = [];
					this.server.call('GetDealersOnly', []).subscribe((dealers: any[]) => {
						dealers.forEach((element) => {
							var elem = element.attributes;
							dealerList.push({
								name: elem.firstname + ' ' + elem.lastname,
								city: elem.city,
								mobile: elem.mobile,
								reports: this.ProductList.filter(function(t) {
									return t.city.toLowerCase() === elem.city.toLowerCase();
								})
							});
						});

						this.ProductList = dealerList.filter(function(t) {
							return t.reports.length > 0;
						});
						this.loadItems();
					});
				} else {
					this.loadItems();
				}
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
			data: this.ProductList.slice(this.skip, this.skip + this.pageSize),
			total: this.ProductList.length
		};
	}
}

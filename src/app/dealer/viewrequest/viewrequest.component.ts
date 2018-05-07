import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-viewrequest',
	templateUrl: './viewrequest.component.html',
	styleUrls: [ './viewrequest.component.css' ]
})
export class ViewrequestComponent implements OnInit {
	ProductList = [];
	private editedRowIndex: number;
	public formGroup: FormGroup;
	dataItem: any;
	private val: any;
	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getProducts();
	}

	getProducts() {
		this.ProductList = [];
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		this.server.call('getDealerRequests', []).subscribe(
			(results: any[]) => {
				debugger;
				var result = results.filter(function(t) {
					return t.attributes.consumerid.attributes.city == usr.city;
				});
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
						rationno: usr.rationno
					});
				});
			},
			(error) => {}
		);
	}

	Accept(dataItem) {
		(<any>window['$']('#myModal')).modal('toggle');
		this.dataItem = dataItem;
		this.val = Math.floor(1000 + Math.random() * 9000);
		this.server.sendOtp(dataItem.mobile,this.val);
	}

	Reject(dataItem) {
		var r = confirm('Are you sure to Reject?');
		if (r == true) {
			var form = { objectId: dataItem.objectId, status: 'reject' };
			this.server.call('updateRequest', form).subscribe((result: any[]) => {
				this.getProducts();
			});
		}
	}

	OtpSubmit(input) {
		if (input.value === this.val) {
			var form = { objectId: this.dataItem.objectId, status: 'success' };
			this.server.call('updateRequest', form).subscribe((result: any[]) => {
				(<any>window['$']('#myModal')).modal('hide');
				this.server.call('updateProductQuantity', this.dataItem).subscribe((result: any[]) => {
					(<any>window['$']('#myModal')).modal('hide');
					this.dataItem = {};
					this.getProducts();
				});
			});
		} else {
			alert('Invalid OTP');
		}
	}
}

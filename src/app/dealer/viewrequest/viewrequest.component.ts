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
	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getProducts();
	}

	getProducts() {
		this.ProductList = [];
		this.server.call('getDealerRequests', []).subscribe(
			(result: any[]) => {
				debugger;
				console.log(result);
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
  }
  
	Reject(sender) {
		var form = { objectId: this.dataItem.objectId, status: 'reject' };
		this.server.call('updateRequest', form).subscribe((result: any[]) => {
			(<any>window['$']('#myModal')).modal('hide');
      this.dataItem = {};
      this.getProducts();
		});
  }
  
	OtpSubmit(input) {
		console.log(input.value);
		if (input.value === '123') {
			var form = { objectId: this.dataItem.objectId, status: 'success' };
			this.server.call('updateRequest', form).subscribe((result: any[]) => {
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

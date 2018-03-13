import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-create-request',
	templateUrl: './create-request.component.html',
	styleUrls: [ './create-request.component.css' ]
})
export class CreateRequestComponent implements OnInit {
	Invalid = false;
	ProductList = [];
	private editedRowIndex: number;
	public formGroup: FormGroup;
	listMonths = [ 'JAN', 'FEB', 'MAR' ];
	itemList:any;
	public autoCorrect: boolean = true;
	minDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
	maxDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 25);
	minTime: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 30);
	maxTime: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 25, 16, 30);
	constructor(private server: HttpService) {}

	ngOnInit() {
		this.getRequests();
	}

	getProducts()
	{
		this.server.call('getAssginedProduct', []).subscribe((products: any[]) => {
			products.forEach((element) => {
				var elem = element.attributes;
				this.itemList={ sugar:elem.sugar, kerosene:elem.kerosene, rice:elem.rice };
			});
		});
	}

	getRequests() {
		this.ProductList = [];
		this.server.call('getConsumerRequests', []).subscribe(
			(result: any[]) => {
			
					result.forEach((element) => {
						var elem = element.attributes;
						this.ProductList.push({
							appointment: elem.appointment,
							time: elem.time,
							rice: elem.rice,
							sugar: elem.sugar,
							kerosene: elem.kerosene,
							objectId: element.id,
							status: elem.status
						});
					});
				
			},
			(error) => {}
		);
	}

	public editHandler({ sender, rowIndex, dataItem }) {
		this.closeEditor(sender);

		this.editedRowIndex = rowIndex;

		sender.editRow(rowIndex, this.formGroup);
	}
	private closeEditor(grid, rowIndex = this.editedRowIndex) {
		grid.closeRow(rowIndex);
		this.editedRowIndex = undefined;
		this.formGroup = undefined;
	}
	public cancelHandler({ sender, rowIndex }) {
		this.closeEditor(sender, rowIndex);
	}
	public saveHandler({ sender, rowIndex, dataItem, isNew }) {
		debugger;
		const obj: any[] = this.ProductList.slice(0);
		if (isNew) {
			obj.push(dataItem);
		} else {
			obj[rowIndex] = dataItem;
		}
		const sugarQuantity = obj
			.map(function(item) {
				return item.sugar;
			})
			.reduce(function(a, b) {
				return a + b;
			}, 0);
		const riceQuantity = obj
			.map(function(item) {
				return item.rice;
			})
			.reduce(function(a, b) {
				return a + b;
			}, 0);
		const kerosceneQuantity = obj
			.map(function(item) {
				return item.kerosene;
			})
			.reduce(function(a, b) {
				return a + b;
			}, 0);
		if (isNew) {
			if (riceQuantity > 3 || sugarQuantity > 3 || kerosceneQuantity > 3) {
				alert('Qunatity exceeded (max 3 kg)');
			} else if(riceQuantity>this.itemList.rice || sugarQuantity>this.itemList.sugar || kerosceneQuantity >this.itemList.kerosene ){
				alert('Stock is empty');
			}
			else {
				this.server.call('createConsumerRequests', dataItem).subscribe(
					(result: any[]) => {
						this.getRequests();
						sender.closeRow(rowIndex);
					},
					(error) => {}
				);
			}
		} else {
			if (riceQuantity > 3 || sugarQuantity > 3 || kerosceneQuantity > 3) {
				alert('Qunatity exceeded (max 3 kg)');
			}
			else if(riceQuantity>this.itemList.rice || sugarQuantity>this.itemList.sugar || kerosceneQuantity >this.itemList.kerosene ){
				alert('Stock is empty');
			} else {
				this.server.call('updateConsumerRequests', dataItem).subscribe(
					(result: any[]) => {
						this.ProductList[rowIndex] = dataItem;
						sender.closeRow(rowIndex);
					},
					(error) => {}
				);
			}
		}
	}
	public removeHandler({ dataItem, rowIndex }) {
		this.ProductList.splice(rowIndex, 1);
	}

	public addHandler({ sender }, formInstance) {
		formInstance.reset();
		this.closeEditor(sender);

		sender.addRow({
			kerosene: '',
			rice: '',
			sugar: '',
			appointment: '',
			time: ''
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-addproducts',
	templateUrl: './addproducts.component.html',
	styleUrls: [ './addproducts.component.css' ]
})
export class AddproductsComponent implements OnInit {
	Invalid = false;
	ProductList = [];
	private editedRowIndex: number;
	public formGroup: FormGroup;
	listItems = [ 'JAN', 'FEB', 'MAR' ];
	constructor(private server: HttpService) {}

	ngOnInit() {}

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
		if (isNew) {
			var fil = this.ProductList.filter(function(t) {
				return t.month === dataItem.month;
			});
			if (fil.length === 0) {
				this.ProductList.push(dataItem);
				sender.closeRow(rowIndex);
			} else {
				alert('Data already exist');
			}
		} else {
			this.ProductList[rowIndex] = dataItem;
			sender.closeRow(rowIndex);
		}
	}
	public removeHandler({ dataItem, rowIndex }) {
		this.ProductList.splice(rowIndex, 1);
	}

	public addHandler({ sender }, formInstance) {
		formInstance.reset();
		this.closeEditor(sender);

		sender.addRow({
			month: '',
			kerosene: '',
			rice: '',
			sugar: ''
		});
	}
}

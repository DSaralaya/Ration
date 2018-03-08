import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../service/httpService';

@Component({
	selector: 'app-addproducts',
	templateUrl: './addproducts.component.html',
	styleUrls: [ './addproducts.component.css' ]
})
export class AddproductsComponent implements OnInit {
	addform: any;
	Invalid = false;
	ProductList = [];
	constructor(fb: FormBuilder, private server: HttpService) {
		this.addform = fb.group({
			month: '',
			kerosene: '',
			rice: '',
			sugar: '',
			isedit: false
		});
	}

	ngOnInit() {}

	AddProduct(form) {
		if (this.addform.valid) {
			var lst = this.ProductList.filter(function(t) {
				return t.month == form.month;
			});
			if (lst.length == 0) {
				this.ProductList.push({ year: new Date().getFullYear(), month: form.month, kerosene: form.kerosene, rice: form.rice, sugar: form.sugar });
			} else {
				alert('Product already exist');
			}
		} else {
			this.validateAllFormFields(this.addform);
		}
	}

	Delete(index) {
		this.ProductList.splice(index, 1);
	}
	Update(item, index) {
    item.isEdit = false;
    debugger;
    this.ProductList[index]=item;
    console.log(this.ProductList);
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach((field) => {
			console.log(field);
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpService } from '../../service/httpService';
import { CityList } from '../../service/CityList';

@Component({
	selector: 'app-add-dealer',
	templateUrl: './add-dealer.component.html',
	styleUrls: [ './add-dealer.component.css' ]
})
export class AddDealerComponent implements OnInit {
	form: any;
	Invalid = false;
	city = CityList.getCities();
	constructor(fb: FormBuilder, private server: HttpService) {
		this.form = fb.group({
			username: '',
			firstname: '',
			lastname: '',
			mobile: '',
			rationno: '',
			adharno: '',
			city: '',
			role: ''
		});
	}

	ngOnInit() {}

	submitForm(form: any) {
		if (this.form.valid) {
			form.role = 'dealer';
			this.server.call('AddDealer', form).subscribe(
				(result) => {
					alert('added sucessfully');
				},
				(error) => {
					this.Invalid = true;
				}
			);
		} else {
			this.validateAllFormFields(this.form);
		}
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

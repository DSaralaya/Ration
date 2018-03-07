import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpService } from '../../service/httpService';

@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
})
export class AddDealerComponent implements OnInit {
  form: any;
	Invalid = false;
	constructor(fb: FormBuilder, private server: HttpService) {
		this.form = fb.group({
			username: '',
			firstname: '',
			lastname: '',
			mobile: '',
			rationno: '',
			adharno: '',city:''
		});
	}

	ngOnInit() {}

	submitForm(form: any) {
		if (this.form.valid) {
			this.server.call('register', form).subscribe(
				(result) => {},
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

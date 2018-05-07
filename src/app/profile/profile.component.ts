import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpService } from '../service/httpService';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	form: any;
	model: any;
	isCityUpdate = false;
	Invalid = false;
	constructor(private fb: FormBuilder, private server: HttpService) {
		var usr = JSON.parse(localStorage.getItem('currentUser'));

		if (usr.role === 'central') {
			this.isCityUpdate = true;
		}
	}

	ngOnInit() {
		this.getUser();
	}
	getUser() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		this.model = usr;
		this.form = this.fb.group({
			username: usr.username,
			firstname: usr.firstname,
			lastname: usr.lastname,
			mobile: usr.mobile,
			rationno: usr.rationno,
			adharno: usr.adharno,
			city: usr.city,
			role: usr.role,
			objectId: usr.objectId
		});
	}

	submitForm(form: any) {
		if (this.form.valid) {
			this.server.call('profileUpdate', form).subscribe(
				(result) => {
					this.getUser();
					alert('updated successfully');
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

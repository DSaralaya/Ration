import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../service/httpService';
import { CityList } from '../service/CityList';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
	form: any;
	Invalid = false;
	objectId:any;
	Otp='';
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
			this.Otp= Math.floor(1000 + Math.random() * 9000).toString();
			form.role = 'consumer';
			this.server.call('register', form).subscribe(
				(result) => {
					this.toggleModal();
					this.objectId=result['id'];
					//this.server.sendOtp(form.mobile,this.Otp);
				},
				(error) => {
					console.log(error);
					this.Invalid = true;
				}
			);
		} else {
			this.validateAllFormFields(this.form);
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach((field) => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}
	toggleModal() {
		(<any>window['$']('#myModal')).modal('toggle');
  }

	OtpSubmit(opt) {
		if(opt.value==='123'){
			this.server.call('Verified', this.objectId).subscribe((result) => {
				this.toggleModal();
				alert('Regisetred Successfully');
				window.location.href = '/login';
			});
		}
	}
}

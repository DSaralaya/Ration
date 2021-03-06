import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debug } from 'util';
import { environment } from '../../environments/environment';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../service/httpService';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	Invalid = false;
	constructor(fb: FormBuilder, private router: Router, private server: HttpService) {
		this.loginForm = fb.group({
			username: '',
			password: ''
		});
	}

	ngOnInit() {
		this.redirect();
	}

	submitForm(form: any): void {
		if (this.loginForm.valid) {
			this.server.call('login', form).subscribe(
				(result) => {
					if (result) {
						this.redirect();
					}
				},
				(error) => {
					this.Invalid = true;
				}
			);
		} else {
			this.validateAllFormFields(this.loginForm);
		}
	}

	redirect() {
		if (localStorage.getItem('currentUser')) {
			var user = JSON.parse(localStorage.getItem('currentUser'));
			if (user.role === 'central') {
				//this.router.navigateByUrl('central');
				window.location.href = '/central';
			} else if (user.role === 'dealer') {
				window.location.href = '/dealer';
				//this.router.navigateByUrl('dealer');
			} else if (user.role === 'consumer') {
				window.location.href = '/viewreport';
				//this.router.navigateByUrl('consumer');
			}
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
	forgotPassword() {
		(<any>window['$']('#myModal')).modal('toggle');
	}

	OtpSubmit(input) {
		console.log(input.value.length);
		if (input.value.length === 10) {
			var val = Math.floor(1000 + Math.random() * 9000);
			var form = { password: val, mobile: input.value };
			this.server.call('updatePassword', form).subscribe((result: any[]) => {
				//this.server.forgotOtp(input.value, val);
				(<any>window['$']('#myModal')).modal('hide');
				alert('Password Changed');
				console.log(val);
			});
		} else {
			alert('invalid mobile no');
		}
	}
}

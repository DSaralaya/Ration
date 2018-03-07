import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
	Parse: any = window['Parse'];

	call(method, params: any) {
		if (method == 'login') {
			return Observable.fromPromise(this.LoginCall(params));
		} else if (method == 'register') {
			return Observable.fromPromise(this.RegisterCall(params));
		} else if (method == 'getdealers') {
			return Observable.fromPromise(this.GetDealers());
		} else if (method == 'profileUpdate') {
			return Observable.fromPromise(this.ProfileUpdate(params));
		}
		return null;
	}

	private LoginCall(form) {
		return this.Parse.User.logIn(form.username, form.password, {
			success: function(user) {
				if (user) {
					localStorage.setItem('currentUser', JSON.stringify(user));
				}
				return true;
			},
			error: function(user, error) {
				debugger;
				return false;
			}
		});
	}

	private RegisterCall(form) {
		var user = new this.Parse.User();
		user.set('username', form.username);
		user.set('password', '12345');
		user.set('firstname', form.firstname);
		user.set('lastname', form.lastname);
		user.set('mobile', form.mobile);
		user.set('rationno', form.rationno);
		user.set('adharno', form.adharno);
		user.set('city', form.city);
		user.set('role', form.role);
		//need to add otp
		return user.signUp(null, {
			success: function(user) {
				return true;
			},
			error: function(user, error) {
				return false;
			}
		});
	}
	private ProfileUpdate(form) {
		var query = new this.Parse.Query(this.Parse.User);
		query.equalTo('objectId', form.objectId);
		return query.first({
			success: function(user) {
				debugger;
				user.set('firstname', form.firstname);
				user.set('lastname', form.lastname);
				user.set('mobile', form.mobile);
				user.set('rationno', form.rationno);
				user.set('adharno', form.adharno);
				user.set('city', form.city);
				user.save();
				localStorage.setItem('currentUser', JSON.stringify(user));
				return true;
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}

	private GetDealers() {
		var Users = this.Parse.Object.extend('User');
		var query = new this.Parse.Query(Users);
		query.notEqualTo('role', 'central');
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}
}

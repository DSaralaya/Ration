import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
	Parse: any = window['Parse'];
	listMonths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
	call(method, params: any) {
		if (method == 'login') {
			return Observable.fromPromise(this.LoginCall(params));
		} else if (method == 'register') {
			return Observable.fromPromise(this.RegisterCall(params));
		} else if (method == 'getdealers') {
			return Observable.fromPromise(this.GetDealers());
		} else if (method == 'profileUpdate') {
			return Observable.fromPromise(this.ProfileUpdate(params));
		} else if (method == 'addProduct') {
			return Observable.fromPromise(this.addProduct(params));
		} else if (method == 'updateProduct') {
			return Observable.fromPromise(this.updateProduct(params));
		} else if (method == 'getProducts') {
			return Observable.fromPromise(this.getProducts());
		} else if (method == 'getConsumers') {
			return Observable.fromPromise(this.getConsumers());
		} else if (method == 'getConsumerRequests') {
			return Observable.fromPromise(this.getConsumerRequests());
		} else if (method == 'createConsumerRequests') {
			return Observable.fromPromise(this.createConsumerRequests(params));
		} else if (method == 'updateConsumerRequests') {
			return Observable.fromPromise(this.updateConsumerRequests(params));
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

	private getProducts() {
		var products = this.Parse.Object.extend('Products');
		var query = new this.Parse.Query(products);
		query.equalTo('year', new Date().getFullYear().toString());
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}

	private addProduct(form) {
		var products = this.Parse.Object.extend('Products');
		var product = new products();
		product.set('year', new Date().getFullYear().toString());
		product.set('month', form.month);
		product.set('rice', form.rice);
		product.set('sugar', form.sugar);
		product.set('kerosene', form.kerosene);
		return product.save(null, {
			success: function(user) {
				return true;
			},
			error: function(user, error) {
				return false;
			}
		});
	}

	private updateProduct(form) {
		var products = this.Parse.Object.extend('Products');
		var query = new this.Parse.Query(products);
		query.equalTo('month', form.month);
		query.equalTo('year', new Date().getFullYear().toString());
		return query.first({
			success: function(product) {
				product.set('rice', form.rice);
				product.set('kerosene', form.kerosene);
				product.set('sugar', form.sugar);
				product.save();
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}

	private getConsumers() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var Users = this.Parse.Object.extend('User');
		var query = new this.Parse.Query(Users);
		query.equalTo('role', 'consumer');
		query.equalTo('city', usr.city);
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}

	private getConsumerRequests() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var query = new this.Parse.Query(requets);
		query.equalTo('cosumerid', usr.objectId);
		query.equalTo('year', new Date().getFullYear());
		query.equalTo('month', this.listMonths[new Date().getMonth()]);
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}

	private createConsumerRequests(form) {
		debugger;
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var request = new requets();
		request.set('year', new Date().getFullYear());
		request.set('month', this.listMonths[new Date().getMonth()]);
		request.set('rice', form.rice);
		request.set('cosumerid', usr.objectId);
		request.set('sugar', form.sugar);
		request.set('kerosene', form.kerosene);
		request.set('appointment', form.appointment);
		request.set('time', form.time);
		request.set('requestedOn', new Date());
		request.set('status', 'pending');
		return request.save(null, {
			success: function(user) {
				return true;
			},
			error: function(user, error) {
				return false;
			}
		});
	}

	private updateConsumerRequests(form) {
		debugger;
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var query = new this.Parse.Query(requets);
		query.equalTo('objectId', form.objectId);
		return query.first({
			success: function(req) {
				req.set('rice', form.rice);
				req.set('sugar', form.sugar);
				req.set('kerosene', form.kerosene);
				req.set('appointment', form.appointment);
				req.set('time', form.time);
				req.set('requestedOn', new Date());
				req.save();
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}
}

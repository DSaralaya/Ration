import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';
import {  Http } from '@angular/http';
@Injectable()
export class HttpService {
	Parse: any = window['Parse'];
	listMonths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
	constructor(private http:Http) {

	}
	sendOtp(number,otp) {
		return this.http.get('https://control.msg91.com/api/sendotp.php?authkey=166425AgIVLyed597225f5&mobile='+number+'&message=Your%20otp%20is%20'+otp+'&otp='+otp).toPromise();
	}
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
		} else if (method == 'getDealerRequests') {
			return Observable.fromPromise(this.getDealerRequests());
		} else if (method == 'updateRequest') {
			return Observable.fromPromise(this.updateRequest(params));
		} else if (method == 'updateProductQuantity') {
			return Observable.fromPromise(this.updateProductQuantity(params));
		} else if (method == 'viewReport') {
			return Observable.fromPromise(this.viewReport());
		} else if (method == 'getAssginedProduct') {
			return Observable.fromPromise(this.getAssginedProduct());
		} else if (method == 'GetDealersOnly') {
			return Observable.fromPromise(this.GetDealersOnly());
		} else if (method == 'AddDealer') {
			return Observable.fromPromise(this.AddDealer(params));
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
				this.Parse.User.logOut().then(() => {
					var currentUser = this.Parse.User.current(); // this will now be null
				});
				return true;
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}

	private AddDealer(form) {
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
		user.set('mobileVerified', true);
		//need to add otp
		return user.save(null, {
			success: function(user) {
				return true;
			},
			error: function(user, error) {
				console.log(error);
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

	private GetDealersOnly() {
		var Users = this.Parse.Object.extend('User');
		var query = new this.Parse.Query(Users);
		query.equalTo('role', 'dealer');
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
		product.set('month', this.listMonths[new Date().getMonth()]);
		product.set('rice', form.rice);
		product.set('sugar', form.sugar);
		product.set('kerosene', form.kerosene);
		product.set('city', form.city);
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
		query.equalTo('city', form.city);
		query.equalTo('year', new Date().getFullYear().toString());
		return query.first({
			success: function(product) {
				product.set('rice', form.rice);
				product.set('kerosene', form.kerosene);
				product.set('sugar', form.sugar);
				//product.set('city', form.city);
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
		debugger;
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var query = new this.Parse.Query(requets);
		var userPointer = {
			__type: 'Pointer',
			className: '_User',
			objectId: usr.objectId
		};
		query.equalTo('consumerid', userPointer);
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
		var userPointer = {
			__type: 'Pointer',
			className: '_User',
			objectId: usr.objectId
		};
		request.set('year', new Date().getFullYear());
		request.set('month', this.listMonths[new Date().getMonth()]);
		request.set('rice', form.rice);
		request.set('consumerid', userPointer);
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

	private getDealerRequests() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var users = this.Parse.Object.extend('User');
		var query = new this.Parse.Query(requets);
		query.equalTo('status', 'pending');
		query.include('consumerid');
		//query.equalTo("consumerid.city", usr.city);
		return query.find({
			success: function(results) {
				if (results.length > 0) {
					return results.filter(function(t) {
						return t.attributes.consumerid.attributes.city == usr.city;
					});
				}
				return results;
			},
			error: function(error) {}
		});
	}

	private updateRequest(form) {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var query = new this.Parse.Query(requets);
		query.equalTo('objectId', form.objectId);
		return query.first({
			success: function(req) {
				req.set('status', form.status);
				req.set('approvedon', new Date());
				req.set('approver', usr.objectId);
				req.save();
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}

	private updateProductQuantity(form) {
		var requets = this.Parse.Object.extend('Products');
		var query = new this.Parse.Query(requets);

		query.equalTo('month', this.listMonths[new Date().getMonth()]);
		return query.first({
			success: function(req) {
				debugger;
				req.set('sugar', req.attributes.sugar - form.sugar);
				req.set('rice', req.attributes.rice - form.rice);
				req.set('kerosene', req.attributes.kerosene - form.kerosene);
				req.save();
			},
			error: function(user, error) {
				console.log(error);
				return false;
			}
		});
	}

	private viewReport() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Requests');
		var query = new this.Parse.Query(requets);
		query.include('consumerid');
		//query.equalTo("consumerid.city", usr.city);
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}

	private getAssginedProduct() {
		var usr = JSON.parse(localStorage.getItem('currentUser'));
		var requets = this.Parse.Object.extend('Products');
		var query = new this.Parse.Query(requets);
		query.equalTo('city', usr.city);
		return query.find({
			success: function(results) {
				return results;
			},
			error: function(error) {}
		});
	}
}

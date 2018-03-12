import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ng2-validation';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CentalHomeComponent } from './central/cental-home/cental-home.component';
import { DealerHomeComponent } from './dealer/dealer-home/dealer-home.component';
import { ConsumerHomeComponent } from './consumer/consumer-home/consumer-home.component';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { AuthGuard } from './service/AuthGurd';
import { HttpService } from './service/httpService';
import { RegisterComponent } from './register/register.component';
import { AddDealerComponent } from './central/add-dealer/add-dealer.component';
import { ProfileComponent } from './profile/profile.component';
import { AddproductsComponent } from './central/addproducts/addproducts.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ViewrequestComponent } from './dealer/viewrequest/viewrequest.component';
import { CreateRequestComponent } from './consumer/create-request/create-request.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'central', component: CentalHomeComponent, canActivate: [ AuthGuard ] },
	{ path: 'addDealer', component: AddDealerComponent, canActivate: [ AuthGuard ] },
	{ path: 'dealer', component: DealerHomeComponent, canActivate: [ AuthGuard ] },
	{ path: 'consumer', component: ConsumerHomeComponent, canActivate: [ AuthGuard ] },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard ] },
	{ path: 'addProduct', component: AddproductsComponent, canActivate: [ AuthGuard ] },
	{ path: 'createrequest', component: CreateRequestComponent, canActivate: [ AuthGuard ] },
	{ path: 'viewrequest', component: ViewrequestComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
	declarations: [ AppComponent, LoginComponent, CentalHomeComponent, DealerHomeComponent, ConsumerHomeComponent, FieldErrorDisplayComponent, RegisterComponent, AddDealerComponent, ProfileComponent, AddproductsComponent, ViewrequestComponent, CreateRequestComponent ],
	imports: [ BrowserModule, ReactiveFormsModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes), CustomFormsModule, BrowserAnimationsModule, GridModule, DropDownsModule, DateInputsModule, InputsModule ],
	providers: [ AuthGuard, HttpService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}

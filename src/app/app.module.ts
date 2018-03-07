import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ng2-validation'
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

const appRoutes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent , },
  { path: 'central', component: CentalHomeComponent,canActivate:[AuthGuard] },
  { path: 'addDealer', component: AddDealerComponent,canActivate:[AuthGuard] },
  { path: 'dealer', component: DealerHomeComponent ,canActivate:[AuthGuard] },
  { path: 'consumer', component: ConsumerHomeComponent ,canActivate:[AuthGuard] },
  { path: 'register', component: RegisterComponent  },
  { path: 'profile', component: ProfileComponent ,canActivate:[AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CentalHomeComponent,
    DealerHomeComponent,
    ConsumerHomeComponent,
    FieldErrorDisplayComponent,
    RegisterComponent,
    AddDealerComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,FormsModule,
    HttpModule,RouterModule.forRoot(appRoutes),CustomFormsModule 
  ],
  providers: [AuthGuard,HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

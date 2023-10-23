import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './sections/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { SharePlaceComponent } from './sections/share-place/share-place.component';
import { AuthGuard } from './auth/auth.guard';
import { ListingPlaceComponent } from './sections/listing-place/listing-place.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'auth', component: AuthComponent},
  {path: 'listing', component: ListingPlaceComponent },
  {path: 'share', component: SharePlaceComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

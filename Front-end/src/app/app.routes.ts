import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
//Componentes Estructurales
import { NavbarComponent } from './ComponentesEstructurales/navbar/navbar.component';
import { HeroComponent } from './ComponentesEstructurales/hero/hero.component';
import { FooterComponent } from './ComponentesEstructurales/footer/footer.component';
import { LoginComponent } from './ComponentesEstructurales/login/login.component';
import { RegisterComponent } from './ComponentesEstructurales/register/register.component';
import { PropertyBenefitsComponent } from './ComponentesEstructurales/property-benefits/property-benefits.component';
import { LocationPropertiesComponent } from './ComponentesEstructurales/location-properties/location-properties.component';
//Componentes Propiedades
import { FeaturedPropertiesComponent } from './ComponentesPropiedades/featured-properties/featured-properties.component';
import { PropertyCardComponent } from './ComponentesPropiedades/property-card/property-card.component';
import { FilterSidebarComponent } from './ComponentesPropiedades/filter-sidebar/filter-sidebar.component';
//Componentes de Interacción
import { ContactFormComponent } from './ComponentesInteracción/contact-form/contact-form.component';
import { TestimonialsComponent } from './ComponentesInteracción/testimonials/testimonials.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
	{ path: '', component: MainComponent},
    //Componentes Estructurales
    { path: 'navbar', component: NavbarComponent},
    { path: 'hero', component: HeroComponent},
    { path: 'footer', component: FooterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'property-benefits', component: PropertyBenefitsComponent},
    { path: 'location-properties', component: LocationPropertiesComponent},
    {path:'dashboard',component:DashboardComponent},
    //Componentes Propiedades
    { path: 'featured-properties', component: FeaturedPropertiesComponent},
    { path: 'property-card', component: PropertyCardComponent},
    { path: 'filter-sidebar', component: FilterSidebarComponent},
    // Componentes de Interacción
    { path: 'testimonials', component: TestimonialsComponent},
    { path: 'contact-form', component: ContactFormComponent},

    { path: '**', redirectTo: '' },

];

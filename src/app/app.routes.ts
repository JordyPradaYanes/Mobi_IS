import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
//Componentes Estructurales
import { NavbarComponent } from './ComponentesEstructurales/navbar/navbar.component';
import { HeroComponent } from './ComponentesEstructurales/hero/hero.component';
import { FooterComponent } from './ComponentesEstructurales/footer/footer.component';
import { LoginComponent } from './ComponentesEstructurales/login/login.component';
//Componentes Propiedades
import { FeaturedPropertiesComponent } from './ComponentesPropiedades/featured-properties/featured-properties.component';
import { PropertyCardComponent } from './ComponentesPropiedades/property-card/property-card.component';
import { FilterSidebarComponent } from './ComponentesPropiedades/filter-sidebar/filter-sidebar.component';
//Componentes de Interacción
import { ContactFormComponent } from './ComponentesInteracción/contact-form/contact-form.component';
import { TestimonialsComponent } from './ComponentesInteracción/testimonials/testimonials.component';

export const routes: Routes = [
	{ path: '', component: MainComponent},
    { path: '**', redirectTo: '' },
    //Componentes Estructurales
    { path: 'navbar', component: NavbarComponent},
    { path: 'hero', component: HeroComponent},
    { path: 'footer', component: FooterComponent},
    { path: 'login', component: LoginComponent},
    //Componentes Propiedades
    { path: 'featured-properties', component: FeaturedPropertiesComponent},
    { path: 'property-card', component: PropertyCardComponent},
    { path: 'filter-sidebar', component: FilterSidebarComponent},
    // Componentes de Interacción
    { path: 'testimonials', component: TestimonialsComponent},
    { path: 'contact-form', component: ContactFormComponent},

];

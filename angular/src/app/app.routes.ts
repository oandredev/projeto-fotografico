import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Public
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';

// Admin (protected with AuthGuard and Json Web Token)
import { Admin } from './pages/admin/admin';
import { Inbox } from './sections/admin/general/inbox/inbox';
import { Customers } from './sections/admin/general/customers/customers';
import { Statistics } from './sections/admin/general/statistics/statistics';
import { HeroSettings } from './sections/admin/customization/hero-settings/hero-settings';
import { AboutSettings } from './sections/admin/customization/about-settings/about-settings';
import { PortfolioSettings } from './sections/admin/customization/portfolio-settings/portfolio-settings';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login, title: 'Login' },
  {
    path: 'admin',
    component: Admin,
    title: 'Área do Administrador',
    canActivate: [authGuard],
    children: [
      { path: '', component: Inbox },
      { path: 'inbox', component: Inbox, title: 'Caixa de Entrada' },
      { path: 'customers', component: Customers, title: 'Clientes' },
      { path: 'statistics', component: Statistics, title: 'Estatísticas' },
      { path: 'hero-settings', component: HeroSettings, title: 'Início' },
      { path: 'about-settings', component: AboutSettings, title: 'Sobre' },
      { path: 'portfolio-settings', component: PortfolioSettings, title: 'Portfólio' },
    ],
  },
  { path: '**', component: NotFound },
];

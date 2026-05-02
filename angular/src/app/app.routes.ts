import { Routes } from '@angular/router';

// Public
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

// (Protected with AuthGuard and Json Web Token)
import { VerifyCode } from './pages/verify-code/verify-code';
import { ResetPassword } from './pages/reset-password/reset-password';

// Admin (protected with AuthGuard and Json Web Token)
import { Admin } from './pages/admin/admin';
import { Inbox } from './sections/admin/general/inbox/inbox';
import { Customers } from './sections/admin/general/customers/customers';
import { Services } from './sections/admin/general/services/services';
import { Statistics } from './sections/admin/general/statistics/statistics';
import { Announcement } from './sections/admin/general/announcement/announcement';
import { HeroSettings } from './sections/admin/customization/hero-settings/hero-settings';
import { AboutSettings } from './sections/admin/customization/about-settings/about-settings';
import { PortfolioSettings } from './sections/admin/customization/portfolio-settings/portfolio-settings';
import { ContactSettings } from './sections/admin/customization/contact-settings/contact-settings';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'forgot-password', component: ForgotPassword, title: 'Esqueci minha senha' },
  { path: 'verify-code', component: VerifyCode, title: 'Código de Verificação' },
  { path: 'reset-password', component: ResetPassword, title: 'Resetar Senha' },
  {
    path: 'admin',
    component: Admin,
    title: 'Área do Administrador',
    children: [
      { path: '', component: Inbox },
      { path: 'inbox', component: Inbox, title: 'Caixa de Entrada' },
      { path: 'customers', component: Customers, title: 'Clientes' },
      { path: 'services', component: Services, title: 'Serviços' },
      { path: 'statistics', component: Statistics, title: 'Estatísticas' },
      { path: 'announcement', component: Announcement, title: 'Anúncios/Avisos' },
      { path: 'hero-settings', component: HeroSettings, title: 'Início' },
      { path: 'about-settings', component: AboutSettings, title: 'Sobre' },
      { path: 'portfolio-settings', component: PortfolioSettings, title: 'Portfólio' },
      { path: 'contact-settings', component: ContactSettings, title: 'Contatos' },
    ],
  },
  { path: '**', component: NotFound }
];
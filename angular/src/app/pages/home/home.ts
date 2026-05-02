import { Component } from '@angular/core';
import { Hero } from '../../sections/public/hero/hero';
import { Portfolio } from '../../sections/public/portfolio/portfolio';
import { About } from '../../sections/public/about/about';
import { Contact } from '../../sections/public/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, Portfolio, About, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
  
export class Home {}
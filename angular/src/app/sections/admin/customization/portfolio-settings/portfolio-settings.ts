import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-portfolio-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-settings.html',
  styleUrls: ['./portfolio-settings.css'],
})
export class PortfolioSettings {}

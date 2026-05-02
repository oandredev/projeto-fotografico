import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbar } from '../../components/admin/admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, AdminNavbar],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
  
export class Admin {}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Shared } from '../services/shared';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, AppHeaderComponent,RouterModule],
})
export class Tab4Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { AppHeaderComponent } from '../components/app-header/app-header.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    AppHeaderComponent
  ],
  declarations: []
})
export class Tab1PageModule {}

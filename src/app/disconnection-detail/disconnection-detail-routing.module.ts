import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisconnectionDetailPage } from './disconnection-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DisconnectionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisconnectionDetailPageRoutingModule {}

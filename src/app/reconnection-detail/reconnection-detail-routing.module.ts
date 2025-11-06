import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReconnectionDetailPage } from './reconnection-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReconnectionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReconnectionDetailPageRoutingModule {}

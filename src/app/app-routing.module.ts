import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
    {
    path: 'disconnection-detail/:id',
    loadComponent: () => import('./disconnection-detail/disconnection-detail.page').then(m => m.DisconnectionDetailPage)
  },
      {
    path: 'reconnection-detail/:id',
    loadComponent: () => import('./reconnection-detail/reconnection-detail.page').then(m => m.ReconnectionDetailPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'disconnection-detail',
    loadChildren: () => import('./disconnection-detail/disconnection-detail.module').then( m => m.DisconnectionDetailPageModule)
  },
    {
    path: 'reconnection-detail',
    loadChildren: () => import('./reconnection-detail/reconnection-detail.module').then( m => m.ReconnectionDetailPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'reconnection-detail',
    loadChildren: () => import('./reconnection-detail/reconnection-detail.module').then( m => m.ReconnectionDetailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

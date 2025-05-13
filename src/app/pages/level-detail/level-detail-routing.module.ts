import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LevelDetailPage } from './level-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LevelDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LevelDetailPageRoutingModule {}

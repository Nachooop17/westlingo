import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LevelDetailPageRoutingModule } from './level-detail-routing.module';

import { LevelDetailPage } from './level-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LevelDetailPageRoutingModule
  ],
  declarations: [LevelDetailPage]
})
export class LevelDetailPageModule {}

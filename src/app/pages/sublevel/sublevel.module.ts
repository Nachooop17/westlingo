import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SublevelPageRoutingModule } from './sublevel-routing.module';

import { SublevelPage } from './sublevel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SublevelPageRoutingModule
  ],
  declarations: [SublevelPage]
})
export class SublevelPageModule {}

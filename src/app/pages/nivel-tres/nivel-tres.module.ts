import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTresPageRoutingModule } from './nivel-tres-routing.module';

import { NivelTresPage } from './nivel-tres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTresPageRoutingModule
  ],
  declarations: [NivelTresPage]
})
export class NivelTresPageModule {}

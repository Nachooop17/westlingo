import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNuevePageRoutingModule } from './nivel-nueve-routing.module';

import { NivelNuevePage } from './nivel-nueve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNuevePageRoutingModule
  ],
  declarations: [NivelNuevePage]
})
export class NivelNuevePageModule {}

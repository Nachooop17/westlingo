import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDosPageRoutingModule } from './nivel-dos-routing.module';

import { NivelDosPage } from './nivel-dos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDosPageRoutingModule
  ],
  declarations: [NivelDosPage]
})
export class NivelDosPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambionombrePageRoutingModule } from './cambionombre-routing.module';

import { CambionombrePage } from './cambionombre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambionombrePageRoutingModule
  ],
  declarations: [CambionombrePage]
})
export class CambionombrePageModule {}

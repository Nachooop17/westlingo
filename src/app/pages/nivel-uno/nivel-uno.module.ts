import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUnoPageRoutingModule } from './nivel-uno-routing.module';

import { NivelUnoPage } from './nivel-uno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUnoPageRoutingModule
  ],
  declarations: [NivelUnoPage]
})
export class NivelUnoPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho7PageRoutingModule } from './nivel-ocho.7-routing.module';

import { NivelOcho7Page } from './nivel-ocho.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho7PageRoutingModule
  ],
  declarations: [NivelOcho7Page]
})
export class NivelOcho7PageModule {}

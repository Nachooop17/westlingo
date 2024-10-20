import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho8PageRoutingModule } from './nivel-ocho.8-routing.module';

import { NivelOcho8Page } from './nivel-ocho.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho8PageRoutingModule
  ],
  declarations: [NivelOcho8Page]
})
export class NivelOcho8PageModule {}

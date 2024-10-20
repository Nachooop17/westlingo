import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOchoPageRoutingModule } from './nivel-ocho-routing.module';

import { NivelOchoPage } from './nivel-ocho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOchoPageRoutingModule
  ],
  declarations: [NivelOchoPage]
})
export class NivelOchoPageModule {}

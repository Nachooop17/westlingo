import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho5PageRoutingModule } from './nivel-ocho.5-routing.module';

import { NivelOcho5Page } from './nivel-ocho.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho5PageRoutingModule
  ],
  declarations: [NivelOcho5Page]
})
export class NivelOcho5PageModule {}

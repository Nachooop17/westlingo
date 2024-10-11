import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro5PageRoutingModule } from './nivel-cuatro.5-routing.module';

import { NivelCuatro5Page } from './nivel-cuatro.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro5PageRoutingModule
  ],
  declarations: [NivelCuatro5Page]
})
export class NivelCuatro5PageModule {}

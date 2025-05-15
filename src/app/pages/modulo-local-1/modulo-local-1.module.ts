import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModuloLocal1PageRoutingModule } from './modulo-local-1-routing.module';
import { Routes } from '@angular/router';
import { ModuloLocal1Page } from './modulo-local-1.page'; 


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloLocal1PageRoutingModule  ],
      declarations: [ModuloLocal1Page]
  
})
export class ModuloLocal1PageModule {}
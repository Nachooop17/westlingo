import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/database.service';
import { Usuario } from '@services/users';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
})
export class AdminUsuariosPage implements OnInit {
  usuario: Usuario | null = null;
  progreso: number = 0;
  razonBaneo: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const idusuario = this.route.snapshot.paramMap.get('idusuario');
    if (idusuario) {
      this.usuario = await this.userService.obtenerUsuarioPorId(+idusuario);
      this.progreso = await this.userService.obtenerProgresoPorUsuario(+idusuario);
    }
  }

  async cambiarEstadoBaneo() {
    if (!this.usuario) return;
  
    this.usuario.baneo = !this.usuario.baneo; // Cambiar estado de baneo
  
    try {
      await this.userService.actualizarBaneoUsuario(
        this.usuario.idusuario,
        this.usuario.baneo,
        this.razonBaneo
      );
  
      const estado = this.usuario.baneo ? 'baneado' : 'activo';
      const alert = await this.alertController.create({
        header: 'Estado actualizado',
        message: `El usuario ahora está ${estado}.`,
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      console.error('Error al actualizar el estado de baneo:', error);
    }
  }
  
}

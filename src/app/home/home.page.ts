import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service';
import { Nivel } from '@services/niveles';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Asegúrate de importar esto


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  niveles: Nivel[] = [];
  private idusuario: number = 0;

  constructor(
    private userService: UserService, 
    private router: Router,
    private alertController: AlertController // Asegúrate de agregar esto
  ) {}

  ngOnInit() {
    this.idusuario = Number(localStorage.getItem('userId'));
    if (!this.idusuario) {
      alert('No se ha encontrado un usuario logeado');
      this.router.navigate(['/login']);
      return;
    }
  
    this.userService.dbState().subscribe((ready) => {
      if (ready) {
        this.userService.actualizarAccesoNivel(this.idusuario,1);
        this.userService.getNiveles(this.idusuario).then((niveles) => {
          console.log('Niveles Recuperados:', JSON.stringify(niveles));
          this.niveles = niveles;
        });
      }
    });
  }
  

  irANivel(idnivel: number) {
    const nivel = this.niveles.find(n => n.idnivel === idnivel);
    console.log(`Nivel ${idnivel}: `, nivel); // Verificar el nivel y su propiedad acceso
    if (nivel && nivel.acceso) {
      let ruta = '';
      switch(idnivel) {
        case 1: ruta = '/nivel-uno'; break;
        case 2: ruta = '/nivel-dos'; break;
        case 3: ruta = '/nivel-tres'; break;
        case 4: ruta = '/nivel-cuatro'; break;
        case 5: ruta = '/nivel-cinco'; break;
        case 6: ruta = '/nivel-seis'; break;
        case 7: ruta = '/nivel-siete'; break;
        case 8: ruta = '/nivel-ocho'; break;
        case 9: ruta = '/nivel-nueve'; break;
        default: ruta = `/nivel-${idnivel}`;
      }
      this.router.navigate([ruta]); // Navegar a la ruta correcta
    } else {
      this.presentAlert('Acceso Denegado', 'Este nivel está bloqueado.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  debugAccess() {
    this.userService.database.executeSql(
      `SELECT DISTINCT n.* FROM niveles n 
       JOIN progreso p ON n.idnivel = p.idnivel 
       WHERE p.idusuario = ?`,
      [this.idusuario]
    )
    .then((res) => {
      const niveles = [];
      for (let i = 0; i < res.rows.length; i++) {
        niveles.push(res.rows.item(i));
      }
      console.log('Debug Acceso desde la base de datos:', JSON.stringify(niveles, null, 2));
    })
    .catch(e => console.log('Error en debugAccess:', JSON.stringify(e)));
  }
  
  
  
}

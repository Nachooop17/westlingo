import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '@services/users';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Variable de conexión a la Base de Datos
  public database!: SQLiteObject;

  // Variables de creación de tablas
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL);";
  
  tablaNiveles: string = "CREATE TABLE IF NOT EXISTS niveles(idnivel INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  
  tablaSubniveles: string = "CREATE TABLE IF NOT EXISTS subniveles(idsubnivel INTEGER PRIMARY KEY AUTOINCREMENT, idnivel INTEGER, nombre VARCHAR(100) NOT NULL, FOREIGN KEY (idnivel) REFERENCES niveles(idnivel) ON DELETE CASCADE);";

  // Variables de insert por defecto
  registroUsuario: string = "INSERT or IGNORE INTO usuario(idusuario, nombre, email, password) VALUES (1, 'Usuario Admin', 'admin@example.com', 'admin123')";

  // Variables tipo observables para manipular los registros de la base de datos
  listaUsuarios = new BehaviorSubject<Usuario[]>([]);

  // Variable observable para el estatus de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.crearBD();
  }

  async crearBD() {
    // Verificar si la plataforma está lista
    await this.platform.ready();
    
    // Crear la base de datos
    try {
      this.database = await this.sqlite.create({
        name: 'bdusuarios.db',
        location: 'default'
      });
      
      // Llamar a la creación de las tablas
      await this.crearTablas();
      await this.getUsuarios();
      
      // Modificar el estado de la base de datos
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('CrearBD', 'Error: ' + JSON.stringify(e));
    }
  }

  async crearTablas() {
    try {
      // Crear la tabla de usuarios
      await this.database.executeSql(this.tablaUsuario, []);

      await this.database.executeSql(this.tablaNiveles, []);
      await this.database.executeSql(this.tablaSubniveles, []);

      // Insertar el registro por defecto
      await this.database.executeSql(this.registroUsuario, []);

    } catch (e) {
      this.presentAlert('CrearTabla', 'Error: ' + JSON.stringify(e));
    }
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  fetchUsuarios(): Observable<Usuario[]> {
    return this.listaUsuarios.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  async getUsuarios() {
    try {
      const res = await this.database.executeSql('SELECT * FROM usuario', []);
      let items: Usuario[] = [];
      
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push(new Usuario(
            res.rows.item(i).idusuario,
            res.rows.item(i).nombre,
            res.rows.item(i).email,
            res.rows.item(i).password
          ));
        }
      }
      this.listaUsuarios.next(items);
    } catch (e) {
      this.presentAlert('GetUsuarios', 'Error: ' + JSON.stringify(e));
    }
  }

  async insertarUsuario(nombre: string, email: string, password: string) {
    try {
      await this.database.executeSql('INSERT INTO usuario(nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password]);
      await this.presentAlert("Agregar", "Usuario agregado de manera correcta");
      await this.getUsuarios();
    } catch (e) {
      this.presentAlert('Agregar', 'Error: ' + JSON.stringify(e));
    }
}

  modificarUsuario(id: number, nombre: string, email: string, password: string) {
    return this.database.executeSql('UPDATE usuario SET nombre = ?, email = ?, password = ? WHERE idusuario = ?', [nombre, email, password, id]).then(() => {
      this.presentAlert("Modificar", "Usuario modificado de manera correcta");
      this.getUsuarios();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }

  eliminarUsuario(id: number) {
    return this.database.executeSql('DELETE FROM usuario WHERE idusuario = ?', [id]).then(() => {
      this.presentAlert("Eliminar", "Usuario eliminado de manera correcta");
      this.getUsuarios();
    }).catch(e => {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    });
  }
  async verificarUsuario(email: string, password: string): Promise<boolean> {
    try {
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE email = ? AND password = ?', [email, password]);
      return res.rows.length > 0; // Retorna true si se encuentra un usuario
    } catch (e) {
      this.presentAlert('Verificar Usuario', 'Error: ' + JSON.stringify(e));
      return false; // En caso de error, retorna false
    }
  }
  async verificarEmail(email: string): Promise<boolean> {
    try {
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE email = ?', [email]);
      return res.rows.length > 0; // Retorna true si el correo existe
    } catch (e) {
      this.presentAlert('Verificar Email', 'Error: ' + JSON.stringify(e));
      return false;
    }
  }
  
  async actualizarPassword(email: string, newPassword: string): Promise<void> {
    try {
      await this.database.executeSql('UPDATE usuario SET password = ? WHERE email = ?', [newPassword, email]);
      await this.presentAlert("Actualizar Contraseña", "Contraseña actualizada correctamente");
    } catch (e) {
      this.presentAlert('Actualizar Contraseña', 'Error: ' + JSON.stringify(e));
    }
  }

  async insertarNivel(nombre: string) {
    await this.database.executeSql('INSERT INTO niveles(nombre) VALUES (?)', [nombre]);
  }
  
  async insertarSubnivel(idnivel: number, nombre: string) {
    await this.database.executeSql('INSERT INTO subniveles(idnivel, nombre) VALUES (?, ?)', [idnivel, nombre]);
  }
  
  async getNiveles() {
    const res = await this.database.executeSql('SELECT * FROM niveles', []);
    // Manejador de resultados
  }
  
  async getSubniveles(idnivel: number) {
    const res = await this.database.executeSql('SELECT * FROM subniveles WHERE idnivel = ?', [idnivel]);
    // Manejador de resultados
  }
  

}

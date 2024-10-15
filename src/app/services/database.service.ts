import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '@services/users';
import { AlertController, Platform } from '@ionic/angular';
import { Nivel } from './niveles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Variable de conexión a la Base de Datos
  public database!: SQLiteObject;

  // Variables de creación de tablas
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL);";
  
  tablaNiveles: string = `
  CREATE TABLE IF NOT EXISTS niveles(
    idnivel INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    total_subniveles INTEGER NOT NULL,
    dificultad VARCHAR(50) NOT NULL,  -- Nueva columna
    acceso BOOLEAN NOT NULL            -- Nueva columna
  );
`;

  
  tablaSubniveles: string = `
  CREATE TABLE IF NOT EXISTS subniveles(
    idsubnivel INTEGER PRIMARY KEY AUTOINCREMENT,
    idnivel INTEGER,
    nombre VARCHAR(100) NOT NULL,
    respuesta_correcta VARCHAR(100) NOT NULL,
    imagen TEXT,
    FOREIGN KEY (idnivel) REFERENCES niveles(idnivel) ON DELETE CASCADE
  );
`;

  // Variables de insert por defecto
  registroUsuario: string = "INSERT or IGNORE INTO usuario(idusuario, nombre, email, password) VALUES (1, 'Usuario Admin', 'admin@example.com', 'admin123')";

  // Variables tipo observables para manipular los registros de la base de datos
  listaUsuarios = new BehaviorSubject<Usuario[]>([]);

  // Variable observable para el estatus de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Variable observable para niveles
  private listaNiveles = new BehaviorSubject<Nivel[]>([]);

  // Variable observable para el estatus de los niveles
  private isNivelesReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
  
      const nivelesExistentes = await this.getNiveles();
      if (nivelesExistentes.length === 0) {
        await this.insertarNiveles(); 
        await this.insertarSubniveles();
      }

      await this.getNiveles(); // Llama aquí para obtener los niveles después de insertarlos
  
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

  async modificarUsuario(id: number, nombre: string, email: string, password: string) {
    try {
      await this.database.executeSql('UPDATE usuario SET nombre = ?, email = ?, password = ? WHERE idusuario = ?', [nombre, email, password, id]);
      this.presentAlert("Modificar", "Usuario modificado de manera correcta");
      this.getUsuarios();
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }

  async eliminarUsuario(id: number) {
    try {
      await this.database.executeSql('DELETE FROM usuario WHERE idusuario = ?', [id]);
      this.presentAlert("Eliminar", "Usuario eliminado de manera correcta");
      this.getUsuarios();
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
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
  // INSERTA LOS NIVELES SIN PASAR idnivel
  async insertarNiveles() {
    const niveles = [
      { nombre: 'Nivel 1', total_subniveles: 8, dificultad: 'Básico', acceso: true },
      { nombre: 'Nivel 2', total_subniveles: 8, dificultad: 'Básico', acceso: true },
      { nombre: 'Nivel 3', total_subniveles: 8, dificultad: 'Básico', acceso: true },
      { nombre: 'Nivel 4', total_subniveles: 8, dificultad: 'Medio', acceso: false },
      { nombre: 'Nivel 5', total_subniveles: 8, dificultad: 'Medio', acceso: false },
      { nombre: 'Nivel 6', total_subniveles: 8, dificultad: 'Medio', acceso: false },
      { nombre: 'Nivel 7', total_subniveles: 8, dificultad: 'Avanzado', acceso: false },
      { nombre: 'Nivel 8', total_subniveles: 8, dificultad: 'Avanzado', acceso: false },
      { nombre: 'Nivel 9', total_subniveles: 8, dificultad: 'Avanzado', acceso: false },
    ];
  
    try {
      for (let nivel of niveles) {
        await this.database.executeSql(
          'INSERT OR IGNORE INTO niveles(nombre, total_subniveles, dificultad, acceso) VALUES (?, ?, ?, ?)', 
          [nivel.nombre, nivel.total_subniveles, nivel.dificultad, nivel.acceso]
        );
      }
      this.presentAlert("Agregar", "Niveles insertados correctamente");
    } catch (e) {
      this.presentAlert('Error', 'Error al insertar niveles: ' + JSON.stringify(e));
    }
  }
  

  // INSERTAR LOS SUBNIVELES CON RESPUESTA CORRECTA E IMAGEN
  async insertarSubniveles() {
    const subniveles = [
      { idnivel: 1, nombre: 'Subnivel 1.1', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-1.png' },
      { idnivel: 1, nombre: 'Subnivel 1.2', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-2.png' },
      { idnivel: 1, nombre: 'Subnivel 1.3', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-3.png' },
      { idnivel: 1, nombre: 'Subnivel 1.4', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-4.png' },
      { idnivel: 1, nombre: 'Subnivel 1.5', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-5.png' },
      { idnivel: 1, nombre: 'Subnivel 1.6', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-6.png' },
      { idnivel: 1, nombre: 'Subnivel 1.7', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-7.png' },
      { idnivel: 1, nombre: 'Subnivel 1.8', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-8.png' },
      //
      { idnivel: 2, nombre: 'Subnivel 2.1', respuesta_correcta: 'Opción 1', imagen: 'ruta_imagen3.jpg' },
      // Y así sucesivamente
    ];
  
    for (let subnivel of subniveles) {
      try {
        await this.insertarSubnivel(subnivel.idnivel, subnivel.nombre, subnivel.respuesta_correcta, subnivel.imagen);
      } catch (e) {
        this.presentAlert('Error', 'Error al insertar subnivel: ' + JSON.stringify(e));
      }
    }
    this.presentAlert("Agregar Subniveles", "Subniveles insertados correctamente");
  }

  async insertarSubnivel(idnivel: number, nombre: string, respuesta_correcta: string, imagen: string) {
    await this.database.executeSql(
      'INSERT INTO subniveles(idnivel, nombre, respuesta_correcta, imagen) VALUES (?, ?, ?, ?)', 
      [idnivel, nombre, respuesta_correcta, imagen]
    );

  }

   // Método para obtener los niveles
   async getNiveles(): Promise<Nivel[]> {
    try {
      const res = await this.database.executeSql('SELECT * FROM niveles', []);
      let niveles: Nivel[] = [];
      
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          niveles.push(new Nivel(
            res.rows.item(i).idnivel,
            res.rows.item(i).nombre,
            res.rows.item(i).total_subniveles,
            res.rows.item(i).dificultad, // Añadir dificultad
            res.rows.item(i).acceso     // Añadir acceso
          ));
        }
      }
      return niveles; // Retorna los niveles obtenidos
    } catch (error) {
      console.error('Error al obtener niveles:', error);
      return []; // Retorna un array vacío en caso de error
    }
  }
  
  

  //
  fetchNiveles(): Observable<Nivel[]> {
    return this.listaNiveles.asObservable();
  }



}

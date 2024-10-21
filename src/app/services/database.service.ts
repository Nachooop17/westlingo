import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '@services/users';
import { AlertController, Platform } from '@ionic/angular';
import { Nivel } from './niveles';
import { Progreso } from './progreso';
import { Subnivel } from './subniveles';
import { Logro } from './logros';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Variable de conexión a la Base de Datos
  public database!: SQLiteObject;

  // Variables de creación de tablas
  tablaUsuario: string = `
    CREATE TABLE IF NOT EXISTS usuario(
      idusuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      foto_perfil BLOB  -- Añadir campo para la foto de perfil
    );
  `;
  tablaNiveles: string = `
  CREATE TABLE IF NOT EXISTS niveles(
    idnivel INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    total_subniveles INTEGER NOT NULL,
    dificultad VARCHAR(50) NOT NULL,  -- Nueva columna
    acceso VARCHAR(10) NOT NULL  -- Cambiado a VARCHAR
  );
`;

  
  tablaSubniveles: string = `
  CREATE TABLE IF NOT EXISTS subniveles(
    idsubnivel INTEGER PRIMARY KEY AUTOINCREMENT,
    idnivel INTEGER,
    nombre VARCHAR(100) NOT NULL,
    respuesta_correcta VARCHAR(100) NOT NULL,
    imagen TEXT,
    completado BOOLEAN,
    FOREIGN KEY (idnivel) REFERENCES niveles(idnivel) ON DELETE CASCADE
  );
`;
  tablaProgreso: string = `
  CREATE TABLE IF NOT EXISTS progreso(
    idprogreso INTEGER PRIMARY KEY AUTOINCREMENT,
    idusuario INTEGER,
    idnivel INTEGER,
    idsubnivel INTEGER,
    progreso REAL,           -- Valor de progreso, por ejemplo, porcentaje
    completado BOOLEAN,         -- Indicador de si se ha completado o no
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idnivel) REFERENCES niveles(idnivel) ON DELETE CASCADE,
    FOREIGN KEY (idsubnivel) REFERENCES subniveles(idsubnivel) ON DELETE CASCADE
  );
`;
tablaLogros: string = `
CREATE TABLE IF NOT EXISTS logros (
  idlogro INTEGER PRIMARY KEY AUTOINCREMENT,
  idusuario INTEGER,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  fecha_obtencion DATETIME,
  imagen BLOB,  -- Añadir campo para almacenar la imagen
  FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
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
    await this.platform.ready();
  
    try {
      this.database = await this.sqlite.create({
        name: 'bdusuarios.db',
        location: 'default'
      });
  
      // Crear las tablas de la base de datos sin depender del idusuario
      await this.crearTablas();
  
      // Modificar el estado de la base de datos
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('CrearBD', 'Error: ' + JSON.stringify(e));
    }
  }
  
  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaUsuario, []);
      await this.database.executeSql(this.tablaNiveles, []);
      await this.database.executeSql(this.tablaSubniveles, []);
      await this.database.executeSql(this.tablaProgreso, []);
      await this.database.executeSql(this.tablaLogros, []);
  
      // Insertar datos iniciales en las tablas de niveles y subniveles
      const nivelesExistentes = await this.getNivelesInicial();
      if (nivelesExistentes.length === 0) {
        await this.insertarNiveles();
        await this.insertarSubniveles();
      }
    } catch (e) {
      this.presentAlert('CrearTabla', 'Error: ' + JSON.stringify(e));
    }
  }
  
  // Método para obtener los niveles iniciales sin depender de usuario
  async getNivelesInicial(): Promise<Nivel[]> {
    try {
      const res = await this.database.executeSql('SELECT * FROM niveles', []);
      let niveles: Nivel[] = [];
      
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          niveles.push(new Nivel(
            res.rows.item(i).idnivel,
            res.rows.item(i).nombre,
            res.rows.item(i).total_subniveles,
            res.rows.item(i).dificultad,
            res.rows.item(i).acceso// Inicialmente todos los niveles están bloqueados
          ));
        }
      }
  
      return niveles;
    } catch (error) {
      console.error('Error al obtener niveles:', error);
      return [];
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
            res.rows.item(i).password,
            res.rows.item(i).foto_perfil
          ));
        }
      }
      this.listaUsuarios.next(items);
    } catch (e) {
      this.presentAlert('GetUsuarios', 'Error: ' + JSON.stringify(e));
    }
  }

  async insertarUsuario(nombre: string, email: string, password: string, foto_perfil: Blob | null) {
    try {
      await this.database.executeSql(
        'INSERT INTO usuario(nombre, email, password, foto_perfil) VALUES (?, ?, ?, ?)',
        [nombre, email, password, foto_perfil]
      );
  
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE email = ? AND password = ?', [email, password]);
      if (res.rows.length > 0) {
        const usuario = res.rows.item(0);
        localStorage.setItem('userId', usuario.idusuario.toString());
        await this.presentAlert("Agregar", "Usuario agregado de manera correcta");
        await this.getUsuarios();
        return usuario;
      } else {
        throw new Error('No se pudo recuperar el usuario recién creado');
      }
    } catch (e) {
      this.presentAlert('Agregar', 'Error: ' + JSON.stringify(e));
    }
  }
  
  
  async actualizarUsuario(idusuario: number, nombre: string, email: string, password: string, foto_perfil: string) {
    try {
      await this.database.executeSql(
        'UPDATE usuario SET nombre = ?, email = ?, password = ?, foto_perfil = ? WHERE idusuario = ?',
        [nombre, email, password, foto_perfil, idusuario]
      );
      console.log(`Usuario ${idusuario} actualizado.`);
    } catch (e) {
      console.error('Error al actualizar usuario:', JSON.stringify(e));
    }
  }
  
  
  

  async modificarUsuario(id: number, nombre: string, email: string, password: string, foto_perfil: Blob) {
    try {
      await this.database.executeSql('UPDATE usuario SET nombre = ?, email = ?, password = ?, foto_perfil = ? WHERE idusuario = ?', [nombre, email, password, foto_perfil, id]);
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
  async verificarUsuario(email: string, password: string) {
    try {
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE email = ? AND password = ?', [email, password]);
      if (res.rows.length > 0) {
        const usuario = res.rows.item(0);
        localStorage.setItem('userId', usuario.idusuario.toString());
        return usuario;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return null;
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
      { nombre: 'Nivel 1', total_subniveles: 8, dificultad: 'Básico', acceso: 'true' },
      { nombre: 'Nivel 2', total_subniveles: 8, dificultad: 'Básico', acceso: 'false' },
      { nombre: 'Nivel 3', total_subniveles: 8, dificultad: 'Básico', acceso: 'false' },
      { nombre: 'Nivel 4', total_subniveles: 8, dificultad: 'Medio', acceso: 'false' },
      { nombre: 'Nivel 5', total_subniveles: 8, dificultad: 'Medio', acceso: 'false' },
      { nombre: 'Nivel 6', total_subniveles: 8, dificultad: 'Medio', acceso: 'false' },
      { nombre: 'Nivel 7', total_subniveles: 8, dificultad: 'Avanzado', acceso: 'false' },
      { nombre: 'Nivel 8', total_subniveles: 8, dificultad: 'Avanzado', acceso: 'false' },
      { nombre: 'Nivel 9', total_subniveles: 8, dificultad: 'Avanzado', acceso: 'false' },
    ];
  
    try {
      for (let nivel of niveles) {
        // Convertimos el valor booleano de acceso a 0 o 1
        const accesoValue = nivel.acceso ? 1 : 0;
  
        await this.database.executeSql(
          'INSERT OR IGNORE INTO niveles(nombre, total_subniveles, dificultad, acceso) VALUES (?, ?, ?, ?)', 
          [nivel.nombre, nivel.total_subniveles, nivel.dificultad, accesoValue]
        );
      }
      console.log("Niveles insertados correctamente");
      this.presentAlert("Agregar", "Niveles insertados correctamente");
    } catch (e) {
      this.presentAlert('Error', 'Error al insertar niveles: ' + JSON.stringify(e));
    }
  }
  

  // INSERTAR LOS SUBNIVELES CON RESPUESTA CORRECTA E IMAGEN
  async insertarSubniveles() {
    const subniveles = [
      { idnivel: 1, nombre: 'Subnivel 1.1', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-1.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.2', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-2.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.3', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-3.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.4', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-4.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.5', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-5.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.6', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-6.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.7', respuesta_correcta: 'Opción 1', imagen: 'nivel-uno-7.png', completado: false },
      { idnivel: 1, nombre: 'Subnivel 1.8', respuesta_correcta: 'Opción 2', imagen: 'nivel-uno-8.png', completado: false },
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
   async getNiveles(idusuario: number): Promise<Nivel[]> {
    try {
        const res = await this.database.executeSql(
            `SELECT n.idnivel, n.nombre, n.total_subniveles, n.dificultad, n.acceso, MAX(p.progreso) as progreso, MAX(p.completado) as completado
             FROM niveles n
             LEFT JOIN progreso p ON n.idnivel = p.idnivel AND p.idusuario = ?
             GROUP BY n.idnivel, n.nombre, n.total_subniveles, n.dificultad, n.acceso`,
            [idusuario]
        );

        let niveles: Nivel[] = [];

        if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {
                niveles.push(new Nivel(
                    res.rows.item(i).idnivel,
                    res.rows.item(i).nombre,
                    res.rows.item(i).total_subniveles,
                    res.rows.item(i).dificultad,
                    res.rows.item(i).acceso = 'true'
                ));
            }
        }

        return niveles;
    } catch (error) {
        console.error('Error al obtener niveles:', error);
        return [];
    }
}


  
  
  
  
async actualizarAccesoNivel(idusuario: number, idnivel: number) {
  try {
    console.log(`Verificando acceso para: idusuario=${idusuario}, idnivel=${idnivel}`);

    // Verificar si el nivel ya está desbloqueado
    const res = await this.database.executeSql(
      'SELECT acceso FROM niveles WHERE idnivel = ?',
      [idnivel]
    );
    
    if (res.rows.length > 0) {
      const nivelAcceso = res.rows.item(0).acceso;
      
      if (!nivelAcceso) {
        // Si el nivel no está desbloqueado, desbloquearlo
        const updateRes = await this.database.executeSql(
          'UPDATE niveles SET acceso = ? WHERE idnivel = ?',
          ['true', idnivel] // Usando 'true' en lugar de 1
        );
        
        
        if (updateRes.rowsAffected > 0) {
          console.log(`Nivel ${idnivel} desbloqueado para el usuario ${idusuario}.`);
        }
      } else {
        console.log(`Nivel ${idnivel} ya estaba desbloqueado para el usuario ${idusuario}.`);
      }
    } else {
      console.error('Nivel no encontrado');
    }
  } catch (e) {
    console.error('Error al actualizar el acceso del nivel:', JSON.stringify(e));
  }
}




  //
  fetchNiveles(): Observable<Nivel[]> {
    return this.listaNiveles.asObservable();
  }
  async getSubniveles(idnivel: number): Promise<Subnivel[]> {
    try {
      const res = await this.database.executeSql('SELECT * FROM subniveles WHERE idnivel = ?', [idnivel]);
      let subniveles: Subnivel[] = [];
  
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          subniveles.push(new Subnivel(
            res.rows.item(i).idsubnivel,
            res.rows.item(i).idnivel,
            res.rows.item(i).nombre,
            res.rows.item(i).respuesta_correcta,
            res.rows.item(i).imagen,
            res.rows.item(i).completado // Asegurarse de que el campo 'completado' está presente en la tabla
          ));
        }
      }
  
      return subniveles;
    } catch (error) {
      console.error('Error al obtener subniveles:', error);
      return [];
    }
  }
  
  
  // Insertar nuevo progreso
  async insertarProgreso(idusuario: number, idnivel: number, idsubnivel: number, progreso: number, completado: boolean) {
    try {
      await this.database.executeSql(
        'INSERT INTO progreso(idusuario, idnivel, idsubnivel, progreso, completado) VALUES (?, ?, ?, ?, ?)',
        [idusuario, idnivel, idsubnivel, progreso, completado]
      );
      this.presentAlert("Agregar Progreso", "Progreso insertado correctamente");
    } catch (e) {
      this.presentAlert('Error', 'Error al insertar progreso: ' + JSON.stringify(e));
    }
  }

  // Actualizar progreso
  async actualizarProgresoSubnivel(idusuario: number, idnivel: number, idsubnivel: number, completado: boolean) {
    try {
      console.log(`Actualizando estado de subnivel: usuario=${idusuario}, nivel=${idnivel}, subnivel=${idsubnivel}, completado=${completado}`);
  
      // Verificar si el progreso del subnivel ya está en progreso
      const res = await this.database.executeSql(
        'SELECT * FROM progreso WHERE idusuario = ? AND idnivel = ? AND idsubnivel = ?',
        [idusuario, idnivel, idsubnivel]
      );
  
      if (res.rows.length > 0) {
        // Si existe, actualizar el estado a completado
        await this.database.executeSql(
          'UPDATE progreso SET completado = ? WHERE idusuario = ? AND idnivel = ? AND idsubnivel = ?',
          [completado, idusuario, idnivel, idsubnivel]
        );
      } else {
        // Si no existe, insertar nuevo registro
        await this.database.executeSql(
          'INSERT INTO progreso (idusuario, idnivel, idsubnivel, completado) VALUES (?, ?, ?, ?)',
          [idusuario, idnivel, idsubnivel, completado]
        );
      }
    } catch (err) {
      console.error('Error al actualizar el estado del subnivel:', JSON.stringify(err));
      console.log('Información del error:', err);
    }
  }
  

async actualizarProgresoNivel(idusuario: number, idnivel: number, progreso: number, completado: boolean) {
    try {
        console.log(`Actualizando progreso del nivel: usuario=${idusuario}, nivel=${idnivel}, progreso=${progreso}, completado=${completado}`);
        
        const res = await this.database.executeSql(
            'SELECT * FROM progreso WHERE idusuario = ? AND idnivel = ?',
            [idusuario, idnivel]
        );

        if (res.rows.length > 0) {
            // Si ya existe progreso del nivel, actualizar
            await this.database.executeSql(
                'UPDATE progreso SET progreso = ?, completado = ? WHERE idusuario = ? AND idnivel = ?',
                [progreso, completado, idusuario, idnivel]
            );
        } else {
            // Si no hay progreso registrado, insertar nuevo
            await this.database.executeSql(
                'INSERT INTO progreso (idusuario, idnivel, progreso, completado) VALUES (?, ?, ?, ?)',
                [idusuario, idnivel, progreso, completado]
            );
        }
    } catch (err) { // Cambié 'error' por 'err' para evitar confusiones
      console.error('Error al actualizar el estado del nivel:', err);
      console.log('Información del error:', err); // Agregar más información sobre el error
  }
  
}




  
  // Método para obtener el progreso
  async getProgreso(idusuario: number): Promise<Progreso[]> {
    try {
      const res = await this.database.executeSql('SELECT * FROM progreso WHERE idusuario = ?', [idusuario]);
      let progresos: Progreso[] = [];
      
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          progresos.push(new Progreso(
            res.rows.item(i).idprogreso,
            res.rows.item(i).idusuario,
            res.rows.item(i).idnivel,
            res.rows.item(i).idsubnivel,
            res.rows.item(i).progreso,
            res.rows.item(i).completado
          ));
        }
      }

      return progresos;
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      return [];
    }
}


async desbloquearSiguienteNivel(idusuario: number, idnivel: number) {
  try {
    // Verificar si el usuario ha completado todos los subniveles del nivel actual
    const res = await this.database.executeSql(
      'SELECT * FROM progreso WHERE idusuario = ? AND idnivel = ? AND completado = ?',
      [idusuario, idnivel, true]
    );

    console.log('Resultado de progreso completado:', res);

    const subnivelesRes = await this.database.executeSql(
      'SELECT * FROM subniveles WHERE idnivel = ?',
      [idnivel]
    );

    console.log('Subniveles del nivel:', subnivelesRes);

    if (res.rows.length === subnivelesRes.rows.length) {
      const nextLevel = idnivel + 1;

      // Obtener los niveles actualizados sin cambiar el acceso
      await this.getNiveles(idusuario); // Solo obtener los niveles actualizados

      console.log(`Nivel ${nextLevel} desbloqueado para el usuario ${idusuario}.`);
    } else {
      console.log('No se han completado todos los subniveles aún.');
    }
  } catch (e) {
    console.error('Error al desbloquear el siguiente nivel:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
  }
}
async otorgarLogro(idusuario: number, nombre: string, descripcion: string, fecha_obtencion: Date, imagen: string) {
  try {
    await this.database.executeSql(
      'INSERT INTO logros (idusuario, nombre, descripcion, fecha_obtencion, imagen) VALUES (?, ?, ?, ?, ?)',
      [idusuario, nombre, descripcion, fecha_obtencion.toISOString(), imagen]
    );
    console.log(`Logro "${nombre}" otorgado a usuario ${idusuario}.`);
  } catch (e) {
    console.error('Error al otorgar logro:', JSON.stringify(e));
  }
}

async getLogrosUsuario(idusuario: number): Promise<Logro[]> {
  try {
    const res = await this.database.executeSql(
      'SELECT * FROM logros WHERE idusuario = ?',
      [idusuario]
    );
    let logros: Logro[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        logros.push(new Logro(
          res.rows.item(i).idlogro,
          res.rows.item(i).idusuario,
          res.rows.item(i).nombre,
          res.rows.item(i).descripcion,
          new Date(res.rows.item(i).fecha_obtencion),
          res.rows.item(i).imagen
        ));
      }
    }
    return logros;
  } catch (error) {
    console.error('Error al obtener logros:', error);
    return [];
  }
}










}

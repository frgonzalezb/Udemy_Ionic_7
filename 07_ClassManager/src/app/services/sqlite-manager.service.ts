import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Student from '../models/student';
import Class from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  public dbReady: BehaviorSubject<boolean>;
  private isWeb: boolean;
  private dbName: string;
  private DB_NAME_KEY: string = 'db_name';
  private DB_SETUP_KEY: string = 'first_db_setup';

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {
    this.isWeb = false;
    this.dbName = '';
    this.dbReady = new BehaviorSubject(false);
  }

  async initDB() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;
    if (info.platform === 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Esta app no puede funcionar sin acceso a la base de datos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (info.platform === 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    }
    this.setupDB();
  }

  async setupDB() {
    const dbSetupDone = await Preferences.get({ key: this.DB_SETUP_KEY });

    if (!dbSetupDone.value) {
      // descargar la DB
      this.downloadDatabase();
    } else {
      // recuperar la DB
      const dbName = await this.getDBName();
      await CapacitorSQLite.createConnection({ database: dbName });
      await CapacitorSQLite.open({ database: dbName });
      this.dbReady.next(true);
    }
  }

  downloadDatabase() {
    this.http.get(environment.db).subscribe(async (jsonExport: JsonSQLite | any) => {
        // jsonExport debería ser de tipo JsonSQLite, pero TS no deja
        // usarlo y su sistema de validación de tipos custom es una shit
        const jsonString = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring: jsonString });

        if (isValid.result) {
          this.dbName = jsonExport.database;

          await CapacitorSQLite.importFromJson({ jsonstring: jsonString });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName });

          await Preferences.set({ key: this.DB_SETUP_KEY, value: '1' });
          await Preferences.set({ key: this.DB_NAME_KEY, value: this.dbName });

          this.dbReady.next(true);
        }
    });
  }

  async getDBName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: this.DB_NAME_KEY });
      if (dbName.value) {
        this.dbName = dbName.value;
      }
    }
    return this.dbName;
  }

  async getStudents(search?: string) {
    let sql = 'SELECT * FROM students WHERE active = 1';
    if (search) {
      sql += ` AND (upper(name) LIKE '%${search.toLocaleUpperCase()}%' OR upper(surname) LIKE '%${search.toLocaleUpperCase()}%')`;
    }
    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql
    }).then((response: capSQLiteValues) => {
      let students: Student[] = [];
      if (!response || !response.values) {
        return null;
      }
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let student = row as Student;
        students.push(student);
      }
      return Promise.resolve(students);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async createStudent(student: Student) {
    let sql = 'INSERT INTO students (name, surname, email, phone) VALUES (?, ?, ?, ?)';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.name,
            student.surname,
            student.email,
            student.phone
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async updateStudent(student: Student) {
    let sql = 'UPDATE students SET name = ?, surname = ?, email = ?, phone = ? WHERE id = ?';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.name,
            student.surname,
            student.email,
            student.phone,
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async deleteStudent(student: Student) {
    // NOTA: Se aplica soft delete, no hard delete
    let sql = 'UPDATE students SET active = 0 WHERE id = ?';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async getClasses() {
    let sql = 'SELECT * FROM class WHERE active = 1';
    sql += ' ORDER BY date_start, date_end';
    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql
    }).then((response: capSQLiteValues) => {
      let classes: Class[] = [];
      if (!response || !response.values) {
        return null;
      }
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let classObj = row as Class;
        classes.push(classObj);
      }
      return Promise.resolve(classes);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async createClass(classObj: Class) {
    let sql = 'INSERT INTO class (date_start, date_end, id_student, price) VALUES (?, ?, ?, ?)';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            classObj.date_start,
            classObj.date_end,
            classObj.student,
            classObj.price
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async updateClass(classObj: Class) {
    console.log(classObj); // dbg
    
    let sql = 'UPDATE class SET date_start = ?, date_end = ?, id_student = ?, price = ? WHERE id = ?';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            classObj.date_start,
            classObj.date_end,
            classObj.id_student,
            classObj.price,
            classObj.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async deleteClass(classObj: Class) {
    // NOTA: Se aplica soft delete, no hard delete
    let sql = 'UPDATE class SET active = 0 WHERE id = ?';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            classObj.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

}

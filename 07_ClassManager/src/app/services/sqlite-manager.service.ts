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
import Filter from '../models/filter';
import Payment from '../models/payment';

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

  async getClasses(filter: Filter | null) {
    let sql = 'SELECT * FROM class WHERE active = 1';

    if (filter) {
      if (filter.date_start) {
        sql += ` AND date_start >= '${filter.date_start}'`;
      }
      if (filter.date_end) {
        sql += ` AND date_end <= '${filter.date_end}'`;
      }
      if (filter.id_student) {
        sql += ` AND id_student = ${filter.id_student}`;
      }
    }

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

  async getPayments(filter?: Filter) {
    /*
    NOTA: Los pagos están estrechamente relacionados con las clases. Es decir,
    si una clase no está activa, el pago tampoco debería salir.
    */
    let sql = 'SELECT p.* FROM payment p, class c WHERE p.id_class = c.id AND c.active = 1';
    
    if (filter && filter.paid !== undefined) {
      if (filter.paid) {
        sql += ' AND p.paid = 1';
      } else {
        sql += ' AND p.paid = 0';
      }

      if (filter.date_start) {
        /*
        Solo en el caso de que la clase esté pagada, se debe filtrar
        por la fecha de pago; en caso contrario, por la fecha de la
        clase. Recordar que un pago, mientras no sea pagado, no posee
        fecha de pago.
        */
        if (filter.paid) {
          sql += ` AND p.date >= '${filter.date_start}'`;
        } else {
          sql += ` AND c.date_start >= '${filter.date_start}'`;
        }
      }

      if (filter.date_end) {
        // Mismo caso que con filter.date_start
        if (filter.paid) {
          sql += ` AND p.date <= '${filter.date_end}'`;
        } else {
          sql += ` AND c.date_end <= '${filter.date_end}'`;
        }
      }

      if (filter.id_student) {
        // NOTA: Se refiere al estudiante de la clase, no del pago
        sql += ` AND c.id_student = ${filter.id_student}`;
      }
    }

    sql += ' ORDER BY p.date';
    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // para testear en android
    }).then((response: capSQLiteValues) => {
      let payments: Payment[] = [];
      if (!response || !response.values) {
        return null;
      }
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let paymentObj = row as Payment;
        payments.push(paymentObj);
      }
      return Promise.resolve(payments);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async createPayment(payment: Payment) {
    let sql = 'INSERT INTO payment (date, id_class, paid) VALUES (?, ?, ?)';
    const dbName = await this.getDBName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            payment.date,
            payment.id_class,
            payment.paid
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });;
  }

}

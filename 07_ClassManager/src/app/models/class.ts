import Student from "./student";

class Class {
  id!: number;
  date_start!: string;
  date_end!: string;
  id_student!: number;
  price!: number;
  active!: number;  // SQLite usa 1 y 0 para true y false, respectivamente
  student?: Student;
}

export default Class;

class Student {
  id!: number;
  name!: string;
  surname?: string;
  email!: string;
  phone!: string;
  active!: number;  // SQLite usa 1 y 0 para true y false, respectivamente
}

export default Student;

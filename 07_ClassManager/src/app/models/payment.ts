import Class from "./class";

class Payment {
  id!: number;
  date!: string;
  id_class!: number;
  paid!: number;
  class?: Class;
}

export default Payment;

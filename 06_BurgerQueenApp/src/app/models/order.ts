import ProductQuantity from "./product-quantity";
import User from "./user";

class Order {
  _id?: string;
  user!: User;
  products!: ProductQuantity[];
  address?: string;
}

export default Order;

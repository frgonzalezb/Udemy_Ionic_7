import Category from "./category";
import ProductExtra from "./product-extra";

class Product {
  _id?: string;
  name!: string;
  img?: string;
  price!: number;
  category!: Category;
  extras?: ProductExtra[];
}

export default Product;

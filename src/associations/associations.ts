import Credit from "../entities/Credit/domain/models/CreditModel.js";
import CreditPayment from "../entities/CreditPayment/domain/models/CreditPaymentModel.js";
import Customer from "../entities/CustomerAccount/domain/models/CustomerModel.js";
import Invoice from "../entities/Invoice/domain/models/InvoiceModel.js";
import Role from "../entities/Role/domain/models/RoleModel.js";
import User from "../entities/User/domain/models/UserModel.js";
import Category from "../entities/Category/domain/models/CategoryModel.js";
import Tax from "../entities/Tax/domain/models/TaxModel.js";
import Product from "../entities/Product/domain/models/ProductModel.js";
import InvoiceProducts from "../entities/Invoice/domain/models/InvoiceProducts.js";
import Province from "../domain/models/ProvinceModel.js";
import Canton from "../domain/models/CantonModel.js";
import District from "../domain/models/DistrictModel.js";
import CashRegister from "../entities/CashRegister/domain/models/CashRegisterModel.js";

export function setupAssociations() {
  // Role <->  User arreglada terminada
  Role.hasMany(User, { foreignKey: "role_id", as: "users" });
  User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

  // Product -> Category arreglada y terminada
  Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
  Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

  // Product -> Tax arreglada y terminada
  Product.belongsTo(Tax, { foreignKey: "tax_id", as: "tax" });
  Tax.hasMany(Product, { foreignKey: "tax_id", as: "products" });

  //Invoice -> Product, tabla intermedia terminada
  Invoice.belongsToMany(Product, {
    through: InvoiceProducts,
    foreignKey: "invoice_id",
    otherKey: "product_id",
    as: "products",
  });

  Product.belongsToMany(Invoice, {
    through: InvoiceProducts,
    foreignKey: "product_id",
    otherKey: "invoice_id",
    as: "invoices",
  });

  // Customer <-> Invoice arreglada y terminada
  Invoice.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
  Customer.hasMany(Invoice, { foreignKey: "customer_id", as: "invoices" });

  // Customer -> Credit arreglada y terminada
  Credit.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
  Customer.hasOne(Credit, { foreignKey: "customer_id", as: "credit" });

  // Credit has CreditPayment 1:N
  CreditPayment.belongsTo(Credit, { foreignKey: "credit_id", as: "credit" });
  Credit.hasMany(CreditPayment, { foreignKey: "credit_id", as: "payments" });

  // Invoice -> CreditPayment 1:N
  CreditPayment.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });
  Invoice.hasMany(CreditPayment, { foreignKey: "invoice_id", as: "payments" });

  // Ubicacion
  Province.hasMany(Canton, { foreignKey: "province_id", as: "cantons" });
  Canton.belongsTo(Province, { foreignKey: "province_id", as: "province" });

  Canton.hasMany(District, { foreignKey: "canton_id", as: "districts" });
  District.belongsTo(Canton, { foreignKey: "canton_id", as: "canton" });

  // En Cash register -> user -> invoice
  CashRegister.belongsTo(User, { foreignKey: "user_id", as: "user" });
  CashRegister.hasMany(Invoice, {
    foreignKey: "cash_register_id",
    as: "invoices",
  });

  // invoice Cash
  Invoice.belongsTo(CashRegister, {
    foreignKey: "cash_register_id",
    as: "cashRegister",
  });
}

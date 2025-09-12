import Credit from "../entities/Credit/domain/models/CreditModel.js";
import CreditPayment from "../entities/CreditPayment/domain/models/CreditPaymentModel.js";
import Customer from "../entities/CustomerAccount/domain/models/CustomerModel.js";
import Invoice from "../entities/Invoice/domain/models/InvoiceModel.js";
import PaymentMethod from "../domain/models/PaymentMethodModel .js";
import Role from "../entities/Role/domain/models/RoleModel.js";
import User from "../entities/User/domain/models/UserModel.js";
import Category from "../entities/Category/domain/models/CategoryModel.js";
import Tax from "../entities/Tax/domain/models/TaxModel.js";
import Product from "../entities/Product/domain/models/ProductModel.js";
import CreditStatus from "../entities/CreditStatus/domain/models/CreditStatusModel.js";

export function setupAssociations() {
  // Credit <-> Invoice (Revisar)
  Credit.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });
  Invoice.hasOne(Credit, { foreignKey: "invoice_id", as: "credit" });

  // Credit <-> Customer (Revisar)
  Credit.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
  Customer.hasMany(Credit, { foreignKey: "customer_id", as: "credits" });

  // Credit <-> CreditPayment (Revisar)
  Credit.hasMany(CreditPayment, { foreignKey: "credit_id", as: "payments" });
  CreditPayment.belongsTo(Credit, { foreignKey: "credit_id", as: "credit" });

  // PaymentMethod <-> CreditPayment (Revisar)
  PaymentMethod.hasMany(CreditPayment, {
    foreignKey: "payment_method_id",
    as: "creditPayments",
  });
  CreditPayment.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  });

  // Credit <-> CreditStatus terminada
  Credit.belongsTo(CreditStatus, {
    foreignKey: "credit_status_id",
    as: "status",
  });
  CreditStatus.hasMany(Credit, {
    foreignKey: "credit_status_id",
    as: "credits",
  });

  // Role <->  User arreglada terminada
  Role.hasMany(User, { foreignKey: "role_id", as: "users" });
  User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

  // Product -> Category arreglada y terminada 
  Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
  Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

   // Product -> Tax arreglada y terminada
  Product.belongsTo(Tax, { foreignKey: "tax_id", as: "tax" });
  Tax.hasMany(Product, { foreignKey: "tax_id", as: "products" });  
}



import Credit from "../entities/Credit/domain/models/CreditModel.js";
import CreditPayment from "../entities/CreditPayment/domain/models/CreditPaymentModel.js";
import Customer from "../entities/CustomerAccount/domain/models/CustomerModel.js";
import Invoice from "../entities/Invoice/domain/models/InvoiceModel.js";
import PaymentMethod from "../domain/models/PaymentMethodModel .js";
import Role from "../entities/Role/domain/models/RoleModel.js";
import User from "../entities/User/domain/models/UserModel.js";

export function setupAssociations() {
  // Credit ↔ Invoice
  Credit.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });
  Invoice.hasOne(Credit, { foreignKey: "invoice_id", as: "credit" });

  // Credit ↔ Customer
  Credit.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
  Customer.hasMany(Credit, { foreignKey: "customer_id", as: "credits" });

  // Credit ↔ CreditPayment
  Credit.hasMany(CreditPayment, { foreignKey: "credit_id", as: "payments" });
  CreditPayment.belongsTo(Credit, { foreignKey: "credit_id", as: "credit" });

  // PaymentMethod ↔ CreditPayment
  PaymentMethod.hasMany(CreditPayment, { foreignKey: "payment_method_id", as: "creditPayments" });
  CreditPayment.belongsTo(PaymentMethod, { foreignKey: "payment_method_id", as: "paymentMethod" });

   // Role ↔ User
  Role.hasMany(User, { foreignKey: "role_id", as: "users" });
  User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
}


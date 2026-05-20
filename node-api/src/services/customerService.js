import * as repo from "../repository/customerRepository.js";

export async function addCustomer(customer) {
  try {
    const result = await repo.addCustomer(customer);
    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      if (error.sqlMessage.includes("cpf")) {
        throw {
          message: "CPF já cadastrado para outro cliente",
        };
      }
      throw {
        message: "Registro duplicado",
      };
    }
    throw {
      message: "Erro interno",
    };
  }
}

export async function getCustomers(filter) {
  const result = await repo.getCustomers(filter);
  return result;
}

export async function updateCustomer(id, customer) {
  const lines = await repo.updateCustomer(id, customer);
  return lines;
}

export async function deleteCustomer(id) {
  const lines = await repo.deleteCustomer(id);
  return lines;
}

export async function getCustomerById(id) {
  const line = await repo.getCustomerById(id);
  return line;
}

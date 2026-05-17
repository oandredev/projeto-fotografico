import * as repo from "../repository/customerRepository.js";

export async function addCustomer(customer) {
  const id = await repo.addCustomer(customer);
  return id;
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
const { json } = require('express');
const fs = require('fs/promises');
const path = require('path')
const { nanoid } = require('nanoid');
const { log } = require('console');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const buffer = await fs.readFile(contactsPath, 'utf-8');
  const contacts = await JSON.parse(buffer);
  return contacts;
}

const getContactById = async (id) => {
  const contacts = await listContacts();
  return contacts.find(item => item.id === id);
}

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) return;
  const [deletedContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return deletedContact;

}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...body };
  const newList = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));
  return newContact;
}

const updateContact = async (id, body) => {
  const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) return;
  const updatedContact = { id, ...body };
  contacts.splice(index, 1, updatedContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

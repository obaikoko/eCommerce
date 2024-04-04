import bcrypt from 'bcryptjs';
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    firstName: 'John',
    lastName: ' Doe',
    email: 'john@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    firstName: 'Jane',
    lastName: ' Doe',
    email: 'jane@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;

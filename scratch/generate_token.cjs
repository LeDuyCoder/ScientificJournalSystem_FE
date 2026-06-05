const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    user_id: '10841c6c-bb69-4132-b388-df0541787f3f',
    email: 'cubinvinh@gmail.com',
    role: 'STUDENT'
  },
  'scientific_journal_secret_key',
  {
    expiresIn: '1d'
  }
);

console.log("GENERATED_TOKEN:", token);

const Perfil = require('./Perfil');
const Utilizador = require('./Utilizador');

// Criação dos perfis

Perfil.findOrCreate({
  where: { perfil: 'Dono' },
  defaults: {
    perfil: 'Dono',
    perms: 1
  }
}).then(() => {
  console.log('Registo "Dono" criado com sucesso.');
}).catch(error => {
  console.error('Erro ao criar registo "Dono":', error);
});

Perfil.findOrCreate({
  where: { perfil: 'Administrador' },
  defaults: {
    perfil: 'Administrador',
    perms: 2
  }
}).then(() => {
  console.log('Registo "Administrador" criado com sucesso.');
}).catch(error => {
  console.error('Erro ao criar registo "Administrador":', error);
});

Perfil.findOrCreate({
    where: { perfil: 'Normal' },
    defaults: {
      perfil: 'Normal',
      perms: 3
    }
  }).then(() => {
    console.log('Registo "Normal" criado com sucesso.');
  }).catch(error => {
    console.error('Erro ao criar registo "Normal":', error);
  });

  // Criação do utilizador

  Utilizador.findOrCreate({
    where: { username: 'Dono' },
    defaults: {
      username: 'Dono', 
      password: 'Dono', 
      primNome: 'Dono', 
      ultNome: '', 
      telemovel: '000000000', 
      email: 'Dono@enbiente.com', 
      nascimento: '01-01-1999', 
      morada: 'Viseu', 
      estado: "Ativa", 
      perfilId: 1, 
      passwordAlteradaEm: new Date()
    }
  }).then(() => {
    console.log('Registo "Dono" criado com sucesso.');
  }).catch(error => {
    console.error('Erro ao criar registo "Dono":', error);
  });

  Utilizador.findOrCreate({
    where: { username: 'Tester' },
    defaults: {
      username: 'Tester', 
      password: 'Tester', 
      primNome: 'Tester', 
      ultNome: '', 
      telemovel: '000000000', 
      email: 'Tester@enbiente.com', 
      nascimento: '01-01-1999', 
      morada: 'Viseu', 
      estado: "Ativa", 
      perfilId: 3, 
      passwordAlteradaEm: new Date()
    }
  }).then(() => {
    console.log('Registo "Tester" criado com sucesso.');
  }).catch(error => {
    console.error('Erro ao criar registo "Tester":', error);
  });

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("signup", (email, password, username) => {
  cy.visit("/");
  cy.get(".fas.fa-user-plus").click();
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#username").type(username);
  cy.get("#submit").click();
});

Cypress.Commands.add("login", (email, password) => {
  cy.get(".fas.fa-sign-in-alt").click();
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit").click();
});

Cypress.Commands.add("tests_cleanup", () => {
  cy.task("clearDb");
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

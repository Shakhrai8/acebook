import "cypress-file-upload";

describe("Making a post", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
  });

  it("login and make a post", () => {
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.contains("This is a test post").should("be.visible");
  });

  it("login and make an image post", () => {
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.get(".post-form-file").attachFile("../fixtures/VOID");
    cy.get("#post-submit").click();
    cy.get(".post-image").should("be.visible");
  });
});

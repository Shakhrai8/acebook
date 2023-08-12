describe("Page Redirect", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });
  
  it("redirects user to their profile page after clicking the profile button", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.contains("Profile").click();
    cy.url().should("include", "/profile"); // /profile/:id [:id not included]
  });

  it("redirects user to their feed after clicking the Acebook button", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.contains("Profile").click();
    cy.get(".header-title").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("redirects user to their feed after clicking the Back to Feed button", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.contains("Profile").click();
    cy.contains("Back to Feed").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
describe("Groups", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });
  
  it("creates a group", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("group_owner@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("owner1");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("group_owner@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.visit("/groups/");

    cy.get(".create-grp-btn").click();
    cy.get(".form-input").type("Test Group");
    cy.get(".form-textarea").type("Test Description");
    cy.get(".form-button").click();
    cy.visit("/groups/");
    cy.contains("Test Group").should("be.visible");
  });
});

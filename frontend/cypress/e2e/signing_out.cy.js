describe("Signing Out", () => {
  it("clicking on the log out button takes you to the /", () => {
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
    cy.get(".fas.fa-sign-out-alt").click();
    cy.contains("Yes").click();
    cy.get("#login-placeholder").should("be.visible");
  });
});

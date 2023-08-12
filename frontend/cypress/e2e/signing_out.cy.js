describe("Signing Out", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });

  it("clicking on the log out button takes you to the /", () => {
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
    cy.get(".fas.fa-sign-out-alt").click();
    cy.contains("Yes").click();
    cy.get("#login-placeholder").should("be.visible");
  });
});

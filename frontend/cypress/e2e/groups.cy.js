describe("Groups", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });

  it("creates a group", () => {
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
    cy.get('.menu_list .side:contains("Groups")').click({ force: true });

    cy.get(".create-grp-btn").should("be.visible").click();
    cy.get(".form-input").type("Test Group");
    cy.get(".form-textarea").type("Test Description");
    cy.get(".form-button").click();
    cy.contains("Profile").click();
    cy.get('.menu_list .side:contains("Groups")').click({ force: true });

    cy.contains("Test Group").should("be.visible");
  });
});

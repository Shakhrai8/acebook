describe("getting a notification", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
  });

  it("shows lastest notification", () => {
    cy.login("someone@example.com", "password");
    cy.get(".post-form-input").type("@username");
    cy.get("#post-submit").click();
    cy.get(".fas.fa-bell").click();
    cy.contains(
      "You have been mentioned in a post by the user @username"
    ).should("be.visible");
  });
});

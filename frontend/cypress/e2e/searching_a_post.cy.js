describe("Searching a post", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
  });

  it("with valid credentials, creates two posts and searching a keyword in a post displays one", () => {
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.get(".post-form-input").type("Search Item");
    cy.get("#post-submit").click();
    cy.get(".search-bar").type("Search Item");
    cy.contains("Search Item").should("exist");
  });
});

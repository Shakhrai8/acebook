describe("Page Redirect", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
  });

  it("redirects user to their profile page after clicking the profile button", () => {
    cy.contains("Profile").click();
    cy.url().should("include", "/profile"); // /profile/:id [:id not included]
  });

  it("redirects user to their feed after clicking the Acebook button", () => {
    cy.contains("Profile").click();
    cy.get(".header-title").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("redirects user to their feed after clicking the Back to Feed button", () => {
    cy.contains("Profile").click();
    cy.contains("Back to Feed").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
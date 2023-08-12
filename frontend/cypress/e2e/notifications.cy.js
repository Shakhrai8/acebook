describe("getting a notification", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });
  
  it("shows lastest notification", () => {
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
    cy.get(".post-form-input").type("@username");
    cy.get("#post-submit").click();
    cy.get(".fas.fa-bell").click();
    cy.contains(
      "You have been mentioned in a post by the user @username"
    ).should("be.visible");
  });
});

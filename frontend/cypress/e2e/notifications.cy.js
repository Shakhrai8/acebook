describe("getting a notification", () => {
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
    cy.get(".create-post-container").type("@username");
    cy.get("#post-submit").click();
    cy.get("#notification-button").click();
    cy.contains(
      "You have been mentioned in a post by the user @username"
    ).should("be.visible");
  });
});

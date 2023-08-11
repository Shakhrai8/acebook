describe("Making a comment", () => {
  it("logs in, creates a post and creates a comment", () => {
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
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.get(".comment-form")
      .last()
      .get("#comment")
      .type("This is a test comment");
    cy.get("#comment-post-button").last().click();
    cy.contains("This is a test comment").should("be.visible");
  });
});

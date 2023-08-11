describe("Liking and Unliking Posts and Comments", () => {
  it("likes a post", () => {
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
    cy.get("#post-likes").click();
    cy.get("#post-like-counter").should("contain", "1");
  });

  it("unlikes a post", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone1@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username1");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone1@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.get("#post-likes").click();
    cy.get("#post-likes").click();
    cy.get("#post-like-counter").should("contain", "0");
  });

  it("likes a comment", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone2@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username2");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone2@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();

    cy.get("#comment").type("This is a comment");
    cy.get("#comment-post-button").click();

    cy.get("#comment-like").click();
    cy.get("#comment-like-counter").should("contain", "1");
  });

  it("unlikes a comment", () => {
    cy.visit("/");
    cy.get(".fas.fa-user-plus").click();
    cy.get("#email").type("someone3@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username3");
    cy.get("#submit").click();
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone3@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();

    cy.get("#comment").type("This is a comment");
    cy.get("#comment-post-button").click();

    cy.get("#comment-like").click();
    cy.get("#comment-like").click();
    cy.get("#comment-like-counter").should("contain", "0");
  });
});

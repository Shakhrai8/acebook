describe("Liking and Unliking Posts and Comments", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
  });

  it("likes a post", () => {
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.get("#post-likes").click();
    cy.get("#post-like-counter").should("contain", "1");
  });

  it("unlikes a post", () => {
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();
    cy.get("#post-likes").click();
    cy.get("#post-likes").click();
    cy.get("#post-like-counter").should("contain", "0");
  });

  it("likes a comment", () => {
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();

    cy.get("#comment").type("This is a comment");
    cy.get("#comment-post-button").click();

    cy.get("#comment-like").click();
    cy.get("#comment-like-counter").should("contain", "1");
  });

  it("unlikes a comment", () => {
    cy.get(".post-form-input").type("This is a test post");
    cy.get("#post-submit").click();

    cy.get("#comment").type("This is a comment");
    cy.get("#comment-post-button").click();

    cy.get("#comment-like").click();
    cy.get("#comment-like").click();
    cy.get("#comment-like-counter").should("contain", "0");
  });
});

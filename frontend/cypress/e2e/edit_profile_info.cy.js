describe("Edit Profile Info", () => {
  beforeEach(() => {
    cy.tests_cleanup();
    cy.signup("someone@example.com", "password", "username");
  });

  it("Changes the user's name and bio", () => {
    cy.login("someone@example.com", "password");
    cy.contains("Profile").click();
    
    cy.contains("Edit Profile").click();
    cy.get(".profile-info-input").type("My New Name");
    cy.get(".profile-info-textarea").type("My New Bio");
    cy.contains("Update Profile Info").click();

    cy.contains("My New Name").should("be.visible");
    cy.contains("My New Bio").should("be.visible");
  });
});

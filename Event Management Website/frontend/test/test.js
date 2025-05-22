/*
 ============================================================================
 Name        : FrontendTest.js
 Description : This file contains Selenium test cases for:
               - User login and navigation
               - Admin event creation and deletion
               - RSVP functionality
 ============================================================================
 */
import 'chromedriver';
import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

let driver;
const url = 'http://localhost:3000'; // Replace with your app's URL

describe('Login Tests and Navigation', function () {
  //this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  /****************************************************************************************
 * Test ID        : TestCase1
 * Description    : Validates that a user can log in with valid credentials,
 *                  then verifies the user is on the events page by checking for
 *                  a Logout button, and finally logs out and confirms returning
 *                  to the login page.
 * Test Procedure : 
 *   1. Navigate to the login page.
 *   2. Locate the email input field and enter a valid email address.
 *   3. Locate the password input field and enter a valid password.
 *   4. Locate and click the submit button.
 *   5. Wait until an element containing the text "Logout" appears.
 *   6. Assert that the user is on the events page by checking "Logout" is visible.
 *   7. Locate and click the "Logout" button.
 *   8. Wait until an element containing the text "Login" appears.
 *   9. Assert that the user is back on the login page.
   ****************************************************************************************/
  it('User Login: should login and navigate to events page then logout', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('john.doe@example.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('password123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait until "Logout" button appears (indicating we're on the events page)
    const logoutButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Logout')]")), 10000);

    // Assert that we have a "Logout" button
    const logoutText = await logoutButton.getText();
    expect(logoutText).to.include('LOGOUT');

    // Click the "Logout" button
    await logoutButton.click();

    // Wait for the text "Login" to appear (confirming we returned to the login page)
    const loginHeadingEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Login')]")), 10000);

    // Assert that we're on the login page
    const loginHeadingText = await loginHeadingEl.getText();
    expect(loginHeadingText).to.include('LOGIN');

  });

  /****************************************************************************************
   * Test ID        : TestCase2
   * Description    : Test invalid login credentials
   * Test Procedure : 
   *   1. Navigate to the login page.
   *   2. Wait for and locate the email input field.
   *   3. Enter an invalid email address.
   *   4. Wait for and locate the password input field.
   *   5. Enter an invalid password.
   *   6. Locate and click the submit button.
   *   7. Verify error message for invalid credentials.
   ****************************************************************************************/
  it('User Login: should show "Invalid login credentials"', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('invalid.user@example.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('invalidpassword123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait for the alert to appear
    await driver.wait(until.alertIsPresent(), 5000);

    // Switch to the alert
    const alertDialog = await driver.switchTo().alert();

    // Retrieve the alert text
    const alertText = await alertDialog.getText();
    expect(alertText).to.equal('Invalid login credentials');

    // Accept or dismiss the alert
    await alertDialog.accept();
  });

  /****************************************************************************************
   * Test ID        : TestCase3
   * Description    : Test for blank email field.
   * Test Procedure : 
   *   1. Navigate to the login page.
   *   3. Wait for and locate the password input field.
   *   4. Enter a valid password.
   *   5. Locate and click the submit button.
   *   6. Verify that it still remain on /login page.
   ****************************************************************************************/
  it('User Login: should stay on the login page if email is missing', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('password123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // 4. Wait a moment for any potential navigation
    await driver.sleep(500);

    // 5. Check if we are still on /login or if an error element is present
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/login');

  });
  /****************************************************************************************
     * Test ID        : TestCase4
     * Description    : Test for blank password field.
     * Test Procedure : 
     *   1. Navigate to the login page.
     *   3. Wait for and locate the email input field.
     *   4. Enter a valid email.
     *   5. Locate and click the submit button.
     *   6. Verify that it still remain on /login page.
     ****************************************************************************************/
  it('User Login: should stay on the login page if password is missing', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('john.doe@example.com');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // 4. Wait a moment for any potential navigation
    await driver.sleep(500);

    // 5. Check if we are still on /login or if an error element is present
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/login');

  });

  /****************************************************************************************
   * Test ID       : TestCase5
  * Description    : Validates that an admin can log in with valid credentials,
  *                  then verifies the admin is on the events page by checking for
  *                  a Logout button, and finally logs out and confirms returning
  *                  to the login page.
  * Test Procedure : 
  *   1. Navigate to the login page.
  *   2. Locate the email input field and enter admin email address.
  *   3. Locate the password input field and enter admin password.
  *   4. Locate and click the submit button.
  *   5. Wait until an element containing the text "Logout" appears.
  *   6. Assert that the user is on the events page by checking "Logout" is visible.
  *   7. Locate and click the "Logout" button.
  *   8. Wait until an element containing the text "Login" appears.
  *   9. Assert that the user is back on the login page.
   ****************************************************************************************/
  it('Admin Login: should login and navigate to events page then logout', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('admin@test.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('admin123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait until "Logout" button appears (indicating we're on the events page)
    const logoutButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Logout')]")), 10000);

    // Assert that we have a "Logout" button
    const logoutText = await logoutButton.getText();
    expect(logoutText).to.include('LOGOUT');

    // Click the "Logout" button
    await logoutButton.click();

    // Wait for the text "Login" to appear (confirming we returned to the login page)
    const loginHeadingEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Login')]")), 10000);

    // Assert that we're on the login page
    const loginHeadingText = await loginHeadingEl.getText();
    expect(loginHeadingText).to.include('LOGIN');

  });

});

describe('User RSVP', function () {

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  /****************************************************************************************
   * Test ID        : TestCase6
   * Description    : Validates that a user can RSVP to event
   * Test Procedure : 
   *   1. Navigate to the login page.
   *   2. Wait for and locate the email input field.
   *   3. Enter a valid email address.
   *   4. Wait for and locate the password input field.
   *   5. Enter a valid password.
   *   6. Locate and click the submit button.
   *   7. Wait until an element containing the text "Event Management" appears.
   *   8. Assert that the heading's text includes "Event Management".
   *   9. Wait until an element containing the text "Art Exhibition" appears.
   *   10. Assert that the heading's text includes "Art Exhibition".
   *   11. Locate and click the RSVP button.
   *   12. Assert the RSVP confirmation text.
   ****************************************************************************************/
  it('should allow user to RSVP to an event', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('john.doe@example.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('password123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait until the text "Event Management" appears on the page
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Event Management')]")), 10000);

    // Verify the element's text
    const headingEl = await driver.findElement(By.xpath("//*[contains(text(),'Event Management')]"));
    const headingText = await headingEl.getText();

    expect(headingText).to.include('Event Management');

    // Wait until the text "Art Exhibition" appears on the page
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Art Exhibition')]")), 10000);

    // Verify the event element's text
    const eventTitleE1 = await driver.findElement(By.xpath("//*[contains(text(),'Art Exhibition')]"));
    const eventTitleText = await eventTitleE1.getText();
    expect(eventTitleText).to.include('Art Exhibition');

    // Find RSVP button 
    const rsvpButton = await driver.findElement(By.xpath("//*[contains(text(),'Art Exhibition')]/following::button[contains(text(),'RSVP')]"));
    await rsvpButton.click();

    // Wait until the confirmation text appears
    await driver.wait(until.elementLocated(By.xpath("//p[contains(text(),'You have RSVPed to this event.')]")), 5000);

    // Verify the RSVP confirmation text
    const rsvpConfirmationEl = await driver.findElement(By.xpath("//p[contains(text(),'You have RSVPed to this event.')]"));
    const rsvpConfirmationText = await rsvpConfirmationEl.getText();
    expect(rsvpConfirmationText).to.include("You have RSVPed to this event.");

  });
});

describe('User Registration Successful', function () {

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });
  /****************************************************************************************
   * Test ID        : TestCase7
   * Description    : Validates that a new user can successfully register an account.
   * Test Procedure : 
   *   1. Navigate to the login page.
   *   2. Locate and click the "REGISTER" link.
   *   3. Wait until the URL changes to include "/register".
   *   4. Fill out the registration form with valid values for username, email, password, and confirm password.
   *   5. Click the "REGISTER" button to submit the form.
   *   6. Wait until the URL changes to include "/login", indicating a successful registration.
   *   7. Assert that the login page is displayed (e.g., by verifying that a "Login" heading is present).
   ****************************************************************************************/
  it('should register a new user and redirect to login page', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe4');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe4@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password12345');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password12345');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Wait for the URL to contain "/login" indicating success
    await driver.wait(until.urlContains('/login'), 10000);

    // Verify we're on the login page
    const loginHeadingEl = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Login')]")), 5000);
    const loginHeadingText = await loginHeadingEl.getText();
    expect(loginHeadingText).to.include('LOGIN');
  });
});

describe('User Registration Failed', function () {

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });
  /****************************************************************************************
   * Test ID        : TestCase8
   * Description    : Validates that attempting to register a user with an email or username 
   *                  that already exists fails, and the user remains on the register page 
   *                  while seeing an appropriate error message.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with an existing email or username.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Registration failed." error when registring a duplicate user', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password123');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Registration failed." instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Registration failed.')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Registration failed.')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Registration failed.');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase8
   * Description    : Validates that attempting to register a user with username less than 3 
   *                  characters fails 
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with a username that is less than 3 characters.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Username field must be at least 3 characters" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('jo');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password123');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Username field must be at least 3 characters" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Username field must be at least 3 characters')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Username field must be at least 3 characters')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Username field must be at least 3 characters');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase9
   * Description    : Validates that attempting to register a user with password less than 8
   *                  characters fails 
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with a password that is less than 8 characters.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Password must be at least 8 characters long!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe10');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('pass');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('pass');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Password must be at least 8 characters long!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Password must be at least 8 characters long!')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Password must be at least 8 characters long!')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Password must be at least 8 characters long!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase10
   * Description    : Validates that attempting to register a user with an empty password field fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form without a password.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Password field is required!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe10');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Password field is required!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Password field is required!')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Password field is required!')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Password field is required!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase11
   * Description    : Validates that attempting to register a user with passwords that don't
   *                  match fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with unmatching passwords.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Passwords don\'t match!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe10');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password12345');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Passwords don't match!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath('//*[contains(text(),"Passwords don\'t match!")]')), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath('//*[contains(text(),"Passwords don\'t match!")]'));

    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Passwords don\'t match!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase12
   * Description    : Validates that attempting to register a user with a password that doesn't
   *                  have at least 3 numbers fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with a password that doesn't have numbers.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Password must have at least 3 numbers" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe10');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Password must have at least 3 numbers" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Password must have at least 3 numbers')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Password must have at least 3 numbers')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Password must have at least 3 numbers');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase13
   * Description    : Validates that attempting to register a user with an empty username field fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form without a username.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Username field is required!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('john.doe10@example.com');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password123');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Username field is required!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Username field is required!')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Username field is required!')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Username field is required!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  /****************************************************************************************
   * Test ID        : TestCase14 (BUG, user gets registered)
   * Description    : Validates that attempting to register a user with an empty email field fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form without an email.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Email field is required!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe10');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password123');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Email field is required!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email field is required!')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Email field is required!')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Email field is required!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });
  /****************************************************************************************
   * Test ID        : TestCase15 (BUG, user gets registered)
   * Description    : Validates that attempting to register a user with an invalid email format
   *                  (doesn't contain @ for eg.) fails.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Click the "Register" button to go to the registration page.
   *   3. Fill out the registration form with an invalid email format.
   *   4. Submit the registration form.
   *   5. Wait for an error message to appear, indicating registration failure.
   *   6. Verify that the user remains on the register page 
   *   7. Confirm the error message is displayed.
   ****************************************************************************************/
  it('should show "Email field is invalid!" error', async function () {
    // 1. Navigate to the login page
    await driver.get(`${url}/login`);

    // 2. Locate and click the "Register" link
    const registerNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Register')]")), 5000);
    await registerNavButton.click();

    // Wait for the URL to contain "/register"
    await driver.wait(until.urlContains('/register'), 10000);

    // Wait for the register page to load (verify "Register" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Register')]")), 10000);

    // Fill the registration form
    // Wait for the username field to appear
    const usernameLocator = By.id('username');
    await driver.wait(until.elementLocated(usernameLocator), 10000);

    // Username
    const usernameInput = await driver.findElement(usernameLocator);
    await usernameInput.sendKeys('johndoe15');

    // Email
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys('invalidemail');

    // Password
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys('password123');

    // Confirm Password
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys('password123');

    // Submit the form
    const registerFormButton = await driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await registerFormButton.click();

    // Expect an error banner message "Email field is invalid!" instead of redirect to /login
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email field is invalid!')]")), 10000);

    // Verify the error text
    const errorBannerEl = await driver.findElement(By.xpath("//*[contains(text(),'Email field is invalid!')]"));
    const errorBannerText = await errorBannerEl.getText();
    expect(errorBannerText).to.include('Email field is invalid!');

    // Check that we remain on /register
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

});

describe('Admin Create Event', function () {

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });
  /****************************************************************************************
    * Test ID       : TestCase16
   * Description    : Validates that an admin can log in with valid credentials and create
   *                  an event.
   * Test Procedure :
   *   1. Navigate to the login page.
   *   2. Locate and fill in the email and password fields with admin credentials.
   *   3. Click the submit button and wait for the "Dashboard" button to appear.
   *   4. Click the "Dashboard" button and wait for the URL to contain "/dashboard".
   *   5. Verify the "Create New Event" heading is displayed on the dashboard.
   *   6. Fill out the event creation form (Event Name, Description, Date, Time, Location).
   *   7. Click the "CREATE EVENT" button.
   *   8. Wait for the newly created event's name to appear on the home page.
   *   9. Assert that the event is successfully displayed on the page.
    ****************************************************************************************/
  it('should login in admin and create new event', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('admin@test.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('admin123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait until "Dashboard" button appears (indicating we're on the events page)
    const dashboardButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Dashboard')]")), 10000);

    // Assert that we have a "Dashboard" button
    const dashboardText = await dashboardButton.getText();
    expect(dashboardText).to.include('DASHBOARD');

    // Click the "Dashboard" button
    await dashboardButton.click();

    // Wait for the URL to contain "/dashboard"
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Wait for the dashboard page to load (verify "Create New Event" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Create New Event')]")), 10000);

    // Fill the new event form
    const eventNameInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Event Name')]/following::input[1]")), 5000);
    const newEventName = 'My Selenium Event';
    await eventNameInput.sendKeys(newEventName);

    const descriptionInput = await driver.findElement(By.xpath("//label[contains(text(),'Description')]/following::textarea[1]"));
    await descriptionInput.sendKeys('This event is created by an automated Selenium test.');

    const dateInput = await driver.findElement(By.xpath("//label[contains(text(),'Date')]/following::input[1]"));
    await dateInput.sendKeys('12/25/2025');

    const timeInput = await driver.findElement(By.xpath("//label[contains(text(),'Time')]/following::input[1]"));
    await timeInput.sendKeys('14:00 PM');

    const locationInput = await driver.findElement(By.xpath("//label[contains(text(),'Location')]/following::input[1]"));
    await locationInput.sendKeys('Virtual Conference Room');

    // Click "CREATE EVENT"
    const createEventButton = await driver.findElement(By.xpath("//button[contains(text(),'Create Event')]"));
    await createEventButton.click();


    //  Wait for the newly created event's text to appear in the DOM.
    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),"${newEventName}")]`)), 10000);

    // Verify the event is visible on the home page
    const newEventCard = await driver.findElement(By.xpath(`//*[contains(text(),"${newEventName}")]`));
    const cardText = await newEventCard.getText();
    expect(cardText).to.include(newEventName);
  });

  /****************************************************************************************
  * Test ID       : TestCase17
  * Description   : Validates that leaving required fields empty when creating a new event 
  *                 triggers the browser’s built-in validation (“Please fill out this field.”) 
  *                 and keeps the user on the dashboard page without creating the event.
  * Test Procedure:
  *   1. Navigate to the login page.
  *   2. Enter admin credentials (email and password) and click “Submit.”
  *   3. Wait for the “Dashboard” button to appear, indicating a successful admin login.
  *   4. Click the “Dashboard” button and wait for the URL to contain “/dashboard.”
  *   5. Verify the “Create New Event” heading is displayed.
  *   6. Leave all required fields empty.
  *   7. Click the “CREATE EVENT” button.
  *   8. Check the validation message on the first required field (e.g., “Event Name”) to confirm 
  *      “Please fill out this field.” is shown.
  *   9. Assert the user remains on the “/dashboard” page and no event is created.
  ****************************************************************************************/
  it('should show "Please fill out this field." when a field is empty when creating event', async function () {
    // Go to login page
    await driver.get(`${url}/login`);

    // Wait for form to load and find email input
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('admin@test.com');

    // Wait for form to load and find password input
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('admin123');

    // Find submit button 
    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait until "Dashboard" button appears (indicating we're on the events page)
    const dashboardButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Dashboard')]")), 10000);

    // Assert that we have a "Dashboard" button
    const dashboardText = await dashboardButton.getText();
    expect(dashboardText).to.include('DASHBOARD');

    // Click the "Dashboard" button
    await dashboardButton.click();

    // Wait for the URL to contain "/dashboard"
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Wait for the dashboard page to load (verify "Create New Event" heading)
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Create New Event')]")), 10000);

    // Leave the form empty
    // Click "CREATE EVENT"
    const createEventButton = await driver.findElement(By.xpath("//button[contains(text(),'Create Event')]"));
    await createEventButton.click();

    // Verify that the form doesn't submit
    // Locate the Event Name input
    const eventNameInput = await driver.findElement(By.xpath("//label[contains(text(),'Event Name')]/following::input[1]"));

    // Retrieve the browser's built-in validationMessage 
    const validationMessage = await driver.executeScript('return arguments[0].validationMessage;', eventNameInput);
    expect(validationMessage).to.include('Please fill out this field.');

    // Check that we remain on the same page ("/dashboard") and no event is created
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.contain('/dashboard');

  });
});

describe('Admin refresh page', function () {

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });
  /****************************************************************************************
   * Test ID       : TestCase18 (BUG)
   * Description   : Validates that after an admin logs in and the page is refreshed, 
   *                 the admin-specific UI controls persist. In a correct implementation,
   *                 the Dashboard button should remain visible. If instead the UI reverts 
   *                 to a normal user view (for example, displaying an RSVP button), it 
   *                 indicates a role mismatch bug.
   * Test Procedure:
   *   1. Navigate to the login page.
   *   2. Enter valid admin credentials (email and password) and submit the form.
   *   3. Wait until the Dashboard button appears, confirming a successful admin login.
   *   4. Refresh the page to simulate a session state change.
   *   5. Allow time for the page to re-render.
   *   6. Assert that the Dashboard button remains visible, indicating that the 
   *      admin session is correctly maintained.
   ****************************************************************************************/
  it('should display admin controls (Dashboard) after refresh', async function () {
    // Log in as admin
    await driver.get(`${url}/login`);

    const emailInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Email')]/following::input[1]")), 5000);
    await emailInput.sendKeys('admin@test.com');

    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(),'Password')]/following::input[1]")), 5000);
    await passwordInput.sendKeys('admin123');

    const submitButton = await driver.findElement(By.css('button.MuiButton-root[type="submit"]'));
    await submitButton.click();

    // Wait for "Dashboard" button to confirm admin login
    const dashboardButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Dashboard')]")), 10000);
    const dashboardText = await dashboardButton.getText();
    expect(dashboardText.toUpperCase()).to.include('DASHBOARD');

    // Refresh the page to simulate the role mismatch scenario
    await driver.navigate().refresh();

    // Allow time for the page to re-render after refresh
    await driver.sleep(3000);

    // Now, expect the Dashboard button to still be present
    const adminDashboardButton = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Dashboard')]")),10000);
    const adminDashboardText = await adminDashboardButton.getText();
    expect(adminDashboardText).to.include('DASHBOARD');

  });
});
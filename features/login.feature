Feature: Swag Labs Login

  Background:
    Given I am on the Swag Labs login page

  Scenario: Successful login with standard user
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be on the inventory page
    And the inventory should display the correct product names

  Scenario: Locked out user is denied access
    When I login with username "locked_out_user" and password "secret_sauce"
    Then I should see a login error message

  Scenario: Empty credentials show an error
    When I login with username "" and password ""
    Then I should see a login error message

  Scenario Outline: Multiple user types can reach the inventory page
    When I login with username "<username>" and password "secret_sauce"
    Then I should be on the inventory page

    Examples:
      | username                |
      | standard_user           |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

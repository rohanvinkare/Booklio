const { AbilityBuilder, Ability } = require("@casl/ability");

/**
 * Attaching the abilities of the cred according to the role
 */
function defineAbilitiesFor(cred) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  switch (cred.role) {
    case "admin":
      can("create", "member");
      can("delete", "member");
      can("delete", "seller");
      can("delete", "user");
      can("update", "member");
      can("read", "members"); // both single and all member read
      can("read", "sellers"); // both single and all seller read
      can("read", "users"); // both single and all user read
      can("read", "Batch-Data");
      can("manage", "all"); // Full access to everything
      break;

    case "user":
      can("read", "uer-profile");
      can("update", "user-profile");
      can("logout", "user-logout");
      break;

    case "seller":
      can("read", "seller-profile");
      can("update", "seller-profile");
      can("logout", "seller-logout");
      break;

    default:
      can("read", "profile"); // Default guest permissions
      break;
  }

  return new Ability(rules);
}

module.exports = { defineAbilitiesFor };

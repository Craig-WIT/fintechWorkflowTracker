import { teamController } from "./controllers/team-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import { fundController } from "./controllers/fund-controller.js";

export const webRoutes = [
    { method: "GET", path: "/teamAdmin", config: teamController.index },
    { method: "POST", path: "/teamAdmin/addTeam", config: teamController.addTeam },
    { method: "GET", path: "/teamAdmin/deleteTeam/{id}", config: teamController.deleteTeam },

    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },

    { method: "GET", path: "/addUser", config: userController.showAddUser },
    { method: "POST", path: "/addUser/addUser", config: userController.addUser },

    { method: "GET", path: "/fundAdmin", config: fundController.showFundAdmin },
    { method: "POST", path: "/fundAdmin/addFund", config: fundController.addFund },
];
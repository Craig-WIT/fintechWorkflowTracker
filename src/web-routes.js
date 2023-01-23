import { teamController } from "./controllers/team-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import { fundController } from "./controllers/fund-controller.js";
import { checklistController } from "./controllers/checklist-controller.js";

export const webRoutes = [
    { method: "GET", path: "/teamAdmin", config: teamController.showTeamAdmin },
    { method: "POST", path: "/teamAdmin/addTeam", config: teamController.addTeam },
    { method: "POST", path: "/teamAdmin/editTeam/{id}", config: teamController.editTeam },
    { method: "GET", path: "/teamAdmin/deleteTeam/{id}", config: teamController.deleteTeam },
    { method: "GET", path: "/teamAdmin/{id}/editTeam", config: teamController.showEditTeam },

    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },

    { method: "GET", path: "/userAdmin", config: userController.showUserAdmin },
    { method: "POST", path: "/userAdmin/addUser", config: userController.addUser },
    { method: "GET", path: "/userAdmin/deleteUser/{id}", config: userController.deleteUser },
    { method: "GET", path: "/userAdmin/{id}/editUser", config: userController.showEditUser },
    { method: "POST", path: "/userAdmin/editUser/{id}", config: userController.editUser },

    { method: "GET", path: "/fundAdmin", config: fundController.showFundAdmin },
    { method: "POST", path: "/fundAdmin/addFund", config: fundController.addFund },
    { method: "GET", path: "/fundAdmin/deleteFund/{id}", config: fundController.deleteFund },
    { method: "GET", path: "/fundAdmin/{id}/editFund", config: fundController.showEditFund },
    { method: "POST", path: "/fundAdmin/editFund/{id}", config: fundController.editFund },

    { method: "GET", path: "/checklistAdmin", config: checklistController.showChecklistAdmin },
    { method: "GET", path: "/checklistAdmin/{id}/editChecklist", config: checklistController.showEditChecklist },
    { method: "POST", path: "/checklistAdmin/editChecklist/{id}", config: checklistController.editChecklist },
    { method: "POST", path: "/checklistAdmin/addChecklist", config: checklistController.addChecklist },
    { method: "GET", path: "/checklistAdmin/deleteChecklist/{id}", config: checklistController.deleteChecklist },
];
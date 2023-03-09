import { teamController } from "./controllers/team-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import { fundController } from "./controllers/fund-controller.js";
import { checklistController } from "./controllers/checklist-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";

export const webRoutes = [
    { method: "GET", path: "/teamAdmin", config: teamController.showTeamAdmin },
    { method: "POST", path: "/teamAdmin/addTeam", config: teamController.addTeam },
    { method: "POST", path: "/teamAdmin/addTeamExcel", config: teamController.addTeamExcel },
    { method: "GET", path: "/teamAdmin/deleteTeam/{id}", config: teamController.deleteTeam },
    { method: "GET", path: "/teamAdmin/{id}/editTeam", config: teamController.showEditTeam },
    { method: "POST", path: "/teamAdmin/editTeam/{id}", config: teamController.editTeam },

    { method: "GET", path: "/dashboard", config: dashboardController.index },
    { method: "GET", path: "/dashboard/{id}/viewTeam", config: dashboardController.showViewTeam },

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
    { method: "POST", path: "/fundAdmin/addFundExcel", config: fundController.addFundExcel },
    { method: "GET", path: "/fundAdmin/deleteFund/{id}", config: fundController.deleteFund },
    { method: "GET", path: "/fundAdmin/{id}/editFund", config: fundController.showEditFund },
    { method: "POST", path: "/fundAdmin/editFund/{id}", config: fundController.editFund },
    { method: "GET", path: "/{teamid}/viewFund/{id}/addFundChecklist", config: fundController.showAddFundChecklist },
    { method: "GET", path: "/{teamid}/viewFund/{id}/viewFundChecklists", config: fundController.showFundChecklists },
    { method: "GET", path: "/{teamid}/viewFund/{id}/deleteFundChecklist/{checklistid}", config: fundController.deleteFundChecklist },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}", config: fundController.showEditFundChecklist },
    { method: "POST", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}", config: fundController.editFundChecklist },
    { method: "POST", path: "/{teamid}/viewFund/addFundChecklist/{id}", config: fundController.addFundChecklist },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/preparerSignOff", config: fundController.preparerSignOff },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/removePreparerSignOff", config: fundController.removePreparerSignOff },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/firstReviewSignOff", config: fundController.firstReviewSignOff },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/removeFirstReviewSignOff", config: fundController.removeFirstReviewSignOff },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/secondReviewSignOff", config: fundController.secondReviewSignOff },
    { method: "GET", path: "/{teamid}/viewFund/{id}/editFundChecklist/{checklistid}/removeSecondReviewSignOff", config: fundController.removeSecondReviewSignOff },
    
    { method: "GET", path: "/checklistAdmin", config: checklistController.showChecklistAdmin },
    { method: "GET", path: "/checklistAdmin/{id}/editChecklist", config: checklistController.showEditChecklist },
    { method: "POST", path: "/checklistAdmin/editChecklist/{id}", config: checklistController.editChecklist },
    { method: "POST", path: "/checklistAdmin/addChecklist", config: checklistController.addChecklist },
    { method: "GET", path: "/checklistAdmin/deleteChecklist/{id}", config: checklistController.deleteChecklist },

    {
        method: "GET",
        path: "/{param*}",
        handler: {
          directory: {
            path: "./public"
          }
        },
        options: { auth: false }
      }
];
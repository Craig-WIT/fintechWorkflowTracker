import { db } from "../models/db.js";
import { UserCredentials, UserSpec, } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Fintech Workflow Tracker" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Fintech Workflow Tracker" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      user.teams = [];
      user.admin = true;
      const userExists = await db.userStore.checkIfUserExists(user);
      if(!userExists) {
        await db.userStore.addUser(user);
      }
      else {
        const errorMsg = "That email address is already registered - please try again"
        return h.view("signup-view", { error: errorMsg });
      }
      return h.redirect("/login");
    },
  },

  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Fintech Workflow" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentials,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      let errorMsg = "";
      if (!user) {
        errorMsg = "No user found with that email address - please try again"
      }
      else if (user.password !== password){
        errorMsg = "You have entered an incorrect password - please try again"
      }
      else{
        request.cookieAuth.set({ id: user._id });
        return h.redirect("/dashboard");
      }
      return h.view("login-view",{error: errorMsg})
    },
  },

  logout: {
    auth: false,
    handler: function (request, h) {
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
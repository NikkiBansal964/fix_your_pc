const router = require("express").Router();
const sendResponse = require("../core/res-methods");
const authValidator = require("../validators/auth");
const authService = require("../services/auth");
const jwt = require("../utils/jwt");

router.post("/create", async (req, res) => {
  const { name, mobile, confirmPassword, password, loginid } = req.body;
  console.log("Resp ===>", {
    name,
    mobile,
    confirmPassword,
    password,
    loginid,
  });
  try {
    if (password !== confirmPassword) {
      return sendResponse(res, {
        statusCode: 401,
        message: `password not match`,
      });
    }
    let user = await authService.createUser({
      name,
      mobile,
      password,
      loginid: mobile,
    });
    return sendResponse(res, { statusCode: 200, data: user });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.post("/signin", async (req, res) => {
  const { mobile, email, password, loginid } = req.body;
  console.log("signi called");
  try {
    let signin = await authService.signin({ password, loginid });
    return sendResponse(res, { statusCode: 200, data: signin });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.get("/getusers", jwt.tokenVerification, async (req, res) => {
  try {
    let users = await authService.getUsers();
    return sendResponse(res, { statusCode: 200, data: users });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.post("/getuserbytype", jwt.tokenVerification, async (req, res) => {
  try {
    let { type } = req.body;
    let users = await authService.getUserByType(type);
    return sendResponse(res, { statusCode: 200, data: users });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.post("/update", jwt.tokenVerification, async (req, res) => {
  try {
    let user = req.body;
    let updateUser = await authService.update(user);
    return sendResponse(res, { statusCode: 200, data: updateUser });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.post("/changepassword", jwt.tokenVerification, async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;
    let userid = req.current_userId;
    if (!oldPassword)
      return sendResponse(res, {
        statusCode: 500,
        message: "Please enter previous password",
      });
    if (!newPassword)
      return sendResponse(res, {
        statusCode: 500,
        message: "Please enter new password",
      });

    let updateUser = await authService.changePassword({
      oldPassword,
      newPassword,
      userid,
    });
    return sendResponse(res, { statusCode: 200, data: updateUser });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

router.post("/resetpassword", jwt.tokenVerification, async (req, res) => {
  try {
    let { userid, password } = req.body;
    let updateUser = await authService.updatePassword(userid, password);
    return sendResponse(res, { statusCode: 200, data: updateUser });
  } catch (e) {
    return sendResponse(res, { statusCode: 500, message: e.message });
  }
});

module.exports = router;

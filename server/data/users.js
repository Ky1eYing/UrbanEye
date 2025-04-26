import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";

const makeHashedPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (e) {
    throw new Error("Error hashing password: " + e.message);
  }
};

const checkPassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (e) {
    throw new Error("Error comparing password: " + e.message);
  }
};

const userCheckWithPwduserId = async (userId, plainPassword) => {
  try {
    userId = check.checkObjectId(userId);
    plainPassword = check.checkVaildString(plainPassword, "Password");
  } catch (e) {
    return false;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return false;
  }
  const hashedPassword = user.password;
  const isMatch = await checkPassword(plainPassword, hashedPassword);

  return isMatch;
};

const userCheckWithPwdUserName = async (userName, plainPassword) => {
  try {
    userName = check.checkVaildString(userName, "UserName");
    userName = userName.toLowerCase();
    plainPassword = check.checkVaildString(plainPassword, "Password");
  } catch (e) {
    return null;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ userName: userName });
  if (!user) {
    return null;
  }
  const hashedPassword = user.password;
  const isMatch = await checkPassword(plainPassword, hashedPassword);

  if (isMatch) {
    return user._id.toString();
  }
  return null;
};

const updateUserName = async (userId, userName) => {
  userId = check.checkObjectId(userId);
  userName = check.checkVaildString(userName, "UserName");
  userName = userName.toLowerCase();

  const usersCollection = await users();

  try {
    let updateInfo = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { userName: userName } },
      { returnDocument: "after" }
    );

    if (!updateInfo) {
      throw new Error(
        `Error: Update failed, could not find an user with id of ${userId}`
      );
    }

    return true;
  } catch (e) {
    if (e.code === 11000) {
      throw new Error("The same UserName already exists!");
    } else {
      throw new Error("Error: Update failed");
    }
  }
};

const updatePassword = async (userId, password) => {
  userId = check.checkObjectId(userId);
  password = check.checkVaildString(password, "Password");

  password = await makeHashedPassword(password);

  const usersCollection = await users();

  let updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { password: password } },
    { returnDocument: "after" }
  );

  if (!updateInfo) {
    throw new Error(
      `Error: Update failed, could not find an user with id of ${userId}`
    );
  }

  return true;
};

const filterUserSimple = (user) => {
  const returnUser = {
    _id: user._id,
    userName: user.userName,
    name: user.name,
    avatar: user.avatar,
  };

  return returnUser;
};

const filterUser = (user) => {
  const returnUser = {
    _id: user._id,
    userName: user.userName,
    name: user.name,
    introduction: user.introduction,
    sex: user.sex,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  };

  return returnUser;
};

const filterUserWithPassword = (user) => {
  const returnUser = {
    _id: user._id,
    userName: user.userName,
    name: user.name,
    introduction: user.introduction,
    sex: user.sex,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    password: user.password,
  };

  return returnUser;
};

// create user func
const createUser = async (
  userName,
  name,
  password,
  introduction,
  sex,
  email,
  phone
) => {
  introduction = check.validateIntroduction(introduction);
  sex = check.validateSex(sex);
  email = check.validateEmail(email);
  phone = check.validatePhone(phone);

  userName = check.checkVaildString(userName, "UserName");
  name = check.checkVaildString(name, "Name");
  password = check.checkVaildString(password, "Password");

  password = await makeHashedPassword(password);

  let newUser = {
    userName: null,
    name: null,
    introduction: null,
    sex: null,
    email: null,
    phone: null,
    avatar: null,

    password: null,
  };

  newUser.userName = userName.toLowerCase();
  newUser.name = name;
  newUser.password = password;

  newUser.introduction = introduction;
  newUser.sex = sex;
  newUser.email = email ? email.toLowerCase() : null; //email is optional(fix .toLowerCase() error)
  newUser.phone = phone;

  const usersCollection = await users();

  try {
    const insertInfo = await usersCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not add user");
    }

    const newId = insertInfo.insertedId.toString();
    newUser._id = newId;
  } catch (e) {
    if (e.code === 11000) {
      throw new Error("The same UserName already exists!");
    } else {
      throw new Error("Could not add user");
    }
  }

  return filterUserWithPassword(newUser);
};

// get one user by user id
const getUserByUserId = async (userId) => {
  userId = check.checkObjectId(userId);

  let usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error("No user with that id");
  }
  user._id = user._id.toString();

  return filterUserWithPassword(user);
};

// get multiple users by user ids
const getUsersByUserIds = async (userIds) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("UserIds must be a non-empty array");
  }

  userIds = userIds.map(id => check.checkObjectId(id));

  let usersCollection = await users();
  const userList = await usersCollection.find({
    _id: { $in: userIds.map(id => new ObjectId(id)) }
  }).toArray();

  if (userList.length === 0 || userList.length !== userIds.length) {
    throw new Error("At least one user was not found");
  }

  const filteredUsers = userList.map(user => {
    user._id = user._id.toString();
    return filterUserSimple(user);
  });

  return filteredUsers;
};

// remove one user by user id
const removeUser = async (userId) => {
  userId = check.checkObjectId(userId);

  const usersCollection = await users();
  const deletionInfo = await usersCollection.findOneAndDelete({
    _id: new ObjectId(userId),
  });
  if (!deletionInfo) {
    throw new Error(`Could not delete user with id of ${userId}`);
  }

  return `${deletionInfo.userName} has been successfully deleted!`;
};

// update user
const updateUser = async (userId, name, introduction, sex, email, phone) => {
  userId = check.checkObjectId(userId);

  introduction = check.validateIntroduction(introduction);
  sex = check.validateSex(sex);
  email = check.validateEmail(email);
  phone = check.validatePhone(phone);

  // userName = check.checkVaildString(userName, "UserName");
  name = check.checkVaildString(name, "Name");
  // password = check.checkVaildString(password, "Password");

  // password = await makeHashedPassword(password);

  let newUser = {
    name: null,
    introduction: null,
    sex: null,
    email: null,
    phone: null,
  };

  // newUser.userName = userName;
  newUser.name = name;
  // newUser.password = password;

  newUser.introduction = introduction;
  newUser.sex = sex;
  newUser.email = email ? email.toLowerCase() : null; //email is optional(fix .toLowerCase() error)
  newUser.phone = phone;

  const usersCollection = await users();

  let updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: newUser },
    { returnDocument: "after" }
  );

  if (!updateInfo) {
    throw new Error(
      `Error: Update failed, could not find an user with id of ${userId}`
    );
  }
  updateInfo._id = updateInfo._id.toString();

  return filterUserWithPassword(updateInfo);
};

export default {
  createUser,
  getUserByUserId,
  getUsersByUserIds,
  removeUser,
  updateUser,
  filterUserSimple,
  filterUser,
  filterUserWithPassword,
  userCheckWithPwduserId,
  userCheckWithPwdUserName,
  updateUserName,
  updatePassword,
};

import { ObjectId } from "mongodb";

// check input 'string' type
export const checkVaildString = (param, param_name) => {
  if (param === undefined) {
    throw new Error(`${param_name} is missing`);
  }
  if (typeof param !== "string") {
    throw new Error(`${param_name} is not a string`);
  }

  param = param.trim();

  if (param.length === 0) {
    throw new Error(`${param_name} full of spaces`);
  }

  return param;
};

// check input 'string' type but allow null
export const checkStringAllowNull = (str, name) => {
  if (str === null || str === undefined) {
    return null;
  } else if (typeof str !== "string") {
    throw new Error(`${name} is not a string`);
  }

  str = str.trim();
  if (str.length === 0) {
    return null;
  } else {
    return str;
  }
};

// check input 'ObjectId' type
export const checkObjectId = (id) => {
  const check_id = checkVaildString(id, "ID");
  if (!ObjectId.isValid(check_id)) {
    throw new Error("ID is not a valid ObjectId");
  }

  return check_id;
};

// check photo url
export const checkPhotoUrl = (photourl) => {
  const check_photourl = checkVaildString(photourl, "PhotoUrl");

  const urlPattern = /^https?:\/\/.+$/;
  if (!urlPattern.test(check_photourl)) {
    throw new Error("Invaild image URL");
  }

  return check_photourl;
};

// check title
export const checkTitle = (title) => {
  const check_title = checkVaildString(title, "Title");
  if (check_title.length > 50) {
    throw new Error("Title length should be within 50 characters");
  }

  return check_title;
};

// check content
export const checkContent = (content) => {
  const check_content = checkVaildString(content, "Content");
  if (check_content.length > 200) {
    throw new Error("Content length should be within 200 characters");
  }

  return check_content;
};

// check location validation
export const checkLocation = (location) => {
  if (location === undefined) {
    throw new Error("location is missing");
  }
  if (typeof location !== "object" || location === null) {
    throw new Error("location must be an object");
  }

  // check latitude and longtitude
  if (!("latitude" in location)) {
    throw new Error("location is missing latitude");
  }
  if (!("longitude" in location)) {
    throw new Error("location is missing longitude");
  }
  if (!("address" in location)) {
    throw new Error("location is missing address");
  }

  // Check latitude is a valid string and within valid range
  const checked_latitude = checkVaildString(
    location.latitude,
    "location.latitude"
  );
  const latitude_num = parseFloat(checked_latitude);
  if (isNaN(latitude_num)) {
    throw new Error("location.latitude is not a valid number");
  }
  if (latitude_num < -90 || latitude_num > 90) {
    throw new Error("location.latitude must be between -90 and 90");
  }

  // Check longitude is a valid string and within valid range
  const checked_longitude = checkVaildString(
    location.longitude,
    "location.longitude"
  );
  const longitude_num = parseFloat(checked_longitude);
  if (isNaN(longitude_num)) {
    throw new Error("location.longitude is not a valid number");
  }
  if (longitude_num < -180 || longitude_num > 180) {
    throw new Error("location.longitude must be between -180 and 180");
  }

  // Check address is a valid string
  checkVaildString(location.address, "location.address");

  return location;
};

// check category
export const checkCategory = (category) => {
  let checked_category = checkVaildString(category, "Category");
  const validCategories = [
    "gun shot",
    "fight",
    "stealing",
    "assaulting",
    "traffic jam",
    "road closed",
    "accident",
    "performance",
    "food truck",
    "parade",
  ];
  if (!validCategories.includes(checked_category)) {
    throw new Error("Invalid category value");
  }

  return checked_category;
};

export const validateUserName = (userName) => {
  userName = checkVaildString(userName, "UserName");

  if (userName.length > 20) {
    throw new Error("UserName must be a string with at most 20 characters.");
  }

  if (!/^[a-zA-Z0-9]+$/.test(userName)) {
    throw new Error("UserName must contain only letters and numbers.");
  }

  return userName;
};

export const validatePassword = (password) => {
  password = checkVaildString(password, "Password");

  if (password.length > 30 || password.length < 4) {
    throw new Error(
      "Password must be a string with at most 30 characters and at least 4 characters."
    );
  }

  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/.test(password)) {
    throw new Error("Password can only contain letters, numbers, and symbols.");
  }

  return password;
};

export const validateName = (name) => {
  name = checkVaildString(name, "Name");

  if (name.length > 40) {
    throw new Error("Name must be a string with at most 40 characters.");
  }

  return name;
};

// check introduction
export const validateIntroduction = (introduction) => {
  introduction = checkStringAllowNull(introduction, "Introduction");
  if (introduction === null) {
    return null;
  }

  if (typeof introduction !== "string" || introduction.length > 200) {
    throw new Error(
      "Introduction must be a string with at most 200 characters."
    );
  }
  return introduction;
};

// check sex
export const validateSex = (sex) => {
  sex = checkStringAllowNull(sex, "Sex");
  if (sex === null) {
    return null;
  }

  if (typeof sex !== "string" || sex.length > 20) {
    throw new Error("Sex must be a string with at most 20 characters.");
  }

  const genderLabels = [
    "Male",
    "Female",
    "Transgender Male",
    "Transgender Female",
    "Non-binary",
    "Genderqueer",
    "Genderfluid",
    "Intersex",
    "Agender",
    "Bigender",
    "Two-Spirit",
    "I don't know",
    "Prefer not to say",
  ];

  if (!genderLabels.includes(sex)) {
    throw new Error("sex is valid");
  }

  return sex;
};

// check email
export const validateEmail = (email) => {
  email = checkStringAllowNull(email, "Email");
  if (email === null) {
    return null;
  }

  const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"[^"\\]*(?:\\.[^"\\]*)*")@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\[(?:[0-9]{1,3}\.){3}[0-9]{1,3}\]))$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }
  return email;
};

// check phone
export const validatePhone = (phone) => {
  phone = checkStringAllowNull(phone, "Phone");
  if (phone === null) {
    return null;
  }

  const phoneRegex = /^\+?\d{7,15}$/;
  if (typeof phone !== "string" || !phoneRegex.test(phone)) {
    throw new Error(
      'Phone number must contain only digits and an optional leading "+", and be 7 to 15 characters long.'
    );
  }
  return phone;
};

// check comment
export const checkComment = (comment) => {
  const check_comment = checkVaildString(comment, "Comment");
  if (check_comment.length > 100) {
    throw new Error("Comment length should be less than 100 characters");
  }

  return check_comment;
};

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
    } 
    else if (typeof str !== "string") {
        throw new Error(`${name} is not a string`);
    }

    str = str.trim();
    if (str.length === 0) {
        return null;
    }
    else {
        return str;
    }
};

// check input 'ObjectId' type
export const checkObjectId = id => {
	const check_id = checkVaildString(id, "ID");
	if (!ObjectId.isValid(check_id)) {
		throw new Error("ID is not a valid ObjectId");
	}

	return check_id;
};

// check location validation
export const checkLocation = location => {
	if (location === undefined) {
		throw new Error("location is missing");
	}
	if (!Array.isArray(location)) {
		throw new Error("location must be an array");
	}
	if (location.length === 0) {
		throw new Error("location is empty");
	}

	// check latitude and longtitude
	const loc = location[0];
	if (typeof loc !== "object" || loc === null) {
		throw new Error("location is not a valid object");
	}
	if (!("latitude" in loc)) {
		throw new Error("location is missing latitude");
	}
	if (!("longitude" in loc)) {
		throw new Error("location is missing longitude");
	}
	if (!("address" in loc)) {
		throw new Error("location is missing address");
	}

	// Check that latitude is a valid string and within valid range
	const checked_latitude = checkVaildString(loc.latitude, "location.latitude");
	const latitude_num = parseFloat(checked_latitude);
	if (isNaN(latitude_num)) {
		throw new Error("location.latitude is not a valid number");
	}
	if (latitude_num < -90 || latitude_num > 90) {
		throw new Error("location.latitude must be between -90 and 90");
	}

	// Check that longitude is a valid string and within valid range
	const checked_longitude = checkVaildString(loc.longitude, "location.longitude");
	const longitude_num = parseFloat(checked_longitude);
	if (isNaN(longitude_num)) {
		throw new Error("location.longitude is not a valid number");
	}
	if (longitude_num < -180 || longitude_num > 180) {
		throw new Error("location.longitude must be between -180 and 180");
	}

	// Check that address is a valid string
	checkVaildString(loc.address, "location.address");

	return location;
};

// check category
export const checkCategory = category => {
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
		"parade"
	];
	if (!validCategories.includes(checked_category)) {
		throw new Error("Invalid category value");
	}

	return checked_category;
};

// check introduction
export const validateIntroduction = introduction => {

    introduction = checkStringAllowNull(introduction, "Introduction");
    if (introduction === null) {
        return null;
    }

    if (typeof introduction !== 'string' || introduction.length > 200) {
      throw new Error('Introduction must be a string with at most 200 characters.');
    }
    return introduction;
};

// check sex
export const validateSex = sex => {

    sex = checkStringAllowNull(sex, "Sex");
    if (sex === null) {
        return null;
    } 

    if (typeof sex !== 'string' || sex.length > 20) {
        throw new Error('Sex must be a string with at most 20 characters.');
    }
    return sex;
};

// check email
export const validateEmail = email => {

    email = checkStringAllowNull(email, "Email");
    if (email === null) {
        return null;
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }
    return email;
};

// check phone
export const validatePhone = phone => {

    phone = checkStringAllowNull(phone, "Phone");
    if (phone === null) {
        return null;
    } 

    const phoneRegex = /^\+?\d{7,15}$/;
    if (typeof phone !== 'string' || !phoneRegex.test(phone)) {
      throw new Error('Phone number must contain only digits and an optional leading "+", and be 7 to 15 characters long.');
    }
    return phone;
};
  
  
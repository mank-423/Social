import User from "../models/user.model";

const checkForRegex = (pattern: RegExp, pass: string): boolean => {
    return pattern.test(pass);
}

export const signUpValidation = async (fullName: string, email: string, password: string) => {

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let errors: { key: string, message: string }[] = [];

    if (!fullName || fullName.trim() === "") {
        errors.push({ key: "fullName", message: "Full name is required" });
    }

    if (!email || email.trim() === "") {
        errors.push({ key: "email", message: "Email is required" });
    }

    if (!password || password.trim() === "") {
        errors.push({ key: "password", message: "Password is required" });
    }

    // Password validation
    if (password) {
        let passwordMessage = ""

        // Length
        if (password.length < 6) {
            passwordMessage += 'Length should be greater than 6.'
        }

        // Regex
        if (!checkForRegex(passwordPattern, password)) {
            passwordMessage += 'Check if password has 1 upper, 1 lower, and 1 alphabet.'
        }

        if (passwordMessage.length > 0) {
            errors.push({
                key: 'password',
                message: passwordMessage
            });
        }
    }

    if (email) {
        const user = await User.findOne({ email });
        let emailError = ""

        if (user) {
            emailError += "User already exists on this email."
        }

        if (!checkForRegex(emailPattern, email)) {
            emailError += "Email format is wrong."
        }

        if (emailError.length > 0) {
            errors.push({
                key: 'email',
                message: emailError
            })
        }
    }

    return errors;
}
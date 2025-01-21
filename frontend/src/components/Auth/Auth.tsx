import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import authService from "../../services/authService";
import { useNavigateAuth } from "../../hooks/useNavigateAuth";
import { AuthType } from "../../types/authField";

const Auth = ({ mode }: AuthType) => {
    const { navigateToLogin, navigateToRegister, navigateAfterLogin } = useNavigateAuth();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "login") {
            try {
                const response = await authService.login(username, password);
                // console.log("Logged in successfully:", response);
                if (response.success) {
                    enqueueSnackbar("Login successfull!", { variant: 'success' });
                    navigateAfterLogin();
                } else {
                    enqueueSnackbar("Error in login", { variant: 'error' });
                }

            } catch (error) {
                console.error("Login failed:", error);
            }
        } else {
            try {
                const response = await authService.register(name, username, password);
                // console.log("Registered successfully:", response);
                if (response.success) {
                    enqueueSnackbar("Registration successfull!", { variant: 'success' });
                    navigateToLogin();
                } else {
                    enqueueSnackbar("Error in register", { variant: 'error' });
                }
            } catch (error) {
                console.error("Registration failed:", error);
            }
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-opacity-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-black">
                    {mode === "login" ? "Welcome Back" : "Create an Account"}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Conditionally render the Name field for "register" mode */}
                    {mode === "register" && (
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-1 text-sm font-medium text-black"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                id="name"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white bg-opacity-30 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Username field for both modes */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block mb-1 text-sm font-medium text-black"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white bg-opacity-30 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password field for both modes */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-1 text-sm font-medium text-black"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white bg-opacity-30 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 bg-opacity-80 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                        {mode === "login" ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                {mode === "login" ? (
                    <p className="text-sm text-center text-black">
                        Don't have an account?{" "}
                        <a onClick={navigateToRegister} className="text-blue-800 hover:underline cursor-pointer">
                            Sign up
                        </a>
                    </p>
                ) : (
                    <p className="text-sm text-center text-black">
                        Already have an account?{" "}
                        <a onClick={navigateToLogin} className="text-blue-800 hover:underline cursor-pointer">
                            Log in
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Auth;

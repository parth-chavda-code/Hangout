import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ImHangouts } from "react-icons/im";
import { FiMail, FiUser } from "react-icons/fi";
import { TbEyeClosed } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "sonner";

function AuthPage() {
    //Hooks should be called at the of the function component first
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);//shows am i on login page or not?
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [togglePasswordSee, setTogglePasswordSee] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        name: "",
        email: "",
        password: "",
        server: ""
    });

    //Handle validation errors
    function validate() {
        const newErrors = {
            name: "",
            email: "",
            password: "",
            server: ""
        };

        let valid = true;
        if (!isLogin) { // Registration page

            //Empty check for Registration page
            if (!name.trim()) {
                newErrors.name = "Please enter your name";
                valid = false;
            }
            if (!email.trim()) {
                newErrors.email = "Please enter your email";
                valid = false;
            }

            if (!password.trim()) {
                newErrors.password = "Please enter your password";
                valid = false;
            }
        } else if (isLogin) {
            //Empty check for Login page

            if (!email.trim()) {
                newErrors.email = "Please enter your email";
                valid = false;
            }

            if (!password.trim()) {
                newErrors.password = "Please enter your password";
                valid = false;
            }
        }


        setError(newErrors);
        return valid;
    }

    //Handle User Registration
    async function handleRegister() {
        //axios = calls /user/registration
        if (!validate()) return;

        try {
            setLoading(true);

            const response = await axios.post(import.meta.env.VITE_BASE_URL + "/user/registration", {
                name, email, password
            });

            toast.success("Registration successful!");

            setName("");
            setEmail("");
            setPassword("");

            setIsLogin(true);

        } catch (err) {

            const errorType = err.response?.data; // error type means zod error or server error = like user not found

            toast.error(errorType?.msg || "Registration failed");

            if (errorType?.error) {

                const fieldErrors = err.response?.data?.error;

                setError(prev => ({
                    ...prev,
                    name: fieldErrors?.name?.[0],
                    email: fieldErrors?.email?.[0],
                    password: fieldErrors?.password?.[0],
                    server: ""
                }));

            } else if (errorType?.msg) {
                setError(prev => ({
                    ...prev,
                    server: errorType.msg
                }));
            }
        } finally {
            setLoading(false);
        }
    }

    //Handle User Login
    async function handleLogin() {
        if (!validate()) return;

        setLoading(true);

        try {
            setIsLogin(true);
            //axios = calls /user/signin
            const response = await axios.post(import.meta.env.VITE_BASE_URL + "/user/signin", {
                email: email,
                password: password
            });

            console.log("Login Successfully");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("myUserId", response.data.userId);

            setEmail("");
            setPassword("");

            toast.success("Login successful!");
            navigate("/chat");

        } catch (err) {

            const errorType = err.response?.data; // error type means zod error or server error = like user not found

            toast.error(errorType?.msg || "Login failed");

            if (errorType?.error) {

                //if we put dot . after ? means optional chaining 
                // and if we don't put . then it is conditional rendering like data? means conditional data?. means optional chaining
                const fieldErrors = err.response?.data?.error;

                setError(prevError => ({
                    ...prevError,
                    email: fieldErrors?.email?.[0] || "",
                    password: fieldErrors?.password?.[0] || "",
                    server: ""
                }));

            } else if (errorType?.msg) {
                setError(prevError => ({
                    ...prevError,
                    server: errorType.msg
                }));
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">

            {/* Heading Section */}
            <div className="w-full max-w-md">
                <h1 className="flex justify-center items-center gap-2 text-3xl font-bold mb-4 ">
                    <ImHangouts className="text-orange-500" />
                    <span>Hangout</span>
                </h1>

                {/* Sub Heading */}
                <div className="flex flex-col justify-center items-center">
                    <h4 className="text-2xl">{isLogin ? "Login" : "Register"}</h4>
                    <p className="text-gray-400">{isLogin ? "Sign in to continue to Hangout." : "Get your Hangout account now."}</p>
                </div>

                {/* Auth Container Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
                    {/* Auth div */}
                    <div className="space-y-5">
                        {/* User Registration */}
                        {!isLogin && (

                            // Name Field
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <div className="relative">
                                    <FiUser className={`absolute right-6 top-1/2 -translate-y-1/2 text-orange-400 ${error.name ? "top-1/3  -translate-y-1/2" : " "}`} />
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        id="name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setError(prev => ({
                                                ...prev,
                                                name: "",
                                                server: ""
                                            }));
                                        }}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition ${error.name ? 'border-red-500' : ''}`} />
                                    {/* Error */}
                                    {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <FiMail className={`absolute right-6 top-1/2 -translate-y-1/2 text-orange-400 ${error.email ? "top-1/3 -translate-y-1/2" : ""}`} />
                            <input
                                type="text"
                                placeholder="Enter Email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value.trimStart());
                                    setError(prev => ({
                                        ...prev,
                                        email: "",
                                        server: ""
                                    }));
                                }}
                                className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition ${error.email ? "border-red-500" : ""}`}
                            />
                            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                        </div>

                        {/* Password Field */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            {togglePasswordSee ?
                                //Eyes Opened
                                <AiOutlineEye className={`absolute right-6 top-1/2 -translate-y-1/2 text-orange-400 cursor-pointer ${error.password ? "top-1/3 -translate-y-1/2" : ""}`} onClick={() => setTogglePasswordSee(!togglePasswordSee)} />
                                :
                                //Eyes Closed
                                <TbEyeClosed className={`absolute right-6 top-1/2 -translate-y-1/2 text-orange-400 cursor-pointer ${error.password ? "top-1/3 -translate-y-1/2" : ""}`} onClick={() => setTogglePasswordSee(!togglePasswordSee)} />
                            }

                            <input
                                type={togglePasswordSee ? "text" : "password"}
                                placeholder="Enter Password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(prev => ({
                                        ...prev,
                                        password: "",
                                        server: ""
                                    }));
                                }}
                                className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition ${error.password ? "border-red-500" : ""}`}
                            />
                            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                        </div>

                        {/* Login or Register Button */}
                        {/* Server Error after login/register */}
                        {error.server && <p className="text-red-500 text-sm mt-1">{error.server}</p>}

                        <button
                            onClick={isLogin ? handleLogin : handleRegister}
                            disabled={loading}
                            className={`w-full bg-orange-500 text-white py-3 rounded-lg mb-5 cursor-pointer transition-colors ${loading ? "bg-orange-300 cursor-not-allowed" : "hover:bg-orange-600"}`}
                        >

                            {/* Loading Spinner, helps to stop unwanted user send requests */}
                            {loading ?
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {isLogin ? " Signing In..." : " Signing Up..."}
                                </div>
                                :
                                (isLogin ? "Login" : "Register")}

                        </button>

                    </div>

                    {/* Toggle Auth Mode */}
                    <div>
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-orange-500 hover:underline cursor-pointer"
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AuthPage;
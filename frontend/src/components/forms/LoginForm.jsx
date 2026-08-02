import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

const LoginForm = ({ role, image }) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const response = await loginUser({

                email,
                password
            });

            localStorage.setItem(

                "token",

                response.access_token
            );

            localStorage.setItem(

                "role",

                response.role
            );

            if (role === "Patient") {

                navigate(
                    "/patient/dashboard"
                );
            }

            else if (role === "Doctor") {

                navigate(
                    "/doctor/dashboard"
                );
            }

            else {

                navigate(
                    "/guardian/dashboard"
                );
            }

        } catch (error) {

            alert("Login Failed");
        }
    };

    return (

        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-blue-50
        ">

            <div className="
            bg-white
            p-10
            rounded-3xl
            shadow-2xl
            w-[420px]
            ">

                <img

                    src={image}

                    alt="role"

                    className="
                    w-24
                    mx-auto
                    mb-6
                    "
                />

                <h1 className="
                text-4xl
                font-bold
                text-center
                text-blue-700
                mb-8
                ">

                    {role} Login

                </h1>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }

                    className="
                    w-full
                    border
                    p-4
                    rounded-xl
                    mb-5
                    "
                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }

                    className="
                    w-full
                    border
                    p-4
                    rounded-xl
                    mb-6
                    "
                />

                <button

                    onClick={handleLogin}

                    className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-4
                    rounded-xl
                    font-bold
                    "
                >

                    Login

                </button>

            </div>

        </div>
    );
};

export default LoginForm;
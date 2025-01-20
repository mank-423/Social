import Auth from "../components/Auth";
import bg from "../assets/bg.jpg";

const Login = () => {
    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg">
                <Auth mode="login"/>
            </div>
        </div>
    );
};

export default Login;

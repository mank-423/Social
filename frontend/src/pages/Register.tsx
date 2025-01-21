
import bg from "../assets/bg.jpg"
import Auth from "../components/Auth/Auth"

const Register = () => {
  return (
    <div>
       <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg">
                <Auth mode="register"/>
            </div>
        </div>
    </div>
  )
}

export default Register

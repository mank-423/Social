import { useNavigate } from "react-router-dom";

// Define return type for the hook
interface NavigateAuth {
    navigateToLogin: () => void;
    navigateToRegister: () => void;
    navigateAfterLogin: () => void;
}

export function useNavigateAuth(): NavigateAuth { 
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    const navigateAfterLogin = () => {
        navigate('/posts');
    }

    return { navigateToLogin, navigateToRegister, navigateAfterLogin };
}

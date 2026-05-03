import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input.jsx";
import { login } from "../../services/auth.js";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form onSubmit={login}>
            <div className="flex justify-between">
                <h2>Connexion</h2>
                <button className="bg-gray-200 text-orange-300 hover:text-red-400">&times;</button>
            </div>
            <div>
                <Input type={"email"} label={"email"} placeholder={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type={"password"} label={"mot de passe"} placeholder={"mot de passe"} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-0.5">
                <Button type="submit">
                    connecter
                </Button>
                <p>Vous n'avez pas encore un compte? <a href="">Crée un ici</a></p>
            </div>
        </form>
    );
}
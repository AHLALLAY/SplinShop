'use client'
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useState } from "react";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <form action="">
            <div>
                <h2>Login</h2>
                <Button>&times;</Button>
            </div>
            <div>
                <Input
                    label="Email"
                    placeholder="your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required={true}
                    disabled={loading}
                /> 
                <Input
                    label="Password"
                    placeholder="your password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required={true}
                    disabled={loading}
                />
            </div>
            <div>
                <Button>
                    {loading ? "in progress ...": "login"}
                </Button>
            </div>
        </form>
    );
}
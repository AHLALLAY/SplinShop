"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <form
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10"
        action=""
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Connexion
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Accédez à votre espace SplinShop
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="size-9 rounded-full p-0 text-muted-foreground hover:text-foreground"
            aria-label="Fermer"
          >
            ×
          </Button>
        </div>

        <div className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            variant="cta"
            className="min-h-11 px-6 sm:min-w-[140px]"
            loading={loading}
          >
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-primary">
            SplinShop
          </span>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-cta">Vitrine e-commerce</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Une expérience d’achat claire et rassurante.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Palette « Commerce sobre » : navigation en bleu ardoise, actions
            commerciales en corail, fonds neutres pour mettre vos produits en
            valeur.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cta px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cta-hover"
            >
              Se connecter
            </Link>
            <span className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-6 text-sm font-medium text-primary">
              Catalogue (bientôt)
            </span>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Couleurs sémantiques :{" "}
            <span className="font-medium text-success">succès</span>,{" "}
            <span className="font-medium text-warning">attention</span>,{" "}
            <span className="font-medium text-destructive">erreur</span>.
          </p>
        </div>
      </main>
    </div>
  );
}

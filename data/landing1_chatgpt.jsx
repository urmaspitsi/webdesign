export default function ElegantDarkLandingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "A clean starting point for individuals exploring the platform.",
      features: ["Core access", "Basic profile tools", "Community support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For professionals who want stronger control, speed, and polish.",
      features: ["Advanced tools", "Priority support", "Expanded usage limits"],
      highlight: true,
    },
    {
      name: "Max",
      price: "$79",
      description: "A premium tier for teams and power users with demanding workflows.",
      features: ["Everything in Pro", "Highest limits", "Dedicated onboarding"],
      highlight: false,
    },
  ];

  const sidebarItems = ["Overview", "Profiles", "Pricing", "Analytics", "Settings"];
  const topNavItems = ["Product", "Solutions", "Resources", "Enterprise"];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-zinc-800 bg-black/40 lg:flex lg:flex-col">
          <div className="border-b border-zinc-800 px-6 py-6">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Workspace</div>
            <div className="mt-2 text-xl font-semibold tracking-tight text-white">Northstar</div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {sidebarItems.map((item, idx) => (
                <button
                  key={item}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                    idx === 1
                      ? "bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200"
                  }`}
                >
                  <span>{item}</span>
                  <span className="text-xs text-zinc-600">0{idx + 1}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-zinc-800 p-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="text-sm font-medium text-white">Minimal design</div>
              <div className="mt-1 text-sm text-zinc-400">
                Refined layout with restrained tones and focused hierarchy.
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                  Menu
                </div>
                <div className="text-base font-semibold tracking-tight text-white">Northstar</div>
              </div>

              <nav className="hidden items-center gap-2 md:flex">
                {topNavItems.map((item, idx) => (
                  <a
                    key={item}
                    href="#"
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      idx === 0
                        ? "bg-zinc-900 text-zinc-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                        : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200"
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button className="hidden rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:text-white sm:block">
                  Sign in
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-zinc-100">U</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-10 sm:px-8 lg:px-10">
            <section className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
                  Pricing Overview
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Simple tiers designed with a premium, quiet aesthetic.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                  A dark, restrained landing experience built for clarity. Compare plans,
                  navigate quickly, and present your product with a professional visual tone.
                </p>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`group relative overflow-hidden rounded-[28px] border p-7 transition duration-300 ${
                      tier.highlight
                        ? "border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/20"
                        : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)] opacity-70" />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm uppercase tracking-[0.22em] text-zinc-500">
                            {tier.name}
                          </div>
                          <div className="mt-4 flex items-end gap-2">
                            <span className="text-4xl font-semibold tracking-tight text-white">
                              {tier.price}
                            </span>
                            <span className="pb-1 text-sm text-zinc-500">/ month</span>
                          </div>
                        </div>
                        {tier.highlight && (
                          <span className="rounded-full border border-zinc-700 bg-black/40 px-3 py-1 text-xs font-medium text-zinc-300">
                            Recommended
                          </span>
                        )}
                      </div>

                      <p className="mt-6 text-sm leading-6 text-zinc-400">{tier.description}</p>

                      <div className="mt-8 space-y-3">
                        {tier.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-black/20 px-4 py-3 text-sm text-zinc-300"
                          >
                            <div className="h-2 w-2 rounded-full bg-zinc-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        className={`mt-8 w-full rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          tier.highlight
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                        }`}
                      >
                        Choose {tier.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

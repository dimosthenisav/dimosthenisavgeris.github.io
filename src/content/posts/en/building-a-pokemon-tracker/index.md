---
title: "Building a Pokémon Tracker"
description: "Shipping a match-tracking app for Pokémon TCG Pocket in about 4 hours with Lovable — where AI tooling flew, where I still had to think like an engineer."
date: 2025-06-15
tags: ["product", "tools"]
toc: "side"
---

I've been playing the new **Pokémon TCG Pocket**, the digital version of the card game. But I kept losing track of my matches. Was my deck weak against certain types? Was I misplaying in late-game scenarios? So I decided to build a dedicated tool: [The Pokémon Tracker](https://pocket-trainer-journal.lovable.app/dashboard), and I used [Lovable](https://lovable.dev/) to ship it quickly (in 4h).

## Why I Built This

I needed a simple tool to:

- Log matches quickly (deck names, outcome, energy types)
- Check my win rates per deck (best / worst matchup)
- Compare my decks easily

### The Idea: Fill the Gaps the Game Doesn't

Pokémon TCG Pocket doesn't give players detailed performance insights. You can't filter games by deck. You can't see win rates per season. And you definitely can't export your data.

So I built that.

The app lets you:

- Log each match with your deck, opponent deck, outcome, energy type, notes, and season
- View win percentages per deck
- Filter results by season, deck, or both
- Export your data as CSV
- Use the app either as a guest (offline) or logged-in user (cloud sync via Supabase)

## How I Actually Built It: Prompts and Process

I didn't write any code from scratch. Everything was generated using AI tooling, mostly Lovable. My role was to guide the tools with clear, structured prompts, fix inconsistencies where needed, and make sure the product logic held together.

I've used Lovable and similar tools before, so I had a good sense of where things might break and how specific I had to be.

Here's what worked:

**Prompt:** *"Create a match tracker form with deck name, opponent deck, outcome (win/loss), energy type, notes, and date"*

> Lovable handled this well — it created a working form with modal support, validation, and state management. I didn't need to tweak much.

**Prompt:** *"Add filtering by season and deck in the dashboard"*

> This worked okay, but the logic needed improvements. I had to regenerate sections and adjust filters manually by rewording the prompts, like adding "useMemo for performance" or "handle edge cases like 'All Seasons'".

**Prompt:** *"Implement guest mode using localStorage and Supabase mode for authenticated users"*

> This was the hardest part. Lovable gave me a base setup, but I had to break the work down and guide the model step-by-step:
>
> - First, create two separate data sources
> - Then, unify their access using helper functions
> - Finally, add conditional rendering based on auth state

Even without hand-coding, I still had to think like an engineer, splitting problems into small chunks, spotting type mismatches, and rerunning generations when something didn't work.

So while I didn't write a single line of code manually, I still built the product, by shaping, prompting, and editing. And that's a useful skillset in itself.

### A Look at the Dashboard

One of the features I wanted as a player was clarity: *How well am I doing with each deck? What matchups are tricky?*

The dashboard is filterable by season and deck, and calculates win rates automatically. For example:

```javascript
const stats = useMemo(() => {
  const filtered = matches.filter((match) => {
    const seasonMatch = selectedSeason === "All Seasons" || match.season === selectedSeason;
    const deckMatch = selectedDeckFilter === "All Decks" || getDeckName(match, true) === selectedDeckFilter;
    return seasonMatch && deckMatch;
  });

  const total = filtered.length;
  const wins = filtered.filter(match => match.outcome === 'win').length;
  const winRate = total ? ((wins / total) * 100).toFixed(1) : '0.0';

  return { total, wins, winRate };
}, [matches, selectedSeason, selectedDeckFilter]);
```

What this means in practice: if you want to see how your Charizard deck did in Season 3, you just pick both filters. You immediately get a win rate and the breakdown. No need to remember what you played.

The official game doesn't offer this level of visibility.

### The Biggest Hurdle: Data Storage for Casual vs. Serious Users

![](./01-haunter.webp)

One product decision haunted me: *How do I let users try the app without forcing sign-ups, while still offering cloud saves for committed players?*

Forcing accounts would kill curiosity-driven testing. But relying solely on browser storage (`localStorage`) meant data could vanish if someone cleared their cache. The solution was a hybrid approach:

- **Guests** use `localStorage` for instant access.
- **Logged-in users** get cloud storage via [Supabase](https://supabase.com/) (connect it effortlessly via Lovable).

Making this seamless required a React hook to act as a "bridge" between the two systems. Here's the core logic:

```tsx
// This hook handles data storage based on login status
export function useMatchHistory() {
  const user = useUser(); // From Supabase
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch data from localStorage or Supabase
  useEffect(() => {
    const loadData = async () => {
      const data = user
        ? await fetchSupabaseMatches(user.id)
        : getLocalStorageMatches();
      setMatches(data);
    };
    loadData();
  }, [user]); // Re-run when user logs in/out

  // Save a match to the right place
  const addMatch = async (match: Match) => {
    const newMatch = user
      ? await saveToSupabase(match, user.id)
      : saveToLocalStorage(match);
    setMatches(prev => [newMatch, ...prev]);
  };

  return { matches, addMatch };
}
```

**Why this matters:**

- The `useEffect` hook automatically switches data sources when login status changes.
- The UI stays simple — it just displays `matches`, unaware of where they're stored.
- This kept the user experience smooth but required manual coding. Lovable couldn't connect the product logic to the technical implementation.

## Where Lovable Struggled (and Where It Helped)

**The Good:**

- **Rapid UI basics:** buttons, tables, and modals took minutes.
- **Supabase integration:** it created the API calls for authentication and database writes.
- **Instant previews:** seeing a working form early helped me iterate on the UX.
- **1-button releases:** just click "publish" and it's ready for production.

**What could be improved:**

- **Migration path for users.** Right now, if you start as a guest and then log in, your data doesn't carry over. I'd like to add a one-click "import guest history to your account" option.
- **Filtering logic was all client-side.** It worked because datasets are small. But for multi-user scale, I'd push analytics to Supabase with SQL views or edge functions.

## What I'd Do Differently

1. **Build what's good enough — not perfect.** The code isn't built for scale, and that's fine. The `localStorage` implementation doesn't account for limits or edge cases, but it works for the current use case: a personal tool or a lightweight public MVP. It's a reminder that functional now is better than overengineered later.
2. **Ship earlier, get feedback faster.** I shared the app late in the process. As soon as others used it, they pointed out things I'd missed: no way to log a draw, or mismatches in the win rate filters. If I had tested even one week earlier, I could've course-corrected faster. Lesson learned.

## Try the App (and Break It)

If you play Pokémon TCG Pocket, give the tracker a spin: [pocket-trainer-journal.lovable.app/dashboard](https://pocket-trainer-journal.lovable.app/dashboard)

It's not perfect. The UI is basic, and I'm sure there are bugs. But it's a start — a reminder that shipping beats perfection.

For PMs curious about AI tools: try building something small. You'll learn where the tools excel and where you'll still need to get your hands dirty (logic). And that's the real value: understanding the gaps between idea and execution.

**Keep iterating and stay curious!**

![](./02-pikachu.png)

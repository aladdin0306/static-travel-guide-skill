# static-travel-guide

Cursor / Agent Skill for building and maintaining **static travel-guide sites**: day-by-day itinerary, map pins, reservation flags, dual-currency budget, localStorage + JSON export, deploy on GitHub Pages.

Reference implementation: [aladdin0306/travel-guides](https://github.com/aladdin0306/travel-guides) · live [demo](https://aladdin0306.github.io/travel-guides/)

## Install

### Cursor (plugin)

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

Or copy the skill folder into your machine:

```bash
cp -R skills/static-travel-guide ~/.cursor/skills/
```

### gh skill (multi-agent)

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user
```

## What the skill does

When the user asks to create or edit a travel guide site, the agent should:

1. Prefer **vanilla HTML/CSS/JS** (no SPA framework unless asked)
2. Follow the trip / day / stop / budget schema in the skill
3. Use Leaflet (or equivalent) for map pins
4. Keep booking flags and budget visible early in the UI
5. Ship via GitHub Pages + optional `localStorage` + export/import JSON

## Repo layout

```text
static-travel-guide-skill/
├── .cursor-plugin/plugin.json
├── README.md
├── LICENSE
└── skills/
    └── static-travel-guide/
        ├── SKILL.md
        ├── reference.md
        └── examples.md
```

## Publish

```bash
git init
git add .
git commit -m "Initial static-travel-guide skill"
gh repo create aladdin0306/static-travel-guide-skill --public --source=. --remote=origin --push
gh skill publish --tag v1.0.0   # optional, if gh skill is available
```

Then submit to Cursor Marketplace if you want: https://cursor.com/marketplace/publish

## License

MIT

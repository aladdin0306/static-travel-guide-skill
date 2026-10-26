# static-travel-guide

Cursor / Agent Skill so **anyone** can generate **their own** travel itinerary (and optionally a static GitHub Pages guide site): days, map pins, booking flags, dual-currency budget, localStorage + JSON export.

The bundled **Australia** page under [`demo/`](demo/) is a **sample** of structure and quality — not a fixed destination. Agents should plan whatever trip the user asks for.

Full reference site: [aladdin0306/travel-guides](https://github.com/aladdin0306/travel-guides) · [live](https://aladdin0306.github.io/travel-guides/)

## Try the Australia demo

```bash
cd demo && python3 -m http.server 8767 --bind 127.0.0.1
# http://127.0.0.1:8767/
```

Or open the GitHub Pages demo after it is enabled on this repo:  
`https://aladdin0306.github.io/static-travel-guide-skill/demo/`

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

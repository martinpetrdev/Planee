// Written by Claude Code (Claude Opus 5.5)
// Fetches Lucide icons and converts them to Android VectorDrawables for <Icon />.
// Usage: pnpm --filter @repo/mobile-ui add-lucide-icon sparkles wand-sparkles
//
// @expo/ui's vector loader only supports filled paths (no strokes, no groups),
// so glyphs come from Lucide's icon font, where strokes are already outlined.
import { mkdirSync, writeFileSync } from "node:fs";

const VERSION = "0.460.0";
const OUT = new URL("../src/icons/lucide/", import.meta.url);

const res = await fetch(
	`https://unpkg.com/lucide-static@${VERSION}/font/lucide.svg`,
);
if (!res.ok) throw new Error(`Failed to fetch Lucide font (${res.status})`);
const font = await res.text();

for (const name of process.argv.slice(2)) {
	const glyph = font.match(
		new RegExp(`<glyph glyph-name="${name}"[^>]*?\\sd="([^"]+)"`),
	);
	if (!glyph) throw new Error(`Lucide icon "${name}" not found`);

	// Font units: 1000 per em, y axis points up. Glyphs only use absolute
	// M/L/C commands, so every second number is a y coordinate to flip.
	let i = 0;
	const pathData = glyph[1].replace(/-?[\d.]+(?:e-?\d+)?/g, (n) =>
		i++ % 2 ? +(1000 - n).toFixed(2) : +(+n).toFixed(2),
	);

	const xml = `<!-- lucide-static v${VERSION} ${name} - ISC -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="1000"
    android:viewportHeight="1000">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="${pathData}"/>
</vector>
`;
	const file = name.replaceAll("-", "_");
	mkdirSync(OUT, { recursive: true });
	writeFileSync(new URL(`${file}.xml`, OUT), xml);
	console.log(`\t${file}: require("./lucide/${file}.xml"),`);
}

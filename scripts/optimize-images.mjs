// Skalerer ned og konverterer prosjektbildene til WebP.
//
// Originalene (4K JPEG) beholdes urørt i assets/project-originals (utenfor
// public/, så de ikke deployes) slik at vi alltid kan re-eksportere. De
// optimaliserte WebP-filene legges i public/projects og er det nettstedet
// faktisk laster. Kortene vises aldri bredere enn ~500px, så 1600px gir
// skarpe bilder selv på 2–3x DPR mens filstørrelsen faller ~85 %.
import { readdir, mkdir, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "projects");
const ORIGINALS = path.join(process.cwd(), "assets", "project-originals");
const MAX_WIDTH = 1600;
const QUALITY = 80;

async function main() {
  await mkdir(ORIGINALS, { recursive: true });
  await mkdir(DIR, { recursive: true });

  // First run: originals live in public/projects and get moved to the stash.
  // Re-runs: originals already in the stash, so re-encode straight from there.
  const fresh = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const file of fresh) {
    const stash = path.join(ORIGINALS, file);
    if (!existsSync(stash)) await rename(path.join(DIR, file), stash);
  }

  const files = (await readdir(ORIGINALS)).filter((f) =>
    /\.(jpe?g|png)$/i.test(f),
  );
  if (!files.length) {
    console.log("Ingen originaler å optimalisere i", ORIGINALS);
    return;
  }

  for (const file of files) {
    const stash = path.join(ORIGINALS, file);
    const out = path.join(DIR, file.replace(/\.(jpe?g|png)$/i, ".webp"));
    await sharp(stash)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);

    const before = (await stat(stash)).size;
    const after = (await stat(out)).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(
      `${file} → ${path.basename(out)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (-${pct}%)`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

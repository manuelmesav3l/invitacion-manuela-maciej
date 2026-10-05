// Temporary asset extraction from the design mockups (replace with hi-res originals).
import sharp from 'sharp'
const SRC = process.argv[2]
const OUT = 'public/assets'
const raw = async (p) => {
  const { data, info } = await sharp(p).flatten({ background: '#F8F5EE' }).raw().toBuffer({ resolveWithObject: true })
  return { data, w: info.width, h: info.height }
}
const save = (data, w, h, name, q = 86) => sharp(data, { raw: { width: w, height: h, channels: 3 } }).webp({ quality: q }).toFile(`${OUT}/${name}`)

// ---- Hero: strip the baked green names by in-painting green-dominant pixels
{
  const { data, w, h } = await raw(`${SRC}/1.png`)
  const mask = new Uint8Array(w * h)
  for (let y = 285; y < 530; y++) for (let x = 415; x < 975; x++) {
    const i = (y * w + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2]
    if (g > r + 6 && g > b + 10 && r < 150) mask[y * w + x] = 1
  }
  // dilate
  const d = new Uint8Array(mask)
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) if (mask[y * w + x])
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) d[(y + dy) * w + x + dx] = 1
  const out = Buffer.from(data)
  for (let y = 283; y < 532; y++) for (let x = 413; x < 977; x++) if (d[y * w + x]) {
    let rs = 0, gs = 0, bs = 0, n = 0
    for (let R = 3; R < 16 && n < 4; R += 3) {
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx, yy = y + dy
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== R || d[yy * w + xx]) continue
        const j = (yy * w + xx) * 3; rs += data[j]; gs += data[j + 1]; bs += data[j + 2]; n++
      }
    }
    const i = (y * w + x) * 3
    if (n) { out[i] = rs / n; out[i + 1] = gs / n; out[i + 2] = bs / n }
  }
  const box = { left: 0, top: 88, width: 980, height: 655 }
  await sharp(out, { raw: { width: w, height: h, channels: 3 } }).extract(box).webp({ quality: 88 }).toFile(`${OUT}/hero-couple.webp`)
}
// ---- Venue illustration + logo
{
  const { data, w, h } = await raw(`${SRC}/2.png`)
  const ex = (l, t, ww, hh, name) => sharp(data, { raw: { width: w, height: h, channels: 3 } }).extract({ left: l, top: t, width: ww, height: hh }).webp({ quality: 88 }).toFile(`${OUT}/${name}`)
  await ex(330, 275, 720, 505, 'venue-illustration.webp')
  await ex(455, 780, 460, 160, 'venue-logo.webp')
  const s = await sharp(data, { raw: { width: w, height: h, channels: 3 } }).extract({ left: 5, top: 5, width: 1, height: 1 }).raw().toBuffer()
  console.log('venue bg', [...s])
}
// ---- Dress code collage (paint out swatch circles; they are rebuilt in HTML)
{
  const { data, w, h } = await raw(`${SRC}/4.png`)
  const bgI = (5 * w + 600) * 3
  const bg = [data[bgI], data[bgI + 1], data[bgI + 2]]
  const out = Buffer.from(data)
  for (const cx of [585, 673, 763, 852, 942, 1031]) for (let y = 882; y < 958; y++) for (let x = cx - 44; x < cx + 44; x++)
    if ((x - cx) ** 2 + (y - 910) ** 2 < 43 ** 2) { const i = (y * w + x) * 3; out[i] = bg[0]; out[i + 1] = bg[1]; out[i + 2] = bg[2] }
  await sharp(out, { raw: { width: w, height: h, channels: 3 } }).extract({ left: 170, top: 265, width: 910, height: 695 }).webp({ quality: 88 }).toFile(`${OUT}/dress-her-collage.webp`)
  console.log('dress bg', bg)
}
// ---- OG image
await sharp(`${OUT}/hero-couple.webp`).resize(1200, 630, { fit: 'contain', background: '#F8F5EE' }).jpeg({ quality: 82 }).toFile(`${OUT}/og-image.jpg`)

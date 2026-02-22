#!/usr/bin/env node
/**
 * Konversi gambar PNG/JPG di web/public dan web/src/assets ke WebP.
 * Menulis file .webp di samping asli. Jalankan: npm run optimize:images
 * Memerlukan: npm install -D sharp
 */
import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dirs = [join(root, 'public'), join(root, 'src', 'assets')]
const exts = new Set(['.png', '.jpg', '.jpeg'])

async function findImages(dir, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = join(dir, e.name)
      if (e.isDirectory()) await findImages(full, files)
      else if (exts.has(extname(e.name).toLowerCase())) files.push(full)
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  return files
}

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('sharp not found. Run: npm install -D sharp')
    process.exit(1)
  }

  const images = []
  for (const d of dirs) {
    await findImages(d, images)
  }
  if (images.length === 0) {
    console.log('No PNG/JPG images found in public/ or src/assets/.')
    return
  }

  for (const fp of images) {
    const out = fp.replace(/\.(png|jpe?g)$/i, '.webp')
    try {
      await sharp(fp)
        .webp({ quality: 85 })
        .toFile(out)
      console.log(`Created ${out}`)
    } catch (err) {
      console.error(`Error ${fp}:`, err.message)
    }
  }
}

main()

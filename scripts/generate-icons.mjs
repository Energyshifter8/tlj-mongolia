// scripts/generate-icons.mjs
// Generates simple solid-color PWA icons (gold on near-black)
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import zlib from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

function crc32(buf) {
  let c = 0xffffffff
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let v = n
    for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1
    table[n] = v
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeAndData = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData))
  return Buffer.concat([len, typeAndData, crc])
}

function createPNG(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: RGB
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Build raw image data (RGB, filter byte 0 per row)
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3)
    raw[rowStart] = 0 // no filter
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3
      // Simple circle with "TLJ" letter shapes
      const cx = width / 2
      const cy = height / 2
      const dx = (x - cx) / (width / 2)
      const dy = (y - cy) / (height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 0.85) {
        // Inside circle — gold accent
        raw[px] = r
        raw[px + 1] = g
        raw[px + 2] = b
      } else {
        // Outside — near-black
        raw[px] = 10
        raw[px + 1] = 9
        raw[px + 2] = 8
      }
    }
  }

  const compressed = zlib.deflateSync(raw)

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const sizes = [192, 512]
for (const size of sizes) {
  const png = createPNG(size, size, 201, 162, 75) // #c9a24b
  const filePath = join(outDir, `icon-${size}.png`)
  writeFileSync(filePath, png)
  console.log(`Created ${filePath} (${png.length} bytes)`)
}

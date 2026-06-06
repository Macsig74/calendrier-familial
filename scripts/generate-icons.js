/* eslint-disable @typescript-eslint/no-require-imports */
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    table[i] = c
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

function generateSolidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 2  // RGB color type
  // compression, filter, interlace = 0

  // Raw rows: filter byte (0) + RGB
  const rowSize = 1 + size * 3
  const raw = Buffer.alloc(size * rowSize)
  for (let row = 0; row < size; row++) {
    const base = row * rowSize
    raw[base] = 0  // filter: None
    for (let col = 0; col < size; col++) {
      const px = base + 1 + col * 3
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 6 })

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = path.join(__dirname, '..', 'public')

// Slate-800: #1e293b → rgb(30, 41, 59)
const png192 = generateSolidPNG(192, 30, 41, 59)
const png512 = generateSolidPNG(512, 30, 41, 59)

fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192)
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512)

console.log('✓ icon-192.png and icon-512.png generated in public/')

import { mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)

const OUTPUT_DIRECTORY = path.join(__dirname, 'out')

await mkdir(OUTPUT_DIRECTORY, { recursive: true })

function * combinations<T> (size: number, items: T[]): Iterable<T[]> {
  if (size === 0) {
    yield []

    return
  }

  for (const rest of combinations(size - 1, items)) {
    for (const item of items) {
      yield [item, ...rest]
    }
  }
}

const CHANNELS = 3

for (let i = 1; i < 5; i++) {
  const states = Array.from({ length: i + 1 }, (_, index) => Buffer.from([(index / i) * 0xFF]))

  const buffers: Buffer[] = []

  for (const combination of combinations(CHANNELS, states)) {
    const buffer = Buffer.concat(combination)

    buffers.push(buffer)
  }

  const buffer = Buffer.concat(buffers)

  const size = buffer.length / CHANNELS

  const height = i + 1

  const width = size / height

  const file = path.join(OUTPUT_DIRECTORY, `${i}.png`)

  await sharp(buffer, {
    raw: {
      width,
      height,
      channels: CHANNELS
    }
  })
    .toFile(file)
}

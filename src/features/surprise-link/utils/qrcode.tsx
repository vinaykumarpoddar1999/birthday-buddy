import Svg, { Rect } from 'react-native-svg';

const QR_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

function encodeNumeric(data: string): number[] {
  const bits: number[] = [];
  for (let i = 0; i < data.length; i += 3) {
    const chunk = data.slice(i, i + 3);
    const value = parseInt(chunk, 10);
    const bitCount = chunk.length * 3 + 1;
    for (let b = bitCount - 1; b >= 0; b -= 1) {
      bits.push((value >> b) & 1);
    }
  }
  return bits;
}

function createMatrix(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array(size).fill(false));
}

function placeFinderPattern(matrix: boolean[][], row: number, col: number): void {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || cc < 0 || rr >= matrix.length || cc >= matrix.length) continue;
      const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
      matrix[rr][cc] = inOuter && (isBorder || inInner);
    }
  }
}

function generateQrMatrix(data: string): boolean[][] {
  const size = 21;
  const matrix = createMatrix(size);
  placeFinderPattern(matrix, 0, 0);
  placeFinderPattern(matrix, size - 7, 0);
  placeFinderPattern(matrix, 0, size - 7);

  const bits = encodeNumeric(
    String(data.length).padStart(2, '0') + data.replace(/[^0-9A-Za-z]/g, '0').slice(0, 20),
  );
  let bitIdx = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let row = 0; row < size; row += 1) {
      for (let c = 0; c < 2; c += 1) {
        const cc = col - c;
        if (matrix[row][cc]) continue;
        if (bitIdx < bits.length) {
          matrix[row][cc] = bits[bitIdx] === 1;
          bitIdx += 1;
        } else {
          matrix[row][cc] = (row + cc) % 2 === 0;
        }
      }
    }
  }
  return matrix;
}

interface QrCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function QrCodeDisplay({
  value,
  size = 160,
  color = '#111827',
  backgroundColor = '#FFFFFF',
}: QrCodeProps) {
  const matrix = generateQrMatrix(value);
  const moduleCount = matrix.length;
  const moduleSize = size / moduleCount;

  return (
    <Svg width={size} height={size}>
      <Rect x={0} y={0} width={size} height={size} fill={backgroundColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <Rect
              key={`${r}-${c}`}
              x={c * moduleSize}
              y={r * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={color}
            />
          ) : null,
        ),
      )}
    </Svg>
  );
}

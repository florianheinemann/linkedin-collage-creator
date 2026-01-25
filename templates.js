/**
 * Collage Templates for LinkedIn Collage Creator
 * All dimensions are in pixels for a 1200x1200 canvas
 * Border width is applied between regions
 */

const CANVAS_SIZE = 1200;
const BORDER_WIDTH = 8;

const TEMPLATES = [
  // Template 1: Hero Left (3-4 images)
  {
    id: 'hero-left',
    name: 'Hero Left',
    minImages: 3,
    maxImages: 4,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const leftWidth = 700;
      const rightWidth = CANVAS_SIZE - leftWidth - b;
      const angleOffset = 60; // Diagonal offset for angled separator

      const regions = [
        // Region 1: Large left hero (angled right edge)
        // Bounds extend to cover the full angled clip area
        {
          clip: [
            { x: 0, y: 0 },
            { x: leftWidth + angleOffset, y: 0 },
            { x: leftWidth - angleOffset, y: CANVAS_SIZE },
            { x: 0, y: CANVAS_SIZE }
          ],
          bounds: { x: 0, y: 0, w: leftWidth + angleOffset, h: CANVAS_SIZE }
        }
      ];

      const rightCount = imageCount - 1;
      const rightHeight = (CANVAS_SIZE - (rightCount - 1) * b) / rightCount;

      for (let i = 0; i < rightCount; i++) {
        const y = i * (rightHeight + b);
        const topAngle = leftWidth + angleOffset - (angleOffset * 2 * y / CANVAS_SIZE);
        const bottomAngle = leftWidth + angleOffset - (angleOffset * 2 * (y + rightHeight) / CANVAS_SIZE);
        const minX = Math.min(topAngle, bottomAngle) + b;

        regions.push({
          clip: [
            { x: topAngle + b, y: y },
            { x: CANVAS_SIZE, y: y },
            { x: CANVAS_SIZE, y: y + rightHeight },
            { x: bottomAngle + b, y: y + rightHeight }
          ],
          bounds: { x: minX, y: y, w: CANVAS_SIZE - minX, h: rightHeight }
        });
      }

      return regions;
    }
  },

  // Template 2: Hero Top (3-5 images)
  {
    id: 'hero-top',
    name: 'Hero Top',
    minImages: 3,
    maxImages: 5,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const heroHeight = 600;
      const bottomHeight = CANVAS_SIZE - heroHeight - b;
      const angleOffset = 40;

      const regions = [
        // Region 1: Large top hero (angled bottom edge)
        // Bounds extend to cover the full angled clip area
        {
          clip: [
            { x: 0, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: heroHeight - angleOffset },
            { x: 0, y: heroHeight + angleOffset }
          ],
          bounds: { x: 0, y: 0, w: CANVAS_SIZE, h: heroHeight + angleOffset }
        }
      ];

      const bottomCount = imageCount - 1;
      const cols = Math.min(bottomCount, 2);
      const rows = Math.ceil(bottomCount / cols);
      const cellWidth = (CANVAS_SIZE - (cols - 1) * b) / cols;
      const cellHeight = (bottomHeight - (rows - 1) * b) / rows;

      for (let i = 0; i < bottomCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * (cellWidth + b);
        const y = heroHeight + b + row * (cellHeight + b);

        // Calculate angled top for first row, straight top for other rows
        const topY1 = row === 0 ? heroHeight + angleOffset - (angleOffset * 2 * x / CANVAS_SIZE) + b : y;
        const topY2 = row === 0 ? heroHeight + angleOffset - (angleOffset * 2 * (x + cellWidth) / CANVAS_SIZE) + b : y;
        const minY = Math.min(topY1, topY2);

        regions.push({
          clip: [
            { x: x, y: topY1 },
            { x: x + cellWidth, y: topY2 },
            { x: x + cellWidth, y: y + cellHeight },
            { x: x, y: y + cellHeight }
          ],
          bounds: { x: x, y: minY, w: cellWidth, h: y + cellHeight - minY }
        });
      }

      return regions;
    }
  },

  // Template 3: Diagonal Split (3-4 images)
  {
    id: 'diagonal-split',
    name: 'Diagonal Split',
    minImages: 3,
    maxImages: 4,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const splitY = 750;
      const diagonalOffset = 300;

      // Calculate diagonal gap to achieve visually consistent border width
      // Diagonal slope = splitY / (diagonalOffset * 2) = 750/600 = 1.25
      // For perpendicular gap of b, horizontal offset = b * sqrt(1 + slope²) ≈ b * 1.6
      const diagGap = Math.round(b * 1.6);

      const diagTopLeft = CANVAS_SIZE - diagonalOffset;
      const diagBottomLeft = diagonalOffset;
      const diagTopRight = diagTopLeft + diagGap;
      const diagBottomRight = diagBottomLeft + diagGap;

      const regions = [
        // Region 1: Top-left hero
        {
          clip: [
            { x: 0, y: 0 },
            { x: diagTopLeft, y: 0 },
            { x: diagBottomLeft, y: splitY },
            { x: 0, y: splitY }
          ],
          bounds: { x: 0, y: 0, w: diagTopLeft, h: splitY }
        },
        // Region 2: Top-right hero
        {
          clip: [
            { x: diagTopRight, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: splitY },
            { x: diagBottomRight, y: splitY }
          ],
          bounds: { x: diagBottomRight, y: 0, w: CANVAS_SIZE - diagBottomRight, h: splitY }
        }
      ];

      const bottomCount = imageCount - 2;
      const cellWidth = (CANVAS_SIZE - (bottomCount - 1) * b) / bottomCount;
      const bottomHeight = CANVAS_SIZE - splitY - b;

      for (let i = 0; i < bottomCount; i++) {
        const x = i * (cellWidth + b);
        regions.push({
          clip: [
            { x: x, y: splitY + b },
            { x: x + cellWidth, y: splitY + b },
            { x: x + cellWidth, y: CANVAS_SIZE },
            { x: x, y: CANVAS_SIZE }
          ],
          bounds: { x: x, y: splitY + b, w: cellWidth, h: bottomHeight }
        });
      }

      return regions;
    }
  },

  // Template 3b: Diagonal Split Subtle (3-4 images) - less extreme angle
  {
    id: 'diagonal-split-subtle',
    name: 'Diagonal Subtle',
    minImages: 3,
    maxImages: 4,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const splitY = 750;
      const diagonalOffset = 480; // Gentler angle than standard (300)

      // Calculate diagonal gap for visually consistent border width
      const slope = splitY / (diagonalOffset * 2);
      const diagGap = Math.round(b * Math.sqrt(1 + slope * slope));

      const diagTopLeft = CANVAS_SIZE - diagonalOffset;
      const diagBottomLeft = diagonalOffset;
      const diagTopRight = diagTopLeft + diagGap;
      const diagBottomRight = diagBottomLeft + diagGap;

      const regions = [
        // Region 1: Top-left hero
        {
          clip: [
            { x: 0, y: 0 },
            { x: diagTopLeft, y: 0 },
            { x: diagBottomLeft, y: splitY },
            { x: 0, y: splitY }
          ],
          bounds: { x: 0, y: 0, w: diagTopLeft, h: splitY }
        },
        // Region 2: Top-right hero
        {
          clip: [
            { x: diagTopRight, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: splitY },
            { x: diagBottomRight, y: splitY }
          ],
          bounds: { x: diagBottomRight, y: 0, w: CANVAS_SIZE - diagBottomRight, h: splitY }
        }
      ];

      const bottomCount = imageCount - 2;
      const cellWidth = (CANVAS_SIZE - (bottomCount - 1) * b) / bottomCount;
      const bottomHeight = CANVAS_SIZE - splitY - b;

      for (let i = 0; i < bottomCount; i++) {
        const x = i * (cellWidth + b);
        regions.push({
          clip: [
            { x: x, y: splitY + b },
            { x: x + cellWidth, y: splitY + b },
            { x: x + cellWidth, y: CANVAS_SIZE },
            { x: x, y: CANVAS_SIZE }
          ],
          bounds: { x: x, y: splitY + b, w: cellWidth, h: bottomHeight }
        });
      }

      return regions;
    }
  },

  // Template 3c: Diagonal Split Double (4 images) - angled top and bottom separators
  {
    id: 'diagonal-split-double',
    name: 'Diagonal Double',
    minImages: 4,
    maxImages: 4,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const splitY = 700;
      const diagonalOffset = 450; // Gentler angle

      // Calculate diagonal gap for visually consistent border width
      const slope = splitY / (diagonalOffset * 2);
      const diagGap = Math.round(b * Math.sqrt(1 + slope * slope));

      // Top diagonal: left-to-right downward slope
      const topDiagTopLeft = CANVAS_SIZE - diagonalOffset;
      const topDiagBottomLeft = diagonalOffset;
      const topDiagTopRight = topDiagTopLeft + diagGap;
      const topDiagBottomRight = topDiagBottomLeft + diagGap;

      // Bottom diagonal: opposite direction (right-to-left downward slope)
      const bottomHeight = CANVAS_SIZE - splitY - b;
      const bottomDiagOffset = 450; // Gentler angle, opposite direction
      const bottomSlope = bottomHeight / (bottomDiagOffset * 2);
      const bottomDiagGap = Math.round(b * Math.sqrt(1 + bottomSlope * bottomSlope));

      const regions = [
        // Region 1: Top-left hero
        {
          clip: [
            { x: 0, y: 0 },
            { x: topDiagTopLeft, y: 0 },
            { x: topDiagBottomLeft, y: splitY },
            { x: 0, y: splitY }
          ],
          bounds: { x: 0, y: 0, w: topDiagTopLeft, h: splitY }
        },
        // Region 2: Top-right hero
        {
          clip: [
            { x: topDiagTopRight, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: splitY },
            { x: topDiagBottomRight, y: splitY }
          ],
          bounds: { x: topDiagBottomRight, y: 0, w: CANVAS_SIZE - topDiagBottomRight, h: splitY }
        },
        // Region 3: Bottom-left (opposite angle)
        {
          clip: [
            { x: 0, y: splitY + b },
            { x: bottomDiagOffset, y: splitY + b },
            { x: CANVAS_SIZE - bottomDiagOffset, y: CANVAS_SIZE },
            { x: 0, y: CANVAS_SIZE }
          ],
          bounds: { x: 0, y: splitY + b, w: CANVAS_SIZE - bottomDiagOffset, h: bottomHeight }
        },
        // Region 4: Bottom-right (opposite angle)
        {
          clip: [
            { x: bottomDiagOffset + bottomDiagGap, y: splitY + b },
            { x: CANVAS_SIZE, y: splitY + b },
            { x: CANVAS_SIZE, y: CANVAS_SIZE },
            { x: CANVAS_SIZE - bottomDiagOffset + bottomDiagGap, y: CANVAS_SIZE }
          ],
          bounds: { x: bottomDiagOffset + bottomDiagGap, y: splitY + b, w: CANVAS_SIZE - bottomDiagOffset - bottomDiagGap, h: bottomHeight }
        }
      ];

      return regions;
    }
  },

  // Template 3d: Kralle (6 images) - 2 rows, 3 columns with angled vertical separators
  {
    id: 'kralle',
    name: 'Kralle',
    minImages: 6,
    maxImages: 6,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const splitY = 600; // Horizontal row split
      const angleOffset = 80; // How much the vertical separators angle inward at the middle

      // Column base positions at the horizontal split
      const col1Mid = 400;
      const col2Mid = 800;

      // Top row: angles point RIGHT (line goes from wider at top to narrower at middle)
      const col1Top = col1Mid + angleOffset; // At y=0, shifted RIGHT
      const col2Top = col2Mid + angleOffset; // At y=0, shifted RIGHT

      // Bottom row: angles point RIGHT (line goes from narrower at middle to wider at bottom)
      const col1Bot = col1Mid + angleOffset; // At y=CANVAS_SIZE, shifted RIGHT
      const col2Bot = col2Mid + angleOffset; // At y=CANVAS_SIZE, shifted RIGHT

      const regions = [
        // Top-left cell: right edge points right (wider at top, narrower at middle)
        {
          clip: [
            { x: 0, y: 0 },
            { x: col1Top, y: 0 },
            { x: col1Mid, y: splitY },
            { x: 0, y: splitY }
          ],
          bounds: { x: 0, y: 0, w: col1Top, h: splitY }
        },
        // Top-middle cell
        {
          clip: [
            { x: col1Top + b, y: 0 },
            { x: col2Top, y: 0 },
            { x: col2Mid, y: splitY },
            { x: col1Mid + b, y: splitY }
          ],
          bounds: { x: col1Mid + b, y: 0, w: col2Top - col1Mid - b, h: splitY }
        },
        // Top-right cell
        {
          clip: [
            { x: col2Top + b, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: splitY },
            { x: col2Mid + b, y: splitY }
          ],
          bounds: { x: col2Mid + b, y: 0, w: CANVAS_SIZE - col2Mid - b, h: splitY }
        },
        // Bottom-left cell
        {
          clip: [
            { x: 0, y: splitY + b },
            { x: col1Mid, y: splitY + b },
            { x: col1Bot, y: CANVAS_SIZE },
            { x: 0, y: CANVAS_SIZE }
          ],
          bounds: { x: 0, y: splitY + b, w: col1Bot, h: CANVAS_SIZE - splitY - b }
        },
        // Bottom-middle cell
        {
          clip: [
            { x: col1Mid + b, y: splitY + b },
            { x: col2Mid, y: splitY + b },
            { x: col2Bot, y: CANVAS_SIZE },
            { x: col1Bot + b, y: CANVAS_SIZE }
          ],
          bounds: { x: col1Mid + b, y: splitY + b, w: col2Bot - col1Mid - b, h: CANVAS_SIZE - splitY - b }
        },
        // Bottom-right cell
        {
          clip: [
            { x: col2Mid + b, y: splitY + b },
            { x: CANVAS_SIZE, y: splitY + b },
            { x: CANVAS_SIZE, y: CANVAS_SIZE },
            { x: col2Bot + b, y: CANVAS_SIZE }
          ],
          bounds: { x: col2Mid + b, y: splitY + b, w: CANVAS_SIZE - col2Mid - b, h: CANVAS_SIZE - splitY - b }
        }
      ];

      return regions;
    }
  },

  // Template 4: Dynamic Grid (5-6 images)
  {
    id: 'dynamic-grid',
    name: 'Dynamic Grid',
    minImages: 5,
    maxImages: 6,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const midX = CANVAS_SIZE / 2;
      const topHeight = 500;
      const midHeight = 350;
      const bottomHeight = CANVAS_SIZE - topHeight - midHeight - 2 * b;
      const angleOffset = 50;

      const regions = [
        // Region 1: Top-left
        {
          clip: [
            { x: 0, y: 0 },
            { x: midX - b / 2, y: 0 },
            { x: midX - b / 2, y: topHeight },
            { x: 0, y: topHeight }
          ],
          bounds: { x: 0, y: 0, w: midX - b / 2, h: topHeight }
        },
        // Region 2: Top-right
        {
          clip: [
            { x: midX + b / 2, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: topHeight },
            { x: midX + b / 2, y: topHeight }
          ],
          bounds: { x: midX + b / 2, y: 0, w: midX - b / 2, h: topHeight }
        }
      ];

      if (imageCount >= 4) {
        // Middle row with angled separator
        const midY = topHeight + b;
        regions.push(
          // Region 3: Middle-left
          // Bounds extend to cover the full angled clip area
          {
            clip: [
              { x: 0, y: midY },
              { x: midX + angleOffset, y: midY },
              { x: midX - angleOffset, y: midY + midHeight },
              { x: 0, y: midY + midHeight }
            ],
            bounds: { x: 0, y: midY, w: midX + angleOffset, h: midHeight }
          },
          // Region 4: Middle-right
          // Bounds start at the leftmost point of the angled clip
          {
            clip: [
              { x: midX + angleOffset + b, y: midY },
              { x: CANVAS_SIZE, y: midY },
              { x: CANVAS_SIZE, y: midY + midHeight },
              { x: midX - angleOffset + b, y: midY + midHeight }
            ],
            bounds: { x: midX - angleOffset + b, y: midY, w: CANVAS_SIZE - midX + angleOffset - b, h: midHeight }
          }
        );
      }

      if (imageCount >= 5) {
        const bottomY = topHeight + midHeight + 2 * b;
        const bottomCols = imageCount - 4;
        const cellWidth = (CANVAS_SIZE - (bottomCols - 1) * b) / bottomCols;

        for (let i = 0; i < bottomCols; i++) {
          const x = i * (cellWidth + b);
          regions.push({
            clip: [
              { x: x, y: bottomY },
              { x: x + cellWidth, y: bottomY },
              { x: x + cellWidth, y: CANVAS_SIZE },
              { x: x, y: CANVAS_SIZE }
            ],
            bounds: { x: x, y: bottomY, w: cellWidth, h: bottomHeight }
          });
        }
      }

      return regions;
    }
  }
];

/**
 * Get templates that support the given number of images
 */
function getCompatibleTemplates(imageCount) {
  return TEMPLATES.filter(t => imageCount >= t.minImages && imageCount <= t.maxImages);
}

/**
 * Get template by ID
 */
function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id);
}

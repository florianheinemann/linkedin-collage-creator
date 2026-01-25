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
        {
          clip: [
            { x: 0, y: 0 },
            { x: leftWidth + angleOffset, y: 0 },
            { x: leftWidth - angleOffset, y: CANVAS_SIZE },
            { x: 0, y: CANVAS_SIZE }
          ],
          bounds: { x: 0, y: 0, w: leftWidth, h: CANVAS_SIZE }
        }
      ];

      const rightCount = imageCount - 1;
      const rightHeight = (CANVAS_SIZE - (rightCount - 1) * b) / rightCount;

      for (let i = 0; i < rightCount; i++) {
        const y = i * (rightHeight + b);
        const topAngle = leftWidth + angleOffset - (angleOffset * 2 * y / CANVAS_SIZE);
        const bottomAngle = leftWidth + angleOffset - (angleOffset * 2 * (y + rightHeight) / CANVAS_SIZE);

        regions.push({
          clip: [
            { x: topAngle + b, y: y },
            { x: CANVAS_SIZE, y: y },
            { x: CANVAS_SIZE, y: y + rightHeight },
            { x: bottomAngle + b, y: y + rightHeight }
          ],
          bounds: { x: leftWidth + b, y: y, w: rightWidth, h: rightHeight }
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
        {
          clip: [
            { x: 0, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: heroHeight - angleOffset },
            { x: 0, y: heroHeight + angleOffset }
          ],
          bounds: { x: 0, y: 0, w: CANVAS_SIZE, h: heroHeight }
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

        // Calculate angled top for first row
        const topY = row === 0 ? heroHeight + angleOffset - (angleOffset * 2 * (x + cellWidth / 2) / CANVAS_SIZE) : y;
        const topY2 = row === 0 ? heroHeight + angleOffset - (angleOffset * 2 * (x + cellWidth) / CANVAS_SIZE) : y;
        const topY1 = row === 0 ? heroHeight + angleOffset - (angleOffset * 2 * x / CANVAS_SIZE) : y;

        regions.push({
          clip: [
            { x: x, y: topY1 + b },
            { x: x + cellWidth, y: topY2 + b },
            { x: x + cellWidth, y: y + cellHeight },
            { x: x, y: y + cellHeight }
          ],
          bounds: { x: x, y: y, w: cellWidth, h: cellHeight }
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

      const regions = [
        // Region 1: Top-left hero
        {
          clip: [
            { x: 0, y: 0 },
            { x: CANVAS_SIZE - diagonalOffset, y: 0 },
            { x: diagonalOffset, y: splitY - b / 2 },
            { x: 0, y: splitY - b / 2 }
          ],
          bounds: { x: 0, y: 0, w: CANVAS_SIZE - diagonalOffset, h: splitY }
        },
        // Region 2: Top-right hero
        {
          clip: [
            { x: CANVAS_SIZE - diagonalOffset + b * 2, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: splitY - b / 2 },
            { x: diagonalOffset + b * 2, y: splitY - b / 2 }
          ],
          bounds: { x: diagonalOffset, y: 0, w: CANVAS_SIZE - diagonalOffset, h: splitY }
        }
      ];

      const bottomCount = imageCount - 2;
      const cellWidth = (CANVAS_SIZE - (bottomCount - 1) * b) / bottomCount;
      const bottomHeight = CANVAS_SIZE - splitY - b;

      for (let i = 0; i < bottomCount; i++) {
        const x = i * (cellWidth + b);
        regions.push({
          clip: [
            { x: x, y: splitY + b / 2 },
            { x: x + cellWidth, y: splitY + b / 2 },
            { x: x + cellWidth, y: CANVAS_SIZE },
            { x: x, y: CANVAS_SIZE }
          ],
          bounds: { x: x, y: splitY + b, w: cellWidth, h: bottomHeight }
        });
      }

      return regions;
    }
  },

  // Template 4: Dynamic Grid (4-6 images)
  {
    id: 'dynamic-grid',
    name: 'Dynamic Grid',
    minImages: 4,
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
          {
            clip: [
              { x: 0, y: midY },
              { x: midX + angleOffset, y: midY },
              { x: midX - angleOffset, y: midY + midHeight },
              { x: 0, y: midY + midHeight }
            ],
            bounds: { x: 0, y: midY, w: midX, h: midHeight }
          },
          // Region 4: Middle-right
          {
            clip: [
              { x: midX + angleOffset + b, y: midY },
              { x: CANVAS_SIZE, y: midY },
              { x: CANVAS_SIZE, y: midY + midHeight },
              { x: midX - angleOffset + b, y: midY + midHeight }
            ],
            bounds: { x: midX, y: midY, w: midX, h: midHeight }
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
  },

  // Template 5: Mosaic (5-6 images)
  {
    id: 'mosaic',
    name: 'Mosaic',
    minImages: 5,
    maxImages: 6,
    getRegions: (imageCount) => {
      const b = BORDER_WIDTH;
      const leftColWidth = 350;
      const rightColWidth = CANVAS_SIZE - leftColWidth - b;
      const leftRows = 3;
      const leftCellHeight = (CANVAS_SIZE - 200 - (leftRows - 1) * b) / leftRows;
      const heroHeight = leftCellHeight * 2 + b;
      const angleOffset = 30;

      const regions = [
        // Region 1: Left top
        {
          clip: [
            { x: 0, y: 0 },
            { x: leftColWidth + angleOffset, y: 0 },
            { x: leftColWidth - angleOffset, y: leftCellHeight },
            { x: 0, y: leftCellHeight }
          ],
          bounds: { x: 0, y: 0, w: leftColWidth, h: leftCellHeight }
        },
        // Region 2: Right hero (big)
        {
          clip: [
            { x: leftColWidth + angleOffset + b, y: 0 },
            { x: CANVAS_SIZE, y: 0 },
            { x: CANVAS_SIZE, y: heroHeight },
            { x: leftColWidth + b, y: heroHeight }
          ],
          bounds: { x: leftColWidth + b, y: 0, w: rightColWidth, h: heroHeight }
        },
        // Region 3: Left middle
        {
          clip: [
            { x: 0, y: leftCellHeight + b },
            { x: leftColWidth - angleOffset + b, y: leftCellHeight + b },
            { x: leftColWidth + angleOffset - b, y: leftCellHeight * 2 + b },
            { x: 0, y: leftCellHeight * 2 + b }
          ],
          bounds: { x: 0, y: leftCellHeight + b, w: leftColWidth, h: leftCellHeight }
        },
        // Region 4: Left bottom
        {
          clip: [
            { x: 0, y: leftCellHeight * 2 + 2 * b },
            { x: leftColWidth, y: leftCellHeight * 2 + 2 * b },
            { x: leftColWidth, y: CANVAS_SIZE - 200 },
            { x: 0, y: CANVAS_SIZE - 200 }
          ],
          bounds: { x: 0, y: leftCellHeight * 2 + 2 * b, w: leftColWidth, h: leftCellHeight }
        }
      ];

      // Bottom row
      const bottomY = CANVAS_SIZE - 200 + b;
      const bottomHeight = 200 - b;
      const bottomCount = imageCount - 4;
      const cellWidth = (CANVAS_SIZE - (bottomCount - 1) * b) / bottomCount;

      for (let i = 0; i < bottomCount; i++) {
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

/**
 * LinkedIn Collage Creator - Main Application
 */

// State
const state = {
  images: [], // { file, url, img }
  selectedTemplateId: null,
  canvas: null,
  ctx: null
};

// DOM Elements
const elements = {
  uploadArea: null,
  fileInput: null,
  imageListSection: null,
  imageList: null,
  imageCount: null,
  clearAllBtn: null,
  templateSection: null,
  templateGrid: null,
  previewSection: null,
  previewCanvas: null,
  downloadBtn: null,
  toast: null
};

// Supported image formats (browsers can't decode HEIC/HEIF natively)
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
const UNSUPPORTED_EXTENSIONS = ['.heic', '.heif'];

/**
 * Initialize the application
 */
function init() {
  // Get DOM elements
  elements.uploadArea = document.getElementById('uploadArea');
  elements.fileInput = document.getElementById('fileInput');
  elements.imageListSection = document.getElementById('imageListSection');
  elements.imageList = document.getElementById('imageList');
  elements.imageCount = document.getElementById('imageCount');
  elements.clearAllBtn = document.getElementById('clearAllBtn');
  elements.templateSection = document.getElementById('templateSection');
  elements.templateGrid = document.getElementById('templateGrid');
  elements.previewSection = document.getElementById('previewSection');
  elements.previewCanvas = document.getElementById('previewCanvas');
  elements.downloadBtn = document.getElementById('downloadBtn');

  // Set up canvas
  state.canvas = elements.previewCanvas;
  state.ctx = state.canvas.getContext('2d');

  // Create toast element for notifications
  createToast();

  // Event listeners
  setupEventListeners();
}

/**
 * Create toast notification element
 */
function createToast() {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.hidden = true;
  document.body.appendChild(toast);
  elements.toast = toast;
}

/**
 * Show a toast notification
 */
function showToast(message, duration = 4000) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  elements.toast.classList.add('show');

  setTimeout(() => {
    elements.toast.classList.remove('show');
    setTimeout(() => {
      elements.toast.hidden = true;
    }, 300);
  }, duration);
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // File input change
  elements.fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop on upload area
  elements.uploadArea.addEventListener('dragover', handleDragOver);
  elements.uploadArea.addEventListener('dragleave', handleDragLeave);
  elements.uploadArea.addEventListener('drop', handleDrop);

  // Clear all button
  elements.clearAllBtn.addEventListener('click', clearAllImages);

  // Download button
  elements.downloadBtn.addEventListener('click', downloadCollage);
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadArea.classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadArea.classList.remove('drag-over');
}

/**
 * Handle file drop
 */
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadArea.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFiles(files);
  }
}

/**
 * Handle file input selection
 */
function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFiles(files);
  }
  // Reset input so same file can be selected again
  e.target.value = '';
}

/**
 * Check if a file is a supported image format
 */
function isSupportedImage(file) {
  // Check MIME type
  if (SUPPORTED_FORMATS.includes(file.type)) {
    return true;
  }

  // Check extension for formats that might have incorrect MIME type
  const name = file.name.toLowerCase();
  if (UNSUPPORTED_EXTENSIONS.some(ext => name.endsWith(ext))) {
    return false;
  }

  // Allow other image/* types that might work
  return file.type.startsWith('image/') && !file.type.includes('heic') && !file.type.includes('heif');
}

/**
 * Process uploaded files
 */
async function processFiles(files) {
  const allFiles = Array.from(files);
  const supported = [];
  const unsupported = [];

  for (const file of allFiles) {
    if (isSupportedImage(file)) {
      supported.push(file);
    } else if (file.type.startsWith('image/') || UNSUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      unsupported.push(file);
    }
  }

  // Show warning for unsupported files
  if (unsupported.length > 0) {
    const names = unsupported.map(f => f.name).join(', ');
    showToast(`Skipped ${unsupported.length} unsupported file(s): HEIC/HEIF format not supported. Please convert to JPG or PNG first.`, 5000);
  }

  // Load supported files
  for (const file of supported) {
    try {
      await addImage(file);
    } catch (err) {
      console.warn(err.message);
      showToast(`Could not load: ${file.name}`, 3000);
    }
  }

  updateUI();
}

/**
 * Add an image to the state
 * Uses FileReader with data URLs for file:// protocol compatibility
 */
function addImage(file) {
  return new Promise((resolve, reject) => {
    // Validate file size (max 50MB to prevent browser issues)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error(`File too large: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const url = e.target.result;
      const img = new Image();

      img.onload = () => {
        state.images.push({ file, url, img });
        resolve();
      };

      img.onerror = (err) => {
        console.error('Image load error:', err, file.name, file.type);
        reject(new Error(`Failed to decode image: ${file.name}`));
      };

      img.src = url;
    };

    reader.onerror = (err) => {
      console.error('FileReader error:', reader.error, file.name);
      reject(new Error(`Failed to read file: ${file.name} - ${reader.error?.message || 'Unknown error'}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Remove an image by index
 */
function removeImage(index) {
  if (index >= 0 && index < state.images.length) {
    state.images.splice(index, 1);
    updateUI();
  }
}

/**
 * Move an image up in the list
 */
function moveImageUp(index) {
  if (index > 0) {
    const temp = state.images[index];
    state.images[index] = state.images[index - 1];
    state.images[index - 1] = temp;
    updateUI();
  }
}

/**
 * Move an image down in the list
 */
function moveImageDown(index) {
  if (index < state.images.length - 1) {
    const temp = state.images[index];
    state.images[index] = state.images[index + 1];
    state.images[index + 1] = temp;
    updateUI();
  }
}

/**
 * Clear all images
 */
function clearAllImages() {
  state.images = [];
  state.selectedTemplateId = null;
  updateUI();
}

/**
 * Update the entire UI based on current state
 */
function updateUI() {
  updateImageList();
  updateTemplateSection();
  updatePreview();
}

/**
 * Update the image list display
 */
function updateImageList() {
  const count = state.images.length;
  elements.imageCount.textContent = `(${count})`;

  if (count === 0) {
    elements.imageListSection.hidden = true;
    return;
  }

  elements.imageListSection.hidden = false;
  elements.imageList.innerHTML = '';

  state.images.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'image-item';
    div.innerHTML = `
      <img src="${item.url}" alt="${item.file.name}" class="image-item-preview">
      <div class="image-item-info">
        <div class="image-item-name">${item.file.name}</div>
        <div class="image-item-index">Position ${index + 1}</div>
      </div>
      <div class="image-item-actions">
        <button class="btn-icon-only" data-action="up" data-index="${index}" ${index === 0 ? 'disabled' : ''} aria-label="Move up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
        <button class="btn-icon-only" data-action="down" data-index="${index}" ${index === count - 1 ? 'disabled' : ''} aria-label="Move down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <button class="btn-icon-only btn-danger" data-action="delete" data-index="${index}" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;

    // Add event listeners to buttons
    div.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', handleImageAction);
    });

    elements.imageList.appendChild(div);
  });
}

/**
 * Handle image list button actions
 */
function handleImageAction(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const index = parseInt(btn.dataset.index, 10);

  switch (action) {
    case 'up':
      moveImageUp(index);
      break;
    case 'down':
      moveImageDown(index);
      break;
    case 'delete':
      removeImage(index);
      break;
  }
}

/**
 * Update the template selection section
 */
function updateTemplateSection() {
  const count = state.images.length;

  if (count < 3) {
    elements.templateSection.hidden = true;
    state.selectedTemplateId = null;
    return;
  }

  elements.templateSection.hidden = false;
  elements.templateGrid.innerHTML = '';

  const compatible = getCompatibleTemplates(count);

  // Auto-select first template if none selected or current not compatible
  if (!state.selectedTemplateId || !compatible.find(t => t.id === state.selectedTemplateId)) {
    state.selectedTemplateId = compatible.length > 0 ? compatible[0].id : null;
  }

  TEMPLATES.forEach(template => {
    const isCompatible = template.minImages <= count && template.maxImages >= count;
    const div = document.createElement('div');
    div.className = `template-item${state.selectedTemplateId === template.id ? ' selected' : ''}`;
    div.dataset.templateId = template.id;

    if (!isCompatible) {
      div.style.opacity = '0.4';
      div.style.pointerEvents = 'none';
    }

    // Create thumbnail canvas
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 120;
    thumbCanvas.height = 120;
    renderTemplateThumbnail(thumbCanvas, template, Math.max(count, template.minImages));

    div.appendChild(thumbCanvas);

    const label = document.createElement('div');
    label.className = 'template-item-label';
    label.textContent = template.name;
    div.appendChild(label);

    const countBadge = document.createElement('div');
    countBadge.className = 'template-item-count';
    countBadge.textContent = `${template.minImages}-${template.maxImages}`;
    div.appendChild(countBadge);

    if (isCompatible) {
      div.addEventListener('click', () => selectTemplate(template.id));
    }

    elements.templateGrid.appendChild(div);
  });
}

/**
 * Render a template thumbnail
 */
function renderTemplateThumbnail(canvas, template, imageCount) {
  const ctx = canvas.getContext('2d');
  const scale = canvas.width / CANVAS_SIZE;
  const regions = template.getRegions(imageCount);

  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const colors = ['#0a66c2', '#00a0dc', '#86c5da', '#a8d5e5', '#c5e5f2', '#dff0f7'];

  regions.forEach((region, i) => {
    ctx.save();

    // Apply clip path
    ctx.beginPath();
    region.clip.forEach((point, j) => {
      const x = point.x * scale;
      const y = point.y * scale;
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.clip();

    // Fill with color
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  });
}

/**
 * Select a template
 */
function selectTemplate(templateId) {
  state.selectedTemplateId = templateId;
  updateTemplateSection();
  updatePreview();
}

/**
 * Update the preview canvas
 */
function updatePreview() {
  if (state.images.length < 3 || !state.selectedTemplateId) {
    elements.previewSection.hidden = true;
    return;
  }

  elements.previewSection.hidden = false;
  renderCollage();
}

/**
 * Render the collage on the main canvas
 */
function renderCollage() {
  const template = getTemplateById(state.selectedTemplateId);
  if (!template) return;

  const ctx = state.ctx;
  const canvas = state.canvas;

  // Clear canvas with white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const regions = template.getRegions(state.images.length);

  regions.forEach((region, i) => {
    if (i >= state.images.length) return;

    const img = state.images[i].img;

    ctx.save();

    // Apply clip path
    ctx.beginPath();
    region.clip.forEach((point, j) => {
      if (j === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.clip();

    // Draw image with cover fit
    drawImageCover(ctx, img, region.bounds.x, region.bounds.y, region.bounds.w, region.bounds.h);

    ctx.restore();
  });
}

/**
 * Draw an image with cover fit (crop to fill)
 */
function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    // Image is wider than box - crop sides
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // Image is taller than box - crop top/bottom
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Download the collage as JPEG
 */
function downloadCollage() {
  if (state.images.length < 3 || !state.selectedTemplateId) {
    return;
  }

  // Re-render to ensure fresh canvas
  renderCollage();

  // Use toDataURL for Safari compatibility
  const dataUrl = state.canvas.toDataURL('image/jpeg', 0.92);

  // On phones/tablets, <a download> is unreliable (iOS Safari ignores it or
  // saves to Files instead of Photos). Prefer the native share sheet, which
  // offers "Save Image". The File is built synchronously so the share call
  // stays within the user gesture that iOS requires.
  if (isTouchDevice()) {
    const file = dataUrlToFile(dataUrl, 'linkedin-collage.jpg');
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch((err) => {
        if (err.name !== 'AbortError') {
          showSaveOverlay(dataUrl);
        }
      });
      return;
    }

    // No file sharing (e.g. in-app browsers): show the image for long-press save
    showSaveOverlay(dataUrl);
    return;
  }

  // Create download link
  const link = document.createElement('a');
  link.download = 'linkedin-collage.jpg';
  link.href = dataUrl;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Detect touch-first devices (phones, tablets incl. iPadOS)
 */
function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1;
}

/**
 * Convert a data URL to a File synchronously
 */
function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

/**
 * Show the collage full-screen so it can be saved via long-press
 */
function showSaveOverlay(dataUrl) {
  const overlay = document.createElement('div');
  overlay.className = 'save-overlay';
  overlay.innerHTML = `
    <p class="save-overlay-hint">Press and hold the image, then tap "Save to Photos"</p>
    <img class="save-overlay-image" alt="Your collage">
    <button class="btn btn-primary save-overlay-close" type="button">Done</button>
  `;
  overlay.querySelector('img').src = dataUrl;
  overlay.querySelector('button').addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

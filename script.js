// Ensure PptxGenJS is loaded if using CDN, otherwise import it:
// import PptxGenJS from 'pptxgenjs'; // For npm/module usage

const appModules = {
    slideCreator: {
        // --- Properties ---
        markdownInput: null,
        slidePreview: null,
        addSlideBtn: null,
        prevSlideBtn: null,
        nextSlideBtn: null,
        templateSelect: null,
        exportPptxBtn: null, // Renamed from exportPdfBtn
        exportHtmlBtn: null, // Added for HTML export
        slidesData: [],
        currentSlideIndex: 0,

        // --- Initialization ---
        init: function() {
            // DOM Element References
            this.markdownInput = document.getElementById('markdownInput');
            this.slidePreview = document.getElementById('slidePreview');
            this.addSlideBtn = document.getElementById('addSlideBtn');
            this.prevSlideBtn = document.getElementById('prevSlideBtn');
            this.nextSlideBtn = document.getElementById('nextSlideBtn');
            this.templateSelect = document.getElementById('templateSelect');
            this.exportPptxBtn = document.getElementById('exportPptxBtn'); // Renamed
            this.exportHtmlBtn = document.getElementById('exportHtmlBtn'); // Added

            // Bind 'this' for event handlers and methods that might lose context
            this.updateAndRender = this.updateAndRender.bind(this);
            this.renderSlidePreview = this.renderSlidePreview.bind(this);
            this.parseMarkdownToSlides = this.parseMarkdownToSlides.bind(this);
            this.downloadPPTX = this.downloadPPTX.bind(this);
            this.downloadHTML = this.downloadHTML.bind(this); // Assuming you might add a button for this

            this.setupEventListeners();
            this.updateAndRender(); // Initial render
        },

        // --- Lógica de Parseo de Texto ---
        parseMarkdownToSlides: function(markdownText) {
            const slideTexts = markdownText.split(/^\s*---\s*$/m); // Split by '---' on its own line
            return slideTexts.map(slideText => {
                const lines = slideText.trim().split('\n');
                let title = '';
                const bullets = [];
                let paragraph = '';

                if (lines.length > 0 && lines[0].startsWith('# ')) {
                    title = lines.shift().substring(2).trim();
                }

                let paragraphContent = [];
                for (const line of lines) {
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                        bullets.push(line.substring(2).trim());
                    } else if (line.trim() !== '') {
                        paragraphContent.push(line.trim());
                    }
                }
                if (paragraphContent.length > 0 && bullets.length === 0) {
                    paragraph = paragraphContent.join('\n');
                } else if (paragraphContent.length > 0 && !paragraph) {
                    paragraph = paragraphContent.join('\n');
                }

                return { title, bullets, paragraph };
            }).filter(slide => slide.title || (slide.bullets && slide.bullets.length > 0) || slide.paragraph);
        },

        // --- Lógica de Renderizado de Vista Previa ---
        renderSlidePreview: function(slideIndexToRender) {
            // Use a different parameter name to avoid conflict with this.currentSlideIndex
            if (this.slidesData.length === 0 || slideIndexToRender < 0 || slideIndexToRender >= this.slidesData.length) {
                this.slidePreview.innerHTML = '<p>No slides to display or index out of bounds.</p>';
                this.updateNavigationButtons();
                return;
            }

            const slide = this.slidesData[slideIndexToRender];
            let htmlContent = '<div class="slide">';

            if (slide.title) {
                htmlContent += `<h1>${slide.title}</h1>`;
            }
            if (slide.bullets && slide.bullets.length > 0) {
                htmlContent += '<ul>';
                slide.bullets.forEach(bullet => {
                    htmlContent += `<li>${bullet}</li>`;
                });
                htmlContent += '</ul>';
            }
            if (slide.paragraph) {
                htmlContent += `<p>${slide.paragraph.replace(/\n/g, '<br>')}</p>`;
            }
            htmlContent += '</div>';
            this.slidePreview.innerHTML = htmlContent;
            this.updateNavigationButtons();
        },

        updateNavigationButtons: function() {
            this.prevSlideBtn.disabled = this.currentSlideIndex <= 0;
            this.nextSlideBtn.disabled = this.currentSlideIndex >= this.slidesData.length - 1 || this.slidesData.length === 0;
        },

        updateAndRender: function() {
            const markdownText = this.markdownInput.value;
            this.slidesData = this.parseMarkdownToSlides(markdownText);
            if (this.slidesData.length > 0) {
                this.currentSlideIndex = Math.max(0, Math.min(this.currentSlideIndex, this.slidesData.length - 1));
                this.renderSlidePreview(this.currentSlideIndex);
            } else {
                this.slidePreview.innerHTML = '<p>Enter Markdown and use "---" to separate slides.</p>';
                this.currentSlideIndex = 0;
            }
            this.updateNavigationButtons();
        },

        // --- Event Listeners Setup ---
        setupEventListeners: function() {
            this.markdownInput.addEventListener('input', () => {
                this.updateAndRender();
            });

            this.addSlideBtn.addEventListener('click', () => {
                this.updateAndRender();
            });

            this.prevSlideBtn.addEventListener('click', () => {
                if (this.currentSlideIndex > 0) {
                    this.currentSlideIndex--;
                    this.renderSlidePreview(this.currentSlideIndex);
                }
            });

            this.nextSlideBtn.addEventListener('click', () => {
                if (this.currentSlideIndex < this.slidesData.length - 1) {
                    this.currentSlideIndex++;
                    this.renderSlidePreview(this.currentSlideIndex);
                }
            });

            this.exportPptxBtn.addEventListener('click', () => { // Renamed from exportPdfBtn
                if (this.slidesData.length > 0) {
                    this.downloadPPTX(this.slidesData);
                } else {
                    alert("No slides to export!");
                }
            });

            this.exportHtmlBtn.addEventListener('click', () => { // Added listener for HTML export
                if (this.slidesData.length > 0) {
                    this.downloadHTML(this.slidesData);
                } else {
                    alert("No slides to export as HTML!");
                }
            });

            this.templateSelect.addEventListener('change', (event) => {
                const selectedTemplate = event.target.value;
                this.slidePreview.classList.remove('template-default', 'template-dark', 'template-light');

                if (selectedTemplate === 'default') {
                    this.slidePreview.classList.add('template-default');
                } else if (selectedTemplate === 'dark') {
                    this.slidePreview.classList.add('template-dark');
                }
                // ... more templates
                if (this.slidesData.length > 0) {
                    this.renderSlidePreview(this.currentSlideIndex);
                }
                console.log("Template changed to:", selectedTemplate);
            });
        },

        // --- Funcionalidad de Descarga ---
        downloadHTML: function(slidesArray) {
            if (slidesArray.length === 0) {
                alert("No slides to download as HTML.");
                return;
            }
            let htmlContent = `<html><head><meta charset="UTF-8"><title>Presentation</title><style>/* Basic styles for HTML slides */ .slide { border: 1px solid black; padding: 20px; margin-bottom: 10px; min-height: 300px; width: 500px; box-sizing: border-box; overflow: auto; } h1 {font-size: 24px;} ul {font-size: 16px;} p {font-size: 16px;} </style></head><body>`;
            slidesArray.forEach(slide => {
                htmlContent += `<div class="slide">`;
                if (slide.title) htmlContent += `<h1>${slide.title}</h1>`;
                if (slide.bullets && slide.bullets.length > 0) {
                    htmlContent += `<ul>${(slide.bullets).map(b => `<li>${b}</li>`).join('')}</ul>`;
                }
                if (slide.paragraph) htmlContent += `<p>${slide.paragraph.replace(/\n/g, '<br>')}</p>`;
                htmlContent += `</div>`;
            });
            htmlContent += `</body></html>`;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'presentation.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        },

        downloadPPTX: function(slidesArray) {
            if (slidesArray.length === 0) {
                alert("No slides to download as PPTX.");
                return;
            }
            if (typeof PptxGenJS === 'undefined' && typeof window.PptxGenJS === 'undefined') {
                alert("PptxGenJS library is not loaded. Please ensure it's included in your HTML or imported.");
                return;
            }
            const PptxGenJSGlobal = window.PptxGenJS || PptxGenJS; // Handle both CDN and module import
            let pres = new PptxGenJSGlobal();

            slidesArray.forEach(slideData => {
                let slide = pres.addSlide();
                let textY = 0.5;

                if (slideData.title) {
                    slide.addText(slideData.title, {
                        x: 0.5, y: 0.25,
                        fontSize: 24, w: '90%', h: 0.75,
                        align: 'center', bold: true
                    });
                    textY = 1.25;
                }

                if (slideData.bullets && slideData.bullets.length > 0) {
                    slide.addText(slideData.bullets.map(b => ({ text: b })), {
                        x: 0.5, y: textY,
                        fontSize: 18, w: '90%', h: (pres.options.slideH - textY - 0.5),
                        bullet: true
                    });
                } else if (slideData.paragraph) {
                    slide.addText(slideData.paragraph, {
                        x: 0.5, y: textY,
                        fontSize: 18, w: '90%', h: (pres.options.slideH - textY - 0.5)
                    });
                }
            });
            pres.writeFile({ fileName: 'presentation.pptx' });
        }
    },
    // markdownConverter: { /* ... future module ... */ }
};

function loadModule(moduleName) {
    if (appModules[moduleName] && typeof appModules[moduleName].init === 'function') {
        appModules[moduleName].init();
    } else {
        console.error(`Module ${moduleName} not found or has no init method.`);
    }
}

// Cargar el módulo por defecto al inicio
window.onload = () => loadModule('slideCreator');
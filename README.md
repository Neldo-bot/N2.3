# Slide Weaver

Slide Weaver is a simple web-based application that allows you to create presentations from Markdown text. You can preview your slides and export them to HTML or PPTX format.

## Features

- Write slide content using simple Markdown syntax.
- Separate slides using `---`.
- Use `# ` for slide titles.
- Use `* ` or `- ` for bullet points.
- Live preview of the current slide.
- Navigate between slides.
- Export presentation to HTML.
- Export presentation to PPTX (powered by [PptxGenJS](https://github.com/gitbrent/PptxGenJS)).
- Basic template selection.

## How to Use

1.  **Open `index.html`**: Open the `index.html` file in your web browser. (If you're hosting on GitHub Pages, this will be the main URL).
2.  **Write Markdown**: Enter your slide content in the text area on the left.
    *   Use `# Your Slide Title` for titles.
    *   Use `* Bullet point` or `- Another bullet` for lists.
    *   Separate individual slides with `---` on a new line by itself.
3.  **Preview**: The slide preview on the right will update as you type.
4.  **Navigate**: Use the "Previous" and "Next" buttons to navigate through your slides.
5.  **Select Template**: Choose a visual template from the dropdown (basic styling provided).
6.  **Export**: 
    *   Click "Export to HTML" to download your presentation as an HTML file.
    *   Click "Export to PPTX" to download your presentation as a PowerPoint file.

## Project Structure

- `index.html`: The main HTML file for the application interface.
- `style.css`: Contains all the CSS styles for the application.
- `script.js`: Handles the application logic, Markdown parsing, slide rendering, and export functionalities.
- `README.md`: This file.

## Dependencies

- [PptxGenJS](https://github.com/gitbrent/PptxGenJS): Used for PPTX export. Loaded via CDN.
- (Optional) [jsPDF](https://github.com/parallax/jsPDF): Can be integrated for PDF export. CDN link is commented out in `index.html`.

## Development

To modify or extend this project:

1.  Clone the repository (if applicable).
2.  Open `index.html` in a browser, or use a live server extension in your code editor (like VS Code's Live Server) for easier development.
3.  Edit `script.js` for logic changes, `style.css` for styling, and `index.html` for structure.

## Future Enhancements (Ideas)

- More advanced Markdown support (images, code blocks).
- PDF export functionality using jsPDF.
- More sophisticated templates and customization options.
- Saving and loading presentations (e.g., using LocalStorage or file import/export).
- Speaker notes.

## Contributing

(Add guidelines here if you wish for others to contribute. For a personal project, you can omit this or state that contributions are not currently sought.)

## License

(Choose a license if you want, e.g., MIT License. If not, you can state "All rights reserved" or omit this section.)

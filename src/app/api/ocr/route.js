import { buffer } from 'micro';
import { loadPyodide } from 'pyodide';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '4mb',
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = await buffer(req);
      const pyodide = await loadPyodide();

      await pyodide.loadPackage(['pytesseract', 'Pillow']);
      const result = await pyodide.runPythonAsync(`
        import pytesseract
        from PIL import Image
        import io
        import base64

        image_data = io.BytesIO(base64.b64decode('${body.toString('base64')}'))
        image = Image.open(image_data)
        text = pytesseract.image_to_string(image, lang='eng')
        text
      `);

      res.status(200).json({ text: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to extract text from image' });
    }
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
}

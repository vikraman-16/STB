const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const apiKey = process.env.HF_API_KEY;


// ✅ Create the Electron browser window
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// ✅ Handle mock interview questions with Hugging Face Zephyr model
ipcMain.handle('ask-gpt', async (event, question) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        inputs: question
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data?.[0]?.generated_text;
    return reply || '⚠️ No response from Hugging Face model.';
  } catch (error) {
    console.error('Hugging Face API Error:', error.response?.data || error.message);
    return '⚠️ Error: Could not contact Hugging Face model.';
  }
});

// ✅ Gracefully quit app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

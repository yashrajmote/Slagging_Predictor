const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const xlsx = require('xlsx'); 
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'slagging_coal_page.html'));
});

app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'public','slagging_data.xlsx'); // Path to your Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  res.json(jsonData);
});

app.get('/get_coal_types', (req, res) => {
  const filePath = path.join(__dirname, 'public','slagging_data.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Extract column headers to find indices of required properties
  const headers = data[0];  // The first row contains headers
  const requiredProperties = ["SiO₂", "Al₂O₃", "Fe₂O₃", "CaO", "MgO", "Na₂O", "K₂O", "TiO₂", "SO₃", "P₂O₅","Mn₃O₄","Sulphur (S)","Initial Deformation Temp.","Softening/ Spherical Temp.","Hemispherical Temp.","Fluid Temp."];

  // Find indices of required properties
  const propertyIndices = requiredProperties.map(prop => headers.map(h => h.trim()).indexOf(prop.trim()));


  // Fetch coal types and their respective properties
  const coalData = data.slice(1).map(row => {
      let coalType = row[0]; // First column is coal type
      let properties = {};

      // Extract required properties
      requiredProperties.forEach((prop, index) => {
          properties[prop] = row[propertyIndices[index]];
      });

      return { coalType, properties };
  });

  res.json({ coal_data: coalData });
});



// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

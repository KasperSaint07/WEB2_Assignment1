const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname));




function renderPage(innerHtml) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>BMI Calculator</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        ${innerHtml}
      </div>
    </body>
    </html>
  `;
}

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { label: 'Underweight', className: 'underweight' };
  } else if (bmi < 25) {
    return { label: 'Normal weight', className: 'normal' };
  } else if (bmi < 30) {
    return { label: 'Overweight', className: 'overweight' };
  } else {
    return { label: 'Obese', className: 'obese' };
  }
}

app.get('/', (req, res) => {
  const formHtml = `
    <h1>BMI Calculator</h1>
    <form action="/calculate-bmi" method="POST">
      <label for="weight">Weight (kg)</label>
      <input type="number" id="weight" name="weight" step="0.1" min="0">

      <label for="height">Height (m)</label>
      <input type="number" id="height" name="height" step="0.01" min="0">

      <button type="submit">Calculate BMI</button>
      <p class="note">Please enter positive numeric values for weight and height.</p>
    </form>
  `;
  res.send(renderPage(formHtml));
});


app.post('/calculate-bmi', (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  if (!weight || !height || weight <= 0 || height <= 0) {
    const errorHtml = `
      <h1>BMI Calculator</h1>
      <p class="error">Invalid input. Please enter positive numeric values for weight and height.</p>
      <a href="/">Back to form</a>
    `;
    return res.send(renderPage(errorHtml));
  }

  const bmi = weight / (height * height);
  const bmiRounded = bmi.toFixed(2);
  const category = getBMICategory(bmi);

  const resultHtml = `
    <h1>BMI Result</h1>
    <p class="result">
      Your BMI: <span class="bmi-value">${bmiRounded}</span><br>
      Category:
      <span class="category ${category.className}">${category.label}</span>
    </p>
    <a href="/">Calculate again</a>
  `;

  res.send(renderPage(resultHtml));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

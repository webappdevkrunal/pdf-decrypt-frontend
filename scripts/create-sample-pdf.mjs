import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createSamplePDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Add title
  page.drawText('Application Form', {
    x: 50,
    y: height - 50,
    size: 24,
    color: rgb(0, 0, 0),
  });

  // Add form fields
  const form = pdfDoc.getForm();

  // First Name
  page.drawText('First Name:', {
    x: 50,
    y: height - 120,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const firstNameField = form.createTextField('firstName');
  firstNameField.addToPage(page, { x: 150, y: height - 130, width: 200, height: 20 });

  // Last Name
  page.drawText('Last Name:', {
    x: 50,
    y: height - 170,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const lastNameField = form.createTextField('lastName');
  lastNameField.addToPage(page, { x: 150, y: height - 180, width: 200, height: 20 });

  // Email
  page.drawText('Email:', {
    x: 50,
    y: height - 220,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const emailField = form.createTextField('email');
  emailField.addToPage(page, { x: 150, y: height - 230, width: 200, height: 20 });

  // Phone
  page.drawText('Phone:', {
    x: 50,
    y: height - 270,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const phoneField = form.createTextField('phone');
  phoneField.addToPage(page, { x: 150, y: height - 280, width: 200, height: 20 });

  // Company
  page.drawText('Company:', {
    x: 50,
    y: height - 320,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const companyField = form.createTextField('company');
  companyField.addToPage(page, { x: 150, y: height - 330, width: 200, height: 20 });

  // Job Title
  page.drawText('Job Title:', {
    x: 50,
    y: height - 370,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const jobTitleField = form.createTextField('jobTitle');
  jobTitleField.addToPage(page, { x: 150, y: height - 380, width: 200, height: 20 });

  // Address
  page.drawText('Address:', {
    x: 50,
    y: height - 420,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const addressField = form.createTextField('address');
  addressField.addToPage(page, { x: 150, y: height - 430, width: 200, height: 20 });

  // City
  page.drawText('City:', {
    x: 50,
    y: height - 470,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const cityField = form.createTextField('city');
  cityField.addToPage(page, { x: 150, y: height - 480, width: 200, height: 20 });

  // State
  page.drawText('State:', {
    x: 50,
    y: height - 520,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const stateField = form.createTextField('state');
  stateField.addToPage(page, { x: 150, y: height - 530, width: 200, height: 20 });

  // Zip Code
  page.drawText('Zip Code:', {
    x: 50,
    y: height - 570,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const zipCodeField = form.createTextField('zipCode');
  zipCodeField.addToPage(page, { x: 150, y: height - 580, width: 200, height: 20 });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sample-form.pdf'), pdfBytes);

}

createSamplePDF().catch(console.error);

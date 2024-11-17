const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path"); // Thêm dòng này để sử dụng module path

// Hàm để tạo file CV
const generateCV = (data) => {
  try {
    const templatePath = path.join(__dirname, "../templates/testcv.docx");
    const outputPath = path.join(__dirname, "../output/generated-cv.docx");

    const templateFile = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(templateFile);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    console.log("Dữ liệu truyền vào template:", data); // Kiểm tra dữ liệu

    // Gắn dữ liệu người dùng vào template
    doc.setData(data);

    // Xử lý file
    doc.render();

    const buf = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buf);

    return outputPath;
  } catch (error) {
    console.error("Lỗi khi tạo CV:", error);
    if (error.properties && error.properties.errors) {
      error.properties.errors.forEach((e) => {
        console.error("Chi tiết lỗi:", e);
      });
    }

    throw new Error("Không thể tạo CV");
  }
};

module.exports = {
  generateCV,
};

import Rule from "../models/Rule.js";
import Notification from "../models/Notification.js";
import PDFDocument from "pdfkit";

// get rules
export const getRules = async (req, res) => {
  try {
    // Pinned rules first, then by creation date
    const rules = await Rule.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rules", error: error.message });
  }
};

export const getRuleById = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rule", error: error.message });
  }
};

// add rule
export const addRule = async (req, res) => {
  try {
    const { title, description, category, isPinned, effectiveDate, expiryDate } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const rule = await Rule.create({
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || "General",
      isPinned: isPinned || false,
      effectiveDate: effectiveDate || Date.now(),
      expiryDate,
      createdBy: req.user?._id // assuming auth middleware attaches user
    });

    // Create Notification
    await Notification.create({
      title: '📘 New Rule Added',
      message: `${title} has been added.`,
      type: 'RuleAdded'
    });

    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: "Failed to add rule", error: error.message });
  }
};

export const updateRule = async (req, res) => {
  try {
    const { title, description, category, isPinned, effectiveDate, expiryDate } = req.body;
    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description).trim();
    if (category !== undefined) update.category = String(category).trim() || "General";
    if (isPinned !== undefined) update.isPinned = Boolean(isPinned);
    if (effectiveDate !== undefined) update.effectiveDate = effectiveDate;
    if (expiryDate !== undefined) update.expiryDate = expiryDate;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const rule = await Rule.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // Create Notification
    await Notification.create({
      title: '📘 Rule Updated',
      message: `${rule.title} policy has been modified.`,
      type: 'RuleUpdated'
    });

    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: "Failed to update rule", error: error.message });
  }
};

export const deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // Create Notification
    await Notification.create({
      title: '📘 Rule Removed',
      message: `${rule.title} has been removed.`,
      type: 'RuleRemoved'
    });

    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete rule", error: error.message });
  }
};

// Export Rule Book PDF
export const exportRuleBookPdf = async (req, res) => {
  try {
    const rules = await Rule.find().sort({ category: 1, createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rules.pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Panchayat Society Rule Book', { align: 'center' });
    doc.moveDown(0.5);
    
    // Generated Date
    doc.fontSize(12).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    let currentCategory = '';

    rules.forEach((rule) => {
      if (rule.category !== currentCategory) {
        currentCategory = rule.category;
        doc.moveDown(1);
        doc.fontSize(18).font('Helvetica-Bold').text(currentCategory, { underline: true });
        doc.moveDown(0.5);
      }

      doc.fontSize(14).font('Helvetica-Bold').text(rule.title);
      doc.fontSize(12).font('Helvetica').text(rule.description);
      
      const dates = `Effective: ${new Date(rule.effectiveDate).toLocaleDateString()}` + 
        (rule.expiryDate ? ` | Expiry: ${new Date(rule.expiryDate).toLocaleDateString()}` : '');
      
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('gray').text(dates);
      doc.fillColor('black'); // Reset color
      doc.moveDown(1);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};
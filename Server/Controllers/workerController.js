import Worker from "../models/Worker.js";

export const listWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ societyId: req.user.societyId }).sort({ trade: 1, name: 1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorker = async (req, res) => {
  try {
    const { name, phone, trade, isActive } = req.body;
    if (!name?.trim() || !phone?.trim() || !trade) {
      return res.status(400).json({ message: "Name, phone, and trade are required" });
    }
    const worker = await Worker.create({
      name: name.trim(),
      phone: phone.trim(),
      trade,
      isActive: isActive !== false,
      societyId: req.user.societyId
    });
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { name, phone, trade, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (phone !== undefined) update.phone = String(phone).trim();
    if (trade !== undefined) update.trade = trade;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const worker = await Worker.findOneAndUpdate({ _id: req.params.id, societyId: req.user.societyId }, update, {
      new: true,
    });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

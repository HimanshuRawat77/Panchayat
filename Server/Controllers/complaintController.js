import Complaint from "../models/Complaint.js";

// ➕ Create Complaint
export const createComplaint = async (req, res) => {
  try {
    const { description, category, priority, image } = req.body;
    const trimmedDescription = description?.trim();

    if (!trimmedDescription) {
      return res.status(400).json({ message: "Description is required" });
    }

    const complaint = await Complaint.create({
      userId: req.user.id,
      description: trimmedDescription,
      category,
      priority: priority || "Medium",
      image,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 Get My Complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔄 Update Status (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
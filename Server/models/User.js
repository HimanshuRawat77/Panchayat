import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    houseNumber: {
      type: String,
      required: true,
    },

    block: {
      type: String,
      required: true,
    },

    nationality: {
      type: String,
      default: "Indian",
    },

    religion: {
      type: String,
      default: "Not Specified",
    },

    role: {
      type: String,
      enum: ["resident", "admin", "platform_admin"],
      default: "resident",
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    subscriptionMode: {
      type: String,
      default: "Free",
    },
    planStatus: {
      type: String,
      enum: ["inactive", "active", "expired"],
      default: "inactive",
    },
    planActivatedAt: {
      type: Date,
      default: null,
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    hasSeenTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// 🔑 Compare password (for login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ societyId: 1, role: 1 });
userSchema.index({ societyId: 1, createdAt: -1 });


const User = mongoose.model("User", userSchema);

export default User;

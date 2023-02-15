const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/auth");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: "Email is required",
      unique: "Email already exists",
    },
    name: {
      type: String,
      required: "Name is required",
    },
    position: {
      type: String,
      required: "Position is required",
    },
    mobile: {
      type: String,
      required: "Mobile number is required",
      unique: "Mobile number already exists",
    },
    password: {
      type: String,
      required: "Password is required",
    },
    roles: {
      type: [String],
      enum: [
        "ADMIN",
        "DIRECTOR",
        "OPS_MANAGER",
        "GEN_MANAGER",
        "ADMIN_MANAGER",
        "QUEUE_EMPL",
        "PAYPOINT_EMPL",
        "EMPLOYEE",
      ],
      default: ["EMPLOYEE"],
    },
    refreshToken: String,
    resetToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  user.password = await hashPassword(user.password);

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  //TODO: Either pass option or use this.getUpdate(), to avoid private method
  const user = this;
  if (!user._update.password) return next();
  const hash = await hashPassword(user._update.password);
  user._update.password = hash;
  next();
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.rotateRefreshToken = async function (refreshToken) {
  this.refreshToken = refreshToken;
  await this.save();
};

userSchema.methods.clearRefreshToken = async function () {
  this.refreshToken = undefined;
  await this.save();
};

userSchema.statics.revokeRefreshToken = async function (userId) {
  const user = await this.findById(userId);
  await user.clearRefreshToken();
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

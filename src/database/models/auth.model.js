import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return user ? true : false;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});
userSchema.pre("findOneAndUpdate", async function () {
  const user = this.getUpdate();
  if (user.password) {
    const hashPassword = await bcrypt.hash(user.password, 8);
    this.setUpdate({ ...user, password: hashPassword });
  }
});

export const UserModel = mongoose.model("User", userSchema);

const passwordTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const PasswordResetTokenModel = mongoose.model(
  "PasswordResetToken",
  passwordTokenSchema
);

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  vehicle: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique:true,
  },
});

export const APIKeyModel = mongoose.model("APIKey", apiKeySchema);

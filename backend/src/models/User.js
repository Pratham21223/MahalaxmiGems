import mongoose from 'mongoose'

// Customer + admin users. Passwords are never stored in plaintext — only the
// bcrypt hash (backend-principles.md: cost >= 12, per-user salt).
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], default: [] },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)

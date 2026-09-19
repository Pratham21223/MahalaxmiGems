import mongoose from 'mongoose'

export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection))
      mongoose.connection.once('error', reject)
    })
  }
  await mongoose.connect(uri)
  return mongoose.connection
}
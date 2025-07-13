import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

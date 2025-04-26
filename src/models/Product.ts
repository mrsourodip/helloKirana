import mongoose from 'mongoose';

interface IProduct {
  name: string;
  description: string;
  pricePerKg: number;
  pricePerPiece: number;
  isPieceProduct: boolean;
  image: string;
  category: string;
  stock: number;
  brand?: string;
  isFeatured?: boolean;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please provide a name for the product'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the product'],
  },
  pricePerKg: {
    type: Number,
    required: function(this: IProduct) {
      return !this.isPieceProduct;
    },
  },
  pricePerPiece: {
    type: Number,
    required: function(this: IProduct) {
      return this.isPieceProduct;
    },
  },
  isPieceProduct: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['rice', 'flour', 'pulses', 'oil', 'essentials'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
  },
  brand: {
    type: String,
    required: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema); 
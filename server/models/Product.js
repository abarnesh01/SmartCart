const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const model3DConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['headphones', 'watch', 'phone', 'shoe', 'chair', 'controller', 'speaker', 'gltf'],
    default: 'headphones',
  },
  gltfUrl: { type: String, default: '' },
  color: { type: String, default: '#3b82f6' },
  accentColor: { type: String, default: '#f43f5e' },
  roughness: { type: Number, default: 0.3 },
  metalness: { type: Number, default: 0.7 },
  scale: { type: Number, default: 1 },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    specifications: [specificationSchema],
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: 0,
      default: 10,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    model3D: {
      type: model3DConfigSchema,
      default: () => ({ type: 'headphones', color: '#3b82f6' }),
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual property for discounted price
productSchema.virtual('discountedPrice').get(function () {
  if (this.discountPercentage > 0) {
    return Number((this.price * (1 - this.discountPercentage / 100)).toFixed(2));
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

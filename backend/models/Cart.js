const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [cartItemSchema]
});

// Method to add or increase quantity of an item
cartSchema.methods.addItem = function(productId, quantity = 1) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ product: productId, quantity });
    }
    
    return this.save();
};

// Method to decrease quantity
cartSchema.methods.decreaseItem = function(productId, quantity = 1) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());
    
    if (existingItem) {
        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
            this.items = this.items.filter(item => item.product.toString() !== productId.toString());
        }
    }
    
    return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
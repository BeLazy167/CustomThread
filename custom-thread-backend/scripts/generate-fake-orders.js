/**
 * Script to generate fake orders using existing designs
 *
 * Run with: node scripts/generate-fake-orders.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Define schemas directly in this script since we can't easily import TypeScript models
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            designId: { type: mongoose.Schema.Types.ObjectId, ref: 'Design' },
            title: String,
            price: Number,
            quantity: Number,
            designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            designerName: String,
            image: String,
        },
    ],
    shipping: {
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        name: String,
        email: String,
    },
    payment: {
        method: String,
        amount: Number,
        currency: String,
        status: String,
    },
    summary: {
        subtotal: Number,
        tax: Number,
        shipping: Number,
        total: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const designSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    images: [String],
    designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    designerName: String,
    category: String,
    tags: [String],
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    clerkId: String,
    email: String,
    firstName: String,
    lastName: String,
    role: {
        type: String,
        enum: ['customer', 'designer', 'admin'],
        default: 'customer',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Create models
const Order = mongoose.model('Order', orderSchema);
const Design = mongoose.model('Design', designSchema);
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

// Configuration
const NUM_ORDERS = 200;
const START_DATE = new Date('2023-01-01');
const END_DATE = new Date();

// Generate random date between start and end
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random quantity between min and max
const randomQuantity = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random status
const randomStatus = () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const weights = [0.1, 0.2, 0.2, 0.4, 0.1]; // Weighted probabilities

    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < statuses.length; i++) {
        sum += weights[i];
        if (random < sum) {
            return statuses[i];
        }
    }

    return statuses[0];
};

// Generate fake customer
const generateFakeCustomer = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        _id: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        address: {
            line1: faker.location.streetAddress(),
            line2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            postalCode: faker.location.zipCode(),
            country: 'US',
        },
    };
};

// Generate orders using existing designs
const generateOrders = async () => {
    try {
        // Get all existing designs regardless of status
        const designs = await Design.find({});

        if (designs.length === 0) {
            console.error('No designs found in the database');
            process.exit(1);
        }

        console.log(`Found ${designs.length} designs`);

        // Check if orders already exist
        const orderCount = await Order.countDocuments();

        if (orderCount > 0) {
            console.log(`There are already ${orderCount} orders in the database.`);

            const answer = await new Promise((resolve) => {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                readline.question(
                    'Do you want to clear existing orders and generate new ones? (y/n): ',
                    (answer) => {
                        readline.close();
                        resolve(answer.toLowerCase());
                    }
                );
            });

            if (answer === 'y') {
                console.log('Clearing existing orders...');
                await Order.deleteMany({});
            } else {
                console.log('Operation cancelled.');
                process.exit(0);
            }
        }

        console.log(`Generating ${NUM_ORDERS} fake orders...`);

        const orders = [];

        for (let i = 0; i < NUM_ORDERS; i++) {
            // Generate a fake customer for this order
            const customer = generateFakeCustomer();

            // Generate order date
            const orderDate = randomDate(START_DATE, END_DATE);

            // Generate 1-5 items per order
            const numItems = Math.floor(Math.random() * 5) + 1;
            const items = [];
            let subtotal = 0;

            // Randomly select designs for this order
            const selectedDesigns = [];
            while (selectedDesigns.length < numItems) {
                const randomDesign = designs[Math.floor(Math.random() * designs.length)];

                // Avoid duplicate designs in the same order
                if (
                    !selectedDesigns.some((d) => d._id.toString() === randomDesign._id.toString())
                ) {
                    selectedDesigns.push(randomDesign);
                }
            }

            // Create order items
            for (const design of selectedDesigns) {
                const quantity = randomQuantity(1, 5);
                // Ensure price is a valid number, default to a random price if not
                const price =
                    typeof design.price === 'number' && !isNaN(design.price)
                        ? design.price
                        : parseFloat((Math.random() * 50 + 20).toFixed(2)); // Random price between 20 and 70

                const itemTotal = price * quantity;

                items.push({
                    designId: design._id,
                    title: design.title || 'Custom Design',
                    price: price,
                    quantity: quantity,
                    designerId: design.designerId || new mongoose.Types.ObjectId(),
                    designerName: design.designerName || 'Unknown Designer',
                    image:
                        design.images && design.images.length > 0
                            ? design.images[0]
                            : 'https://placehold.co/400x300',
                });

                subtotal += itemTotal;
            }

            // Calculate tax and total
            const tax = parseFloat((subtotal * 0.08).toFixed(2));
            const shipping = parseFloat((5.99).toFixed(2));
            const total = parseFloat((subtotal + tax + shipping).toFixed(2));

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                userId: customer._id,
                items: items,
                shipping: {
                    address: customer.address,
                    name: `${customer.firstName} ${customer.lastName}`,
                    email: customer.email,
                },
                payment: {
                    method: 'card',
                    amount: total,
                    currency: 'usd',
                    status: 'succeeded',
                },
                summary: {
                    subtotal: subtotal,
                    tax: tax,
                    shipping: shipping,
                    total: total,
                },
                status: randomStatus(),
                createdAt: orderDate,
                updatedAt: orderDate,
            });

            orders.push(order);

            // Log progress
            if ((i + 1) % 50 === 0 || i === NUM_ORDERS - 1) {
                console.log(`Generated ${i + 1}/${NUM_ORDERS} orders`);
            }
        }

        // Save all orders in batches to avoid overwhelming the database
        const BATCH_SIZE = 50;
        for (let i = 0; i < orders.length; i += BATCH_SIZE) {
            const batch = orders.slice(i, i + BATCH_SIZE);
            await Order.insertMany(batch);
            console.log(`Saved orders ${i + 1} to ${Math.min(i + BATCH_SIZE, orders.length)}`);
        }

        console.log(`Successfully generated ${orders.length} orders`);

        // Generate some statistics
        const totalRevenue = orders.reduce((sum, order) => sum + order.summary.total, 0);
        const averageOrderValue = totalRevenue / orders.length;

        console.log('\nOrder Statistics:');
        console.log(`Total Orders: ${orders.length}`);
        console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
        console.log(`Average Order Value: $${averageOrderValue.toFixed(2)}`);

        const statusCounts = {};
        orders.forEach((order) => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        console.log('\nOrder Status Distribution:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`${status}: ${count} (${((count / orders.length) * 100).toFixed(1)}%)`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error generating orders:', error);
        process.exit(1);
    }
};

// Run the script
generateOrders();

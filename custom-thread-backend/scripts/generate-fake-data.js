/**
 * Script to generate fake sales data for testing the reports feature
 *
 * Run with: node scripts/generate-fake-data.js
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
const NUM_USERS = 20;
const NUM_DESIGNERS = 10;
const NUM_DESIGNS = 50;
const NUM_ORDERS = 200;
const START_DATE = new Date('2023-01-01');
const END_DATE = new Date();

// Arrays to store created data
const users = [];
const designers = [];
const designs = [];
const orders = [];

// Generate random date between start and end
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random price between min and max
const randomPrice = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate random quantity between min and max
const randomQuantity = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random status
const randomStatus = () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
};

// Generate users
const generateUsers = async () => {
    console.log('Generating users...');

    // Create regular users
    for (let i = 0; i < NUM_USERS; i++) {
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            clerkId: `user_${faker.string.alphanumeric(10)}`,
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            role: 'customer',
            createdAt: randomDate(START_DATE, END_DATE),
            updatedAt: new Date(),
        });

        users.push(user);
    }

    // Create designers
    for (let i = 0; i < NUM_DESIGNERS; i++) {
        const designer = new User({
            _id: mongoose.Types.ObjectId(),
            clerkId: `user_${faker.string.alphanumeric(10)}`,
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            role: 'designer',
            createdAt: randomDate(START_DATE, END_DATE),
            updatedAt: new Date(),
        });

        designers.push(designer);
    }

    // Save all users
    await User.insertMany([...users, ...designers]);
    console.log(`Created ${users.length} users and ${designers.length} designers`);
};

// Generate designs
const generateDesigns = async () => {
    console.log('Generating designs...');

    for (let i = 0; i < NUM_DESIGNS; i++) {
        const designer = designers[Math.floor(Math.random() * designers.length)];

        const design = new Design({
            _id: mongoose.Types.ObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: randomPrice(15, 100),
            images: [faker.image.url(), faker.image.url()],
            designerId: designer._id,
            designerName: `${designer.firstName} ${designer.lastName}`,
            category: faker.commerce.department(),
            tags: [
                faker.commerce.productAdjective(),
                faker.commerce.productMaterial(),
                faker.commerce.productAdjective(),
            ],
            status: 'active',
            createdAt: randomDate(START_DATE, END_DATE),
            updatedAt: new Date(),
        });

        designs.push(design);
    }

    // Save all designs
    await Design.insertMany(designs);
    console.log(`Created ${designs.length} designs`);
};

// Generate orders
const generateOrders = async () => {
    console.log('Generating orders...');

    for (let i = 0; i < NUM_ORDERS; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const orderDate = randomDate(START_DATE, END_DATE);

        // Generate 1-5 items per order
        const numItems = Math.floor(Math.random() * 5) + 1;
        const items = [];
        let subtotal = 0;

        for (let j = 0; j < numItems; j++) {
            const design = designs[Math.floor(Math.random() * designs.length)];
            const quantity = randomQuantity(1, 5);
            const price = design.price;
            const itemTotal = price * quantity;

            items.push({
                designId: design._id,
                title: design.title,
                price: price,
                quantity: quantity,
                designerId: design.designerId,
                designerName: design.designerName,
                image: design.images[0],
            });

            subtotal += itemTotal;
        }

        // Calculate tax and total
        const tax = parseFloat((subtotal * 0.08).toFixed(2));
        const shipping = parseFloat((5.99).toFixed(2));
        const total = parseFloat((subtotal + tax + shipping).toFixed(2));

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            userId: user._id,
            items: items,
            shipping: {
                address: {
                    line1: faker.location.streetAddress(),
                    line2: faker.location.secondaryAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    postalCode: faker.location.zipCode(),
                    country: 'US',
                },
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
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
    }

    // Save all orders
    await Order.insertMany(orders);
    console.log(`Created ${orders.length} orders`);
};

// Main function to generate all data
const generateData = async () => {
    try {
        // Check if data already exists
        const userCount = await User.countDocuments();
        const designCount = await Design.countDocuments();
        const orderCount = await Order.countDocuments();

        if (userCount > 0 || designCount > 0 || orderCount > 0) {
            console.log('Data already exists in the database.');
            console.log(`Users: ${userCount}, Designs: ${designCount}, Orders: ${orderCount}`);

            const answer = await new Promise((resolve) => {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                readline.question(
                    'Do you want to clear existing data and generate new data? (y/n): ',
                    (answer) => {
                        readline.close();
                        resolve(answer.toLowerCase());
                    }
                );
            });

            if (answer === 'y') {
                console.log('Clearing existing data...');
                await User.deleteMany({});
                await Design.deleteMany({});
                await Order.deleteMany({});
            } else {
                console.log('Operation cancelled.');
                process.exit(0);
            }
        }

        // Generate data
        await generateUsers();
        await generateDesigns();
        await generateOrders();

        console.log('Fake data generation complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error generating data:', error);
        process.exit(1);
    }
};

// Run the script
generateData();

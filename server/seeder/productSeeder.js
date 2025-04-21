require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const createProducts = () => {
    return [
        {
            productId: 1,
            title: "Nike Air Zoom Pegasus 39",
            category: "running",
            price: 1899000,
            image: "/assets/images/produk/produk1.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk1.png", "/assets/images/produk/produk1-2.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 2,
            title: "Nike Air Force 1 '07",
            category: "casual",
            price: 1429000,
            image: "/assets/images/produk/produk2.png",
            description: "Classic streetwear sneakers",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk2.png", "/assets/images/produk/produk2-2.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 3,
            title: "Nike Zoom Fly 5",
            category: "running",
            price: 2279000,
            image: "/assets/images/produk/produk3.png",
            description: "High-performance running shoes",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk3.png", "/assets/images/produk/produk3-3.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 4,
            title: "Nike Revolution 6",
            category: "sport",
            price: 799000,
            image: "/assets/images/produk/produk4.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk4.png", "/assets/images/produk/produk4-4.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 5,
            title: "Nike Dunk Low Retro",
            category: "casual",
            price: 1549000,
            image: "/assets/images/produk/produk5.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk5.png", "/assets/images/produk/produk5-5.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 6,
            title: "Nike Air Max 270",
            category: "sport",
            price: 2099000,
            image: "/assets/images/produk/produk6.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk6.png", "/assets/images/produk/produk6-6.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 7,
            title: "Nike Metcon 8",
            category: "sport",
            price: 1899000,
            image: "/assets/images/produk/produk7.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk7.png", "/assets/images/produk/produk7-7.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 8,
            title: "Nike Blazer Mid '77",
            category: "casual",
            price: 1429000,
            image: "/assets/images/produk/produk8.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk8.png", "/assets/images/produk/produk8-8.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 9,
            title: "Nike Free Run 5.0",
            category: "running",
            price: 1599000,
            image: "/assets/images/produk/produk9.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk9.png", "/assets/images/produk/produk9-9.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 10,
            title: "Nike Air Huarache",
            category: "casual",
            price: 1799000,
            image: "/assets/images/produk/produk10.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk10.png", "/assets/images/produk/produk10-10.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 11,
            title: "Nike ZoomX Invincible",
            category: "running",
            price: 2899000,
            image: "/assets/images/produk/produk11.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk11.png", "/assets/images/produk/produk11-11.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 12,
            title: "Nike SB Dunk Low",
            category: "casual",
            price: 1649000,
            image: "/assets/images/produk/produk12.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk12.png", "/assets/images/produk/produk12-12.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 13,
            title: "Nike React Miler",
            category: "running",
            price: 1999000,
            image: "/assets/images/produk/produk13.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk13.png", "/assets/images/produk/produk13-13.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 14,
            title: "Nike Air Zoom Structure",
            category: "sport",
            price: 2199000,
            image: "/assets/images/produk/produk14.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk14.png", "/assets/images/produk/produk14-14.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 15,
            title: "Nike Waffle One",
            category: "casual",
            price: 1399000,
            image: "/assets/images/produk/produk15.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk15.png", "/assets/images/produk/produk15-15.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 16,
            title: "Nike SuperRep Go",
            category: "sport",
            price: 1599000,
            image: "/assets/images/produk/produk16.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk16.png", "/assets/images/produk/produk16-16.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 17,
            title: "Nike Tempo Next%",
            category: "running",
            price: 3899000,
            image: "/assets/images/produk/produk17.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk17.png", "/assets/images/produk/produk17-17.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 18,
            title: "Nike Court Vision",
            category: "casual",
            price: 1199000,
            image: "/assets/images/produk/produk18.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk18.png", "/assets/images/produk/produk18-18.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 19,
            title: "Nike Legend Essential",
            category: "sport",
            price: 10000000,
            image: "/assets/images/produk/produk19.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk19.png", "/assets/images/produk/produk19-19.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        },
        {
            productId: 20,
            title: "Nike Air Zoom Vomero",
            category: "running",
            price: 5000000,
            image: "/assets/images/produk/produk20.png",
            description: "Running shoes with responsive cushioning",
            rating: 4.5,
            stock: 15,
            colors: [
                {
                    name: "Black/White",
                    code: "#000000",
                    images: ["/assets/images/produk/produk20.png", "/assets/images/produk/produk20-20.png"]
                }
            ],
            sizes: ["40", "41", "42", "43", "44"]
        }
    ];
};

const seedProducts = async () => {
    try {
        const products = createProducts();
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Products seeded!');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

module.exports = seedProducts;

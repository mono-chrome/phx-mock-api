const dummyData = [
  {
    id: 1,
    title: "Women's Classic Cotton T-Shirt",
    body_html:
      "A soft and stylish cotton t-shirt designed for everyday comfort with a flattering fit for women.",
    vendor: "JustFab",
    product_type: "Apparel",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-08-01T09:30:00Z",
    published_at: "2023-01-01T00:00:00Z",
    status: "active",
    tags: "apparel, women, casual, t-shirt",
    variants: [
      {
        id: 101,
        product_id: 1,
        title: "Small / White / Regular",
        price: "19.99",
        sku: "JF-TST-001-SWR",
        inventory_quantity: 50,
        option1: "Small",
        option2: "White",
        option3: "Regular",
      },
      {
        id: 102,
        product_id: 1,
        title: "Medium / Black / Slim",
        price: "19.99",
        sku: "JF-TST-001-MBS",
        inventory_quantity: 75,
        option1: "Medium",
        option2: "Black",
        option3: "Slim",
      },
    ],
    images: [
      {
        id: 1001,
        product_id: 1,
        src: "https://justfab.com/images/womens-tshirt-white.jpg",
        variant_ids: [101],
      },
      {
        id: 1002,
        product_id: 1,
        src: "https://justfab.com/images/womens-tshirt-black.jpg",
        variant_ids: [102],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["Small", "Medium", "Large"],
      },
      {
        name: "Color",
        values: ["White", "Black", "Navy"],
      },
      {
        name: "Fit",
        values: ["Regular", "Slim"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Classic Cotton T-Shirt - Effortless Style",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Discover our women’s classic cotton t-shirt, crafted for comfort and style. Available in multiple sizes, colors, and fits.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 2,
    title: "Women's Skinny Jeans",
    body_html:
      "Premium denim skinny jeans designed for a flattering and comfortable fit, perfect for a chic everyday look.",
    vendor: "JustFab",
    product_type: "Apparel",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-08-01T10:15:00Z",
    published_at: "2023-02-20T00:00:00Z",
    status: "active",
    tags: "denim, jeans, women, casual, skinny",
    variants: [
      {
        id: 103,
        product_id: 2,
        title: "26 / Blue / Regular",
        price: "49.99",
        sku: "JF-JNS-002-26BR",
        inventory_quantity: 25,
        option1: "26",
        option2: "Blue",
        option3: "Regular",
      },
      {
        id: 104,
        product_id: 2,
        title: "28 / Black / Regular",
        price: "49.99",
        sku: "JF-JNS-002-28BK",
        inventory_quantity: 30,
        option1: "28",
        option2: "Black",
        option3: "Regular",
      },
    ],
    images: [
      {
        id: 1003,
        product_id: 2,
        src: "https://justfab.com/images/womens-jeans-blue.jpg",
        variant_ids: [103],
      },
      {
        id: 1004,
        product_id: 2,
        src: "https://justfab.com/images/womens-jeans-black.jpg",
        variant_ids: [104],
      },
    ],
    options: [
      {
        name: "Waist Size",
        values: ["26", "28", "30"],
      },
      {
        name: "Color",
        values: ["Blue", "Black"],
      },
      {
        name: "Length",
        values: ["Regular", "Short"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Skinny Jeans - Flattering Denim",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Elevate your wardrobe with our women's skinny jeans. Available in multiple waist sizes and colors for a perfect fit.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 3,
    title: "Women's Running Sneakers",
    body_html:
      "Lightweight and comfortable running sneakers designed for women to keep pace with an active lifestyle.",
    vendor: "JustFab",
    product_type: "Footwear",
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2023-08-01T11:00:00Z",
    published_at: "2023-03-15T00:00:00Z",
    status: "active",
    tags: "sneakers, running, footwear, women, athletic",
    variants: [
      {
        id: 105,
        product_id: 3,
        title: "7 / Black / Standard",
        price: "89.99",
        sku: "JF-SNK-003-7BLK",
        inventory_quantity: 50,
        option1: "7",
        option2: "Black",
        option3: "Standard",
      },
      {
        id: 106,
        product_id: 3,
        title: "8 / White / Standard",
        price: "89.99",
        sku: "JF-SNK-003-8WHT",
        inventory_quantity: 40,
        option1: "8",
        option2: "White",
        option3: "Standard",
      },
    ],
    images: [
      {
        id: 1005,
        product_id: 3,
        src: "https://justfab.com/images/womens-running-sneakers-black.jpg",
        variant_ids: [105],
      },
      {
        id: 1006,
        product_id: 3,
        src: "https://justfab.com/images/womens-running-sneakers-white.jpg",
        variant_ids: [106],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["7", "8", "9", "10"],
      },
      {
        name: "Color",
        values: ["Black", "White", "Pink"],
      },
      {
        name: "Style",
        values: ["Standard", "Wide"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Running Sneakers - Lightweight & Stylish",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Step into comfort with our women's running sneakers. Designed with breathable materials and available in multiple sizes and colors.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 4,
    title: "Women's Ankle Boots",
    body_html:
      "Trendy and durable ankle boots crafted for versatility and a chic, everyday look.",
    vendor: "JustFab",
    product_type: "Footwear",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2023-08-01T12:00:00Z",
    published_at: "2023-04-05T00:00:00Z",
    status: "active",
    tags: "boots, ankle boots, footwear, women, fashion",
    variants: [
      {
        id: 107,
        product_id: 4,
        title: "6 / Brown / Low Heel",
        price: "89.99",
        sku: "JF-ANB-004-6BR",
        inventory_quantity: 60,
        option1: "6",
        option2: "Brown",
        option3: "Low Heel",
      },
      {
        id: 108,
        product_id: 4,
        title: "7 / Black / Low Heel",
        price: "89.99",
        sku: "JF-ANB-004-7BK",
        inventory_quantity: 70,
        option1: "7",
        option2: "Black",
        option3: "Low Heel",
      },
    ],
    images: [
      {
        id: 1007,
        product_id: 4,
        src: "https://justfab.com/images/womens-ankle-boots-brown.jpg",
        variant_ids: [107],
      },
      {
        id: 1008,
        product_id: 4,
        src: "https://justfab.com/images/womens-ankle-boots-black.jpg",
        variant_ids: [108],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["6", "7", "8", "9"],
      },
      {
        name: "Color",
        values: ["Brown", "Black", "Tan"],
      },
      {
        name: "Heel Type",
        values: ["Low", "High"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Ankle Boots - Trendy & Versatile",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Step out in style with our women's ankle boots. Crafted for durability and designed for a chic, everyday look.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 5,
    title: "Women's High-Heeled Shoes",
    body_html:
      "Elegant high-heeled shoes that enhance your silhouette while keeping comfort in mind.",
    vendor: "JustFab",
    product_type: "Footwear",
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2023-08-01T13:00:00Z",
    published_at: "2023-05-05T00:00:00Z",
    status: "active",
    tags: "heels, high-heeled, footwear, women, formal",
    variants: [
      {
        id: 109,
        product_id: 5,
        title: "6 / Red / 3-inch",
        price: "99.99",
        sku: "JF-HEE-005-6RD",
        inventory_quantity: 100,
        option1: "6",
        option2: "Red",
        option3: "3-inch",
      },
      {
        id: 110,
        product_id: 5,
        title: "7 / Black / 3-inch",
        price: "99.99",
        sku: "JF-HEE-005-7BK",
        inventory_quantity: 80,
        option1: "7",
        option2: "Black",
        option3: "3-inch",
      },
    ],
    images: [
      {
        id: 1009,
        product_id: 5,
        src: "https://justfab.com/images/womens-high-heels-red.jpg",
        variant_ids: [109],
      },
      {
        id: 1010,
        product_id: 5,
        src: "https://justfab.com/images/womens-high-heels-black.jpg",
        variant_ids: [110],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["5", "6", "7", "8"],
      },
      {
        name: "Color",
        values: ["Red", "Black", "Nude"],
      },
      {
        name: "Heel Height",
        values: ["3-inch", "4-inch"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's High-Heeled Shoes - Elegant & Modern",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Enhance your style with our elegant high-heeled shoes. Perfect for formal occasions and available in a range of sizes and colors.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 6,
    title: "Women's Casual Cropped Hoodie",
    body_html:
      "A chic cropped hoodie made from organic cotton – perfect for layering during cooler days while keeping a trendy look.",
    vendor: "JustFab",
    product_type: "Apparel",
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2023-08-01T14:00:00Z",
    published_at: "2023-06-05T00:00:00Z",
    status: "active",
    tags: "hoodie, cropped, casual, women, organic",
    variants: [
      {
        id: 111,
        product_id: 6,
        title: "Small / Gray / Regular",
        price: "49.99",
        sku: "JF-CH-006-SGR",
        inventory_quantity: 40,
        option1: "Small",
        option2: "Gray",
        option3: "Regular",
      },
      {
        id: 112,
        product_id: 6,
        title: "Medium / Pink / Regular",
        price: "49.99",
        sku: "JF-CH-006-MPK",
        inventory_quantity: 50,
        option1: "Medium",
        option2: "Pink",
        option3: "Regular",
      },
    ],
    images: [
      {
        id: 1011,
        product_id: 6,
        src: "https://justfab.com/images/womens-cropped-hoodie-gray.jpg",
        variant_ids: [111],
      },
      {
        id: 1012,
        product_id: 6,
        src: "https://justfab.com/images/womens-cropped-hoodie-pink.jpg",
        variant_ids: [112],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["Small", "Medium", "Large"],
      },
      {
        name: "Color",
        values: ["Gray", "Pink", "White"],
      },
      {
        name: "Fit",
        values: ["Regular", "Oversized"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Casual Cropped Hoodie - Organic & Trendy",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Stay on trend with our cropped hoodie made of organic cotton. Available in multiple sizes and colors to match your style.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 7,
    title: "Women's Active Leggings",
    body_html:
      "Sleek and flexible active leggings designed for a full range of motion during workouts, while keeping you stylish.",
    vendor: "JustFab",
    product_type: "Apparel",
    created_at: "2023-07-01T00:00:00Z",
    updated_at: "2023-08-01T15:00:00Z",
    published_at: "2023-07-05T00:00:00Z",
    status: "active",
    tags: "leggings, activewear, women, fitness",
    variants: [
      {
        id: 113,
        product_id: 7,
        title: "Small / Black / Full-Length",
        price: "39.99",
        sku: "JF-LEG-007-SBLK",
        inventory_quantity: 60,
        option1: "Small",
        option2: "Black",
        option3: "Full-Length",
      },
      {
        id: 114,
        product_id: 7,
        title: "Medium / Navy / Full-Length",
        price: "39.99",
        sku: "JF-LEG-007-MNAV",
        inventory_quantity: 50,
        option1: "Medium",
        option2: "Navy",
        option3: "Full-Length",
      },
    ],
    images: [
      {
        id: 1013,
        product_id: 7,
        src: "https://justfab.com/images/womens-active-leggings-black.jpg",
        variant_ids: [113],
      },
      {
        id: 1014,
        product_id: 7,
        src: "https://justfab.com/images/womens-active-leggings-navy.jpg",
        variant_ids: [114],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["Small", "Medium", "Large", "XL"],
      },
      {
        name: "Color",
        values: ["Black", "Navy", "Burgundy"],
      },
      {
        name: "Length",
        values: ["Full-Length", "Capri"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Active Leggings - Sleek & Flexible",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Move with confidence in our women's active leggings, designed for both performance and style. Available in multiple sizes and colors.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 8,
    title: "Women's Ballet Flats",
    body_html:
      "Comfortable and stylish ballet flats crafted for everyday elegance and ease.",
    vendor: "JustFab",
    product_type: "Footwear",
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T16:00:00Z",
    published_at: "2023-08-05T00:00:00Z",
    status: "active",
    tags: "flats, ballet, footwear, women, casual",
    variants: [
      {
        id: 115,
        product_id: 8,
        title: "5 / Pink / Standard",
        price: "59.99",
        sku: "JF-BF-008-5PNK",
        inventory_quantity: 90,
        option1: "5",
        option2: "Pink",
        option3: "Standard",
      },
      {
        id: 116,
        product_id: 8,
        title: "6 / Black / Standard",
        price: "59.99",
        sku: "JF-BF-008-6BK",
        inventory_quantity: 80,
        option1: "6",
        option2: "Black",
        option3: "Standard",
      },
    ],
    images: [
      {
        id: 1015,
        product_id: 8,
        src: "https://justfab.com/images/womens-ballet-flats-pink.jpg",
        variant_ids: [115],
      },
      {
        id: 1016,
        product_id: 8,
        src: "https://justfab.com/images/womens-ballet-flats-black.jpg",
        variant_ids: [116],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["4", "5", "6", "7"],
      },
      {
        name: "Color",
        values: ["Pink", "Black", "White"],
      },
      {
        name: "Style",
        values: ["Standard", "Embellished"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Ballet Flats - Effortless Elegance",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Step gracefully with our women's ballet flats, designed for both comfort and style. Perfect for any casual or dressy occasion.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 9,
    title: "Women's Casual Sandals",
    body_html:
      "Lightweight and comfortable sandals ideal for warm days, combining effortless style with everyday ease.",
    vendor: "JustFab",
    product_type: "Footwear",
    created_at: "2023-09-01T00:00:00Z",
    updated_at: "2023-08-01T17:00:00Z",
    published_at: "2023-09-05T00:00:00Z",
    status: "active",
    tags: "sandals, casual, footwear, women, summer",
    variants: [
      {
        id: 117,
        product_id: 9,
        title: "7 / Tan / Flat",
        price: "34.99",
        sku: "JF-SND-009-7TAN",
        inventory_quantity: 120,
        option1: "7",
        option2: "Tan",
        option3: "Flat",
      },
      {
        id: 118,
        product_id: 9,
        title: "8 / White / Flat",
        price: "34.99",
        sku: "JF-SND-009-8WHT",
        inventory_quantity: 100,
        option1: "8",
        option2: "White",
        option3: "Flat",
      },
    ],
    images: [
      {
        id: 1017,
        product_id: 9,
        src: "https://justfab.com/images/womens-casual-sandals-tan.jpg",
        variant_ids: [117],
      },
      {
        id: 1018,
        product_id: 9,
        src: "https://justfab.com/images/womens-casual-sandals-white.jpg",
        variant_ids: [118],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["6", "7", "8", "9"],
      },
      {
        name: "Color",
        values: ["Tan", "White", "Blue"],
      },
      {
        name: "Style",
        values: ["Flat", "Wedge"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Casual Sandals - Stylish & Comfortable",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Enjoy sunny days in our women's casual sandals. Designed for comfort and style, they are perfect for any summer outing.",
        namespace: "global",
        type: "string",
      },
    ],
  },
  {
    id: 10,
    title: "Women's Floral Sundress",
    body_html:
      "A breezy and beautiful floral sundress perfect for warm weather, offering a flattering and feminine silhouette.",
    vendor: "JustFab",
    product_type: "Apparel",
    created_at: "2023-10-01T00:00:00Z",
    updated_at: "2023-10-05T14:30:00Z",
    published_at: "2023-10-01T00:00:00Z",
    status: "active",
    tags: "sundress, floral, apparel, women, summer, dress",
    variants: [
      {
        id: 119,
        product_id: 10,
        title: "XS / Floral Blue / Regular",
        price: "44.99",
        sku: "JF-SD-010-XSFBL",
        inventory_quantity: 200,
        option1: "XS",
        option2: "Floral Blue",
        option3: "Regular",
      },
      {
        id: 120,
        product_id: 10,
        title: "S / Floral Pink / Regular",
        price: "44.99",
        sku: "JF-SD-010-SFPK",
        inventory_quantity: 150,
        option1: "S",
        option2: "Floral Pink",
        option3: "Regular",
      },
    ],
    images: [
      {
        id: 1019,
        product_id: 10,
        src: "https://justfab.com/images/womens-floral-sundress-blue.jpg",
        variant_ids: [119],
      },
      {
        id: 1020,
        product_id: 10,
        src: "https://justfab.com/images/womens-floral-sundress-pink.jpg",
        variant_ids: [120],
      },
    ],
    options: [
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
      {
        name: "Color",
        values: ["Floral Blue", "Floral Pink", "Floral White"],
      },
      {
        name: "Fit",
        values: ["Regular", "Slim"],
      },
    ],
    metafields: [
      {
        key: "seo_title",
        value: "Women's Floral Sundress - Breezy & Beautiful",
        namespace: "global",
        type: "string",
      },
      {
        key: "seo_description",
        value:
          "Step into summer with our stunning floral sundress. Designed with a feminine silhouette and available in multiple sizes and colors.",
        namespace: "global",
        type: "string",
      },
    ],
  },
];
export { dummyData };

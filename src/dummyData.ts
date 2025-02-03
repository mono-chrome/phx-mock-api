const dummyData = [
  {
    id: 1,
    title: "Classic Cotton T-Shirt",
    body_html: "Comfortable cotton t-shirt for everyday wear.",
    vendor: "FashionHub",
    product_type: "Apparel",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-08-01T09:30:00Z",
    published_at: "2023-01-01T00:00:00Z",
    status: "active",
    tags: "apparel, summer, casual",
    variants: [
      {
        id: 101,
        product_id: 1,
        title: "Default Title",
        price: "19.99",
        sku: "CC-TS-001",
        inventory_quantity: 100,
        option1: "Default Title",
      },
    ],
    images: [
      {
        id: 1001,
        product_id: 1,
        src: "https://example.com/images/tshirt.jpg",
        variant_ids: [101],
      },
    ],
    options: [
      {
        name: "Title",
        values: ["Default Title"],
      },
    ],
  },
  {
    id: 2,
    title: "Slim Fit Jeans",
    body_html: "Premium denim jeans with modern slim fit.",
    vendor: "DenimCo",
    product_type: "Apparel",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-08-01T10:15:00Z",
    published_at: "2023-02-20T00:00:00Z",
    status: "active",
    tags: "denim, pants, fashion",
    variants: [
      {
        id: 102,
        product_id: 2,
        title: "Default Title",
        price: "49.99",
        sku: "SJ-DF-002",
        inventory_quantity: 75,
        option1: "Default Title",
      },
    ],
    images: [
      {
        id: 1002,
        product_id: 2,
        src: "https://example.com/images/jeans.jpg",
        variant_ids: [102],
      },
    ],
    options: [
      {
        name: "Title",
        values: ["Default Title"],
      },
    ],
  },
  {
    id: 3,
    title: "Wireless Bluetooth Headphones",
    body_html: "High-quality noise-canceling wireless headphones.",
    vendor: "AudioTech",
    product_type: "Electronics",
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2023-08-01T11:00:00Z",
    published_at: "2023-03-15T00:00:00Z",
    status: "active",
    tags: "audio, tech, wireless",
    variants: [
      {
        id: 103,
        product_id: 3,
        title: "Default Title",
        price: "99.99",
        sku: "WBH-003",
        inventory_quantity: 50,
        option1: "Default Title",
      },
    ],
    images: [
      {
        id: 1003,
        product_id: 3,
        src: "https://example.com/images/headphones.jpg",
        variant_ids: [103],
      },
    ],
    options: [
      {
        name: "Title",
        values: ["Default Title"],
      },
    ],
  },
  // Additional products 4-10 would follow the same structure...
  {
    id: 10,
    title: "Ceramic Coffee Mug",
    body_html: "350ml ceramic mug with ergonomic handle.",
    vendor: "HomeEssentials",
    product_type: "Drinkware",
    created_at: "2023-10-01T00:00:00Z",
    updated_at: "2023-10-05T14:30:00Z",
    published_at: "2023-10-01T00:00:00Z",
    status: "active",
    tags: "kitchen, coffee, ceramic",
    variants: [
      {
        id: 110,
        product_id: 10,
        title: "Default Title",
        price: "14.99",
        sku: "CCM-010",
        inventory_quantity: 200,
        option1: "Default Title",
      },
    ],
    images: [
      {
        id: 1010,
        product_id: 10,
        src: "https://example.com/images/mug.jpg",
        variant_ids: [110],
      },
    ],
    options: [
      {
        name: "Title",
        values: ["Default Title"],
      },
    ],
  },
];

export { dummyData };

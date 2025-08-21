import { NextResponse } from "next/server"

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    productId: "1",
    rating: 5,
    title: "Excellent quality and sound",
    content:
      "These headphones exceeded my expectations. The sound quality is incredible, and the noise cancellation works perfectly. Battery life is also impressive.",
    author: "Alex Johnson",
    date: "2023-11-15",
    verified: true,
  },
  {
    id: 2,
    productId: "1",
    rating: 4,
    title: "Great value for money",
    content:
      "Very comfortable to wear for long periods. Sound quality is great, though bass could be a bit stronger. Overall, very satisfied with my purchase.",
    author: "Sarah Miller",
    date: "2023-10-28",
    verified: true,
  },
  {
    id: 3,
    productId: "1",
    rating: 5,
    title: "Perfect for work calls",
    content:
      "I use these headphones daily for work calls and listening to music. The microphone quality is excellent and everyone can hear me clearly. Highly recommend!",
    author: "Michael Chen",
    date: "2023-10-12",
    verified: true,
  },
  {
    id: 4,
    productId: "2",
    rating: 5,
    title: "Amazing fitness companion",
    content:
      "This watch has transformed my fitness routine. The tracking is accurate and the app is intuitive. Battery lasts for days!",
    author: "Emma Wilson",
    date: "2023-11-05",
    verified: true,
  },
  {
    id: 5,
    productId: "2",
    rating: 3,
    title: "Good but has some issues",
    content:
      "The watch looks great and has many features, but I've had some syncing issues with my phone. Customer service was helpful though.",
    author: "David Brown",
    date: "2023-09-30",
    verified: false,
  },
  {
    id: 6,
    productId: "3",
    rating: 5,
    title: "Best t-shirt I've owned",
    content:
      "The quality of this t-shirt is outstanding. After multiple washes, it still looks brand new. Will definitely buy more colors.",
    author: "Jessica Lee",
    date: "2023-11-10",
    verified: true,
  },
  {
    id: 7,
    productId: "4",
    rating: 4,
    title: "Very comfortable chair",
    content:
      "I've been using this chair for my home office for a month now. It's very comfortable for long working hours and my back pain has reduced significantly.",
    author: "Robert Taylor",
    date: "2023-10-22",
    verified: true,
  },
  {
    id: 8,
    productId: "5",
    rating: 5,
    title: "Couldn't put it down!",
    content:
      "This book was absolutely captivating from start to finish. The character development is superb and the plot twists kept me guessing. Highly recommend!",
    author: "Amanda Garcia",
    date: "2023-11-08",
    verified: true,
  },
  {
    id: 9,
    productId: "6",
    rating: 5,
    title: "Professional quality camera",
    content:
      "As a professional photographer, I'm extremely impressed with this camera. The image quality is outstanding and the controls are intuitive. Worth every penny.",
    author: "Chris Wilson",
    date: "2023-10-15",
    verified: true,
  },
  {
    id: 10,
    productId: "7",
    rating: 4,
    title: "Elegant and practical",
    content:
      "This handbag is both stylish and functional. The leather quality is excellent and it has plenty of compartments. The only reason for 4 stars is that it's a bit heavier than expected.",
    author: "Nicole Adams",
    date: "2023-11-02",
    verified: true,
  },
  {
    id: 11,
    productId: "7",
    rating: 5,
    title: "Perfect gift",
    content:
      "I bought this as a gift for my wife and she absolutely loves it. The craftsmanship is excellent and it looks even better in person than in the photos.",
    author: "James Wilson",
    date: "2023-10-25",
    verified: true,
  },
  {
    id: 12,
    productId: "8",
    rating: 5,
    title: "Best water bottle ever",
    content:
      "This water bottle keeps my drinks cold for the entire day! The design is sleek and it doesn't leak at all. I take it everywhere with me now.",
    author: "Lisa Johnson",
    date: "2023-11-12",
    verified: true,
  },
]

// Additional review templates to generate more reviews
const additionalReviews = [
  {
    title: "Highly recommend this product",
    content: "I've been using this for a few weeks now and I'm very impressed with the quality and performance.",
    rating: 5,
    verified: true,
  },
  {
    title: "Good product with minor issues",
    content: "Overall I'm satisfied with this purchase, but there are a few small issues that could be improved.",
    rating: 4,
    verified: true,
  },
  {
    title: "Decent value for the price",
    content: "Not the best quality I've seen, but considering the price point, it's a good value purchase.",
    rating: 3,
    verified: true,
  },
  {
    title: "Exceeded my expectations",
    content: "I wasn't expecting much, but this product really surprised me with its quality and features.",
    rating: 5,
    verified: true,
  },
  {
    title: "Not worth the money",
    content: "I expected better quality for the price. Disappointed with my purchase and wouldn't recommend it.",
    rating: 2,
    verified: false,
  },
  {
    title: "Perfect for my needs",
    content: "This product fits my needs perfectly. The design is elegant and the functionality is excellent.",
    rating: 5,
    verified: true,
  },
  {
    title: "Average product",
    content: "It's okay, nothing special. Does the job but doesn't stand out in any particular way.",
    rating: 3,
    verified: true,
  },
  {
    title: "Great customer service",
    content: "Had an issue with my initial order, but customer service was excellent in resolving it quickly.",
    rating: 4,
    verified: true,
  },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  // Filter reviews for the specific product
  const productReviews = sampleReviews.filter((review) => review.productId === productId)

  // If we have fewer than 10 reviews, add some additional ones
  if (productReviews.length < 10) {
    const neededReviews = 10 - productReviews.length
    const authors = [
      "John Smith",
      "Mary Johnson",
      "Robert Davis",
      "Jennifer Wilson",
      "Michael Brown",
      "Patricia Miller",
      "William Garcia",
      "Elizabeth Martinez",
      "David Anderson",
      "Linda Thomas",
    ]
    const dates = [
      "2023-11-20",
      "2023-11-18",
      "2023-11-15",
      "2023-11-10",
      "2023-11-05",
      "2023-10-30",
      "2023-10-25",
      "2023-10-20",
      "2023-10-15",
      "2023-10-10",
    ]

    for (let i = 0; i < neededReviews; i++) {
      const reviewTemplate = additionalReviews[i % additionalReviews.length]
      const newReview = {
        id: 1000 + i,
        productId: productId,
        rating: reviewTemplate.rating,
        title: reviewTemplate.title,
        content: reviewTemplate.content,
        author: authors[i % authors.length],
        date: dates[i % dates.length],
        verified: reviewTemplate.verified,
      }
      productReviews.push(newReview)
    }
  }

  return NextResponse.json(productReviews)
}

import { Tour } from "../types";

export const tours: Tour[] = [
  {
    id: "t1",
    slug: "ohiya-camping-expedition",
    title: "Ohiya Camping Expedition",
    category: "camping_hiking",
    description: "Experience the ultimate camping expedition through the lush green mountains of Ohiya.",
    durationHours: 24,
    imageUrl: "/images/ohiya-camping.jpg",
    features: [
      "Surathali Ella",
      "Camping Tent Accommodation",
      "Meals Included"
    ],
    pricing: {
      fullTourPrice: 30000,
      perPersonWithMeals: 7400,
      perPersonWithoutMeals: 5000
    }
  },
  {
    id: "t2",
    slug: "devils-staircase-hike-adventure",
    title: "Devil's Staircase Hike Adventure Tour",
    category: "camping_hiking",
    description: "A thrilling hike through the infamous Devil's Staircase.",
    durationHours: 24,
    imageUrl: "/images/devils-staircase.jpg",
    features: [
      "Devil's Staircase Hike",
      "Camping Tent Accommodation",
      "Samanalawewa Camping"
    ],
    pricing: {
      fullTourPrice: 33000,
      perPersonWithMeals: 7400,
      perPersonWithoutMeals: 5000
    }
  },
  {
    id: "t3",
    slug: "hirikatu-oya-river-camping",
    title: "Hirikatu Oya River Camping",
    category: "camping_hiking",
    description: "Relax by the pristine waters of Hirikatu Oya with this family-friendly river camping experience.",
    durationHours: 24,
    imageUrl: "/images/hirikatu-oya.jpg",
    features: ["Hirikatu Oya River", "Night Camping"],
    pricing: {
      fullTourPrice: 28000,
      perPersonWithMeals: 5500,
      perPersonWithoutMeals: 4000
    }
  },
  {
    id: "t4",
    slug: "liptons-seat-tour",
    title: "Lipton's Seat Tour",
    category: "day_tour",
    description: "Explore the beautiful Lipton's Seat.",
    durationHours: 8,
    imageUrl: "/images/weliwanguwa.jpg", // Placeholder
    features: ["Lipton's Seat", "Tea Plantation"],
    pricing: {
      fullTourPrice: 20000,
      perPersonWithMeals: 4900,
      perPersonWithoutMeals: 3200
    }
  }
];

export interface Tour {
  id: string;
  slug: string;
  title: string;
  duration: string;
  startTime: string;
  price: number;
  currency: string;
  priceType: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Extreme";
  description: string;
  routeProgram: string[];
  inclusions: string[];
  optionalAddons: { name: string; price?: string }[];
  image: string;
}

export const tours: Tour[] = [
  {
    id: "t1",
    slug: "ohiya-camping-expedition",
    title: "Ohiya Camping Expedition",
    duration: "2 Days / 1 Night",
    startTime: "12:00 PM",
    price: 7400,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Moderate",
    description: "Experience the ultimate camping expedition through the lush green mountains of Ohiya. Includes scenic waterfall visits and night camping.",
    routeProgram: [
      "Surathali Ella",
      "Idalgashinna",
      "Ohiya Camping",
      "Devil's Staircase",
      "Upper Bambarakanda Natural Pool",
      "Bambarakanda Waterfall"
    ],
    inclusions: [
      "Camping Tent Accommodation",
      "Sleeping Mattress",
      "Sleeping Bags / Blankets",
      "Camping Lights",
      "Camping Chairs",
      "Camping Table",
      "Power Bank",
      "Drinking Water",
      "Charcoal"
    ],
    optionalAddons: [
      { name: "Horton Plains Guide & Tickets", price: "8,700 LKR" }
    ],
    image: "/images/ohiya-camping.jpg" // Placeholder path
  },
  {
    id: "t2",
    slug: "devils-staircase-hike-adventure",
    title: "Devil's Staircase Hike Adventure Tour",
    duration: "2 Days / 1 Night",
    startTime: "08:00 AM",
    price: 7400,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Extreme",
    description: "A thrilling hike through the infamous Devil's Staircase followed by a relaxing campfire BBQ at Samanalawewa.",
    routeProgram: [
      "Surathali Ella",
      "Idalgashinna",
      "Ohiya",
      "Devil's Staircase Hike",
      "Bambarakanda",
      "Natural Bath",
      "Samanalawewa Camping",
      "BBQ",
      "Campfire"
    ],
    inclusions: [
      "Camping Tent Accommodation",
      "Sleeping Mattress",
      "Sleeping Bags / Blankets",
      "Camping Lights",
      "Camping Chairs",
      "Camping Table",
      "Power Bank",
      "Drinking Water",
      "Charcoal"
    ],
    optionalAddons: [
      { name: "Photographer & Drone Shoot" }
    ],
    image: "/images/devils-staircase.jpg"
  },
  // Placeholders for the rest of the 7 routes
  {
    id: "t3",
    slug: "hirikatu-oya-river-camping",
    title: "Hirikatu Oya River Camping",
    duration: "1 Night",
    startTime: "02:00 PM",
    price: 5500,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Easy",
    description: "Relax by the pristine waters of Hirikatu Oya with this family-friendly river camping experience.",
    routeProgram: ["Hirikatu Oya River", "River Bath", "BBQ Dinner", "Night Camping"],
    inclusions: ["Tent", "Sleeping Bags", "Dinner", "Breakfast"],
    optionalAddons: [],
    image: "/images/hirikatu-oya.jpg"
  },
  {
    id: "t4",
    slug: "weliwanguwa-camping-adventure",
    title: "Weliwanguwa Camping Adventure",
    duration: "2 Days / 1 Night",
    startTime: "10:00 AM",
    price: 6500,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Moderate",
    description: "An off-the-beaten-path camping adventure through Weliwanguwa's scenic trails.",
    routeProgram: ["Weliwanguwa Trail", "Viewpoint Hike", "Camping"],
    inclusions: ["Tent", "Sleeping Bags", "Meals"],
    optionalAddons: [],
    image: "/images/weliwanguwa.jpg"
  },
  {
    id: "t5",
    slug: "non-pareil-waterfall-camping",
    title: "Non-Pareil Waterfall Camping",
    duration: "2 Days / 1 Night",
    startTime: "09:00 AM",
    price: 7000,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Hard",
    description: "Experience the majestic Non-Pareil estate and camp near stunning waterfalls.",
    routeProgram: ["Non-Pareil Estate", "Bakers Bend", "Waterfall Camping"],
    inclusions: ["Tent", "Sleeping Bags", "Meals", "Guide"],
    optionalAddons: [],
    image: "/images/non-pareil.jpg"
  },
  {
    id: "t6",
    slug: "hawagala-hiking-camping",
    title: "Hawagala Hiking & Camping",
    duration: "2 Days / 1 Night",
    startTime: "07:00 AM",
    price: 6000,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Hard",
    description: "Conquer the Hawagala peak and enjoy panoramic views of the Sabaragamuwa province.",
    routeProgram: ["Belihuloya", "Hawagala Ascent", "Peak Camping", "Descent"],
    inclusions: ["Tent", "Sleeping Bags", "Meals", "Guide"],
    optionalAddons: [],
    image: "/images/hawagala.jpg"
  },
  {
    id: "t7",
    slug: "lanka-ella-hiking",
    title: "Lanka Ella Hiking",
    duration: "Full Day",
    startTime: "08:00 AM",
    price: 4500,
    currency: "LKR",
    priceType: "per person",
    difficulty: "Moderate",
    description: "A day hike to the beautiful Lanka Ella waterfall hidden deep within the forest.",
    routeProgram: ["Trailhead", "Forest Trek", "Lanka Ella Waterfall", "Return Trek"],
    inclusions: ["Guide", "Packed Lunch", "Water"],
    optionalAddons: [],
    image: "/images/lanka-ella.jpg"
  }
];

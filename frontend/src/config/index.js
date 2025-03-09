export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "students", label: "Students" },
  ],
  genre: [
    { id: "horror", label: "Horror" },
    { id: "fantasy", label: "Fantasy" },
    { id: "mystery", label: "Mystery" },
    { id: "fiction", label: "Fiction" },
    { id: "non-fiction", label: "Non-Fiction" },
    { id: "manga", label: "Manga" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Low to High" },
  { id: "price-hightolow", label: "High to Low" },
  { id: "price-atoz", label: "Title: A to Z" },
  { id: "price-ztoa", label: "Title: Z to A" },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  students: "Students",
};

export const genreOptionsMap = {
  horror: "Horror",
  fantasy: "Fantasy",
  mystery: "Mystery",
  fiction: "Fiction",
  "non-fiction": "Non-Fiction",
  manga: "Manga",
};

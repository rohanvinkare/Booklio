export const booksPoster = [
    { poster: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Carousel Poster" },
    { poster: "https://images.unsplash.com/photo-1647288020413-dc15f04ce1a2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Carousel Poster" },
    { poster: "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Carousel Poster" },
    { poster: "https://images.unsplash.com/photo-1535905748047-14b2415c77d5?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Carousel Poster" },
    { poster: "https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Carousel Poster" },
];

export const books = [
    { poster: "public/booksCoverPage/alchemist.jpeg", name: "Alchemist" },
    { poster: "public/booksCoverPage/atomicHabits.png", name: "Atomic Habits" },
    { poster: "public/booksCoverPage/bhagwatGeeta.jpeg", name: "Bhagwat Geeta" },
    { poster: "public/booksCoverPage/doglapan.jpeg", name: "Doglapan" },
    { poster: "public/booksCoverPage/ikigai.jpeg", name: "Ikigai" },
    { poster: "public/booksCoverPage/thatNight.jpeg", name: "That Night" },
    { poster: "public/booksCoverPage/chandraShekharAzad.jpeg", name: "ChandraShekharAzad" },
    { poster: "public/booksCoverPage/youth.jpeg", name: "Youth" },
    { poster: "public/booksCoverPage/tintin.jpeg", name: "Adventures Of Tintin" },
    { poster: "public/booksCoverPage/steveJobs.jpg", name: "Steve Jobs" },
    { poster: "public/booksCoverPage/j.c.Bose.jpeg", name: "Dr. J.C. Bose" },
    { poster: "public/booksCoverPage/subhashChandraBose.jpeg", name: "The Springing Tiger" },
    { poster: "public/booksCoverPage/ramayana.jpeg", name: "The Ramayana" },
    { poster: "public/booksCoverPage/snowWhite.jpeg", name: "Snow White" },
    { poster: "public/booksCoverPage/cindrella.jpeg", name: "Cindrella" },
    { poster: "public/booksCoverPage/albertEinstein.jpeg", name: "Subtle Is The Lord" },
    { poster: "public/booksCoverPage/lifeAmazingSecrets.jpeg", name: "Life Amazing Secrets" },
    { poster: "public/booksCoverPage/psychologyOfMoney.jpeg", name: "Psychology Of Money" },
    { poster: "public/booksCoverPage/richDadPoorDad.jpeg", name: "Rich Dad Poor Dad" },
    { poster: "public/booksCoverPage/thePowerOfSubconsciousMind.jpeg", name: "The Power Of Subconscious Mind" },
];

function shuffleArray(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

export const randomBoooksSet1 = shuffleArray(books)
    .concat(shuffleArray(books))
    .concat(shuffleArray(books));

export const randomBoooksSet2 = shuffleArray(
    books.filter(book => !randomBoooksSet1.includes(book))
).concat(shuffleArray(books))
    .concat(shuffleArray(books));

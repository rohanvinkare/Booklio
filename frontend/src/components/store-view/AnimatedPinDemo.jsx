import { PinContainer } from "@/components/ui/3d-pin.jsx";
import { Link } from "react-router-dom";

const genreData = [
    {
        title: "Mystery & Thriller",
        description: "Gripping tales with suspenseful twists.",
        href: "/shop/listing",
        image:
            "https://image.tmdb.org/t/p/original/jfw5WoRnPGJQrDdaSOB5QqpjytC.jpg",
    },

    {
        title: "Autobiography",
        description: "Real stories, facts, and life-changing ideas.",
        href: "/shop/listing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv-WIbGl9OKkZVdNFXPp7WGN1-SvbydOEJEg&s",
    },

    {
        title: "Romance",
        description: "Heartwarming love stories and emotional journeys.",
        href: "/shop/listing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7y5fJpYzg0jr8R-J97racms_h4wQa8Uve6Q&s",
    },
    {
        title: "Fantasy",
        description: "Magical realms and legendary creatures.",
        href: "/shop/listing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFL5isjfaleXj548W3xcO6qnvlc31-vjWlQ&s",
    },
    {
        title: "Science Fiction",
        description: "Explore futuristic worlds and alternate realities.",
        href: "/shop/listing",
        image:
            "https://media.istockphoto.com/id/1403817732/video/flying-away-from-the-nebula.jpg?s=640x640&k=20&c=_Va4HotgrhAlB7kDRPTknSX0Cb1TbhsB51VcYBK27n0=",
    },

    {
        title: "Historical",
        description: "Travel back in time with stories of the past.",
        href: "/shop/listing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ46EMBL1dS3qpSInuA_FJ9uHIesiTxY4ItUw&s",
    },
];


export function AnimatedPinDemo() {
    return (
        <div className="w-full px-4 py-8 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {genreData.map((genre, index) => (
                    <Link
                        key={index}
                        to={genre.href}
                        className="flex justify-center sm:justify-start w-full"
                    >
                        <PinContainer title={genre.title} href={genre.href}>
                            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/80 w-[18rem] h-[18rem] bg-[#060606] rounded-lg shadow-md">
                                <h3 className="!pb-2 !m-0 font-bold text-base text-slate-100 z-10">
                                    {genre.title}
                                </h3>
                                <p className="text-sm text-slate-400 z-10">{genre.description}</p>

                                <div
                                    className="flex flex-1 w-full rounded-lg mt-4 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${genre.image})` }}
                                />
                            </div>
                        </PinContainer>
                    </Link>
                ))}
            </div>
        </div>
    );
}

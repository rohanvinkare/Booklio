import { Container } from "@/components/landingPage/Container";
import { FadeIn } from "@/components/landingPage/FadeIn";

export const Usps = () => {
    return (
        <Container className="relative z-10 text-3xl md:text-4xl font-bold space-y-12 text-white max-w-[692px] py-36">
            <FadeIn>
                <p>Explore top-rated titles across all genres, from bestsellers to hidden gems — all in one place.</p>
            </FadeIn>
            <FadeIn>
                <p>Discover books tailored to your taste with our smart recommendation engine, designed to match you with your next favorite read.</p>
            </FadeIn>
            <FadeIn>
                <p>Get your favorite books delivered fast and free with our nationwide shipping service.</p>
            </FadeIn>
            <FadeIn>
                <p>Stay ahead with early access to the latest books at unbeatable prices, only for our members.</p>
            </FadeIn>
        </Container>
    );
}
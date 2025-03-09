import pageNotFoundImage from "@/assets/pageNotFound.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const PageNotFound = () => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md text-center shadow-lg rounded-lg border border-gray-700 bg-gray-800">
                <CardHeader className="py-6">
                    <CardTitle className="text-4xl font-bold text-white">
                        Oops! Page Not Found
                    </CardTitle>
                    <CardDescription className="mt-2 text-gray-400">
                        The link you followed is broken, or the page has been removed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-4">
                    <img
                        src={pageNotFoundImage}
                        alt="Page not found illustration"
                        className="mx-auto w-3/4 mb-6 rounded-lg shadow-md"
                    />
                    <button
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-500"
                        onClick={() => (window.location.href = "/")}
                    >
                        Back to Home
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default PageNotFound;

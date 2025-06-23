const MobileReviews = () => {
    return (
        <div className="block sm:hidden px-4">
            {/* Grid for Mobile */}
            <div className="grid grid-cols-1 gap-y-6 border-y border-gray-200 divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">

                {/* Review 1 */}
                <div className="py-6">
                    <blockquote>
                        <span className="text-sm text-gray-800 dark:text-neutral-200">
                            I'm absolutely floored by the level of care and attention to detail Booklio has put into this platform. We'll definitely be repeat users.
                        </span>
                        <footer className="mt-3">
                            <div className="flex items-center gap-x-2">
                                <img
                                    className="shrink-0 size-6 rounded-full"
                                    src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                    alt="Avatar"
                                />
                                <div className="text-xs text-gray-500 dark:text-neutral-500">Josh Grazioso</div>
                            </div>
                        </footer>
                    </blockquote>
                </div>

                {/* Review 2 */}
                <div className="py-6">
                    <blockquote>
                        <span className="text-sm text-gray-800 dark:text-neutral-200">
                            Booklio has been a game-changer. It boosted our book sales and helped us focus more on what matters.
                        </span>
                        <footer className="mt-3">
                            <div className="flex items-center gap-x-2">
                                <img
                                    className="shrink-0 size-6 rounded-full"
                                    src="https://images.unsplash.com/photo-1671726203390-cdc4354ee2eb?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                    alt="Avatar"
                                />
                                <div className="text-xs text-gray-500 dark:text-neutral-500">Nicole Grazioso</div>
                            </div>
                        </footer>
                    </blockquote>
                </div>

            </div>
        </div>
    );
};

export default MobileReviews;

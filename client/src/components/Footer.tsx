import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer
            className="bg-red-600 text-center text-white lg:text-left">

         
            <div className="mx-6 py-10 text-center md:text-left">
                <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* <!-- Tailwind Elements section --> */}
                    <div className="">
                    <h6
                        className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
                            <path  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        About Website
                    </h6>
                    <p>
                        Yummy Hub is a website that helps stores sell food that is nearly expired while also assisting businesses in reducing food waste.
                    </p>
                    </div>
                    {/* <!-- Products section --> */}
                    <div className="">
                        <h6
                            className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Products
                        </h6>
                        <div className="flex flex-row justify-between w-3/4">
                            <p className="mb-4">
                                <Link to="/type/1" className="text-neutral-200 dark:text-neutral-200"
                                >Dried food</Link>
                            </p>
                            <p className="mb-4">
                                <Link to="/type/2" className="text-neutral-200 dark:text-neutral-200"
                                >Drinks</Link>
                            </p>
                            <p className="mb-4">
                                <Link to="/type/3" className="text-neutral-200 dark:text-neutral-200"
                                >Bread</Link>
                            </p>
                        </div>
                        <div className="flex flex-row justify-between w-3/4">
                            <p className="mb-4">
                                <Link to="/type/4" className="text-neutral-200 dark:text-neutral-200"
                                >Canned food</Link>
                            </p>
                            <p className="mb-4">
                                <Link to="/type/5" className="text-neutral-200 dark:text-neutral-200"
                                >Vegetable</Link>
                            </p>
                            <p className="mb-4">
                                <Link to="/type/6" className="text-neutral-200 dark:text-neutral-200"
                                >Fruit</Link>
                            </p>
                        </div>
                    </div>
                    {/* <!-- Useful links section --> */}
                    <div className="">
                    <h6
                        className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                        Useful links
                    </h6>
                    <p className="mb-4">
                        <Link to="/location" className="text-neutral-200 dark:text-neutral-200"
                        >Location</Link>
                    </p>
                    </div>
                    {/* <!-- Contact section --> */}
                    <div>
                    <h6
                        className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                        Contact
                    </h6>
                    <p className="mb-4 flex items-center justify-center md:justify-start">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5">
                        <path
                            d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path
                            d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        460 S Sathon Rd, Thung Maha Mek, Sathon, Bangkok 10120, Thailand
                    </p>
                    <p className="mb-4 flex items-center justify-center md:justify-start">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5">
                        <path
                            d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path
                            d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                        </svg>
                        yummyhub@gmail.com
                    </p>
                    </div>
                </div>
            </div>

            {/* <!--Copyright section--> */}
            <div className="bg-red-900 p-6 text-center">
            <span>© 2023 Copyright:</span>
            <Link
                className="font-semibold text-white"
                to="/"
            > Yummy Hub</Link>
            </div>
        </footer>
        );
}

export default Footer;
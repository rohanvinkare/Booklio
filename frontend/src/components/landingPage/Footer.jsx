import facebookIcon from '@public/socialIcons/facebook.png';
import githubIcon from '@public/socialIcons/github.png';
import gmailIcon from '@public/socialIcons/gmail.png';
import linkedinIcon from '@public/socialIcons/linkedin.png';

export const Footer = () => {
    return (
        <>
            <div className="h-[30vh] bg-backgroundContrast text-white text-3xl p-20 flex justify-around">
                <div>
                    <p className="font-unbounded text-5xl font-semibold">Booklio</p>
                    <div>
                        <a className="text-lg flex gap-2 mt-2 items-center" href="">
                            Our Team
                            <img className="h-10 w-10" src="/socialIcons/team.png" alt=""></img>
                        </a>
                    </div>
                </div>
                <div>
                    <p className="text-lg pb-5 cursor-pointer">Get To Know Us</p>
                    <hr />
                    <div className="flex flex-col pt-3">
                        <a className="text-xs" href="/">About Booklio</a>
                        {/* <a className="text-xs" href="">Privacy Policy</a> */}
                    </div>
                </div>
                <div>
                    <p className="text-lg pb-5 cursor-pointer">Make Money With Us</p>
                    <hr />
                    <div className="flex flex-col pt-3">
                        <a className="text-xs" href="/auth/seller/login">Sell on Booklio</a>
                        {/* <a className="text-xs" href="/auth/seller/login">Become an Affiliate</a> */}
                        <a className="text-xs" href="/auth/admin/login">Management Account</a>
                    </div>
                </div>
                <div>
                    <p className="text-lg pb-5 cursor-pointer">Let Us Help You</p>
                    <hr />
                    <div className="flex flex-col pt-3">
                        <a className="text-xs" href="/user">Your Account</a>
                        {/* <a className="text-xs" href="">Services</a> */}
                        {/* <a className="text-xs" href="">Contact</a> */}
                    </div>
                </div>
                <div>
                    <p className="text-lg pb-5 cursor-pointer">Connect With Us</p>
                    <hr />
                    <div className="flex gap-2 pt-5">
                        <img className="h-5 w-5" src={facebookIcon} alt="Facebook" />
                        <img className="h-5 w-5" src={githubIcon} alt="Github" />
                        <img className="h-5 w-5" src={gmailIcon} alt="Gmail" />
                        <img className="h-5 w-5" src={linkedinIcon} alt="Linkedin" />
                    </div>
                </div>
            </div>
            <div className="bg-background text-xs text-white flex justify-center items-center">
                © Copyright: All rights reserved by Booklio.com
            </div>
        </>
    );
}
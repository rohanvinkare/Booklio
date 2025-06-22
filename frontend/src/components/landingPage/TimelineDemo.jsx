import { Timeline } from "@/components/ui/timeline";
import { TextAnimate } from "@/components/magicui/text-animate";

// Optional helper to inject Cloudinary transformations
const optimizeImage = (url) =>
  url.replace("/upload/", "/upload/w_600,q_auto,f_auto/");

const TimelineDemo = () => {
  const data = [
    {
      title: "Buy",
      content: (
        <div>
          <p className="mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200">
            <TextAnimate animation="blurInUp" by="character" once>
              Discover a wide range of authentic products from trusted sellers. Explore curated selections, compare options, and purchase seamlessly — all from one platform.
            </TextAnimate>
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              "v1750007870/12_m0ekv0.png",
              "v1750008125/4_nxxshx.png",
              "v1750007893/15_xcd2jx.png",
              "v1750007826/13_qmscz7.png",
            ].map((path, i) => (
              <img
                key={i}
                src={optimizeImage(`https://res.cloudinary.com/djwfg6dgl/image/upload/${path}`)}
                alt="buy step"
                width={600}
                height={240}
                className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Sell",
      content: (
        <div>
          <p className="mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200">
            <TextAnimate animation="blurInUp" by="character" once>
              Become a verified seller and reach thousands of potential buyers. List products, manage pricing, and handle sales all within our simple-to-use dashboard.
            </TextAnimate>
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              "v1750007983/7_genue5.png",
              "v1750007945/5_hjeejq.png",
              "https://assets.aceternity.com/pro/bento-grids.png", // Not Cloudinary
              "v1750007816/16_ypjm3r.png",
            ].map((path, i) => (
              <img
                key={i}
                src={
                  path.startsWith("http")
                    ? path
                    : optimizeImage(`https://res.cloudinary.com/djwfg6dgl/image/upload/${path}`)
                }
                alt="sell step"
                width={600}
                height={240}
                className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Track",
      content: (
        <div>
          <p className="mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200">
            <TextAnimate animation="blurInUp" by="character" once>
              Stay updated on your orders in real-time. Get status updates, shipping info, and manage returns or issues with ease through your personal dashboard.
            </TextAnimate>
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              "v1750007871/11_sozi8y.png",
              "v1750007841/9_waap3y.png",
              "v1750007870/10_twroyv.png",
              "v1750007832/14_i1dmlr.png",
            ].map((path, i) => (
              <img
                key={i}
                src={optimizeImage(`https://res.cloudinary.com/djwfg6dgl/image/upload/${path}`)}
                alt="track step"
                width={600}
                height={240}
                className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
};

export default TimelineDemo;

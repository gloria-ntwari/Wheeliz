import { Button } from "../../../../components/ui/button";

const quickLinks = [
  { label: "About", href: "#about-section" },
  { label: "Where to Buy", href: "#newsletter-section" },
  { label: "FAQ", href: "#faq-section" },
  { label: "Careers", href: "#intro-section" },
];

const productLinks = [
  { label: "About", href: "#about-section" },
  { label: "Where to Buy", href: "#newsletter-section" },
  { label: "FAQ", href: "#faq-section" },
  { label: "Careers", href: "#intro-section" },
];

const connectLinks = [
  { label: "Instagram" },
  { label: "Facebook" },
];

export const FooterSection = (): JSX.Element => {
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <footer className="w-full bg-[#181817] py-8 sm:py-12 px-4 sm:px-6 lg:px-16">
      <div className="max-w-[1490px] mx-auto">
        {/* First Row - Four Columns */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 mb-8 lg:mb-12">
          {/* Column 1 - Logo and Description */}
          <div className="flex flex-col w-full lg:w-[410px] items-center lg:items-start gap-6 lg:gap-8 text-center lg:text-left">
            <img
              className="w-[180px] sm:w-[220px] lg:w-[297px] h-auto"
              alt="Wheeliez Logo"
              src="/clip-path-group-16.png"
            />
            <p className="[font-family:'Barlow',Helvetica] font-semibold text-[#ffffff80] text-base sm:text-lg lg:text-[25px] leading-relaxed">
              We craft great tasting natural snacks <br className="hidden sm:block" />
              that inspire people to go beyond.
            </p>
          </div>

          {/* Links Container - For mobile/tablet */}
          <div className="flex flex-col sm:flex-row justify-between w-full lg:hidden gap-8 sm:gap-12">
            {/* Quick Links */}
            <nav className="flex flex-col items-center sm:items-start gap-4">
              <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-xl sm:text-2xl leading-[34px]">
                Quick Links
              </h3>
              <ul className="flex flex-col items-center sm:items-start gap-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                      className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Our Product */}
            <nav className="flex flex-col items-center sm:items-start gap-4">
              <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-xl sm:text-2xl leading-[34px]">
                Our Product
              </h3>
              <ul className="flex flex-col items-center sm:items-start gap-2">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                      className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect */}
            <nav className="flex flex-col items-center sm:items-start gap-4">
              <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-xl sm:text-2xl leading-[34px]">
                Connect
              </h3>
              <ul className="flex flex-col items-center sm:items-start gap-2">
                {connectLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Desktop Layout - Hidden on mobile/tablet */}
          {/* Column 2 - Quick Links */}
          <nav className="hidden lg:flex flex-col items-start gap-6 w-full sm:w-auto">
            <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-2xl lg:text-3xl leading-[34px]">
              Quick Links
            </h3>
            <ul className="flex flex-col items-start gap-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                    className="[font-family:'Barlow',Helvetica] font-medium text-white text-lg sm:text-xl lg:text-[25px] hover:opacity-80 transition-opacity text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 - Our Product */}
          <nav className="hidden lg:flex flex-col items-start gap-6 w-full sm:w-auto">
            <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-2xl lg:text-3xl leading-[34px]">
              Our Product
            </h3>
            <ul className="flex flex-col items-start gap-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                    className="[font-family:'Barlow',Helvetica] font-medium text-white text-lg sm:text-xl lg:text-[25px] hover:opacity-80 transition-opacity text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 - Connect */}
          <nav className="hidden lg:flex flex-col items-start gap-6 w-full sm:w-auto">
            <h3 className="[font-family:'Barlow',Helvetica] font-bold text-white text-2xl lg:text-3xl leading-[34px]">
              Connect
            </h3>
            <ul className="flex flex-col items-start gap-3">
              {connectLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="[font-family:'Barlow',Helvetica] font-medium text-white text-lg sm:text-xl lg:text-[25px] hover:opacity-80 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Second Row - Copyright and Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 lg:items-center lg:py-14 py-8">
          {/* Mobile/Tablet Layout */}
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:hidden">
            <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg text-center">
              © Wheeliez 2025
            </div>
            <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg text-center">
              Privacy Policy
            </div>
          </div>

          <div className="lg:hidden">
            <Button 
              onClick={() => smoothScrollTo('featured-products-section')}
              className="w-[160px] sm:w-[180px] h-[45px] sm:h-[50px] bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2 rounded-none"
            >
              <span className="[font-family:'Barlow',Helvetica] font-medium text-sm sm:text-base whitespace-nowrap">
                BACK TO TOP
              </span>
              <img
                className="w-4 h-4"
                alt="Arrow"
                src="/ooui-arrow-next-ltr-2.svg"
              />
            </Button>
          </div>

          {/* Desktop Layout - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-10" style={{ marginLeft: '501px' }}>
            <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-lg sm:text-xl lg:text-[25px]">
              © Wheeliez 2025
            </div>
            <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-lg sm:text-xl lg:text-[25px]">
              Privacy Policy
            </div>
          </div>

          <div className="hidden lg:flex items-center" style={{ marginLeft: '240px' }}>
            <Button 
              onClick={() => smoothScrollTo('featured-products-section')}
              className="w-[180px] sm:w-[200px] lg:w-[230px] h-[50px] sm:h-[55px] lg:h-[60px] bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2 rounded-none"
            >
              <span className="[font-family:'Barlow',Helvetica] font-medium text-base sm:text-lg lg:text-xl whitespace-nowrap">
                BACK TO TOP
              </span>
              <img
                className="w-4 h-4 sm:w-5 sm:h-5"
                alt="Arrow"
                src="/ooui-arrow-next-ltr-2.svg"
              />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
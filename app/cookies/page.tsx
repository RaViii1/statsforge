import Footer from '@/components/Footer';
import NavbarLoL from '@/components/Navbar';
import React from 'react';

const CookiesPolicy: React.FC = () => {
  return (
    <div className='bg-[#0d0d0f]'>
      <NavbarLoL />
      <div className=" max-w-4xl mx-auto py-12 px-6 min-h-screen bg-[#121010] text-zinc-300 selection:bg-orange-500/30 overflow-x-hidden font-sans">
        
        <h1 className="text-3xl font-bold mb-2 text-orange-500">StatsForge.gg Cookies Policy</h1>
        <p className="text-sm text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 20, 2026
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500">What are cookies?</h2>
          <p className="mb-4 text-gray-200 leading-relaxed">
            Cookies are small text files stored by your browser as you browse the Internet. They can be used to 
            collect, store, and share data about your activities across websites, including on StatsForge.gg. 
            Cookies also allow us to remember things about your visits to StatsForge.gg, like your preferred 
            language, and to make the site easier to use.
          </p>
          <p className="text-gray-200 leading-relaxed">
            We use both session cookies, which expire after a short time or when you close your browser, and 
            persistent cookies, which remain stored in your browser for a set period of time. We use session 
            cookies to identify you during a single browsing session, like when you log into StatsForge.gg. 
            We use persistent cookies where we need to identify you over a longer period, like when you 
            request that we keep you signed in.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-orange-500">Why does StatsForge.gg use cookies and similar technologies?</h2>
          <p className="mb-6 text-gray-200 leading-relaxed">
            We use cookies and similar technologies like web beacons, pixel tags, or local shared objects 
            ("flash cookies"), to deliver, measure, and improve our services in various ways. We use these 
            cookies both when you visit our site and services through a browser and through the desktop app. 
            As we adopt additional technologies, we may also gather additional data through other methods.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Authentication and security</h3>
              <ul className="list-disc pl-6 space-y-1 mb-0 text-gray-200">
                <li>To log you into StatsForge.gg</li>
                <li>To protect your security</li>
                <li>To help detect and fight spam, abuse, and other activities that violate StatsForge.gg's agreements</li>
              </ul>
              <p className="mt-2 text-gray-200">
                For example, cookies help authenticate your access to StatsForge.gg and prevent unauthorized 
                parties from accessing your accounts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Preferences</h3>
              <ul className="list-disc pl-6 space-y-1 mb-0 text-gray-200">
                <li>To remember data about your browser and your preferences</li>
                <li>To remember your settings and other choices you've made</li>
              </ul>
              <p className="mt-2 text-gray-200">
                For example, cookies help us remember your preferred language or the country you're in, so we 
                can provide content in your preferred language without asking each time you visit.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Analytics and research</h3>
              <p className="mb-2 text-gray-200">
                To help us understand how you are using the Services so that we can make them better, faster, and safer.
              </p>
              <p className="mb-2 text-gray-200">
                For example, cookies help us test different versions of StatsForge.gg to see which features or 
                content users prefer, web beacons help us determine which email messages are opened, and cookies 
                help us see how you interact with StatsForge.gg, like the links you click on.
              </p>
              <p className="mb-2 text-gray-200">
                We also work with a number of analytics partners, including Google Analytics and Mixpanel, who use 
                cookies and similar technologies to help us analyze how users use the Services, including by noting 
                the sites from which you arrive. Those service providers may either collect that data themselves 
                or we may disclose it to them.
              </p>
              <p className="text-gray-200">
                You can opt out of some of these services through tools like the{' '}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                ,{' '}
                <a 
                  href="https://mixpanel.com/optout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Mixpanel Opt-Out Cookie
                </a>
                , and{' '}
                <a 
                  href="https://www.hotjar.com/opt-out" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Hotjar Opt-Out Cookie
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Personalized content</h3>
              <p className="mb-2 text-gray-200">To customize StatsForge.gg with more relevant content</p>
              <p className="text-gray-200">
                For example, cookies help us show personalized stats, builds, and recommendations tailored 
                to your gameplay.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Advertising</h3>
              <p className="mb-2 text-gray-200">To provide you with more relevant advertising.</p>
              <p className="mb-2 text-gray-200">
                Through our Services, StatsForge.gg may allow third party advertising partners to set cookies 
                and other tracking tools to collect information regarding your activities and your device 
                (e.g., your IP address, mobile identifiers, page(s) visited, location, time of day). We may 
                also combine and share such information and other information (such as demographic information 
                and past purchase history) with third party advertising partners.
              </p>
              <p className="mb-2 text-gray-200">
                These advertising partners may use this information (and similar information collected from 
                other websites) for purposes of delivering targeted advertisements to you when you visit third 
                party websites within their networks. This practice is commonly referred to as "interest-based 
                advertising" or "online behavioral advertising."
              </p>
              <p className="mb-4 text-gray-200">
                If you prefer not to share your information with third party advertising partners, you may 
                follow the instructions below.
              </p>
              <p className="text-gray-200 mb-4">
                To learn more about targeting and advertising cookies and how you can opt out, visit{' '}
                <a 
                  href="http://www.allaboutcookies.org/manage-cookies/index.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  www.allaboutcookies.org/manage-cookies/index.html
                </a>
                , or if you're located in the European Union, visit the{' '}
                <a 
                  href="http://www.youronlinechoices.eu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Your Online Choices site
                </a>
                .
              </p>
              <p className="mt-2 text-gray-200">
                Please note that where advertising technology is integrated into the Services, you may still 
                receive advertising on other websites and applications, but it will not be tailored to your interests.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-orange-500">What are my privacy options?</h2>
          <p className="mb-4 text-gray-200">
            You have a number of options to control or limit how we and our partners use cookies:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-200">
            <li>
              Most browsers automatically accept cookies, but you can change your browser settings to decline 
              cookies by consulting your browser's support articles. If you decide to decline cookies, please 
              note that you may not be able to sign in, customize, or use some interactive features in the Services.
            </li>
            <li>
              Flash cookies operate differently than browser cookies, so your browser's cookie-management tools 
              may not remove them. To learn more about how to manage Flash cookies, see Adobe's{' '}
              <a 
                href="https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                article on managing flash cookies
              </a>{' '}
              and{' '}
              <a 
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Website Storage Settings panel
              </a>
              .
            </li>
            <li>
              To get information and control cookies used for tailored advertising from participating companies, 
              see the consumer opt-out pages for the{' '}
              <a 
                href="http://www.networkadvertising.org/choices" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Network Advertising Initiative
              </a>{' '}
              and{' '}
              <a 
                href="http://www.aboutads.info/choices/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Digital Advertising Alliance
              </a>
              , or if you're located in the European Union, visit the{' '}
              <a 
                href="http://www.youronlinechoices.eu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Your Online Choices site
              </a>
              . To opt out of Google Analytics' display advertising or customize Google Display Network ads, 
              visit the{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Google Ads Settings page
              </a>
              .
            </li>
            <li>
              For general information about targeting cookies and how to disable them, visit{' '}
              <a 
                href="http://www.allaboutcookies.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                www.allaboutcookies.org
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-500">Updates & Contact Info</h2>
          <p className="mb-4 text-gray-200">
            From time to time, we may update this Cookie Policy. If we do, we'll notify you by posting the 
            policy on our site with a new effective date.
          </p>
          <p className="text-gray-200">
            If you have any questions about our use of cookies, please email us at{' '}
            <a href="mailto:privacy@statsforge.gg" className="text-orange-400 hover:text-orange-300 underline font-semibold">
              privacy@statsforge.gg
            </a>
            .
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;

"use client";

const PrivacyPolicy: React.FC = () => {

  return (
      <div className='flex h-full w-full flex-col justify-between'>
        <h1 className="font-bold">privacy-policy</h1>

        <h2>Who We Are</h2>
        <p>Our website address is: <a href="https://cockpit.coach/">https://cockpit.coach/</a>.</p>

        <h2>Comments</h2>
        <p>If a visitor leaves a comment on the site, we collect the data shown in the comments form, as well as the visitor's IP address and browser user agent string to help with spam detection.</p>
        <p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p>

        <h2>Media Files</h2>
        <p>If you are a registered user and upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p>
        <h2>Cookies</h2>
        <p>If you leave a comment on our site, you may opt-in to saving your name, email address, and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p>
        <p>If you have an account and you log in to this site, we will set a temporary cookie to determine </p>
      </div>
  
  );
};

export default PrivacyPolicy;

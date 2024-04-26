# AlienGear ![](/public/navbar/NavbarAppIcon.svg)

AlienGear is my personal e-commerce project designed to demonstrate my skills in web development, particularly in creating a functional and user-friendly online store. This project is part of my portfolio, showcasing my proficiency in various technologies and tools used in modern web development.

## 🚀 Technologies Behind AlienGear

- *Frontend*: Built with React, ensuring a dynamic and responsive user interface.
- *Styling*: Utilizing Scss for custom styling, making AlienGear visually appealing and user-friendly.
- *Backend*: Powered by Firebase Realtime Database for efficient data management and Vercel Serverless Functions for backend logic, including Stripe integration for secure payments.
- *Authentication*: Secure user authentication with Firebase Authentication.
- *Images*: Product images are stored securely on Firebase Storage, providing fast and reliable access.
- *Payment Processing*: Integrated with Stripe for a secure and efficient payment gateway.
- *Deployment*: Hosted on Vercel.com, ensuring high availability and performance.

## 🌟 Key Features

- *Product Catalog*: Explore a wide range of products with detailed descriptions, high-quality images, and competitive prices.
- *User Authentication*: Secure sign-up and login options, including password recovery and email verification for a seamless experience.
- *Shopping Cart*: Easily manage your cart with the ability to add, remove, or modify items before checkout.
- *Payment Gateway*: Securely process payments with Stripe, ensuring your transactions are safe and efficient.
- *Catalog filters*: Narrow down your search with various filters to find exactly what you're looking for.
- *Individual product page*: Dive into the details of each product with comprehensive information and bigger variety of pictures.
- *Smoothe animations*: Enjoy a visually pleasing experience with smooth animations that enhance usability.
- *Responsive design*: Access AlienGear from any device, ensuring a consistent and enjoyable shopping experience across all platforms.

## 🎨 Design

The design of AlienGear is a blend of my original vision and inspired by the clean, modern look of razer.com. It's a balance of functionality and aesthetics, aiming to create a user-friendly and visually appealing platform.

## 📷 Screenshots

### Home Page

![](/screenshots/home_page.png)

<details>
<summary>Products Page</summary>

![](/screenshots/product_page.png)

</details>

<details>
<summary>Individual Product Page</summary>

![](/screenshots/individualProduct_page.png)
![](/screenshots/pads_individual_page.png)

</details>

<details>
<summary>About Us Page</summary>

![](/screenshots/about_us_page.png)

</details>

<details>
<summary>Search Page</summary>

![](/screenshots/search_page.png)

</details>

<details>
<summary>Profile / Sign In / Sign Up / Password Reset Pages</summary>

![](/screenshots/profile_page.png)
![](/screenshots/sign_in_page.png)
![](/screenshots/sign_up_page.png)
![](/screenshots/password_reset_page.png)

</details>

<details>
<summary>Cart Page</summary>

![](/screenshots/cart_page.png)

</details>

<details>
<summary>Payment Success / Cancel Page</summary>

![](/screenshots/success_page.png)
![](/screenshots/cancel_page.png)

</details>

## 🌐 Link to Live Site

- Live Site URL: [AlienGear](https://aliengear.vercel.app/)

## 💭 Reflection

This project marked my first step into designing and developing a computer accessories web store. My primary goals were to implement functional authentication and payment systems, create a user-friendly shopping cart and search functionality, and enhance my web design skills. This was my first time working with different APIs, setting up payment and authentication systems, and using environment variables. Additionally, it was my first React application, which presented its own set of challenges.

I chose React for its popularity and interest, and used Vite for setting up the project. I tried to make single page application. Initially, I faced difficulties with single page application navigation, but eventually found a solution. For styling, I opted for Sass to try something new, and for authentication and database, I selected Firebase due to its ease of implementation and popularity. Vercel was chosen for hosting, as it was familiar and well-liked. I chose not to host any backend server-side infrastructure, as the only requirement for server-side functionality was the implementation of Stripe. Vercel's serverless functions proved to be an excellent solution for this specific case, offering a streamlined and efficient approach.

While not a designer, I aimed for a clean and functional design. The website is responsive, though improvements could be made, especially in terms of responsivness for different screen sizes. 
Overall, I'm quite satisfied with the final appearance of the website. While there's room for improvement, particularly in making the profile page more visually appealing, the constraints were limited by small user information available (name, email, and password), which naturally limited design options. Additionally, the responsive design could have been enhanced, but I found myself overwhelmed by the complexity of managing different font sizes. Initially, I thought increasing the UI size on larger screens would improve the design, but ultimately, adjusting font sizes for each screen size breakpoint proved to be a less effective solution. Despite these challenges, the website remains responsive, and with some refinement, it could achieve a cleaner look.

In reviewing the code, I aimed to ensure readability, even without the use of comments. However, I also utilized comments to clarify specific functions and areas of the code. There's definitely potential to enhance reusability, something I've already attempted in certain sections, such as the products page.

Regarding the use of React Router, I was aware that my website would only feature a navbar and lack a footer. Consequently, I configured the navbar and incorporated an ```<Outlet />``` element within it. If a footer were to be included, the structure would likely involve placing ```<Header />```, ```<Outlet />```, and ```<Footer />``` elements sequentially within main.jsx. Overall, the router functions as intended, and the website flow aligns with the desired design

Lessons Learned and Future Improvements:
- The approach to responsive design, particularly with different font sizes for each screen size breakpoint, was not optimal. Future iterations could benefit from a cleaner, more consistent approach.
- There's potential to make the code more reusable, as demonstrated in the products page.
- The project was a learning experience, and I've gained valuable insights into the tools and technologies I used.

Overall, this project was a rewarding learning experience, challenging me to expand my skills and knowledge in web development. While there are areas for improvement, I'm proud of the progress made and look forward to applying these learnings in future projects.

## 📚 Useful resources

- [Razer's webite](https://www.razer.com/store) - Served as a source for design references, and all images featured on my website were sourced from this site.

## 👤 Author

- Gmail - [nick.richardson.4884@gmail.com](mailto:nick.richardson.4884@gmail.com)
- Discord - [@Rikcher](https://discordapp.com/users/259270379942445056)
- Twitter - [@4Rikcher](https://twitter.com/4Rikcher)


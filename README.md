# Instatus wrapper
A simple wrapper that bypasses the $15 restriction on <a href="instatus.com">instatus.com</a> for the feature called "Custom Domains".

# Example
You can visit an example by visiting <a href="instatus-wrapper.vercel.app">this link</a> or clicking the one in the repository.  
<br>
<img width="257" height="147" alt="image" src="https://github.com/user-attachments/assets/0fd24739-d55e-41b0-8ea6-84a42f1ce700" />
<br><br>
You can also visit <a href="https://status.vex.systems">status.vex.systems</a> as live proof that it works.

# How to use
Fork this repo, then go to <a href="https://github.com/Vex-Systems/instatus-wrapper/blob/main/public/config.js">this file</a> and change the Instatus URL to one of yours.  
<br>
<img width="852" height="77" alt="image" src="https://github.com/user-attachments/assets/7423d0f5-e990-4c1b-a694-aba40d7898c1" />
<br>
That's all! Now you can host it on Vercel and have unlimited custom domains, instead of just one in the Pro plan and three in the Business plan.

# Limitations
It will render the page accurately, including metadata such as title and favicon. However, it will **NOT** work with "OG" <meta> properties or Twitter embeds. The tags you see in the browser are set after the metadata is fetched from the origin, not before rendering. The cache TTL is **15 minutes**. Besides that, there is no practical way to store any data on serverless platforms like Vercel. If you plan to host this on another provider, you are welcome to open a pull request to add functionality that displays embeds correctly.  
<br><br>
<img width="426" height="128" alt="image" src="https://github.com/user-attachments/assets/ca35c11e-7f95-4abf-96f7-067961f717ed" /><br><br>
<img width="482" height="79" alt="image" src="https://github.com/user-attachments/assets/ae858fb3-b559-4228-9857-830e76eaddb4" /><br>
*The metadata is cloned from the original <a href="instatus.com">instatus.com</a> page.*

# Why?
I hate features being put behind paywalls, even for this such simple thing, competition like BetterStack have this option in their base plan, why make it such a trouble to add a subdomain. It is understandable to have more options in paid plans but why restrict such a basic one, cmon :)

🕣 Timestamps:
0:00 Intro + What we’re building today
1:05 Pizza app concept and design breakdown
2:39 Why Use Expo & Clerk
3:00 Why Expo SDK 55 is exciting
4:25 Expo widgets and live activities
6:06 Clerk AuthView one-line auth UI
7:54 Sign up flow for Expo + Clerk
10:00 Creating the Clerk app for Papa Pizza
12:00 Bootstrapping the Expo app
14:38 Opening the project in Cursor
15:23 Running the app in Expo Go
17:28 Git + setup best practices for vibe coding
18:07 Setting up the Next.js admin app with Convex
24:24 Running the admin + backend locally
26:04 Wiring Clerk into the admin app
32:38 Splitting frontend, backend, and app workflows
34:24 Connecting the mobile app to Convex
37:04 Setting up native auth in Expo
44:45 Building the first auth screens
52:30 Product planning and app structure decisions
1:05:00 Building the core mobile UI
1:25:00 Adding menu and product flows
1:46:00 Cart logic and order flow
2:10:00 Clerk + auth refinements
2:28:00 Convex data modeling and backend work
2:52:00 Admin dashboard progress
3:16:00 Realtime updates and app wiring
3:38:00 Debugging + fixing build issues
4:02:00 Polish, cleanup, and final improvements
4:24:00 Final walkthrough and Outro

Chapter 1: Intro + What we’re building today
0:022 secondsYo, what is going on Papa fam? Welcome back to the stream. It's your boy Sunny and today we are diving into episode
0:1010 secondsfive of the Vibe Code the right way with me series. Welcome back. Today we're building a delivery pizza app. So, this
0:1717 secondsone is really interesting because it sounds simple, but I promise you on the surface, this is a huge build. I think it's going to be the biggest vibecoded build we've ever done on the channel.
0:2626 secondsSo, buckle up, get your coffees ready.
0:2727 secondsLet me know where you're watching from right now. And of course, smash that like button if you've been enjoying the content on this channel. A lot of you guys are watching right now that aren't actually subscribed. So, do me a favor,
0:3636 secondssubscribe to the channel and let me know where you're watching from right now.
0:3838 secondsThe second that beat drops, we're going to be diving into a build powered by our friends over at Expo and Clerk. They're going to be powering up the whole thing.
0:4646 secondsWe have a native app today, iOS and Android, and we have an whole Nex.js admin panel, all powered by Convex behind it all. It's crazy. We're going
0:5454 secondsto do so much today. Go ahead and get ready, guys. Jump into the build. We're going to be doing a pizza delivery app in three, two, one. Check it out, guys.
Chapter 2: Pizza app concept and design breakdown
1:051 minute, 5 secondsSo, here we have it. Hey, look at we got Tatiana in the house. What's up? Yeah. Yeah. From Ethiopia. What's up, guys?
1:111 minute, 11 secondsGood to see you all. So, here we have the design for the pizza delivery app.
1:151 minute, 15 secondsSo, very, very common, you know, pizza delivery app. And again, this is not going to be for a multi-tenant app. This is going to be more for like say Fred's Pizzeria. Okay. So, we're going to show
1:241 minute, 24 secondsyou effectively imagine you have a client. They want to have a delivery app built for specifically for their own system and we're going to build
1:311 minute, 31 secondseverything inhouse. Okay. So, imagine system like this. Now, this website right here is dribble. Oops. This website right here is dribble. So, I love using dribble. And what I'm going
1:391 minute, 39 secondsto do is I'm going to show you from the ground up because the difference with these live streams is these are not prepped. There is no code right now. I'm going to be literally teaching you how
1:481 minute, 48 secondsto go from the design, getting the requirements together, and then going ahead and building everything from absolute scratch. So, it's kind of crazy. Honestly, I don't know why I put
1:571 minute, 57 secondsmyself in these situations, but I do it to help you guys learn. So, we're going to effectively have an app. So, we're going to build the whole app live today and then we're also going to have
2:052 minutes, 5 secondseffectively an admin panel. Let me see if they have some kind of admin dashboards that look pretty good.
2:102 minutes, 10 secondsDribble is more of a design website. It helps us out with a few things, but imagine we had like a food admin dashboard. So, if we go to just type in something like food admin or food, I
2:192 minutes, 19 secondsguess. Yeah. So, something like this, I guess, on the back end where we can see the orders coming through. Obviously, it wouldn't look exactly like this, but we're going to go ahead and build this.
2:272 minutes, 27 secondsOkay. So, go ahead. We got Sir Leon in the house. I recognize a lot of people as well. What's up, guys? Ghana as well.
2:332 minutes, 33 secondsWhat's up, US? I see you guys. So, we're going to go ahead and jump over to the uh I forgot what this is called, easel,
Chapter 3: Why Use Expo & Clerk
2:392 minutes, 39 secondsright? We're going to go ahead and plan things out now. Before we do, a quick word from today's sponsors that make the whole thing possible and allow me to keep on building things like this for
2:472 minutes, 47 secondsabsolutely free. First up, we have Clerk. Now, Clerk is of course going to be handling the authentication inside this app. It's going to be handling the billing portion as well. So,
2:542 minutes, 54 secondsauthentication today is something that I'm really excited about and also we have uh Expo today. So, Expo, if you haven't used Expo, I don't know where
Chapter 4: Why Expo SDK 55 is exciting
3:023 minutes, 2 secondsyou've been living because Expo is how effectively you build an app the right way in my opinion. Okay, so Expo has really done something incredible and I really wanted to bring it to you guys.
3:113 minutes, 11 secondsThey've introduced Expo router 55 or actually the whole SDK 55 is pretty damn awesome because if you've ever seen iOS,
3:183 minutes, 18 secondsthey have such a beautiful glass, you know, it was a bit opinionated in the beginning, but you have this glass UI.
3:243 minutes, 24 secondsSo now Expo allows you to natively add this in. Now, if you don't know what Expo is, effectively it's one code base that allows us to write the code once
3:323 minutes, 32 secondsand compile it down to iOS, Android, and even web. Right? We're going to be focusing on the iOS and Android part of that compilation and then we're going to have an X.js app for the back end. Okay.
3:423 minutes, 42 secondsBut in this case, if we go ahead and let me just go ahead and stop the music for a little bit and I'll show you guys over here. They have a really nice blog that they actually showcase all of these uh
3:503 minutes, 50 secondsfeatures for them. But in this case, I think if it loads up for me on stream,
3:543 minutes, 54 secondsof course, it's not going to load. But anyway, but basically, this is going to go ahead and uh be some of the cool elements that we can add inside of our app. So, even things like this behavior
4:024 minutes, 2 secondswhere we have these beautiful kind of glass pop outs. All of this stuff is now natively supported. I really like this one. This is so clean. Look, as you
4:114 minutes, 11 secondsscroll down, you have this bottom accessory. So, we can go ahead and add in a bunch of those things. They even have toolbars is very cool. My favorite
4:184 minutes, 18 secondsone that I'm really excited about is the widgets. So, it's actually part of the I believe it's SDK55 change log. So, you
Chapter 5: Expo widgets and live activities
4:254 minutes, 25 secondscan go actually check it out right now on their website. If you type in Expo SDK55, you can go check them out. But scrolling down, I believe it was the
4:334 minutes, 33 secondswidgets. So, let me just type in widgets. Here we are. Right now, this is sick because I don't know if you guys have ever seen it, but of course, you would have seen any some kind of app on
4:424 minutes, 42 secondsyour uh I guess this is happening because of Twitter. But if we go in here, but basically, you can now build
4:484 minutes, 48 secondsnative widgets inside of your um inside of your apps, which is awesome. So, look at that. A full widget with live
4:554 minutes, 55 secondsactivity previews. This is sick. This is so so nice. So, we now have all of this.
5:005 minutesJay's actually sent me a very good article. Uh, let me go ahead and click that one, Jay. Let me go and see if that loads up. What exactly? Oh, thank you,
5:065 minutes, 6 secondsJay. That's perfect. Right. So, we have the Expo. Give Jay a shout out, guys. He's always coming in clutch. Right. So,
5:105 minutes, 10 secondshere we have the Expo widgets. So, this is now natively supported, which I I'm so happy that the team at Expo are really doing this. They're absolutely on fire lately. So, we have the live
5:195 minutes, 19 secondsactivities. All of this is basically now possible in Expo. So, today, all I need you to do is let me know what you want to see inside the build. I'm going to be
5:265 minutes, 26 secondsshowcasing what I think's cool inside of these new releases and also how we can go ahead and build the entire thing.
5:325 minutes, 32 secondsWe're going to be powering all with Convex. So Convex is going to be the same back end that we're going to use to support the admin app. So in real time and then we're going to have the iOS and
5:395 minutes, 39 secondsAndroid app on the other side. Right. So we're going to do all of this from scratch. So it's going to be crazy. Um we got N. He goes, "My name is N. I'm
5:465 minutes, 46 secondswatching you from Madagasco." Yo, what's that's cool. I love what you're doing, Sunny. I'm looking for a job. Oh, dude.
5:515 minutes, 51 secondsWell, you know what? Just keep keep sharpening those skills, man. You got this. Uh, it's funny because I've met a few people that know about me from Madagascar.
5:595 minutes, 59 secondsOkay, this is cool. The chat is popping off. All right, what's up, guys? So,
6:036 minutes, 3 secondslet's dive straight into it. Okay, now one thing that I love as well that Clerk have recently introduced is called Clerk or View and I want to show you guys
Chapter 6: Clerk AuthView one-line auth UI
6:116 minutes, 11 secondsbefore we jump into it. So, if you look at Clerk or View, now Clerk typically before had Ooh, this is this is cool.
6:186 minutes, 18 secondsAbs. This is actually Oh, nice. Yo, this is sick. I love the team at uh Clerk.
6:236 minutes, 23 secondsEvery time I go live, literally before I go live, something new pushes and it really, really helps me out. So you guys can see right here, this is what we're going to be implementing today. So what
6:326 minutes, 32 secondsis so cool about this guys is basically it's one line of code. Yeah, I'm not joking. It's one line of code. You can
6:396 minutes, 39 secondssee it actually here. I think they've actually added in the customiz Yo, they added it in today. Oh, I love these guys. Every time I go live, clerk literally add it in as I go live. Oh,
6:506 minutes, 50 secondsthat's so cool. They added it in right now. Okay. So I think we can actually do this now. I think that's actually
6:576 minutes, 57 secondswhat's view is. Yeah. So basically we're going to be implementing this. Now this is literally a oneliner code implementation. Although that is swift.
7:037 minutes, 3 secondsSo I need to check if it's for expo. Let me go ahead and see expo or view. Let's see. I don't know. I think I was looking
7:117 minutes, 11 secondsat the swift one to be honest. But basically we have one line of code. This is the line of code that I'm interested in. Return or view mode. Right. So this
7:197 minutes, 19 secondsone or view component renders that entire signup flow that we talked about.
7:237 minutes, 23 secondsNow I'm talking everything. I'm talking your multiffactor authentication, your social login, every single thing in an expo app, which is unheard of by the way. If you've ever had to build an app,
7:347 minutes, 34 secondsyou'll know that that takes a lot of time. Whether you vibe code it, whatever you decide to do, that takes a long time to do. So now they've actually gone ahead and created this one beautiful
7:427 minutes, 42 secondscomponent called Orthview, and it's yeah, it's absolutely crazy good. They even have customization for that coming very shortly. So we saw an example on
7:497 minutes, 49 secondsSwift, but even for Expo, they have support for that coming soon. So let's dive into the build right now and I want to jump straight into it. So first thing I want you to do is hit the first link
Chapter 7: Sign up flow for Expo + Clerk
7:587 minutes, 58 secondsin the description and you'll land over at the Expo link, right? So when you're signing up for Expo, hit that first link in the description. Please guys, all I
8:068 minutes, 6 secondsask is that I do all of this stuff for free. All you have to do is use those links in the description because it basically tells Expo and Clerk that you came from this video and it allows me to
8:148 minutes, 14 secondsdo this stuff for free. Okay, so like we said before, it really helps support the channel and this how it's how we able to do what we're doing. Right, so Expo is the first thing I want you to go to.
8:238 minutes, 23 secondsWe're going to go ahead and get started over here. Now, what I want you to do is basically you can go ahead and read all the docs and stuff like that, but we're just going to click on get started for
8:318 minutes, 31 secondsfree and sign up an account. Okay, so continue with Google, whatever you want to do. Uh, in this case, I'm going to go ahead and agree. And then, oh, I've
8:398 minutes, 39 secondsalready done it. So, I'm going to sign into my account. I already have an account, but once you're if you're new here, uh, oh, I need to actually log into I've already got an account there.
8:478 minutes, 47 secondsUm, ah, I'm on the wrong thing. So,
8:508 minutes, 50 secondsokay. What we'll do is I need to actually go into my other profile. So,
8:558 minutes, 55 secondsI'm going to log in over here. So, go over to Expo, sign in. And as you can see, I'm already signed in on this one. Okay. So, once you're in your account, you can see you've got your dashboard,
9:049 minutes, 4 secondsyou got your themes and stuff. go to your dashboard and you get an overview here. I've got a bunch of different apps I've been working on. So, what I want you to then do is basically stop here.
9:119 minutes, 11 secondsSo, you now have your base for continuing on with Expo. This is basically where you can go ahead and deploy to things like EAS. Expo has a
9:199 minutes, 19 secondsbunch of incredible services, but this is a good starting point. Now, the next step I need you to do is hit the second link in the description and it'll take you to Clerk. You need to set up an
9:279 minutes, 27 secondsaccount with Clerk. We need both of these. Clerk handles the authentication.
9:309 minutes, 30 secondsExport is obviously going to handle our uh the entire iOS and Android portion of the build. So, let's go ahead and click on continue.
9:399 minutes, 39 secondsAnd then we're going to log into our account.
9:439 minutes, 43 secondsAnd here we have it. And I'm going to go ahead and actually throw this over so I've got a bit of consistency otherwise I'm going to get very very confused real
9:509 minutes, 50 secondsfast. Okay. So, here we have I was working on a pizza app demo last time. I want you to go to the top and click on create application inside of Clerk. And
9:589 minutes, 58 secondsthen now once you've got this guys, go ahead and give me an app name. Okay? So I can give this bit of a bit of a dummy name, but give me a name for this
Chapter 8: Creating the Clerk app for Papa Pizza
10:0510 minutes, 5 secondspizzeria. For example, think about it like Fred's Pizza Place or whatever.
10:0910 minutes, 9 secondsIt's going to be for a specific pizzeria. Let's imagine a real business.
10:1210 minutes, 12 secondsYou have a client. You've got an approach to business. You say, "Okay, I want to now build you a beautiful website, uh, app, everything included,
10:1910 minutes, 19 secondsand I want you to go ahead and basically, yeah, pay me for that." Uh,
10:2310 minutes, 23 secondsso go ahead and give me a name. Let's get creative. Someone said pizza app,
10:2610 minutes, 26 secondsright? Pizza. Again, if someone owns that, don't come at me. But for now,
10:2910 minutes, 29 secondsthey were Puzzy Pizza. Pizza app. Don't spam. Don't spam. You're going to get blocked by accident by our spam bot. Uh,
10:3710 minutes, 37 secondswe got pizza. Papa Pizza. Oh, I like Papa Pizza. Papa Pizza. All right, so we got Papa Pizza. Let's go and give that a try. I knew I knew Jay was going to Jay.
10:4710 minutes, 47 secondsCome on, dude. He was all right with it. All right, so we got Papa Pizza. Um, let's do that. Papa pizza for now. Okay,
10:5310 minutes, 53 secondsso let's do it separately. So that's kind of cool actually. So then you can go ahead and toggle your different authentication methods. It's very
11:0211 minutes, 2 secondssimple. Literally Google app and that autoview component that I talked about literally pulls in all of this stuff.
11:0711 minutes, 7 secondsOkay. Oh, he's only timed them out for a minute, right? So you can go ahead and toggle all of your different authentication methods on even things like sign in with phone numbers and all that stuff. But for now, we're just going to do Google and Apple. Okay.
11:1711 minutes, 17 secondsClick on continue. Okay. And then you can see we've got this screen. Okay. I want you to click on expo and then we can go ahead and either follow these
11:2611 minutes, 26 secondscommands to go ahead and get up up and running or we even have an expo command.
11:3011 minutes, 30 secondsNow actually this is not a bad approach really. We could do this approach or I want to show you the starting point from expo side because uh I want to make sure
11:3911 minutes, 39 secondsthat everything you're getting today is up to date with the latest at the moment. Okay. So to be honest it's very simple. We can just type in expo uh
11:4711 minutes, 47 secondslet's do expo get started and I want to get started of course with TypeScript.
11:5111 minutes, 51 secondsOkay. And then here we have a using create your first app expo documentation. So we have sticker smash or we can use this one over here. Type
11:5911 minutes, 59 secondsscript default SDK. Yes. So this is the one I want. So MPX create expo app latest template default SDK 55. So copy that and then I'm going to open up warp.
Chapter 9: Bootstrapping the Expo app
12:0912 minutes, 9 secondsNow warp is you know you can open up terminal warp whatever you want. It's just the same thing right? Uh there's just different I mean not the same things but go to documents go to your
12:1712 minutes, 17 secondsbuilds folder and then we're going to paste in that command. Okay. And this is basically going to help us create an app. So we're going to say npx create expo app. And this basically creates a
12:2512 minutes, 25 secondsstarter template for us in the default template with SDK 55 which is the latest one. Right? So let's go ahead and do that and then say yes. Okay. To proceed
12:3512 minutes, 35 secondsand if it says node isn't installed then you simply have to install node onto your machine. So Google how to install node. The one thing that I want to
12:4212 minutes, 42 secondsmention in these live streams is that this is all about learning how to go ahead and uh you know vibe code the
12:4912 minutes, 49 secondsright way. So what's this? We got this broken relation behind a proxy or a bad network saying uh okay interesting. I don't have a proxy although give me one
12:5812 minutes, 58 secondssecond guys. Uh interestingly my internet has been acting strange. Um oh I have got a proxy on. Mhm. Okay my bad.
13:0713 minutes, 7 secondsUm let me go ahead and close that right now. That's probably why something was happening. So let's go ahead and do it
13:1513 minutes, 15 secondsnow. So I'm going to go ahead and do MPX create expo app latest. Yes. Let's try now. Hopefully it's all. Yep, there you go. So, I was behind a proxy. That's why some things weren't loading, I was thinking. So, what is your app name?
13:2413 minutes, 24 secondsLet's go ahead and say Papa Pizza. Papa Pizza. Okay. And then locating project files. There you go. It's going to start
13:3213 minutes, 32 secondsinstalling. Okay. So, this is going to be the base of our app. Oh, there we go.
13:3613 minutes, 36 secondsWe got Nay. He goes, "Thanks. It's my birthday today, but I don't want to miss that beautiful." Hey, happy birthday to Nay. Everyone shout out N is uh for his birthday right now. That's awesome,
13:4313 minutes, 43 secondsdude. Right. And while we're at it,
13:4513 minutes, 45 secondswhile that's loading, guys, definitely go check out the third link in the description. There's actually an entire community that I'm launching all about AI workflows, how I've got AI agents working for me, how I use it to code,
13:5513 minutes, 55 secondseverything that I do to basically get ahead with my business, my day-to-day life is inside this community that we're launching very soon. Uh, go ahead and
14:0314 minutes, 3 secondssign up to Zero to Agent Hero in the third link in the description. Jay just also dropped it in the chat. Feel free to go ahead and sign up because it's going to help you a ton. I promise you
14:1114 minutes, 11 secondsthat. Plus, we're only letting in a handful of members once the doors open because we want to keep that a very exclusive community. Okay, but making
14:1814 minutes, 18 secondssure it's accessible for a good way in a good way, right? So, once that's done,
14:2214 minutes, 22 secondswe're going to go ahead and cd into that directory. So, cd papa pizza. And then you can see we've got the following commands. Run Android, run iOS, and run
14:3014 minutes, 30 secondsweb. Now, I'm going to actually simply just type in cursor dot to go ahead and open this up in cursor. We are using cursor today to go ahead and get things
14:3714 minutes, 37 secondsup and running. So, I'm going to go ahead and pull this over. going to make my workspace a bit more neat. Let's go ahead and pull this in. And of course,
Chapter 10: Opening the project in Cursor
14:4414 minutes, 44 secondsif my screen is ever too big or too small, go ahead and let me know. Now,
14:4814 minutes, 48 secondsyes, cursor has got, you know, this whole new agents window. We're not going to screw with that too much today. You can feel free to use that. In my opinion, I don't think it's a good tool
14:5614 minutes, 56 secondsfor teaching. So, I don't think we're going to go ahead and focus on that side of things today. But if you look at the app now, we've got our base starter template, right? So if we go ahead and
15:0415 minutes, 4 secondsgo to our package uh JSON file, you can see we've got package log which means we're doing using mpm. Again, you can decide to use pmppm yarn, whatever you want. I'm not going to go too, you know,
15:1415 minutes, 14 secondsinto those kind of optimizations. But the main simple command is if you forget everything, just run npm expo start.
15:2015 minutes, 20 secondsOkay, npm expo start. And this will go oh uh npm expo start, npm run start,
Chapter 11: Running the app in Expo Go
15:2515 minutes, 25 secondssorry, npm run start. And it will go ahead and trigger our expo from our node modules. And now you can see we are using Expo Go which is the simulator that we want to effectively start with.
15:3415 minutes, 34 secondsNow there are a couple of prerequisites here. Okay. So either A if you're using a MacBook I want you to go ahead and download Xcode. Right? So you want to
15:4215 minutes, 42 secondsdownload Xcode and then you're going to have to follow a bit of setup to go ahead and get your simulator up and running. You can follow millions of tutorials online on how to do that. Once
15:5015 minutes, 50 secondsyou've done that, you can open up the iOS simulator by pressing I. Okay. Then we have Android. So, if you don't have a Mac and you want to code or you're on a
15:5815 minutes, 58 secondsWindows machine, all you need to do is download Android Studio. Once you open up Android Studio, I want you to open up this window and click on more actions
16:0616 minutes, 6 secondsand go to virtual device manager. And then what you'll see is we have this over here. So, in this case, I've got a Pixel 10 Pro. You can go ahead and start
16:1416 minutes, 14 secondsit up and then it will go ahead and spin up an Android device. Now, I'm going to be using iOS today because I want to show you all the beautiful new iOS
16:2216 minutes, 22 secondselements. But know that the codebase that we're building for goes ahead and compiles into both. Okay? And then, of course, you got web. So, this is an interactive CLI command. So, I can press
16:3016 minutes, 30 secondsI to open up iOS. And you can see that it opens up iOS on the iPhone 17 Pro Max, which means somewhere on my machine. Yep. There you go. It's going
16:3816 minutes, 38 secondsto pop up. So, there you go. It goes ahead and starts up. Now, notice how this is in something called Expo Go. So while we're using Expo Go, it means that we don't have any kind of, you know,
16:4716 minutes, 47 secondscrazy dependencies that, you know, Expo go is like the quick way to get started,
16:5116 minutes, 51 secondswhich is what we want to do to start playing with things. And you can see I've got a glass UI already in the starter template. Beautiful. Right,
16:5716 minutes, 57 secondswe've got this the routing set up for us. So I really like their starter template and how we can go ahead and get things running. Right, command D goes ahead and opens up the uh developer menu
17:0617 minutes, 6 secondsand then you can go ahead and start messing around with things. They do support hot reloading out of the box. So if we go to app index here for example,
17:1317 minutes, 13 secondswe can see if we go to the if device is device shake device and all this kind of stuff. You got all this but you say welcome to expo 1 2 3 right 1 2 3 hit save boom hot reloading out of the box.
17:2417 minutes, 24 secondsOkay so really really nice. Now what I want to do is I'm going to go ahead and teach you guys how to you know properly manage your git instances. So in this
Chapter 12: Git + setup best practices for vibe coding
17:3217 minutes, 32 secondscase if we go here you can see I've got a few changes and there was an initial commit when I clone this uh set things up. So, as we change things, I'm going
17:4017 minutes, 40 secondsto try my best to go ahead and show you how I will handle it the best way that I can um with AI kind of coding cuz you want to make sure that you've got these
17:4817 minutes, 48 secondsfallback points when you're coding with AI because things can get pretty uh damaging real quick. Uh so, we want to make sure we've got, you know, points
17:5617 minutes, 56 secondsthat we can fall back to. So, let's make this nice and big. Cool. Perfect. So, we've got our expo app set up, right?
18:0118 minutes, 1 secondSo, this is our, you know, our starting base point, right? So, we're going to go ahead and build an app like this. It's going to look beautiful. Promise you.
Chapter 13: Setting up the Next.js admin app with Convex
18:0718 minutes, 7 secondsRight. Next up, we've going to we need to go ahead and actually set up our Nex.js app. So, for Nex.js, like I mentioned, we are going to be using
18:1518 minutes, 15 secondsConvex as the backend. Now, Convex is an awesome database, right? They're not sponsoring the video. Uh we are sponsored by Clerk and Expo cuz they're awesome. Honestly, I love those guys,
18:2318 minutes, 23 secondsright? But Convex is a pretty awesome uh backend system. So, we're going to be using this to go ahead and sort of prepare our NextJS app. And this is going to be a shared back end between our app and our admin panel. Okay. So,
18:3418 minutes, 34 secondswe're going to go ahead and click on Next.js. And then here you can see MPX.
18:3818 minutes, 38 secondsOh, actually it's not this one. It's npm create convex latest. Right now what I want to do is I actually want to kind of create it at a top level here. So right
18:4818 minutes, 48 secondsnow we've got Papa Pizza and this is our entire app. Right. So if we go into warp, I'm going to go up a level. So in this case I've got the builds folder.
18:5518 minutes, 55 secondsOkay. So I'm going to do um I should have done this before really. Um
19:0219 minutes, 2 secondsokay, we can do this in a slightly different way. Uh, so I mean I'll show you a little cool trick that I like to do because I guess this is this is live.
19:1019 minutes, 10 secondsThis is point of life, right? So I'm going to move the puppet pizza into a new directory. So what I want to do is I'm going to say cd uh or make dire.
19:1819 minutes, 18 secondsOops. Come on Siri. Siri decided it was a great idea to start listening to me.
19:2719 minutes, 27 secondsHow do I stop that one? It does that every time and it's so frustrating.
19:3219 minutes, 32 secondsYeah, there we go. Okay. So, I just can't say those magic words. All right.
19:3619 minutes, 36 secondsOh, hey, we got W King UK. Hey, what's up? We got some UK Brits in the house.
19:4019 minutes, 40 secondsGood stuff. All right. So, we're going to make a directory and I'm going to call this one uh let's call it the pizza app uh YouTube. Okay, so pizza app
19:4919 minutes, 49 secondsYouTube and then we're going to CD. And what I want to do is I want to copy Papa Pizza into it. So, I should have done this in the beginning. So, I've made a folder called pizza app YouTube. I want
19:5719 minutes, 57 secondsto just shift everything over. So, I'm going to actually you Oh, shouldn't have done that. Uh, I'm going to use Damn it. Um,
20:0720 minutes, 7 secondsmy cuz it's a new laptop, a few of my things aren't actually there. So, if I do agent, I can actually Yeah. So, this is actually like a an agent interact interactive environment from warp. So,
20:1820 minutes, 18 secondsif you download warp, you can kind of mess around with this. But, in this case, I can go ahead and say I want to uh move Papa Pizza
20:2720 minutes, 27 secondsuh into uh the directory. Oh, actually this is very easy. What am I doing? Uh, yeah. No, but I can say that. Yeah. I want,
20:3620 minutes, 36 secondsyou know, I'm going to use superpar. I want to move Papa Pizza into this directory.
20:4420 minutes, 44 secondsSo, I want to move Papa Pizza into this directory. And it was called pizza app uh YouTube, right? And then
20:5320 minutes, 53 secondsbasically, you can ask the agent and the agent will give you the command, right? Or you could just open up the finder.
20:5720 minutes, 57 secondsBut I'm kind of want to show you a couple of cool things as well, right?
21:0021 minutesSo, I'm moving the papa into Peter YouTube app. I'll verify both directories exist before executing the move. So, you see it can show the commands and I can run the commands.
21:0721 minutes, 7 secondsIt's kind of cool, right? It actually helps out. Also, by the way, Super Whisper, the thing that I just used for talking, uh you can feel free to go to superw whisper.com, use code sunny25 and you'll get a little discount off.
21:1721 minutes, 17 secondsAwesome app. I use it for I'm going to use it a bunch today and it's how I do this uh when I talk into the computer.
21:2221 minutes, 22 secondsOkay, so we're going to go ahead and close out of this now. So, move Papa Pizza into the YouTube directory. So now if I go ahead and type in cd pizza app
21:3121 minutes, 31 secondsuh YouTube and I type in ls, we can see papa pizza's in there now. Okay. Now I'm going to do cursor dot. Okay. And the reason why is cuz I want to have a top
21:3921 minutes, 39 secondslevel. Yes. Like this. Okay. Now what I'm going to do is I'm going to rename this one to be let's call this one our ex or let's just call it our app. Okay.
21:4921 minutes, 49 secondsSo this is going to be our okay. We're going to call this our apps folder. And then we're going to pull
21:5621 minutes, 56 secondsthis into that. Okay. So, you can do a monor repo structure. I'm not going to do a full monor repo right now. Uh this is just kind of a hacky way of doing it.
22:0422 minutes, 4 secondsBut inside of our apps folder now, I want to go ahead and set up things. So, if I go ahead and I do, we can see apps.
22:1022 minutes, 10 secondsSo, cd into apps. And now, what we can do, right, is go ahead and pull it over
22:1722 minutes, 17 secondshere. I'm going to pull this back is we have all of this codebase running inside of here. Expo apps but the
22:2622 minutes, 26 secondscommand that we were interested in and actually we want to do a get init at the top level first. So at the top level we just simply do get init. And now we have an empty git repository. That's perfect.
22:3522 minutes, 35 secondscd enter apps and then I want to go ahead and do this command. So inside the
22:4322 minutes, 43 secondsdocumentation let's go into nex.js and we're going to do npm create convex at latest. Okay. So paste it in. npm create comx at latest.
22:5222 minutes, 52 secondsOh no. Do we want to do it here? No, we want to do it inside of a Yeah, I think we do do it in here because we've got the ls. Yeah, we do it inside of here.
23:0123 minutes, 1 secondSo, I'm going to do create convex latest using package manager my mpm. So, uh project name. Let's go ahead and say that this one is called our admin,
23:1123 minutes, 11 secondsright? Because it's going to be the admin panel. So, and this one is going to be an XJS app browser. We're going to use clerk. So, it'll set all of that up for us. And if you can see here now, we
23:2023 minutes, 20 secondshave the admin app and then we have the actual app itself. Okay, so I'm going to go ahead and separate the two like so.
23:2623 minutes, 26 secondsNow, if you do want to really get into this and dive into it, I really recommend checking out something called Turbo Monor repo, right? You can get
23:3323 minutes, 33 secondsreally deep with all this stuff. Uh, in fact, they have a good one with convex and clerk. So, if you convex, clerk,
23:3923 minutes, 39 secondsexpo, monor repo, uh, this is a good example. So, you can see monor repo and xjs and expo. So, you can see this is one that I'd recommend. I think it's a
23:4823 minutes, 48 secondslittle bit outdated. You'd have to bring it up to date. Um, they also have this one, get comx. This one was updated 4 months ago, two months ago. So, you can feel free to look at that as well. Um,
23:5823 minutes, 58 secondsbut yeah, I've actually forked off of that before and it gives you a really nice turbo on a repo, but I don't want to confuse too much today cuz I can understand how it can get a bit intense,
24:0624 minutes, 6 secondsright? So, we have the admin side, we have the app side. Now, you can see look, we've got two different apps,
24:1224 minutes, 12 secondsright? So, you need to make sure you know which ones that you're inside of at every any point in time. So if we CD into our admin app, I want to go ahead and just set that up first. Okay, so we
24:2124 minutes, 21 secondsgot the admin app here. We've already seen our app can run. That's fine. So I want to go ahead and run the admin app now. So if we go ahead and see inside of
Chapter 14: Running the admin + backend locally
24:2824 minutes, 28 secondsour package JSON, you can see if we do mpm rundev, it starts up our convex backend and the next.js front end. Okay,
24:3524 minutes, 35 secondsso we can go ahead and do mpm rundev.
24:3824 minutes, 38 secondsAnd this will go ahead and spin up the front end and the back end. And because it will spin it up for the first time,
24:4224 minutes, 42 secondswe can go ahead and actually we have to set up our convex project. So, we're going to create a new project. If you don't, if you're not logged in, it would have asked you to log in at this point.
24:5024 minutes, 50 secondsSo, we're going to create a new project.
24:5124 minutes, 51 secondsI'm going to go ahead and say that the project name is, let's say, pizza papa pizza. Yeah, papa pizza, right? Cloud
24:5824 minutes, 58 secondsdeployment. Yes. And then it's going to create a new convex, right? Set up the convex AI files. Yes, we want to do that. And that's basically going to uh
25:0625 minutes, 6 secondsadd a bunch of different uh agent MD and claude MD files to help us out with things, right? And even here we have uh cursor rules, but I don't think it
25:1525 minutes, 15 secondsactually pulls in those ones. But the main one that we're interested in is we can close that for a sec is actually this agent skills. So it actually pulled in a bunch of skills that we can use
25:2425 minutes, 24 secondslocally to this project. Okay, so that's the first thing that will help us out.
25:2825 minutes, 28 secondsThe next thing is you see how clerk runs inside of uh keyless mode. Okay, so we actually need to set that up uh to get
25:3625 minutes, 36 secondsthat working correctly. So, what I want you to do firstly to get a sanity check is just type in localhost 3000. And you should see this, right? If you see this,
25:4425 minutes, 44 secondsgood job. You're doing something well. So, I want you to pull open over here.
25:4925 minutes, 49 secondsAnd what we're going to do is bring this open to this side over here. Okay? So,
25:5425 minutes, 54 secondsnow we have our app on the right hand side and then on behind it I've got the phone app. So, this is going to be the admin app. This is going to be the user app, the pizza app. Okay. So, for the admin app, now I need to wire things up,
Chapter 15: Wiring Clerk into the admin app
26:0526 minutes, 5 secondsright? So, environment.loc local has already pulled in a couple of things.
26:0826 minutes, 8 secondsConvex deployment next public comx URL and the convex site URL. Okay. So, what I like to do here is just simply give them a couple of labels. Right? So, I
26:1726 minutes, 17 secondswant to go ahead and, you know, make this a bit neater so I can figure out what's going on a bit nicer. Right? And we're going to have clerk as well. Now,
26:2326 minutes, 23 secondsfor clerk, what I need you to do is go over to that initial setup that we did.
26:2726 minutes, 27 secondsSo, I believe it was over here. And remember, we were over here, right? Now, you can do some default template files.
26:3326 minutes, 33 secondsAnd you see here they have like a few setup steps. We can actually ignore this for now because we're not doing the clerk part. We can go into nextjs for
26:4026 minutes, 40 secondsnow. Okay. So click into next.js because we're in the admin panel. And then we're going to just simply copy the environment files. Right. So we're going to copy the environment files. Hit save.
26:5026 minutes, 50 secondsAnd now in a moment what we should see is that keyless message disappears because what we've done is we've basically connected our account with our
26:5926 minutes, 59 secondsclerk account. Right? So that's why this is now connected. And because we've done that, if I was to click sign in for example. Hey, sign into Papa Pizza. And
27:0627 minutes, 6 secondsI should now be able to have a full sign in flow. Right? So, this is why I really like this starter template. But we're not done there yet, right? We still have to do a few things. So, what I want you
27:1427 minutes, 14 secondsto do next is go into admin, go into the convex or config.ts. And here you can see we have to actually go ahead and connect convex and clerk together. Okay.
27:2627 minutes, 26 secondsSo, the way to do that is we simply go over here. We're going to go ahead and uncomment this line over here. And we can get rid of that one. And you can see
27:3527 minutes, 35 secondsthat replace this with your own clerk issuer UR uh URL from the convex JWT template or from the following blah blah
27:4227 minutes, 42 secondsblah. Okay. So what I want you to do is just cuz I like to show you the most upto-ate things is type in convex clerk.
27:4927 minutes, 49 secondsUh that's simply enough. And you can see look 6 days ago clerk released a guide on all about how to go ahead and do this right. Uh yeah we'll fix the multiple
27:5727 minutes, 57 secondspackage lock files. Don't worry about that guys. We we will get that handled afterwards. Um cuz we're live obviously we'll clean up
28:0528 minutes, 5 secondsa few things after. So we need to set up clerk as a or a convex or provider. You can get AI to this but it can also become messy when you do that. So I'm going to show you this part by
28:1428 minutes, 14 secondsourselves. So the way we do that is we click on the link over here. Navigate to convex integration. And what they're doing here is we're basically setting up
28:2228 minutes, 22 secondsconvex and clerk together. Now if you don't want to go to this screen or you don't know how to get to that screen, I'll show you from actually clerk. Okay.
28:2828 minutes, 28 secondsSo go to configure. Go down to developers. Go down to integrations and then you see convex here. You want to enable that and then you want to click
28:3728 minutes, 37 secondson manage integration. Okay. Now what you want to do is go down Papa Pizza Development and then we're going to enable it's enabled and you want to copy
28:4628 minutes, 46 secondsthis into our environment file. Okay. So we're going to go ahead and copy this into our environment file. So the first thing is although we're copying it here,
28:5628 minutes, 56 secondsknow that this is not actually where we need to be running it ideally. Okay. So yes, it's pulling in here, right? So
29:0429 minutes, 4 secondswhere is my um if we cut this off for a second? We need to run dev and we you see how it runs both convex dashboard.
29:1229 minutes, 12 secondsNow, I'll be honest with you. What I like to do here is split the two because when you run these together, you can see look, it's spun the app up and it spun the dashboard for Convex up and Convex.
29:2229 minutes, 22 secondsIf we log into the correct account, let me go ahead and log into the correct account quickly. What you'll find is is that it's going to have everything set
29:2929 minutes, 29 secondsup, but it's all running behind one terminal, and that can kind of get confusing when you're debugging things, right? So, this is all set up. Now,
29:3629 minutes, 36 secondsremember when I set up that um uh when I just got that API key? This one right here, clerk front end API, right? This
29:4429 minutes, 44 secondsactually belongs over here. So if you go to environment variables, it actually needs to be added here. So clerk front
29:5129 minutes, 51 secondsend API and this value, we need to go ahead and copy it and we need to push it inside of here and then click on save.
29:5929 minutes, 59 secondsAnd that's a crucial step that a lot of people forget. Okay. And now if you go into I believe it was no, I think we're good there. I don't think we need to do
30:0630 minutes, 6 secondsthat one. All right. Now if we go back over to that guide we can see look activate convex integration we have the
30:1430 minutes, 14 secondsfront end API save the URL in this case it was the URL they gave us you can go ahead and give additional claims which basically passes along additional bits
30:2230 minutes, 22 secondsof information inside the session cookie right but here or the JWT token sorry then we need to look configure convex with clerk's front end API URL so in
30:3130 minutes, 31 secondsyour environment file add your front-end API right so if it's already been configured you can proceed to the next step so In your app's convex folder,
30:3930 minutes, 39 secondscreate an orthconfig.ts.
30:4130 minutes, 41 secondsSo, orthconfig.ts. And then we have to put in that, right? So, inside of the template, you'll notice that it was called a little bit different. It was jwts because that was the old way of
30:4930 minutes, 49 secondsdoing it. Now, we have a nice new way of doing it. Can actually go ahead and get rid of this. And then what I want you to do is add a simple check here saying if
30:5730 minutes, 57 secondsthere is no clerk frontend API URL, we throw an error. Okay? So, that's something which is kind of important,
31:0431 minutes, 4 secondsright? So, you want to make sure that that's set.
31:0731 minutes, 7 secondsNow once that's done, we can go back and then we go over to the documentation again and you can see that deploy your changes. We already done that and it was
31:1531 minutes, 15 secondsdeployed and it worked. Okay. Now we need to check that our app is actually wrapped and working the right way. So if we go to Nex.js, we should see there is a wrapper around the base of our app.
31:2431 minutes, 24 secondsAll right. And that's the good thing about that starter kit that I showed you inside admin. If we go down to app, go down to layout, you can see that look,
31:3231 minutes, 32 secondsit wraps the app perfectly. You got clerk provider wraps around clerk client provider. You click inside and there we have it. Right? So this is all. And what
31:3931 minutes, 39 secondsI would always recommend is don't do that. Right? You always want to make sure you have a guard check like so. I really never want to go ahead and just have a kind of gung-ho check like that.
31:5031 minutes, 50 secondsOkay. So you want to just fix up a few things like this. And then let's just make sure the app is uh is loading again. So go back to let's actually run it over here. It's a bit simpler. Right.
31:5931 minutes, 59 secondsThere we go. Cool. Now let's go ahead and sign in. Let's go ahead and sign in with my account. So, Sunny, for example,
32:0632 minutes, 6 secondsand then we should be able to come back and we should be able to see a user profile if we did it well. All right.
32:1232 minutes, 12 secondsAnd there should be no errors. So, you see here, no errors so far. We're good.
32:1632 minutes, 16 secondsI'll show you how we can split these terminals in a moment. And you can see, look, we're pretty good. It says,
32:2032 minutes, 20 seconds"Welcome anonymous." Uh, we have our user here as well. If I refresh, you can see, yep, there we go. Add random number. So, we got a couple of test
32:2732 minutes, 27 secondsfunctions here. And you see it pulls in my account. Okay, so that's pretty awesome. Works for us. Now, what I want
32:3532 minutes, 35 secondsto do is I'm going to cancel this and you see if we go back into package JSON, we have dev front end and dev back end.
Chapter 16: Splitting frontend, backend, and app workflows
32:4332 minutes, 43 secondsSo, I want you to copy that, right? And then I want you to split the terminal here. So, I'm going to on the left side,
32:4932 minutes, 49 secondsI'm going to do npm npm rundev front end. And here I'll do npm rundev back end. Okay. So, spin that up. Spin that
32:5732 minutes, 57 secondsup. And now why I like this is because I've got my back end running here, my front end running here. And then on the separate tab over here, I have my where
33:0633 minutes, 6 secondsis it? Oh, sorry. This is a different one. So I can press add. This is a split tab. Get out of the way. Yeah, I can go here. And now on this one, I can have the actual app. So if I do see the apps,
33:1533 minutes, 15 secondsyou see how inside of here I've got the admin and the app. The app is the native app, also.
33:2633 minutes, 26 secondsWe have the script here is mpm run start. So in this case we just do npm run start. Okay now you can see look there we go right.
33:3533 minutes, 35 secondsSo now I've got my app running and this is the way I like it. I have the app running here. You can rename this to be called the expo app if you really wanted
33:4233 minutes, 42 secondsto. And then you see these are basically my different instances of what I'm looking at. So this one right here is going to be my next.js app. Let's just
33:5033 minutes, 50 secondsmake it very clear for you guys. So I'll say this is the admin next.js app. And this one is my convex back end. I think
33:5833 minutes, 58 secondsthis is going to really help everyone understand. Right. So this is the convex server effectively running in the back.
34:0334 minutes, 3 secondsThere we go. Right. And that just helps you out a little bit with understanding.
34:0734 minutes, 7 secondsOkay. So now that we've got that running, we've got essentially all of our apps. Now if I press R, you can see I refreshed the app inside of here. And if I go over here, you can see I've got
34:1634 minutes, 16 secondseverything uh loading in like so. So we can actually begin developing now. Now,
34:2034 minutes, 20 secondsthere's one more step that I want you to do. Okay. Now, I believe we've set up a few of the things. The only thing that we would need to do is connect our app
Chapter 17: Connecting the mobile app to Convex
34:2934 minutes, 29 secondsup to X uh to clerk afterwards, which we can do after uh is actually go into our convex. And what I actually want to make
34:3734 minutes, 37 secondssure that we can do is I really want to kind of get access to this convex. And this probably isn't the best way to do this, but I think for today's sake, it should it'll be okay.
34:4834 minutes, 48 secondsUm but ideally we want to have convex lifted out of here. So I'm wondering if we can do that neatly without breaking
34:5734 minutes, 57 secondstoo many things. So ideally where we have apps admin app I want to have one more which is effectively typically they call it like packages back end but we
35:0635 minutes, 6 secondscan actually just let's just say back end and I'm going to use AI here to go ahead and try and debug this. So we can go ahead and shift convex into that
35:1535 minutes, 15 secondsfolder. So let's give that a try. So I'm going to say uh I want to move the convex folder and I'm using ultra planning cur.
35:2435 minutes, 24 secondsI want to move the convex folder to the uh forward slash or we can just say to
35:3135 minutes, 31 secondsthe apps top level folder inside the inside the backend folder inside the
35:3935 minutes, 39 secondsbackend folder. So I want effectively we us to have convex over here. So that way our admin and our app can access
35:4735 minutes, 47 secondseverything. Okay. So what I like to do is I like to switch to a plan mode. So I can press shift tab and then I can go ahead and hit enter. Okay. Now this will
35:5535 minutes, 55 secondsbasically plan on how to do that. I like to use Opus 46. I'm using max mode because I'm live. I want things to go smooth, right? But also you want really want to start in plan mode always.
36:0636 minutes, 6 secondsNow, while that's happening, we can go into cursor and we can start actually helping ourselves out a little bit. So,
36:1236 minutes, 12 secondswhen you AI code, you want to give yourself the best chance of AI being the best it can be, right? So, go into cursor, go into cursor settings, and
36:2036 minutes, 20 secondsagain, you can use claude code. You can use whatever you want to do. Uh, in this case, if I go down to plugins, however,
36:2436 minutes, 24 secondsyou can see there's a couple that I really recommend. Number one is Comvex.
36:2836 minutes, 28 secondsInstall that plugin. We are using Convex, right? The other one is Clerk.
36:3136 minutes, 31 secondsMake sure you install this plugin. It installs the MCP server, the skills, all of these are going ahead and helping out. So, somebody said, why mixing and
36:4036 minutes, 40 secondsNexJS and Expo? So, the reason why I'm mixing next expo here is you can actually have Expo handle everything for you. But one, in the essence of a live
36:4836 minutes, 48 secondsstream demo, uh I feel more comfortable having an XJS app. It's it's just yeah,
36:5236 minutes, 52 secondsit's cool for me. Uh two, if I did go the Expo route, there would be a few workarounds that I'd have to do. But you can definitely use Expo for the web, the
37:0037 minutesuh the iOS and the Android app. Uh but in the sake of speed on the stream, uh I like to use Next.js as my back end as a separate app, right? And also it means that you can have separate deployments,
Chapter 18: Setting up native auth in Expo
37:1137 minutes, 11 secondsyou know, just deploy the Next.js app. I feel more confident in that approach. So that's the one I'm going for. But full transparency, absolutely you could use Expo for all three. Um, in this case,
37:2137 minutes, 21 secondslook, we have all of the clerk skills pulling in. And these are skill skills are awesome because basically they only get pulled in when something matches the description, right? So, in this case,
37:3037 minutes, 30 secondsuh, here if I do I can't actually open this up, but uh, yeah, basically what this is doing is if only if the AI determines that it's about this topic,
37:4037 minutes, 40 secondsfor example, like cluck webbooks, will it pull that into the context window. Okay. Uh, I appreciate all of you guys.
37:4537 minutes, 45 secondsThank Thank you so much for the nice comments. Everyone saying great content and stuff. Appreciate you guys. All right, so let that do its thing for a moment and then let's go back over here.
37:5437 minutes, 54 secondsSo the next thing I want to do is type in expo clerk. Okay, so I want to connect these two up together. So expo quick start with clerk. Now over here we
38:0338 minutes, 3 secondshave a few things. You can see like set up a clerk application. We've already done this, right? Sign into clerk.
38:0838 minutes, 8 secondsCreate a clerk application. We've already done. Now in expo you've got a few ways to set up things. Now we need to let's think about this, right? We've already got our authentication working
38:1738 minutes, 17 secondson the admin panel. Eventually, I'm going to show you how we can make it so only admins can go into the admin panel and we can determine who is an admin.
38:2538 minutes, 25 secondsSo, that's one thing. And the second thing is we need to essentially add authentication to our next our expo app.
38:3238 minutes, 32 secondsOkay. So, let me pull it over here for a sec so you can just see what's going on a bit nicer. So, over here now if we
38:3938 minutes, 39 secondshave our app. Yeah. So, I need to have authentication here. So, I need to have a login flow and all that good stuff.
38:4438 minutes, 44 secondsNow typically when you do login flows you got to have the whole wiring up and yeah you can do that 100%. So clerk have been amazing for that for the longest
38:5238 minutes, 52 secondstime. So you see if you need full control of the UI you can use a JavaScript approach but a lot of you are asking but I like native I like purple that pure native approach and in that
39:0139 minutes, 1 secondcase you could use if you want to have a mix of the both then you can have for example JavaScript plus native sign but recently they added pure native
39:0939 minutes, 9 secondscomponents. Okay and they have actually got a really nice article about this. I believe it was
39:1639 minutes, 16 secondsum I don't know did they make I don't think they made an article actually. Um but basically I'll explain it. What this
39:2439 minutes, 24 secondsdoes is it basically gives you full native functionality with the authentication experience and that is really nice because we don't have to
39:3139 minutes, 31 secondsmanage a lot of the corner cases. You know a lot of the time when you build login flows you think password username and password maybe Google sign in. What
39:3939 minutes, 39 secondsyou're not thinking about is what about if they have two-actor authentication?
39:4239 minutes, 42 secondsWhat about if they have a lot of things like that? Yo, we got Ste. Um, hip I can't remember the names of everyone when the username pops up now. Um, dude,
39:5239 minutes, 52 secondsjust write your name, please. I I've gone blank on stream, but he he says,
39:5639 minutes, 56 seconds"Welcome to the Expo Summit in London last year." Jamie, there we go. Jamie, before you wrote it, I caught it. Yeah.
40:0140 minutes, 1 secondUh, it's good to see you, dude. I need to launch the community so we can jump on calls again. Uh, went to the Expo Summit in London last year and they showed this off. Yeah, it's absolutely
40:1040 minutes, 10 secondsawesome, dude. uh native component but the new native component I'm going to show you today game changer it's one line of code and it's it's so clean okay
40:1840 minutes, 18 secondsso in the cloud dashboard navigate to n uh native applications and ensure that the native uh API is enabled so let's do
40:2540 minutes, 25 secondsthat number one let's go over there and you see enable native API I've already done that perfect okay now remember also
40:3440 minutes, 34 secondsjust want to bear in mind while we're doing everything today if you go here to develop we're actually in development Right? When you go to production, you of
40:4340 minutes, 43 secondscourse want to create a production instance and follow the steps and set things up for the production environment. So that way you can have two, your development and your
40:5040 minutes, 50 secondsproduction environment. Right, Jamie? So it's so good to see you, dude. Uh honestly, I really missed the the coaching calls because of the conversations we used to have. Uh so
40:5840 minutes, 58 secondshere we have uh the next thing we've already created the expo app and then we need to remove some of the default uh template files. Now this is complex with
41:0641 minutes, 6 secondsthe route you create in the guide. So we actually need to check this one specifically. So what we want to do here is just see what
41:1441 minutes, 14 secondsthe starter template that we set up has so that we don't cause any unnecessary changes. So if we first look here, they
41:2141 minutes, 21 secondswant us to remove inside a source app tabs. So we don't actually have tabs. We don't have a modal and we don't have a not found. So we don't need to do that
41:2941 minutes, 29 secondsline. The default template also includes React Native animated which can cause.
41:3441 minutes, 34 secondsSo we don't need to have these over here. So let's go ahead and uninstall these. And also we've got a question here. Before we do that, we want to move
41:4141 minutes, 41 secondsthe convex folder from the apps admin convex to a shared location. Which part do you want the shared location? Apps backend convex. A new backend app
41:4841 minutes, 48 secondsalongside admin and Yep. The convex folder is the backend folder contest. So backend convex a new backend app alongside admin.
41:5841 minutes, 58 secondsI think it would be better I guess in here because you can have like shared back end. Yes, both apps will share this convex back end. Yes. There we go.
42:0642 minutes, 6 secondsRight. So, this is why plan mode helps out a bit because now it can figure out what to move and all that kind of stuff. Right? And if there's any, you know,
42:1242 minutes, 12 secondsimplications like that. Okay. So, back to what we were doing, we need to run that command. So, anytime I want to do a
42:2042 minutes, 20 secondsnew command, I don't want to mess up the nice thing that we built here. Oops, I don't want to do that. All right. We're going to press plus and we're in a new terminal here. And then I'm going to go
42:2842 minutes, 28 secondsinto my cd apps/ app. So, this is my expo app. And I'm going to do npm uninstall react native uh reanimated
42:3642 minutes, 36 secondsreact native worklets legacy pair dependencies. Okay. And then we're going to remove react native reanimated if it
42:4542 minutes, 45 secondsexists inside of the layout. So inside of the layout of this is not the right
42:5242 minutes, 52 secondsapp. So make sure you don't get confused with this app. You could name rename this to expo app if it really helps.
42:5742 minutes, 57 secondsRight? So it's completely up to you. I'm aware of what we're looking at, but in case that helps with you guys, uh because I understand how it can get a little confusing sometimes, right? So,
43:0743 minutes, 7 secondshere we do not have the react native uh reanimated. Okay, so you can skip this.
43:1243 minutes, 12 secondsOh, okay. Yeah, we can skip that step if we don't have the bank doesn't include expo router. Um you need to install expo router and it's dependencies to follow
43:1943 minutes, 19 secondsalong with the guide. So, let's see if we have expo router installed. So,
43:2343 minutes, 23 secondsthat's the first expo router. Yeah, we do have explorer. Perfect. Okay, so we don't need we're good. So install the required dependencies to ensure SDK
43:3243 minutes, 32 secondscompatible versions. So mpm install we need to install clerk expo and expose secure storage. And the reason why you want to follow these steps manually like
43:4043 minutes, 40 secondshow I'm doing it is because AI can often pull in old documentation regardless of how well you prep it. So this is why I'd
43:4743 minutes, 47 secondsrecommend set your app up yourself the first time. Uh and then you really want to then you can you can build features with AI. Don't get me wrong, we're going to build this app so fast. is awesome.
43:5743 minutes, 57 secondsBut when you're setting things up, you really don't want to trust AI to do it.
44:0144 minutes, 1 secondUh it will screw something up. And I promise you, it will screw it up. Like,
44:0444 minutes, 4 secondsI'm not even saying that it will do a bad job at something, even if you prepped it to the max.
44:1144 minutes, 11 secondsOkay. So, while that's doing it, we're going to go back over here and let's see. Set your clerk API keys. So, again,
44:1944 minutes, 19 secondsthese are secret keys, so you shouldn't show these obviously to anyone else. Um,
44:2344 minutes, 23 secondsbut in this case, I'm going to invalidate the keys after. So, we're going to go to our environment local.
44:2744 minutes, 27 secondsAnd you can see I've got my This is Where did I just do that? I've done that in the app.
44:3544 minutes, 35 secondsOkay. So, make sure you don't do a mistake like that. Go into environment. We don't have an environment file here. So, inside of our
44:4344 minutes, 43 secondsapps, inside of our This is confusing me a little bit. We need to actually change that. Um, we're going to go and do a environment file.
Chapter 19: Building the first auth screens
44:5244 minutes, 52 secondsav and we're going to paste that in. Okay.
44:5744 minutes, 57 secondsAnd here you can see that is not get ignored. Right. So we can just simply go into our environment
45:0445 minutes, 4 secondsfile. There we go. Okay. Now expo public. Notice how next.js you have to write next public right for expo for
45:1245 minutes, 12 secondspublic keys you have to have the prefix expo public. Right. So expo public clerk publishable key. Now once we've done
45:1845 minutes, 18 secondsthat, you can see we got add clked provider to the root layout. So now we just need to add that to the root layout. So if we go over to our root
45:2745 minutes, 27 secondslayout, and this is actually super easy to set up, honestly, it's not this. So this is inside the wrong thing. Again,
45:3445 minutes, 34 secondsdon't do that. You really want to make sure you're inside the right app every time. So app
45:3945 minutes, 39 secondsum source app layout. Yeah. Okay. So we need to go and add this in. So, I want
45:4745 minutes, 47 secondsto pull in the top three. Let's go ahead and do that right now.
45:5245 minutes, 52 secondsAnd then I want you to go ahead and check for the publishable key like so.
45:5745 minutes, 57 secondsAnd then you see we have clerk provider slot like so. Right. So, this is the first thing. We've got the theme provider. We have the animated slash.
46:0546 minutes, 5 secondsAnd then we have the app tabs. And the tabs are actually rendering inside I believe inside of here. We Where are we doing our tabs? So our tabs are Oh,
46:1646 minutes, 16 secondsthat's actually just the app tabs, which is component app tabs. Ah, so they've done it inside of native tabs. Cool. All right. So we'll jump into that
46:2346 minutes, 23 secondsafterwards. That's fine. But for now, we can simply wrap the app inside of. So I'm going to move the get rid of slot.
46:3246 minutes, 32 secondsWe just need the clerk provider wrapping the other two. And then that's got the publishable key and the token cache.
46:3746 minutes, 37 secondsRight. Hit save. And every time you do this, you want to make sure you just can render your app. Okay. So in this case,
46:4346 minutes, 43 secondsgo back to our app and firstly let's just check did that do it? Yep, it installed a bunch of stuff and then over here we just press I. We can, you know,
46:5046 minutes, 50 secondsrefresh our app. So we can control the app here as well. And you can see it loaded. So that's great, right? Which means we didn't break everything. Okay,
46:5846 minutes, 58 secondsso quick pause on that. Let's have a look at on the plan that is to move convex to the back end. So it found the
47:0547 minutes, 5 secondsall the things to move create the app's backend package. Cool. And then it's going to move some of the scripts. And then it's going to move the convex
47:1247 minutes, 12 secondsfolder. And then you can see split the environment variables needed by pushing the convex environment apps admin environment needed by the nextjs front
47:2047 minutes, 20 secondsend. And then add the okay and then add the path alias in admin.ts config. Okay. So that way we've
47:2847 minutes, 28 secondsgot a y that's actually very handy. So that way we can reference it very simply. Update imports in the admin app.
47:3447 minutes, 34 secondsAnd then update the admin script and dependencies. update admin eslink config and run the back end. Okay, let's let that do its thing.
47:4447 minutes, 44 secondsSo, we're basically just going to shift that into its own backend package.
47:4747 minutes, 47 secondsRight. So, now we effectively created the monor repo without turbo repo. Okay.
47:5147 minutes, 51 secondsWithout turbo is like a helper thing to do it. Hey, it's been a couple of your uh it's been a couple of something since I've been watching your live streams. It
47:5847 minutes, 58 secondsgives me the kind of energy to build a new product idea. I appreciate I love that. Thank you so much. And all I ask is that if you're going to build a new product, please just use the links in
48:0648 minutes, 6 secondsthe description to sign up to Expo and Clerk, go to production. It will be mean a ton for us because it shows them that you listen to this tutorial and then you
48:1448 minutes, 14 secondswent ahead and actually pushed out a real app, which is awesome. That's the goal of everything here, right? Um, so next up, we have uh this one we can
48:2348 minutes, 23 secondsignore for now. We can come back to that. Then we need to add in the signup pages and all that good stuff. Now, of course, we're going to do this and then
48:3048 minutes, 30 secondswe're going to add in the um convex wrapper as well. So, we're going to also need to add a convex wrapper in here at
48:3748 minutes, 37 secondsthe end as well. Uh but we'll come back to that afterwards. So, right now we've got underscore layout. Um
48:4448 minutes, 44 secondsso, app. So, let's go to our app and we have our source and we have our
48:5048 minutes, 50 secondsunderscore layout. And let me let me you know what? I want to actually minimize that. Yep, there we
48:5948 minutes, 59 secondsgo. There we go. It's getting a bit annoying. Okay. And then let's add in create an or route group. Yeah, there we go. So,
49:0949 minutes, 9 secondswe need a route group. And this is basically just a way of grouping folders, right? So, routes, we're going to have or we're going to stick underscore layout inside of there. No,
49:1849 minutes, 18 secondswe're not going to stick underscore layout inside there. inside of underscore inside there we're going to create a new underscore layout uh tsx
49:2649 minutes, 26 secondslayout tsx and we're going to copy this and we're going to paste it right so we have our user authentication everything is set up here and this is basically
49:3449 minutes, 34 secondschecking so in this case the authentication routes which are going to ren be rendered in here they're going to render out a stack and then if you're
49:4249 minutes, 42 secondssigned in it will simply redirect you to your home index route which is this one here right now the signup page inside
49:5049 minutes, 50 secondsthis all out. We're going to go ahead and do a sign up page. Actually, you know what? Are we using the
49:5749 minutes, 57 secondsNo, this is the wrong one. Damn it. I've completely messed that up. So, this is doing the native route. Yes. Ah, guys,
50:0750 minutes, 7 secondsthis one here. This one. This one. This one. Sorry, I've completely clicked the wrong one. This native components,
50:1350 minutes, 13 secondsright? Yeah, they are in beta, so there's that to factor in. But damn it,
50:1650 minutes, 16 secondsit was native. I knew it. I thought there was too many steps. Uh, but it's fine, right? We can get into it. So,
50:2150 minutes, 21 secondsthis one is what I needed, right? We need this one. So, go back and just do a couple of those steps, right? That's again, it's fine. It's part of being
50:2950 minutes, 29 secondslive, right? We're going to go into our We're inside the app here. We're going to do MPX Expo install. And now you can
50:3650 minutes, 36 secondssee ex installing four SDK 55 compatible native modules. Cool. Right. Um, add the clerk API keys. Explore clerk. Let's
50:4450 minutes, 44 secondsjust double check we did that correct one. Yep. Explore clerk publishable key.
50:4850 minutes, 48 secondsPK test and it's 1 CG. Yep, that's perfect. And then we have verify the app.json plugins. Yes, this is the one.
50:5550 minutes, 55 secondsSo now inside of uh uh Expo um projects, you will have something called app.json.
51:0251 minutes, 2 secondsThis is a very important file. This is effectively going to, you know, handle tons of different things inside your app. But if we go over here to plugins,
51:1051 minutes, 10 secondsyou can see there's a few things that we need to specifically add in. One of which is Expo Secure Store. We've already done that. and clerk expo which
51:1751 minutes, 17 secondshas been done here. Okay. So these are very very important. You want to make sure that these are added in. Okay. Uh and expo MPX expo install automatically
51:2651 minutes, 26 secondsadds that to our config. Okay. Then we've got add CL provider to the route layout which we've already done. Came a little bit late but I'm I'm here. I'm
51:3451 minutes, 34 secondsglad I made it. Yay. What's up? Add authentication and home screen. So this is the next step. Okay. So yes, this is much better. Right. This is much much
51:4251 minutes, 42 secondsbetter. Okay. Now, we can actually get rid of this or view, right? So, you can do that. You don't need to do that. It's you can be a bit more simple about it.
51:5151 minutes, 51 secondsNow, over here, we're just going to keep it very simple in the beginning. We've got the home screen. And then,
51:5651 minutes, 56 secondsbasically, we can pull in if you're authenticated or not. So, if we go up,
52:0152 minutes, 1 seconduh I don't like always when we do this inline stuff. So, I'm going to move that to the bottom this inline function,
52:0752 minutes, 7 secondsright? Um let's go here. Let's pop this in. And now we've got our use or and we can import that from Clark Expo. And
52:1552 minutes, 15 secondswhat I want you to do as we test this out is basically command J. We're going to have to cut our app because we we changed a bunch. So I'm going to cut the app. I'm going to npm run start again.
52:2552 minutes, 25 secondsOkay, because we did add in a ton. Now in this case, it says using development build. Now because if we see over here,
Chapter 20: Product planning and app structure decisions
52:3452 minutes, 34 secondsthere's one thing I forgot to mention. So over here we have here. So if we use the native component approach, you see
52:4352 minutes, 43 secondsthis approach uses Clark's pre-built native components to render Swift UI on iOS and Jetack compose. So they're literally rendering Swift UI components
52:5152 minutes, 51 secondsand and Jetack compos for Android. So these are literally native components.
52:5652 minutes, 56 secondsBut what it does mean is you need to do something called a development build, right? So in Expo, you have two things.
53:0353 minutes, 3 secondsYou have an Expo Go version of the app and then you have something called a development build. And our development build is basically going to be the build where you can install any dependency on
53:1153 minutes, 11 secondsnative heavy, right? You can go and install any single native dependency on there, but Expo Go, you can't do that.
53:1853 minutes, 18 secondsSo, you're going to end up building with Expo Go and then eventually you're going to have to switch to a development build. Now, some caveats, right? If you
53:2453 minutes, 24 secondsbuild with uh Expo develop a development build, and by the way, this happens if you build with Swift directly even, you need an Apple developer account, right?
53:3453 minutes, 34 secondsSo, you need to go sign up to an Apple developer account. And when you set things up, it will go ahead and ask you to do those things. Uh if you don't want to do that, okay, you can actually go
53:4353 minutes, 43 secondsahead and simply build it on Android and test out on Android. And then when you're ready to, you can go ahead and get an Apple developer account, right?
53:5053 minutes, 50 secondsCuz Android is free to develop on. Now,
53:5253 minutes, 52 secondsuh I have a developer account to show you today. So, we're going to go ahead and do that. And also to get an Expo app up and running, you can say we can type
53:5953 minutes, 59 secondsin Expo development build, right? Just type in Expo development build. And you can see that create a development build
54:0554 minutes, 5 secondson EAS or locally. Okay. So first thing is to get a development build we have to install something called Expo dev
54:1354 minutes, 13 secondsclient. Okay. So I'm going to go ahead and cut this right now and we're going to install expo dev client. That's the
54:1954 minutes, 19 secondsfirst thing. Second thing is we're going to go ahead and build native app. So so if you want to build the native app, you
54:2854 minutes, 28 secondscan do it like so. EAS build platform Android profile development. Now, this will go ahead and build it on EAS, which is Expo's app development services. So,
54:3754 minutes, 37 secondsbasically, it sends it to send your project to Expo and they build it in the cloud and then they basically create a bundle that you can then install on your
54:4454 minutes, 44 secondssimulator or on your uh actual physical device. So, if you plug in your device with a wire, you can actually go ahead and install it on your device and play
54:5254 minutes, 52 secondswith it on your phone. So, that's really really what I'd recommend. Um, today I'm going to keep it relatively simple and there's a couple of steps for the iOS simulator. So development. So for
55:0155 minutes, 1 secondexample, if we want to do it for a native app for iOS simulator, then what we can do is if we go into our uh EAS.json.
55:1055 minutes, 10 secondsSo actually we're not going to do it inside of EAS. So I'm going to show you you can do it EAS and follow these steps. I'm going to show you locally how
55:1755 minutes, 17 secondsto do it. So build locally using the EAS CLI. Now here you can see look on Mac you can do this. On Windows you would
55:2355 minutes, 23 secondshave to use the EAS. So EAS basically everyone can use EAS. So I recommend you go ahead and do that. um APK version I
55:3255 minutes, 32 secondswant build locally without you see there's some limitations for these ones.
55:3555 minutes, 35 secondsSo everyone should go ahead and do this one but I'm going to show you how you can do it locally as well because it's going to be better for timewise on the live stream. So I've already got a development account so we can do that.
55:4455 minutes, 44 secondsUm so let's give that a try. So in this case build locally with the local flag.
55:4955 minutes, 49 secondsOkay. So in order to build it, I want to do uh I think it's expo run build. Uh user build expo start.
56:0056 minutesSo yeah, any can be built on your local machine with the local flag. Okay, so we
56:0856 minutes, 8 secondscan just do it with that. So AS build and then we just do d- local or you could do EAS. There's another command expo run. Um but now that I know that I actually want to try this out. So, uh,
56:2056 minutes, 20 secondswe're going to go and do you see the prerequisites?
56:2556 minutes, 25 secondsEAS CLI. So, you need to make sure you do these things first. Sign up for an Expo account. Make sure you've already installed the CLI, which I've already done. And then download an Android
56:3356 minutes, 33 secondssimilar, which I told you how to do earlier on. You just download Android Studio and open it up like that. And then you can do it this way. But for iOS is what we're going to be doing. Do
56:4156 minutes, 41 secondsthis. Go ahead and log in. I've already done that. Mac OS with the iOS simulator installed. I've already done that. Okay.
56:4756 minutes, 47 secondsSo then we need to go ahead and create an EAS.json. Now in in order to uh actually do this, if I type in EAS login, I've actually already logged in.
56:5656 minutes, 56 secondsSo I don't think I need to log in again.
56:5856 minutes, 58 secondsYeah, you're already logged in as sign me. Yes, J continue loses login. Uh no, I've already Sorry, I've already logged in. I don't want to do
57:0557 minutes, 5 secondsthat again. Um I did development profile. ESJS Jason.
57:1057 minutes, 10 secondsSo uh there is a way that it can just generate that for us. Um I'm going just going to carry on and see if we can do that. Yeah. Yes. build platform iOS
57:1757 minutes, 17 secondsprofile development. Let's give that a try. So EAS build platform iOS vermin-local and then you can see EAS CLI is now
57:2657 minutes, 26 secondsavailable. So I need to actually upgrade that. Uh and then you see AS project is not configured. So we can actually just create an EAS project for us. So first things first, I'm going to upgrade my
57:3457 minutes, 34 secondsCLI. So I'm going to cut that upgrade the CLI cuz I want to have the best experience today. Quick water break as well.
57:4357 minutes, 43 secondsAnd then trust me, the build actually moves very quickly after this. And the whole build is going to be timestamped.
57:4857 minutes, 48 secondsThis is as live as it gets. I can promise you that. This is really as live as it gets. And you're going to be blown away with how quick this progresses afterwards. While that's happening,
57:5657 minutes, 56 secondslet's check on our convex back end,
57:5957 minutes, 59 secondsguys. So, we can see that now our convex back end has been moved to here. So, if we go over here, we can see apps. We
58:0758 minutes, 7 secondshave backend convex with the node modules. That's awesome, right? We have everything running in here. And that's perfect because now our admin and our
58:1458 minutes, 14 secondsapp can pull from that. Cool. So it's installed it right. So in this case
58:2258 minutes, 22 secondsit's installed the new CLI. Now if we go ahead and build the platform for the development profile. EAS project not configured. Yes. Would you like to
58:2958 minutes, 29 secondsconfigure it? Yes. Creating uh SA Papa Pizza on EAS. And then you can see it's linked it. No environment variables with visible plain text and sensor found.
58:3958 minutes, 39 secondsWould you like to link your iOS bundle identifiers? So in this case, I'm just going to carry on. iOS app only existent exempt. Yes. Do all the basic defaults
58:4658 minutes, 46 secondsis fine for now. Do you want to log into Apple developer account? I've already logged in. So it should let me log straight in. Yeah. So I've already
58:5458 minutes, 54 secondslogged in. I'm going to log into my account. Uh well, you can do the same thing, right? Of course, I'm just showing you cuz that way I've already set that up. Now once that's done, do
59:0459 minutes, 4 secondsyou want to reuse certificate? That's fine. I'm going to use reuse my certificate. And then I've got a bunch of devices here. So, uh, in this case,
59:1059 minutes, 10 secondsad hoc build. I don't know which one it is, actually. Um,
59:1559 minutes, 15 secondslet's just click that one. I don't I don't remember actually which one it was.
59:2059 minutes, 20 secondsUm, create new profile provision. Uh, do you want to continue without provisioning those devices? Yes. All right. It's fine for now.
59:3059 minutes, 30 secondsI should be I shouldn't have done that,
59:3159 minutes, 31 secondsbut it's fine. Um, and then you see it's g ahead and created a bunch of serial and all that stuff. So, what I want to do now is
59:4059 minutes, 40 secondsum So,
59:4659 minutes, 46 secondsfingerprint. So, let's go ahead and let that do its thing for now. Uh in the meantime, I want to see something. So, we're going to have to rebuild.
59:5459 minutes, 54 secondsSo, I surprisingly enough, I actually don't run this command. I actually run expo uh run iOS instead of this. So, I'm just wondering if it's a different step.
1:00:021 hour, 2 secondsSo expo run rebuild advant profile expert skill debug profile. So uh mpx
1:00:091 hour, 9 secondsmpm run. Yeah. Yes. Let me see what is my for my one. I actually run this. Yes.
1:00:141 hour, 14 secondsSo you see this is I had a feeling this was going to happen. So fast is not available. Ah I didn't
1:00:231 hour, 23 secondsinstall fast names on this machine. Um okay. There's a different way to do this. We can do controlr. Uh we can do npx run. I think it was
1:00:321 hour, 32 secondsiOS mpx expo run. Yeah. So, we can do this.
1:00:371 hour, 37 secondsSo, these two commands are quite important that you're going to have to use quite a lot. MPX expo pre-build clean, which basically wipes the old stuff. And then MPX expo run iOS. Right?
1:00:491 hour, 49 secondsSo, if I was to just do that now, you can see that it starts running a build on my machine locally. So, it's worth knowing that the two different things,
1:00:571 hour, 57 secondsright? So, what I done previously, you'd have to set up fast lane, do a bunch of that stuff. It you definitely want to do that, right? Uh today, obviously, while we're live, I'm just trying to get the
1:01:051 hour, 1 minute, 5 secondsthing up and running so I can show you guys. This is the thing with uh um native builds. They take a little bit more time to set up, which is why they're pretty crazy to do live, but
1:01:141 hour, 1 minute, 14 secondsit's all good. Right now, convex functions, let's just check on a bunch of our stuff over here. I'm going to just rerun this one. So, oops. Uh run
1:01:221 hour, 1 minute, 22 secondsdev front. Oh, yeah. This function is actually, remember, the admin app has now changed. So now we only have if we go into our admin app package.json.
1:01:331 hour, 1 minute, 33 secondsOkay. Yeah. So now we only have the we separated the packages, right? So it'll be mpm rundev. And this would be for the yeah the backend file. We can fix the
1:01:401 hour, 1 minute, 40 secondslock files afterwards. And then we're going to have over here that's that's building. So let's create another one.
1:01:471 hour, 1 minute, 47 secondsAnd then I'm going to split. Actually we don't need to split it. We can have ls cd apps. And then we got the back end
1:01:581 hour, 1 minute, 58 secondsagain. Siri wanted to jump into the mix there. See back end.
1:02:061 hour, 2 minutes, 6 secondsAnd then let's now we've got the package JSON here. So what have I got for my command over there? Apps back end
1:02:131 hour, 2 minutes, 13 secondspackage JSON convex dev. So npm rundev. And this will spin up my convex back end. Right. So now we can just rename this one to convex back end.
1:02:261 hour, 2 minutes, 26 secondsOkay. So you see what we got now. So that's running the convex back end.
1:02:291 hour, 2 minutes, 29 secondsWe've got the admin next.js app, the expo app running over here. And this is a spare node terminal. Okay.
1:02:361 hour, 2 minutes, 36 secondsSo this will help us out quite a bit in terms of just keeping things organized and neat. And we've got nice separation between our apps, right? So we can
1:02:441 hour, 2 minutes, 44 secondsdeploy as we wish. And again, the next natural upgrade here would make that a monor repo or start with a monor repo structure if you wanted to. Right? So there's a couple of things I want to do
1:02:521 hour, 2 minutes, 52 secondsto streamline this now. So you want to make sure firstly the convex functions are working. That's great. The nextJS app, let's just see if it's loading still so we can make sure that we're
1:03:001 hour, 3 minutesgood on that front. Yep. So that's all working great. And then what I want you to do is open up a separate terminal and then go into comx.dev
1:03:091 hour, 3 minutes, 9 secondsand make sure that you can log in and go into the site. So I think I'm about to clear my head. I worked with one of the
1:03:161 hour, 3 minutes, 16 secondsmost difficult seniors ever he joined because I don't have experience.
1:03:211 hour, 3 minutes, 21 secondsUh I can't answer deep questions guys on the live stream but you see now the the native app would have just finished
1:03:281 hour, 3 minutes, 28 secondsbuilding. Let's see what's happened. So yeah unable to resolve module react native reanimated. So remember that was
1:03:361 hour, 3 minutes, 36 secondsactually an issue that we saw could have popped up remember. So, if we go into our admin um our app, remember we did see that that was going to be an issue.
1:03:451 hour, 3 minutes, 45 secondsAnd the reason probably why is because this is popping up inside of where is React Native Reanimated. So, React
1:03:551 hour, 3 minutes, 55 secondsNative Reanimated Reanimated. So, we see it here, but I didn't actually remove it. So, that was probably my fault here.
1:04:051 hour, 4 minutes, 5 secondsSo, animated icons, React Native Reanimated. So that was causing an issue on Android. Okay. So this is only for the animated and the collapsible stuff.
1:04:161 hour, 4 minutes, 16 secondsSo the question is I didn't actually need that or want those animated icons.
1:04:201 hour, 4 minutes, 20 secondsSo we could actually just get rid of those entirely because I don't plan on using them. Um
1:04:281 hour, 4 minutes, 28 secondsso animated icon. So that's the little animated icon. So for now we don't actually even need that. So I can get rid of this one.
1:04:351 hour, 4 minutes, 35 secondsThat's number one. We can get rid of this animated splash screen. So, just a bit of clean up now on the code side of
1:04:421 hour, 4 minutes, 42 secondsthings, right? And then we also have inside the index animated icon over here. We don't need that. And then we're
1:04:501 hour, 4 minutes, 50 secondsjust following the trail, getting rid of those, right? Uh, if we hit reload, I think we still have some more react
1:04:571 hour, 4 minutes, 57 secondsreanimated stuff. And I probably also have to uninstall it. Yeah, definitely have to uninstall it. So this was actually
Chapter 21: Building the core mobile UI
1:05:061 hour, 5 minutes, 6 secondsyeah it does fight with SDK uh 55 sometimes. So um we actually saw this
1:05:131 hour, 5 minutes, 13 secondsinside of the setup right it was actually already explained to us over here import and uninstalled this one. So
1:05:221 hour, 5 minutes, 22 secondsI believe inside of native let's go ahead and just rerun this command. Okay so they do mention that this would could be a concern as well. I think that's why it's actually freaking out as well. So,
1:05:331 hour, 5 minutes, 33 secondslet's cut the app running here. Let's do mpm uninstall react native reanimate.
1:05:381 hour, 5 minutes, 38 secondsYou always want to make sure you're in the right directory as well. Remove 41 packages. There you go. So, now this should not actually be there. So, that's
1:05:451 hour, 5 minutes, 45 secondsno longer there. So, if we were to do a search again, sometimes you have to just kind of cut the search, run it again.
1:05:531 hour, 5 minutes, 53 secondsWell, okay. It's still part of the pair dependencies, I guess. Let's get rid of
1:06:001 hour, 6 minutesthis one. I mean, the animated icon webb, we don't need that either. Uh, we we're just trying to clear things up now. Get rid of this.
1:06:101 hour, 6 minutes, 10 secondsWe don't need these. Get rid of that. And for the explore, that's fine. Okay.
1:06:181 hour, 6 minutes, 18 secondsNow, let's give this a go. So, hit a refresh.
1:06:221 hour, 6 minutes, 22 secondsAnd it says, "Oh, yeah. Now, we need to restart our development server." So,
1:06:251 hour, 6 minutes, 25 secondswhat happened is we just finished the build, right? So the actual full thing built and then it's it spun up the app.
1:06:311 hour, 6 minutes, 31 secondsSo once it builds that entire build process, you know that big one that was basically running. Now once you've done a build, you don't need to rebuild every
1:06:391 hour, 6 minutes, 39 secondssingle time, right? What you can actually do is just go into your main thing and actually just do npm run start. It's only when you install more dependencies and change things up. And
1:06:471 hour, 6 minutes, 47 secondsyou can see that it's just using that previous development build. And if we hit R now, what it will do is iOS bundled. If we do I, you can see it
1:06:561 hour, 6 minutes, 56 secondsopens it up. And you can see welcome to expo. So this is how effectively we get past that point, right? So you don't need to rebuild that development bundle
1:07:031 hour, 7 minutes, 3 secondsevery single time. But you see we we unblocked ourselves. Cool. Okay. So now what I want you to do is where we're
1:07:111 hour, 7 minutes, 11 secondspretty good now, right? The admin admin is still generating the convex files over here, which is not ideal.
1:07:231 hour, 7 minutes, 23 secondsSo I want to just double check what that did actually. So, um,
1:07:271 hour, 7 minutes, 27 secondsconvex_/or generated are still being generated inside the admin file. Fix that.
1:07:391 hour, 7 minutes, 39 secondsI want to go ahead and make sure there's probably a config that I haven't tweaked somewhere that needs to go ahead and get updated. But effectively what we should
1:07:461 hour, 7 minutes, 46 secondsbe doing um is running that not here but instead
1:07:541 hour, 7 minutes, 54 secondsinside the back end. So it should be running here and then yeah. Oh interesting actually. So maybe I just need to delete that I guess it's com
1:08:021 hour, 8 minutes, 2 secondsafter being generated. So this lag because it's still running from the admin directory. So I probably ah it's because I just ran it from
1:08:101 hour, 8 minutes, 10 secondsthere. Okay. Stale from the before. Let me also check the P. So, okay. So, it was just left over.
1:08:191 hour, 8 minutes, 19 secondsSo, it's just it just needs to delete that. Okay, that's fine.
1:08:261 hour, 8 minutes, 26 secondsSo, yeah, we're good now. Okay.
1:08:301 hour, 8 minutes, 30 secondsAnd then the admin app. If we just cut that off and do npm rundev, now we can see that that yep, there's no
1:08:401 hour, 8 minutes, 40 secondsconvex that spins up. And if we go ahead and cut our convex and run that again,
1:08:451 hour, 8 minutes, 45 secondswe can see. Let's just double check here. So we can see that it runs, we refresh. Yeah, that's better. So if we go back over here, we don't have a
1:08:541 hour, 8 minutes, 54 secondsconvex there now. Convex is running only in here. This is this is what we wanted.
1:08:581 hour, 8 minutes, 58 secondsAnd if we go to all convex front end is already Yep, there we go. That's great.
1:09:021 hour, 9 minutes, 2 secondsThis one we don't need the environment variable set here because it's deployed on cloud. Okay. Okay. Now there we go.
1:09:091 hour, 9 minutes, 9 secondsRight. And now we've got the free apps and then we've got a separate terminal if we need it. Okay. So we we unblocked ourselves. Okay. So now that that's
1:09:171 hour, 9 minutes, 17 secondsdone, what I want you to do is come back over here and uh add the authentication screen. So very simply we go over here.
1:09:271 hour, 9 minutes, 27 secondsWe can go ahead and actually make this a little bit easier for ourselves. So we can see this is the documentation. So what we can do is in the actual logged
1:09:351 hour, 9 minutes, 35 secondsin screen. So if we go to collapse everything go to admin app sorry app go to source app index.tsx
1:09:441 hour, 9 minutes, 44 secondsand at the top here what I want you to do now is to understand things. So if we do console log and do is signed in right and if we hit save you should be able to
1:09:521 hour, 9 minutes, 52 secondssee look false and true. So is signed in is false is loaded is true. So we're not signed in at the moment. So when we're
1:10:001 hour, 10 minutesnot signed in now what we want to do is basically go ahead and render the user login. Right. So look at this. Use user propo modal. Let's go ahead and pop
1:10:081 hour, 10 minutes, 8 secondsthese in. And let's go ahead and uh bring these in. So this clerk expo and this clerk expo. Okay. So we got a bunch
1:10:171 hour, 10 minutes, 17 secondsof things here. So present user profile user and sign out. And then let's go here. And if we're not is loaded, it should show a loading indicator.
1:10:241 hour, 10 minutes, 24 secondsOtherwise, you see it shows the or view.
1:10:261 hour, 10 minutes, 26 secondsSo let's go ahead and pop those in. So boom. And now again from React Native,
1:10:311 hour, 10 minutes, 31 secondswe're probably going to have to import a bunch of stuff. I'm just tabbing these and it's importing them at the top.
1:10:361 hour, 10 minutes, 36 secondsStyles centered. So in this case, I haven't added the styles down below. We can add those after. And view. Uh this
1:10:431 hour, 10 minutes, 43 secondsone is actually from we need to import it from Expo Native,
1:10:501 hour, 10 minutes, 50 secondsright? So Expo native. Okay. Now, hey, look at that. That is awesome. Cool. Right. In this case, look, we can go ahead and do.
1:11:001 hour, 11 minutesNow, what I'd recommend here is you actually you could actually go ahead and put that in a modal and it will look really nice. So, it look like it slides up in a modal. Um, you could do that.
1:11:091 hour, 11 minutes, 9 secondsUh, let's see what else we got to customize here. Is dismissible and you've got the key as well. Uh, and then also is dismissible by default is false,
1:11:171 hour, 11 minutes, 17 secondsbut I wonder if this is true. That might be okay. So, if you dismiss that, I see.
1:11:211 hour, 11 minutes, 21 secondsSo, you can go ahead and set that up if if you handle your routing correctly.
1:11:241 hour, 11 minutes, 24 secondsRight. Styles. Is for the activity loader. So, if we were to refresh, we can see that the activity loader in the
1:11:311 hour, 11 minutes, 31 secondsbeginning didn't render nicely. Um, it's not signed in. It's not loaded.
1:11:391 hour, 11 minutes, 39 secondsStars do.
1:11:411 hour, 11 minutes, 41 secondsAnd I actually want to just quickly sty that before we carry on. So, styles.edun.
1:11:491 hour, 11 minutes, 49 secondsSo, down here, we can just pop in centered.
1:11:541 hour, 11 minutes, 54 secondsAnd now, yep, the little loader loads in. We have a little flicker though,
1:11:571 hour, 11 minutes, 57 secondswhich I'm not too happy about. And that's because it's rendering the app tabs first. Right. So, we're going to fix all of that afterwards. But for now,
1:12:051 hour, 12 minutes, 5 secondsI just want to get the authentication flow working so I can actually see if the user's properly logged in. So, we're going to log in. Let's do Google. And you can see, look, I've not actually
1:12:121 hour, 12 minutes, 12 secondsdone any coding besides adding this oneliner component name. And this is what I love about this auto view component. And this is a beautiful collaboration between um what's it
1:12:211 hour, 12 minutes, 21 secondscalled? Uh clerk and expo. Like super super nice. Um, look at this. And look at that. Boom. We're logged in. Right now, we've got the user here. So, that I
1:12:301 hour, 12 minutes, 30 secondsdidn't You see how easy that was? It was crazy, right? Um, so if we in, for example, inside the explore tab, uh, or now we're inside the home. So, if we go
1:12:381 hour, 12 minutes, 38 secondsinside of our explore or we're in the home, I guess. See, we have user present user profile. So, if we were to go ahead and add in like some buttons, for
1:12:451 hour, 12 minutes, 45 secondsexample, like look, you've got the sign out, manage profile. These are just like some dummy things that we can pop in.
1:12:511 hour, 12 minutes, 51 secondsUm, let's go ahead and actually just throw this entire bunch instead of all of this themed view stuff. Let's get rid
1:12:591 hour, 12 minutes, 59 secondsof all of that. Let's go ahead and replace that with their example. Okay. And then for the styles, for the image,
1:13:081 hour, 13 minutes, 8 secondswe can import expo image. Um, yeah,
1:13:111 hour, 13 minutes, 11 secondswe've got loads of styles that basically we need to import. So, what I think is easiest is you just take their styles instead of having the ones that I had in
1:13:191 hour, 13 minutes, 19 secondsmine. So, you want to go ahead and get rid of all of the stars down here. Uh,
1:13:231 hour, 13 minutes, 23 secondswe don't need the dev menu hint as well anymore. So, we can get rid of that.
1:13:281 hour, 13 minutes, 28 secondsAnd then underneath, we can simply pop the stars in. Okay. And now the text.
1:13:341 hour, 13 minutes, 34 secondsWhy is this freaking out? Text is from Rev. We should have text. Yeah, text.
1:13:421 hour, 13 minutes, 42 secondsGet rid of all this stuff that we don't need. Um,
1:13:491 hour, 13 minutes, 49 secondsand then get rid of this. Get rid of this. You see how we're just cleaning things up, right? And this is really like you can refactor as you wish, right? So, hit refresh. Boom. Right.
1:13:581 hour, 13 minutes, 58 secondsNow, we're here. Okay. Now, um, this is what I wanted. Cool. And then we can continue with Google.
1:14:061 hour, 14 minutes, 6 secondsSo, let's do continue with Google. Let's log in again.
1:14:121 hour, 14 minutes, 12 secondsThat's not good. Yeah. Get rid of save that.
1:14:181 hour, 14 minutes, 18 secondsOkay. Now, once we're logged in, you can see, look, we got the user. Right now, I want to show you a couple of things because look, this is what's so nice is that not only did I not have to do any
1:14:261 hour, 14 minutes, 26 secondsof the authentication flow, all I had to do was add in this one or view component. Uh, I've got a little bug on my simulator, but you won't have to log
1:14:331 hour, 14 minutes, 33 secondsin every time. So, it's just my device that does this one thing. So, if we do notice that, that's just mine. But otherwise, you guys can see here that the user button, this right here.
1:14:421 hour, 14 minutes, 42 secondsPerfect. So if we click here, so firstly it just shows the user itself, right?
1:14:451 hour, 14 minutes, 45 secondsBut I think the user button I'm looking for is actually this one. Yeah. So you see this user button guys, I didn't implement anything. And now just from
1:14:521 hour, 14 minutes, 52 secondshere I can change the user's picture. I can go ahead and change the name. I can update all their details. And this is modifying my actual clerk profile. I can
1:15:001 hour, 15 minutesgo into here and I can add in different accounts. This is all built off the back, right? So everything if I click on sign out, boom, I sign out. Everything
1:15:091 hour, 15 minutes, 9 secondsbuilt from literally one component user button and also view right beautiful.
1:15:161 hour, 15 minutes, 16 secondsNow I also want to check out the present user profile. Where is this rendered out? So this is on the touchable opacity for manage profile. Okay. So if you can
1:15:241 hour, 15 minutes, 24 secondseither uh toggle that by having the user button which is this one right here or if you click on manage profile it also
1:15:321 hour, 15 minutes, 32 secondspulls up. So you can programmatically call it with present user profile. So I wanted to highlight these two things because honestly it's a gamecher like
1:15:391 hour, 15 minutes, 39 secondsjust from those two things we have user management right so we have full authentication flow inside of our app okay so now what I want to do is I want
1:15:461 hour, 15 minutes, 46 secondsto shift that into a profile view so I'm going to create a profile tsx and then rfce I don't think I have my
1:15:541 hour, 15 minutes, 54 secondsrenative I do have re native functional export components so react native functional export that's just a plugin you can feel free to
1:16:021 hour, 16 minutes, 2 secondsdownload that one so renative functional I think it was yeah that one. So we can say profile. So
1:16:101 hour, 16 minutes, 10 secondsthis is just a profile component and inside of our layout app tabs actually here in app tabs we
1:16:181 hour, 16 minutes, 18 secondsactually have our native tab handler. So this is native tabs something beautiful in SDK 4 54 I believe it came for expo
1:16:261 hour, 16 minutes, 26 secondsand you can see we have the home explore. I'm going to add one more for the uh profile. Oh, it was actually there. One more for the profile. So,
1:16:361 hour, 16 minutes, 36 secondsprofile. Yep.
1:16:401 hour, 16 minutes, 40 secondsWe don't actually have an image for that one. So, so we don't have an image for that one.
1:16:461 hour, 16 minutes, 46 secondsThat one's rendering assets. Image tab icons. Explore. So, do we have any other assets? Actually, do I have any assets? Image expport icons.
1:16:551 hour, 16 minutes, 55 secondsWe have home explore.
1:17:011 hour, 17 minutes, 1 secondhome. Where is it? Uh, tab images, tab icons, explore, home. Okay, so we've got the few different variants
1:17:091 hour, 17 minutes, 9 secondsthat are pulling in. So, these are just going to be different ones. So, what I might do is actually just replace one of these. I mean, we can easily get another one for ourself, but for now, I'm being
1:17:171 hour, 17 minutes, 17 secondsa bit lazy. I just want to go ahead and do um let's just pop this in here. So, rendering mode.
1:17:251 hour, 17 minutes, 25 secondsPop this in. So, there you go. Profile. Okay. So,
1:17:291 hour, 17 minutes, 29 secondsand then for explore, let's just remove that. So, in this case, okay, we've got the explore, profile, home. Okay, so this is already perfect tab management.
1:17:361 hour, 17 minutes, 36 secondsReally nice. Uh, for the profile, I'm going to basically shift everything from uh well, everything that we had from our index effectively over to that. So,
1:17:471 hour, 17 minutes, 47 secondsthis entire view, I'm going to man move to profile over here. So, let's shift that over.
1:17:561 hour, 17 minutes, 56 secondsAnd then four. And also actually, you know what?
1:18:011 hour, 18 minutes, 1 secondThis is a bit silly. We could do it a few ways actually. So,
1:18:051 hour, 18 minutes, 5 secondsall right, let's do a little refactoring. Right. So, in this case, we need to swap the uh index with the profile. So, what I could do is I could
1:18:131 hour, 18 minutes, 13 secondsdo that myself or I could just get AI to do it. So, I'm going say swap the index and profile pages page contents. I want
1:18:211 hour, 18 minutes, 21 secondsthe um uh index.tsx. tsx uh screen or you can just do it at index.tsx screen
1:18:301 hour, 18 minutes, 30 secondsum contents inside the profile uh screen. Okay, so we can go ahead and do that. Just spin that off. Let that do its thing. That'll shift it all for us.
1:18:401 hour, 18 minutes, 40 secondsWe can come in and check on that afterwards. So that basically and then I want the index to be a dummy screen.
1:18:451 hour, 18 minutes, 45 secondsThis is effectively we're going to where we're going to order pizza from. So now we need to build right cuz we're we're kind of yeah we're focusing too much on this side. So this is you can follow
1:18:541 hour, 18 minutes, 54 secondsthrough the next steps and you can have a bunch more things. It's really powerful stuff. And then you guys saw there like first it's so simple guys because I was doing the refactor now.
1:19:041 hour, 19 minutes, 4 secondsYeah. So it's going to go ahead and swap things out for us.
1:19:071 hour, 19 minutes, 7 secondsAnd then if I just go ahead and accept all. So you guys can see here the home screen is very basic now. And the profile is that now. And as you can see we have the profile stuff over there.
1:19:161 hour, 19 minutes, 16 secondsAnd in home we have it up there. Now because it's up there you got two ways of addressing danger zones. So if we go into the index over here, we can either
1:19:251 hour, 19 minutes, 25 secondsdo safe area view. So you can either do a safe area view or you can use insets.
1:19:311 hour, 19 minutes, 31 secondsThere's loads of different things you can do, but just a quick easy one. If you did that, you see how it pops in the the inside the view, right? So you can do that or you can do safe area insets,
1:19:411 hour, 19 minutes, 41 secondswhatever the case. But I just want to,
1:19:421 hour, 19 minutes, 42 secondsyou know, show you that you can do those things. So for now, we've got our base set up. So once you have your base set up, right, and everything's kind of, you
1:19:491 hour, 19 minutes, 49 secondsknow, in a stable place, I want you to check your git diff because at this point, I guarantee something's going to be wrong, right? 4,800 changes, right?
1:19:591 hour, 19 minutes, 59 secondsThere's way too many changes here. Let's have a look what's going on. So firstly,
1:20:021 hour, 20 minutes, 2 secondsthe agent skills are fine to commit. The main thing is node modules are being committed, right? That's absolutely wrong. So you instead of you can go
1:20:101 hour, 20 minutes, 10 secondsahead and check this out, but basically uh we can use AI to quickly change this.
1:20:141 hour, 20 minutes, 14 secondsSo uh get diff. So I can show the the get diff the get diff
1:20:211 hour, 20 minutes, 21 secondsshows too many uh changes. Um uh we need
1:20:261 hour, 20 minutes, 26 secondsto say uh add node modules to the get ignore uncheck
1:20:361 hour, 20 minutes, 36 secondsuncheck. Wait, I'm just going to use super check for other things that should also be ignored.
1:20:421 hour, 20 minutes, 42 secondsAll right. So let that do its thing and that's going to basically that number should massively drop. It should never be 4,800. We never ever commit node modules. Okay. Um so now it's going to
1:20:521 hour, 20 minutes, 52 secondsgo ahead and check out all the get ignore files and then it's going to check the get status to see what's uh structured and then it'll be able to compare.
1:21:001 hour, 21 minutesOkay. So preparation wise you know it took a little bit of time but in this case this was me trying to really go ahead and explain everything in depth.
1:21:081 hour, 21 minutes, 8 secondsWe have admin app and we have this. The only difference is is that now the only the one thing that I didn't do actually is for the expo app I didn't wrap it
1:21:171 hour, 21 minutes, 17 secondsaround the clerk provider. So the difference is is that where we have the clerk provider pattern here we need to do one more step right and that one more
1:21:261 hour, 21 minutes, 26 secondsstep is inside of admin and if you can see it here actually if you type in clerk convex you can see inside of the
1:21:341 hour, 21 minutes, 34 secondsdocumentation whenever you go ahead and see like you know so example here um when you set things up you have to
1:21:411 hour, 21 minutes, 41 secondschange the way you wrap things you see how we go ahead and wrap uh the app inside of a convex provider and then we go ahead instantiate convex for example.
1:21:501 hour, 21 minutes, 50 secondsOkay, so we need to do the same thing.
1:21:531 hour, 21 minutes, 53 secondsNow I have got the component uh already set up pretty much inside of inside of a layout. So inside of our
1:22:031 hour, 22 minutes, 3 secondsadmin app, we had it working. So if we go to our admin app, the layout here, we have our clerk provider and then the convex client provider. This one, you
1:22:111 hour, 22 minutes, 11 secondssee this component right here? This is the one we need. We're going to copy this and we're basically going to shift this to our uh our app. Okay. So over
1:22:191 hour, 22 minutes, 19 secondshere we're going to go ahead and create a components folder or actually inside the source maybe components folder.
1:22:261 hour, 22 minutes, 26 secondsYeah. And we're going to add it inside there. Convex client provider. And you see these are wrong packages. Okay. So these are obviously not all the correct
1:22:331 hour, 22 minutes, 33 secondspackages. Convex react convex um clerk expo is going to be here. This is going to be clerk expo. For this one, we need
1:22:401 hour, 22 minutes, 40 secondsto make sure we are using the right uh right packages. So, I want to make sure we do this correctly. So,
1:22:511 hour, 22 minutes, 51 secondsset up this. We done this uh deploys react here. So, clerk react clerk and the packages are the same regardless. So
1:23:001 hour, 23 minuteslook react and then it's going to be the only difference is actually that we need to make sure we don't do is if we pull
1:23:081 hour, 23 minutes, 8 secondsthis over the left and we pull open up our layout over here. So convex react.
1:23:171 hour, 23 minutes, 17 secondsSo clerkjs. So we just need to make sure you use the right packages here. So we need to install convex react number one.
1:23:251 hour, 23 minutes, 25 secondsSo I want you to go ahead and um do that first. Well, actually convex
1:23:331 hour, 23 minutes, 33 secondsexpo is what we may need here. Convex expo. So using convex mpm export export install convex. So let's go ahead and
1:23:421 hour, 23 minutes, 42 secondsinstall that firstly into our app because we shouldn't be using the same Oh no, don't do it there. Don't do it there. Right. Did I accidentally install
1:23:491 hour, 23 minutes, 49 secondsit there? No. Okay. CD into apps ser. It's so annoying when Apple thinks
1:23:561 hour, 23 minutes, 56 secondsI'm saying the magic word. Okay, into that. And then inside of here, MPX expo
1:24:031 hour, 24 minutes, 3 secondsinstall comx. Okay, so we're going to expo install comx.
1:24:091 hour, 24 minutes, 9 secondsAnd now you can see this is going to install comx, but
1:24:161 hour, 24 minutes, 16 secondsthis is installing the database, which I don't want to do. So let's see what that did.
1:24:251 hour, 24 minutes, 25 secondsWe actually added in the packages that I needed which is the correct thing. So we have clerk provide. So firstly just to
1:24:321 hour, 24 minutes, 32 secondsavoid any confusion I'm inside of the app and then inside of convex client provider. Okay. So here just to avoid
1:24:411 hour, 24 minutes, 41 secondsany confusion that could be happening right now. Clerk expo here is our us and then the convex client is over here. So
1:24:491 hour, 24 minutes, 49 secondsnew convex react client like so and then here you see this next public convex url this is wrong right so this one
1:24:561 hour, 24 minutes, 56 secondsobviously needs to now change so inside of our environment file you see we don't have next public convex url we have next
Chapter 22: Adding menu and product flows
1:25:051 hour, 25 minutes, 5 secondsuh expo public so firstly needs to become expo public and then the easiest way to do is to go to your environment
1:25:121 hour, 25 minutes, 12 secondslocal in your other project gra uh ta these two. Go back to your
1:25:211 hour, 25 minutes, 21 secondsenvironment file, paste it in, and just change these two prefixes with expo.
1:25:261 hour, 25 minutes, 26 secondsOkay, so cuz we might need both of these, right? So expo public convex URL.
1:25:311 hour, 25 minutes, 31 secondsAnd then you want to instead pop those in because expo doesn't read that. And again, it's not a use client because we're not in X.js here. We're inside of
1:25:391 hour, 25 minutes, 39 secondsExpo. Okay. So now we have our ComX client provider. We go over to our
1:25:461 hour, 25 minutes, 46 secondslayout now. And then if we see inside of the uh documentation,
1:25:531 hour, 25 minutes, 53 secondsso that's when you were to obviously connect it up. Convex client. And I just want to make sure that we're correctly convex react client unsafe changes
1:26:021 hour, 26 minutes, 2 secondswarning false. Um you can use uh you can use superbase if you wanted to. Honestly, there's no preference here. If you like super basease, feel free to use superbase.
1:26:111 hour, 26 minutes, 11 secondsRight. Going back to documentation here.
1:26:141 hour, 26 minutes, 14 secondsuh we wrap it around the convex provider with clock. So where we have our
1:26:241 hour, 26 minutes, 24 secondsI keep switching between apps which is very very frustrating. So script uh source app layout. So here we are. So
1:26:321 hour, 26 minutes, 32 secondsclerk provider and then I have the component convex client provider. Here we are. Okay. So convex provider with
1:26:391 hour, 26 minutes, 39 secondsclerk and you see it has to be inside of the clerk provider. So the way we want to do that is we go into our layout and
1:26:481 hour, 26 minutes, 48 secondsyou see our clerk provider. You want to make sure you push it inside of that. So now what we do is we're going to go
1:26:551 hour, 26 minutes, 55 secondsahead and say convex client provider and you see how we push it underneath there and we import it like so. Okay. Now once
1:27:041 hour, 27 minutes, 4 secondswe have that we should be good. Now you can see that you can control which UI is shown when the user is signed in or out using convex's authenticated or
1:27:121 hour, 27 minutes, 12 secondsunauthenticated and offloading. These should be used instead of clerk's show components respectively. So very important to remember that. Okay, it's
1:27:211 hour, 27 minutes, 21 secondsimportant to use the use convex or hook instead of clux use or hook. We need to check whether user is signed in or not.
1:27:271 hour, 27 minutes, 27 secondsSo even here where we use the use or you're only going to use the use or when you're setting things up initially. So
1:27:361 hour, 27 minutes, 36 secondswe had the use from clerk react over here but when you're actually inside the app you want to be using use convex or
1:27:441 hour, 27 minutes, 44 secondsall right instead. So it basically is making sure that the fetches happen the four way around right and this is where I think the documentation for this
1:27:521 hour, 27 minutes, 52 secondsintegration might need to get updated because I think there's a slight discrepancy with it. Um but you can see
1:27:591 hour, 27 minutes, 59 secondsnow okay it was fine we got there. Uh but let's go back to we need to change one thing actually. So our log our login
1:28:071 hour, 28 minutes, 7 secondslogic. So here we were checking for the login state right inside of the uh profile screen which is wrong. We need
1:28:161 hour, 28 minutes, 16 secondsit inside the layout. Okay. So we're going to shift this logic. So over here.
1:28:201 hour, 28 minutes, 20 secondsSo I want to have the two files open. So I'm going to have my layout file over here. I'm going to have my profile over here. And let's just start refactoring.
1:28:271 hour, 28 minutes, 27 secondsSo typically everything's happening over on the layout, right? When the when the app loads, what to show and so so forth,
1:28:341 hour, 28 minutes, 34 secondsright? So we're going to take this over there and we're going to start refactoring things up. So firstly, this needs to be inside of here.
1:28:421 hour, 28 minutes, 42 secondsAnd then we need to pull in the us from like so. Okay. And then the only thing
1:28:491 hour, 28 minutes, 49 secondsis here you see we're trying to use from clerk and we're outside the theme uh outside the clerk provider. So this is
1:28:571 hour, 28 minutes, 57 secondswhere it poses issue right. So we actually need to have this happen inside the perhaps the
1:29:061 hour, 29 minutes, 6 secondsconvex client provider otherwise the state won't be available I don't believe so this is something which I fixed in
1:29:141 hour, 29 minutes, 14 secondsanother one but I really don't want to screw it up with you guys so I want to kind of get this right. So if we did try it here we can give it a try but I don't believe this is the nice way to go. So,
1:29:241 hour, 29 minutes, 24 secondsif I was to pop this in here, let's go ahead and give it a try. So,
1:29:281 hour, 29 minutes, 28 secondsimport, import, import, and then styles.ed.
1:29:331 hour, 29 minutes, 33 secondsLet's go ahead and give that over at the bottom. Just like this.
1:29:411 hour, 29 minutes, 41 secondsOkay. Now,
1:29:461 hour, 29 minutes, 46 secondsget a refresh. Okay. Yeah. So, users can only be used with inside of a clerk provider component. Yeah. So this is where typically it's just a react pattern that we're we have to deal with,
1:29:561 hour, 29 minutes, 56 secondsright? So we want to make sure and then by the way we're not done with the the refactoring. So we need to do it inside
1:30:031 hour, 30 minutes, 3 secondsof here the convex client provider. So effectively we need to take all of this go inside of here and I want to do it
1:30:121 hour, 30 minutes, 12 secondshere really right or even do we do it here or do we do it inside another layer?
1:30:271 hour, 30 minutes, 27 secondsIt actually should be happening in the app tabs or your first navigator. So it should really be happening at this level
1:30:351 hour, 30 minutes, 35 secondsshould be happening here. Yeah. So we should be doing it at whatever your lowest like your main navigator is. So
1:30:421 hour, 30 minutes, 42 secondsour main navigator is our app tabs in this instance. So, we're going to go ahead and put it here because it needs to be at the lowest point underneath convex and client. Yep.
1:30:551 hour, 30 minutes, 55 secondsPull that in. And then when we render these out. So,
1:31:011 hour, 31 minutes, 1 secondright now actually we can keep these these are just around the users logged in state. So, that's absolutely fine.
1:31:091 hour, 31 minutes, 9 secondsUse clock and same for this. Okay. Now, if we hit
1:31:161 hour, 31 minutes, 16 secondsa refresh, let's see. So, users can only be used within the tab layout. So, tab layout. Where's my tab layout? Tab layout.
1:31:281 hour, 31 minutes, 28 secondsWe're not Oh, we forgot to save the file.
1:31:331 hour, 31 minutes, 33 secondsYep. There we go. So, now the only thing that's actually old file. Yeah. So, let's do a bit of cleanup.
1:31:401 hour, 31 minutes, 40 secondsAnd then let's do a bit of clean up here.
1:31:441 hour, 31 minutes, 44 secondsAnd there we go. Okay. Now, there are going to be, you know, at the end of this, I'll give you I'll actually give you the whole code base because it'll make it a bit more simple for you guys
1:31:511 hour, 31 minutes, 51 secondsto log in. But in this case, um it's just because I had the monor repo structure. It got a little bit confusing. But let's go ahead and do a continue now.
1:32:001 hour, 32 minutesAnd then we should log in and then rendered more hooks in the previous render. It's because I screwed something up over here. So, the use inside the app
1:32:071 hour, 32 minutes, 7 secondstabs. So, I've messed something up deeply here and it's very frustrating on the live stream. Ah, okay. Um,
1:32:161 hour, 32 minutes, 16 secondslet me have a look at the actual documentation.
1:32:211 hour, 32 minutes, 21 secondsSo, expo um clock or view is what I'm after.
1:32:291 hour, 32 minutes, 29 secondsView expo name. So, we have the signin screen, right? Uh, and then we have the
1:32:361 hour, 32 minutes, 36 secondsreplacement. Ah, okay. Okay, I have a nice way we can do this. We can use protected stacks. That's what I did
1:32:441 hour, 32 minutes, 44 secondsbefore. So, okay, back to layout. What we can do here,
1:32:521 hour, 32 minutes, 52 secondsuh, is I actually have a very nice code base I did a little bit of a practice run on. I'm going to pull up on the side just so I can reference something
1:33:001 hour, 33 minutesbecause I had I figured this out yesterday and I wanted to work something out. Um,
1:33:081 hour, 33 minutes, 8 secondspizza.
1:33:091 hour, 33 minutes, 9 secondsOne second, guys. I'm just going to pull that up for reference because I did one slight change in that which I believe will help me out a little bit with this now.
1:33:201 hour, 33 minutes, 20 secondsSo, what is this? This Oh, I'm already in the pizza app. Okay, it was um
1:33:301 hour, 33 minutes, 30 secondsapps. So, pizza store
1:33:371 hour, 33 minutes, 37 secondsOkay, so yesterday I was uh messing around with something and I had my code base and I don't mind
1:33:451 hour, 33 minutes, 45 secondsactually showing. So I was messing around with the monor repo structure and what I did was I had my layout
1:33:521 hour, 33 minutes, 52 secondsnavigation which was our root layout navigator cler and then we rendered the root layout navigator inside a separate ah it's just a separate child component.
1:34:021 hour, 34 minutes, 2 secondsI see. So this is what I was doing wrong. Okay. So effectively we need to just simply do a root layout navigator.
1:34:101 hour, 34 minutes, 10 secondsUh then we have our imports and then we have our slot and the slot is effectively rendered here. But
1:34:191 hour, 34 minutes, 19 secondsinstead of this I can actually just render out the app tabs. So I can render the app tabs here.
1:34:261 hour, 34 minutes, 26 secondsAnd then here we can just render out the root layout navigator. And that way it's technically nested within it. And then in app tabs, we don't want to have the
1:34:341 hour, 34 minutes, 34 secondslogic that I put in here. We just want to have the tabs. Yeah. So that should be good now. There we go.
1:34:451 hour, 34 minutes, 45 secondsAll right. Hit refresh. Let's test it out. So now um go over here.
1:34:551 hour, 34 minutes, 55 secondsOkay. So now we've got the first. So this is our top layout. You see everything is u wrapped the way that it should be wrapped. Um the only thing
1:35:041 hour, 35 minutes, 4 secondsthat I do notice is that dynamic I'm not sure if we need I don't think this is for this. Yeah. Okay. Cool. So we go into continue with Google
1:35:131 hour, 35 minutes, 13 secondspizza. We sign in and imagine the user's coming in. They want to sign in buy a pizza. Right. You can style that up as you wish. Right. eventually in the
1:35:201 hour, 35 minutes, 20 secondsbeginning like for now the customization for that screen isn't available but you can simply have it in a kind of you know a pizza screen and then a sign up popup
1:35:281 hour, 35 minutes, 28 secondsand you can go ahead and customize that yourself but now I want to focus more on the actual UI screen so there we go we fixed that part right my simulator has a
1:35:351 hour, 35 minutes, 35 secondsbug which isn't actually you know a very commonly known bug but you guys won't have the experience of signing out every time if if I do a hot refresh so just
1:35:441 hour, 35 minutes, 44 secondsknow that that is something that only I'm experiencing at the moment I'm trying to figure out why that's happening as Right. So, uh let's do the
1:35:521 hour, 35 minutes, 52 secondsfull build now. Okay. So, all right. The main thing is uh come on then. I need to plan out the actual app. Okay. So, at this point, so we're 1 hour and 30 in.
1:36:011 hour, 36 minutes, 1 secondAnd watch how fast this is going to go now because this is goes to show once you've got the everything set up the correct way. The back end, the admin app, the the front end app. It really
1:36:101 hour, 36 minutes, 10 secondsdoesn't take long to build something uh with the correct source set up. So,
1:36:141 hour, 36 minutes, 14 secondsgoing to our design over here. I'm going to give the design that we previously had over here as inspiration for this.
1:36:221 hour, 36 minutes, 22 secondsRight. So, we've got a couple of pizzas here. You know, you can add a couple of ingredients. We can uh select the restaurant we don't actually want. We just want to have a single kind of
1:36:311 hour, 36 minutes, 31 secondsrestaurant design. Um, but I actually want to keep the glass native UI at the bottom of it. Okay. So, let's go ahead
1:36:401 hour, 36 minutes, 40 secondsand take this for example as maybe inspo, right? So something like this.
1:36:461 hour, 36 minutes, 46 secondsNow I can pop this in and I can say we don't want the navigation from this picture. We want to keep the native navigation that we currently have.
1:36:561 hour, 36 minutes, 56 secondsRight. Um and I'm basically just going to keep manating now. So we need to make a plan to create a pizza delivery app.
1:37:041 hour, 37 minutes, 4 secondsThis is going to be for a single store called Papa Pizza. Right. Papa's Pizza,
1:37:101 hour, 37 minutes, 10 secondsright? Uh let me restart the playlist. And let's have a quick water break.
1:37:201 hour, 37 minutes, 20 secondsOkay, so we need to create and obviously switch to plan mode at this point. Do command E as well to go into the proper plan view. And this is going to help us
1:37:291 hour, 37 minutes, 29 secondsout a lot, right? Um the app belongs to for slash app. So
1:37:391 hour, 37 minutes, 39 secondsit's going to be d this, right? and the admin panel where we control the inventory,
1:37:491 hour, 37 minutes, 49 secondsthe pizzas available, the ingredients,
1:37:521 hour, 37 minutes, 52 secondsuh the type of pizzas available to order and also where we can see the orders that have been placed
1:37:581 hour, 37 minutes, 58 secondsbelong in the Nex.js app and then we just simply pop in the admin. So basically see how I'm linking
1:38:061 hour, 38 minutes, 6 secondsit up. Now both apps the app that the users will use to order pizza and the admin panel will use a shared backend
1:38:151 hour, 38 minutes, 15 secondsconvex instance for the database. So there's real time streaming by default.
1:38:211 hour, 38 minutes, 21 secondsOkay. And then this is going to be the convex backend. So in this case we go to our backend package. Okay. So now we've got the set up nicely.
1:38:311 hour, 38 minutes, 31 secondsI need as I'm watching we can say um we need to create an MVP here where we can essentially go ahead and as a user
1:38:391 hour, 38 minutes, 39 secondsselect the pizzas that we want inside of our cart navigate to the cart screen and then go ahead and place an order. The
1:38:471 hour, 38 minutes, 47 secondsorder should then appear in the admin panel and in the admin panel we should be able to go ahead and change the status of the pizza order. So, we should
1:38:571 hour, 38 minutes, 57 secondsbe able to see uh the pizzas that need to be cooked and then we should be able to say if they're on their way to be delivered to the user and then also once they have been delivered to the user.
1:39:081 hour, 39 minutes, 8 secondsSo, we should be able to update the status. We should be able to have CRUD functionality. That makes sense. And for the user, we should be able to see all
1:39:161 hour, 39 minutes, 16 secondsof our placed orders as well as the individual status using convex realtime. This should be fairly simple to achieve.
1:39:251 hour, 39 minutes, 25 secondsAnd the reason why I chose convex is because basically convex by default the database is realtime. So if as long as we have those fields updating in the
1:39:331 hour, 39 minutes, 33 secondsback end our users going to see that real-time order status. Okay. Um now for the actual image we gave in. This is
1:39:411 hour, 39 minutes, 41 secondsjust some inspiration for some of how the UI can look.
1:39:461 hour, 39 minutes, 46 secondsRight? So uh you know we can go ahead and give that as a draft. And then really I want to do one more thing which is
1:39:551 hour, 39 minutes, 55 secondsonly admin users should be able to use the admin app. And the way we're going to do this is we're going to check for an admin row on clerk side. Uh that we
1:40:041 hour, 40 minutes, 4 secondscan manually add from clerk's dashboard to assign which users are an admin.
1:40:121 hour, 40 minutes, 12 secondsOkay. So that way we can protect the admin app as well. Um and then for the other side, we have got payment stuff
1:40:211 hour, 40 minutes, 21 secondswhich we if we have time we can implement. We're going to potentially do stripe checkout. Uh if not, then we can just kind of mock the payment side. Um okay, but let's begin with this, right?
1:40:321 hour, 40 minutes, 32 secondsI'm going say I want you to use as much of SDK 55 expo features as we possibly can perhaps in the navigation to make
1:40:401 hour, 40 minutes, 40 secondsthings uh look extra nice. So they've got some awesome uh actually stuff that we could use here.
1:40:471 hour, 40 minutes, 47 secondsUm, and then perhaps the bottom accessory would be really nice there actually. Uh, but let's just
1:40:551 hour, 40 minutes, 55 secondsstart with this, right? So, we're going to give this as a whole idea. We're going to start a plan, right? So, this is in plan mode, of course. We're going to go ahead and close these. And now,
1:41:041 hour, 41 minutes, 4 secondswe're going to really start seeing some acceleration with the app. Right. um the I didn't specifically tell it to use the
1:41:131 hour, 41 minutes, 13 secondsuh the plugins and skills because it should be doing that by default. Okay.
1:41:171 hour, 41 minutes, 17 secondsBut if it doesn't, then it's just worth knowing that we might be better off prompting it as well. While this is happening, I'm going to change my music
1:41:251 hour, 41 minutes, 25 secondsto be a bit more lowfi as well because I think I want to it's a bit more of a a jam session right now that I'm going to get this stuff done. But feel free ask
1:41:341 hour, 41 minutes, 34 secondsyour questions like while we're doing this because this bit is pretty much where everything rapidly accelerates and you're going to see both apps getting rapidly built out and it's really kind
1:41:421 hour, 41 minutes, 42 secondsof cool, right? So I'm going to have effectively things set up really nicely.
1:41:461 hour, 41 minutes, 46 secondsNow I'm going to have the admin app over here. So this is going to become our admin app. This is going to be our users
1:41:531 hour, 41 minutes, 53 secondsapp. Um this is going to be I guess our documentation side of things. So in case we need to check out designs or documentation, we can go on this. Uh and
1:42:011 hour, 42 minutes, 1 secondand really I do recommend like if you're working with AI, it really does it benefits you to have multiple screens,
1:42:061 hour, 42 minutes, 6 secondsguys. Like just invest in them. Like I use obviously when you got so much stuff going on like an app running a back end,
1:42:121 hour, 42 minutes, 12 secondshaving separate screens running everything is is going to be an absolute game changer for you.
1:42:191 hour, 42 minutes, 19 secondsWhile that's uh happening, I really want to highlight one thing. Like although we had a bit of uh trouble setting things up, that was more my fault. The actual
1:42:291 hour, 42 minutes, 29 secondsthing that was absolutely incredible is how one the clerk and comx sides play together because now we can do you know essentially secure calls uh to know
1:42:371 hour, 42 minutes, 37 secondswhich the the user is logged in and basically check on backend functions.
1:42:411 hour, 42 minutes, 41 secondsBut most importantly, if you go here to uh actually, you know, I'm just wondering actually
1:42:481 hour, 42 minutes, 48 secondsif we needed to do the club wrapper on the convex wrapper. It's fine. We can keep it for now. But for the actual uh
1:42:571 hour, 42 minutes, 57 secondsif we go here to the um layout like guys really like the fact is if you've ever had to build
1:43:051 hour, 43 minutes, 5 secondsauthentication and please comment down like in chat right now if you've ever had to do this but the fact you can just do that if you're not signed in return
1:43:131 hour, 43 minutes, 13 secondsauth sign in sign in or up or just sign up if you want to restrict only one or the
1:43:211 hour, 43 minutes, 21 secondsother like that is so crazily simple it's unreal. right? Um to to be able to do that. So yeah, once you get past the development build and all that kind of
1:43:291 hour, 43 minutes, 29 secondsstuff and remember like when you're building native, you do need a bit more patience in my opinion, right? But thanks to Expo, you can do this stuff
1:43:361 hour, 43 minutes, 36 secondsotherwise truly before this like building two apps entirely. It was it was a big task, right? So in this case,
1:43:431 hour, 43 minutes, 43 secondswe've got three sub agents kind of, you know, running off and checking how the entire app looks so we can build a plan.
1:43:501 hour, 43 minutes, 50 secondsAnd this is another reason why I like using cursor because what cursor does really well is it spins up sub aents
1:43:571 hour, 43 minutes, 57 secondswhich are cheaper. So composer 2 is cheaper. It doesn't use my same uh you know quote. So if we go here for example to my cursor settings to my you know my
1:44:071 hour, 44 minutes, 7 secondsusage tab. What you'll see is look I have 35% API used up right and then in this case I've got auto and composer.
1:44:151 hour, 44 minutes, 15 secondsNow auto and composer are these models.
1:44:171 hour, 44 minutes, 17 secondsSo when I'm using these sub aents, I'm not using for my API cost, right? Which is actually very very important, right?
1:44:231 hour, 44 minutes, 23 secondsWe we ideally want to save that one because that's what we want to, you know, use things like Opus 46. Uh a very good library as well that I've come to
1:44:311 hour, 44 minutes, 31 secondslove is context 7. So this I mean it didn't do a good job there, but it tends to be a pretty good uh tool at pulling
1:44:401 hour, 44 minutes, 40 secondsin the latest uh stuff inside of your um what's it called? uh your your the latest docs and MTP and skills and that
1:44:481 hour, 44 minutes, 48 secondsstuff. So, if you go into cursor settings and you go into your um let's do let's make it a bit bigger.
1:44:571 hour, 44 minutes, 57 secondsGo into plugins this one here. So, you see up stash contact 7 MTP server for upto-ate documentation lookup. It's very very cool. It actually helps out quite a
1:45:061 hour, 45 minutes, 6 secondslot. Right. So, command D is how I'm navigating between these two views.
1:45:101 hour, 45 minutes, 10 secondsRight. One view I use for like the AI side. one view I use for uh kind of when I'm coding myself and checking things
1:45:171 hour, 45 minutes, 17 secondsout and all that stuff. Okay, now let's go over here. So now I have a better understanding of co is let me look up the clerk has API for role based
1:45:261 hour, 45 minutes, 26 secondsaccess control which is needed for the admin panel. Yes. So one thing that you can do inside a clerk which I love is if we go over to clerk's uh configure panel
1:45:341 hour, 45 minutes, 34 secondsyou see my user. So, I've logged in already and this and also here like you can actually add in your bundle ID and
1:45:421 hour, 45 minutes, 42 secondsapp ID prefix. I actually think I'm not sure if I actually needed to do this for the development.
1:45:491 hour, 45 minutes, 49 secondsPart of me is thinking I did need to do this for the development but I'm not sure uh I'll come back to
1:45:571 hour, 45 minutes, 57 secondsthis but basically for the users when you're in the production you 100%
Chapter 23: Cart logic and order flow
1:46:021 hour, 46 minutes, 2 secondshave to do that. But here you see we have Sunny. So if I want to make Sunny an admin effectively, I can go into his public metadata and I can literally go
1:46:091 hour, 46 minutes, 9 secondsahead and basically add in uh it can only be read from the back end and the front end API but it can't be it can't be changed from uh anywhere else right
1:46:181 hour, 46 minutes, 18 secondsso in this case I could say something like row admin right and I can check now for that and that is only basically
1:46:251 hour, 46 minutes, 25 secondssavable or accessible or modifiable on um the uh what's it called
1:46:321 hour, 46 minutes, 32 secondsfrom a from a secure sign place like uh no one can although it's called public metadata, no one can just come in and change that. Okay, so now it's started to basically go ahead and create a plan.
1:46:431 hour, 46 minutes, 43 secondsSo what you want to do now is really dive into this plan and look at it. So papers piece delivery plan, current state expo app, NXJS admin app, right?
1:46:511 hour, 46 minutes, 51 secondsAnd you can see that we've got native tabs, three tabs with placeholder content, convex backend, no formal monor repo tooling. So in this case, yeah, we
1:46:591 hour, 46 minutes, 59 secondsshould be we should be using monor repo tooling. Uh phase one convex schema and backing functions replace the demo numbers table with the pizza domain model.
1:47:071 hour, 47 minutes, 7 secondscategories, right? Um, pizzas. So, name, description, image, category, base, URL,
1:47:131 hour, 47 minutes, 13 secondsprep time, minutes, rating, calories is available, right? Sizes. We got different sizes, which linked, I believe, to the pizza or not. No. So,
1:47:221 hour, 47 minutes, 22 secondsthey're not actually interesting.
1:47:241 hour, 47 minutes, 24 secondsThey're not linking to the pizzas. This is where I want to essentially give it a little bit of a review and feedback on the plan. So, then we have the orders,
1:47:331 hour, 47 minutes, 33 secondsorder items, size, ID. So I'm guessing we just have standardized sizes. So you could have like I guess
1:47:401 hour, 47 minutes, 40 secondscuz it's a pizza is fairly pretty straightforward. Um the ingredients however so ingredients. Oh yeah. So we
1:47:481 hour, 47 minutes, 48 secondsdo have ingredients and then for an order we can see an order would be has a status a price delivery address notes
1:47:561 hour, 47 minutes, 56 secondsand then order items are linked to the order. So in this case we have for an
1:48:031 hour, 48 minutes, 3 secondsorder item we have the order itself the order the pizza the size and the extras which is an array of ingredients. So in
1:48:121 hour, 48 minutes, 12 secondsthis case we have the order the pizza ID the size ID of the size that was selected the quantity of that the unit
1:48:201 hour, 48 minutes, 20 secondsprice and then the extras listed out for the ingredients for that order. And that order is linked to this order right here. So that's actually a good model.
1:48:281 hour, 48 minutes, 28 secondsUh that's actually a good model. Um,
1:48:301 hour, 48 minutes, 30 secondskeep hands with mutations. Yes, that's fine. Okay, you don't throw if unauthenticated. Yes, that's what we want. Admin only mutations. Check the
1:48:371 hour, 48 minutes, 37 secondsusers row with the JWT claims queries use index. Okay. Yep. Expo to customer experience navigation structure. Keep this existing n but restructure tabs.
1:48:461 hour, 48 minutes, 46 secondsAdd a cart tab. Yep. I mean, you see how it's using SDK 55's native tabs. Nice.
1:48:521 hour, 48 minutes, 52 secondsUh, new stack API for pizza detail screens. That's cool. So, if I show you that, actually, it's kind of cool. So,
1:48:571 hour, 48 minutes, 57 secondsif we go to SDK 55, I had it open like a nice little um five, I think it's called the stack API. So, stack, new toolbar.
1:49:091 hour, 49 minutes, 9 secondsSo, we have actually have a toolbar as well, which is awesome, right? And you even have the zoom um kind of, you know,
1:49:151 hour, 49 minutes, 15 secondstransitions. So, when you click into something, it zooms in. There's a lot of very cool changes, but I believe I'm trying to look for Yeah, there we have
1:49:221 hour, 49 minutes, 22 secondsnew stack API. So, we have this flow as well.
1:49:281 hour, 49 minutes, 28 secondsWe have I'm really would love to have like your cooker is your pizza is being cooked,
1:49:361 hour, 49 minutes, 36 secondsbut we'll see if we can get to that point right without getting too crazy long. Search bar at the top, local filtering, horizontal scrolling. Okay.
1:49:451 hour, 49 minutes, 45 secondsUI inspiration, rounded card design.
1:49:471 hour, 49 minutes, 47 secondsYes. Peter detail screen. Cart management. No server side cop MVP. Use react context exposure. Yeah, okay, that's fine. Local storage card screen.
1:49:561 hour, 49 minutes, 56 secondsorder screen, order the detail screen and then you would pretty much go through run through your file. So admin rogate. So this is the main one. So
1:50:041 hour, 50 minutes, 4 secondsrename proxy to middleware.ts. This is old. No, that's wrong. So
1:50:141 hour, 50 minutes, 14 secondsthis is wrong. Right. Read all clerk plugins and skills to ensure that you're using the most upto-date uh
1:50:221 hour, 50 minutes, 22 secondsdocumentation. In addition, the session claims metadata. I don't believe this is the right approach. Check the actual
1:50:301 hour, 50 minutes, 30 secondsskills that are installed from clerk to see how we can do this the correct way cuz this is wrong. This is not correct.
1:50:371 hour, 50 minutes, 37 secondsAnd this is the problem sometimes with AI. It can really hallucinate in a confident way. Right.
1:50:451 hour, 50 minutes, 45 secondsSo in this case, so it should be checking clerk skills. Yeah. And now you can see look it should be pulling in our cloak and if it hasn't now let me read the clerk MTP tool see what's available.
1:50:551 hour, 50 minutes, 55 secondsSo yeah there you go custom UI web it's going to start reading through a lot of the let me check especially B2B resource
1:51:031 hour, 51 minutes, 3 secondswe're not using B2B but anyway it should still help us out. We're not yeah that's the problem it's using B toC we're using B2C today we're not going to be using Oh
1:51:121 hour, 51 minutes, 12 secondsyeah here we are manual. So public metadata set row admin. So, it is actually this one. Oh,
1:51:201 hour, 51 minutes, 20 secondsit actually is that one. Um, okay.
1:51:221 hour, 51 minutes, 22 secondsAnyway, let it do this. Uh, kind of it's better to be a bit more intrusive with it. Order management, the core admin feature, real time order list, use
1:51:291 hour, 51 minutes, 29 secondsquery, menu management, clean up, remove the demo stuff, seed data, and polish.
1:51:351 hour, 51 minutes, 35 secondsYes, we can add some seed pizza data and key technical storage client side only.
1:51:401 hour, 51 minutes, 40 secondsPizza stores URL strings for MVP can migrate to convex file storage later. Um,
1:51:491 hour, 51 minutes, 49 secondsfor this one I want to do let me turn the music down a bit. I need
1:51:571 hour, 51 minutes, 57 secondsto focus. For this one, I'm going to say I want to go ahead and use convex file storage now. And when we seed in the
1:52:061 hour, 52 minutes, 6 secondsimages, we go ahead and pull things from uh copyright free places. I believe it was Upsplash. Was it Upsplash? Um, I
1:52:151 hour, 52 minutes, 15 secondsbelieve was it upsplash that they pull it from? I I always forget. Uh, places.
1:52:201 hour, 52 minutes, 20 secondsI'm sure it was uns unsplash or upsplash. Let me know in the comments.
1:52:241 hour, 52 minutes, 24 secondsUm, but let me see images. We go ahead and pull things from places and upload.
1:52:291 hour, 52 minutes, 29 secondsUnsplash. Yes. Thank you guys. Upload right from Unsplash. Unsplash.
1:52:371 hour, 52 minutes, 37 secondsWe should be able to remove all the seeded information easily as well,
1:52:421 hour, 52 minutes, 42 secondsright? Thank you so much guys. Look at that's how I know you're locked in.
1:52:451 hour, 52 minutes, 45 secondsThat's so cool. Right. I read through the clock MTP correction proxy is correct. Correction to admir after reading the cler what I found. It has functional object organization. It does
1:52:531 hour, 52 minutes, 53 secondsnot work with public metadata games. Uh pros clerk. So use clerk organizations. No. Use public metadata workaround.
1:52:591 hour, 52 minutes, 59 secondsSimple setup. Just use because we're not using B2B. We're using a B2C approach.
1:53:041 hour, 53 minutes, 4 secondsWe're going to be using the public metadata workaround for now. All right.
1:53:081 hour, 53 minutes, 8 secondsBecause if you do use role based access control then yes you are creating a B2B app. I did that in the last uh video,
1:53:151 hour, 53 minutes, 15 secondsbut we're not going to be doing that for now.
1:53:181 hour, 53 minutes, 18 secondsUh pending confirmed cooking on the way delivered with cancel available from pending and confirmed real time all
1:53:261 hour, 53 minutes, 26 secondsorder queries use convex use query format real time. Yep, that's awesome.
1:53:301 hour, 53 minutes, 30 secondsAnd SDK 55 native task stack composible API for headers on detail screens rendering mode template for tin table tab icons. Cool. There's anything else
1:53:381 hour, 53 minutes, 38 secondscool we can add in? Let's see. Um, I would love to add this in. If there's a pizza being made, we can see if we can add that in. I mean, having the uh live
1:53:471 hour, 53 minutes, 47 secondsactivities would be awesome to say a pizza is cooking. So, that's where I kind of want to get to uh more than adding payments to this. Um, the
1:53:561 hour, 53 minutes, 56 secondspayments would effectively be using Stripe checkout. Uh, but I'm more excited to be able to ideally SC it.
1:54:041 hour, 54 minutes, 4 secondsDepends on what you guys want. Let me know right now. Uh, we're about to touch two hours. I think we're good on time as well. So,
1:54:111 hour, 54 minutes, 11 secondsokay. See, protect first middleware session claim and redirects not admins to/ unauthorized. Yes.
1:54:191 hour, 54 minutes, 19 secondsUh and then we need custom JWT session claim. So, session claims don't edit save type. Yep, that's good. Check row helper. Yes. Okay. And that's all good. That's all good.
1:54:351 hour, 54 minutes, 35 secondsThat looks all good. And then al also change this.
1:54:421 hour, 54 minutes, 42 secondsAll right. So then I added in the pizza change for the URLs. I do want to use the um convex actually. No, I don't know
1:54:501 hour, 54 minutes, 50 secondsactually. H do we? Yeah, we should do it. Yeah,
1:54:571 hour, 54 minutes, 57 secondslet's choose convex storage. Let's do it properly. Right. By the way, if your if your diagrams don't load like these ones, right, you can actually just use
1:55:061 hour, 55 minutes, 6 secondsum so this is actually a cool little diagram that I made, but it shows how the expo and admin panel both pull from the same next convex back end. That's
1:55:141 hour, 55 minutes, 14 secondsbecause you just need to install the mermaid package. So here, type in mermaid. This one here, this plugin
1:55:241 hour, 55 minutes, 24 secondsallows you to have those diagrams because GitHub will render these out and when you pull it to push it to a repo if
1:55:311 hour, 55 minutes, 31 secondsyou do push it. Okay, so remove the nest to get show. That's wrong. What the hell is that? Okay, let's do command D pop pizza.
1:55:421 hour, 55 minutes, 42 secondsWhere am I at? Yeah. Yeah. Waiting plan review. So now update the schema to use v storage instead of the optional string for images. Yeah,
1:55:511 hour, 55 minutes, 51 secondscool.
1:55:531 hour, 55 minutes, 53 secondsAnd then we're going to trigger this to do a build. And this is a really cool part that I love, right? So, we can actually change it to be a monor repo after, right? So, no turbo. You see
1:56:021 hour, 56 minutes, 2 secondspmppm workspace or turbo. That's much more efficient if you're going to do it.
1:56:061 hour, 56 minutes, 6 secondsSo, I do recommend you can go that route if you want to do it. Um, and also for the admin, if you really want, like I do
1:56:141 hour, 56 minutes, 14 secondstend to use chaten for pretty much all my styling. So if we go to chaten docs, we could just simply use something
1:56:211 hour, 56 minutes, 21 secondslike chaten um this could be a lot simpler for getting a nice thing for the UI on the back end.
1:56:311 hour, 56 minutes, 31 secondsSo yeah, in fact, you know what? Let me install that. So I'm just going to go ahead and do command uh E, command I,
1:56:381 hour, 56 minutes, 38 secondscommand B.
1:56:401 hour, 56 minutes, 40 secondsAnd now over here, we are in our app. So we're not here. I want to add it inside of this admin panel. So not for the um
1:56:491 hour, 56 minutes, 49 secondschaten wouldn't be for the app, it would be for the admin panel. Oops. So let's go ahead and copy here.
1:56:591 hour, 56 minutes, 59 secondsSo you can use shading create uh or we can just use straight up CLI. So
1:57:081 hour, 57 minutes, 8 secondsthis one here mpx grid in it. So let's install it
1:57:151 hour, 57 minutes, 15 secondsand then radics nova. It's fine. You guys can feel free to do the um the
1:57:221 hour, 57 minutes, 22 secondsactual shading and create crit if you want. And you can customize like your colors and stuff as well. And also you can use things like um wait is that
1:57:301 hour, 57 minutes, 30 secondsgoing to No, no, no, no, no, no. That's not right. No, it is right. Yeah, that is right.
1:57:381 hour, 57 minutes, 38 secondsOveright.
1:57:441 hour, 57 minutes, 44 secondsYep. I thought it was going to reinstall everything. Um, and then add, for example, a card component.
1:57:521 hour, 57 minutes, 52 secondsAnd then if you create a monor repo, run the command from apps web, specify the workspace for the repo. So, yeah, you could you could do to be fair, what you can actually do is you can set up a
1:57:591 hour, 57 minutes, 59 secondsmonor repo directly from here. and it's kind of cool. Um, and that means you can share it between different apps and stuff, which is awesome to be fair. But today I'm just going to keep it simple.
1:58:091 hour, 58 minutes, 9 secondsYou can feel free to do monor repos yourself on a live stream. That's kind of a big ask. Um, but maybe I do a monor repo next time. Okay. Um,
1:58:201 hour, 58 minutes, 20 secondsokay. So now we have the uh shaden components. So if we go into here, we have components UI collapsible.
1:58:301 hour, 58 minutes, 30 secondsNot this one. App admin components UI button. Yep. So we have our Chaden components. So what I want to do now is command D.
1:58:391 hour, 58 minutes, 39 secondsPull this over. Command B. Hide that.
1:58:431 hour, 58 minutes, 43 secondsWhat is this? Oh, okay. So go down. And then you see the plan. So where is the
1:58:491 hour, 58 minutes, 49 secondsplan? This is the plan. Um what is going on? Is this the No.
1:59:001 hour, 59 minutesNo. Command I. Yeah, my screen is weirding out right now. There it is. Yeah. Okay. All right.
1:59:081 hour, 59 minutes, 8 secondsThere we are. So, what I want to do now is click on the plan and I want to say uh we were just talking about Shaden. So,
1:59:171 hour, 59 minutes, 17 secondsfor the admin panel, I want to use Shadien to go ahead and add in all of the UI components.
1:59:251 hour, 59 minutes, 25 secondsShaden. Look at that. shad CN to go ahead and add in all your U your components. Cool. I really recommend when you're doing this as well, you can just use the time stamps to dive through this app.
1:59:371 hour, 59 minutes, 37 secondsOkay. Now,
1:59:421 hour, 59 minutes, 42 secondsyou've also got an MTP server. So, to add this in, we can go cursor. We can add it in. So, like that.
1:59:501 hour, 59 minutes, 50 secondsAnd we can just simply pop it in like that. And you see how you can add in your MCP configuration save to cursor.
2:00:042 hours, 4 secondsIt's going to try and install it, but I think we already have that. So in I already it's fine for now.
2:00:162 hours, 16 secondsLet's just Yeah, let's carry on. It's okay.
2:00:202 hours, 20 secondsUm, so look now I just to do say we just installed it manually.
2:00:282 hours, 28 secondsSo skip that. I also installed shad cen mcp for you to use. Okay.
2:00:382 hours, 38 secondsAnd then we can just go ahead and uh you see how it's mapping it like map sidebar for the main table for listing pizzas badge tabs. It's going to prevent a
2:00:462 hours, 46 secondsbunch of headache like work for the admin sheet for the shien task.
2:00:552 hours, 55 secondsOkay.
2:00:572 hours, 57 secondsNow even skills we can add these into the project as well.
2:01:052 hours, 1 minute, 5 secondsAnd this will go ahead and install it into the project. Now again you can do this at the top level. Right now we're only going to do it at this level in the
2:01:132 hours, 1 minute, 13 secondsproject. Yes. And now we can see over command D, command J
2:01:222 hours, 1 minute, 22 secondsinside admin, we should now have the skills installed. So I believe it was
2:01:302 hours, 1 minute, 30 secondsno agents shaden. Yeah, we also have the skills now. So that should help the agent out. Command D. Pull it over here.
2:01:402 hours, 1 minute, 40 secondsBack up already initialized. Uh, you also have skills available for Shaden to use. Okay,
2:01:512 hours, 1 minute, 51 secondsso let it find it and then we're ready to go ahead and trigger the build. Right,
2:01:572 hours, 1 minute, 57 secondsso two more likes by the way. Destroy that like button. Right, race is already set.
2:02:042 hours, 2 minutes, 4 secondsThis guy chats in the end well defined install button magic compliment. Ah,
2:02:112 hours, 2 minutes, 11 secondsthis is annoying. This is a little tool I had right to our start execution. So I'm going to stop that bit here. Okay.
2:02:172 hours, 2 minutes, 17 secondsSo ignore that. That's just a little skill I've set up. Okay. So now we've imagine we've accepted our plan. What I highly recommend you do here is command
2:02:262 hours, 2 minutes, 26 secondsD go to your uh get changes and you see we're on a reasonable number of changes. You would review this of course, right?
2:02:322 hours, 2 minutes, 32 secondsAnd then right now we are have got a few like package lock files. You'd want to clean that up, but again, like honestly, you can do that on your own. Like, uh,
2:02:402 hours, 2 minutes, 40 secondsgive it a reasonable commit message and commit. At this point, I want to obviously focus on the build side. So,
2:02:452 hours, 2 minutes, 45 secondsimagine you did this, gave it a correct commit message, you committed. Now, you have a fresh slate to go ahead and build from. So, we have the plan that was been set up. So, this is the plan right here.
2:02:552 hours, 2 minutes, 55 secondsWhat we need to then do is click on build. Okay. And now we go into our viewer. So, let's go over here. And now,
2:03:022 hours, 3 minutes, 2 secondsthis is what I would say is the most important step. now really. So you want to basically make sure you're seeing what it's doing. Check out everything that it's done and make sure it's right.
2:03:122 hours, 3 minutes, 12 secondsSo in this case, let design and implement the convex schema and uh so let's see what it does. Start by reading the convex guidelines and the current files I need to modify. And quite
2:03:202 hours, 3 minutes, 20 secondshonestly because everything's set up nicely now that 2 hours and 3 minutes and this is the kind of the cool part that I want to show you once you've got
2:03:282 hours, 3 minutes, 28 secondsthings set up and this is what people tend to do the wrong way. they tend to jump straight into the AI coding and then they'll spend hours and hours and
2:03:362 hours, 3 minutes, 36 secondshours and hours and hours and hours going ahead and uh you know debugging right whereas if you spend a little bit more time on the setup then I promise
2:03:442 hours, 3 minutes, 44 secondsyou like once you actually start building the features it's like super fast right and now we can just have a fun little review while it's building
2:03:512 hours, 3 minutes, 51 secondsright so in this case that it's gone ahead and built the categories if we do command J at the same time and I go into my convex back end you can See, look,
2:04:012 hours, 4 minutes, 1 seconduh, could not find a public function for did you forget to run npm convex dev. So now it's going to delete some of those old functions. So let's just minimize that so we can see what's going on. And
2:04:102 hours, 4 minutes, 10 secondslet's just get this a bit more readable so we can actually have a bit of a view what's happening. So at this point, it's going to go ahead and yeah, it's going
2:04:172 hours, 4 minutes, 17 secondsto find any convex old functions to go ahead and uh delete and remove as well as uh you know, building out the new
2:04:252 hours, 4 minutes, 25 secondsone. So in this case, it's going to uh it's running composer 2 here. And you see how effective that is. And this is something I really recommend whether
2:04:332 hours, 4 minutes, 33 secondsyou're using claude, cursor, whatever it might be. Make sure that it's spinning up sub agents to do the exploration work
2:04:412 hours, 4 minutes, 41 secondsbecause imagine if we were using opus to do things like reading all the files in the codebase. You're just unnecessarily
2:04:472 hours, 4 minutes, 47 secondsspending um tokens on, you know, a job that a very simpler model could do much faster and much cheaper. So this is why
2:04:562 hours, 4 minutes, 56 secondsI recommend like cursor is an awesome platform, right? So in this case, you see it went ahead and fixed those a bunch of issues. It added some indexes
2:05:042 hours, 5 minutes, 4 secondsfor fast to lookup and then you can see here this is now added those in. And the thing I like about convex is it's pretty much doing it in real time. So, uh, if
2:05:122 hours, 5 minutes, 12 secondswe go ahead and go to the left, we go to our convex now on the back and we go over here, we go to data, we can see we've already got categories,
2:05:222 hours, 5 minutes, 22 secondsingredients, numbers is our old table and you can see by the asterisk over here. So, we can actually delete that table like so. And let's hit refresh.
2:05:322 hours, 5 minutes, 32 secondsWe see Papa Pizza D let that happen.
2:05:372 hours, 5 minutes, 37 secondsAnd then, did I Yeah. Okay. I'm getting rid of that table. Delete table. Yeah, there we go. Categories, ingredients,
2:05:432 hours, 5 minutes, 43 secondsand you shouldn't be able to delete a active table. Yeah, there you go. Can't delete an active table because it's defined the schema. It's only when there's asterisk there. So that's great.
2:05:512 hours, 5 minutes, 51 secondsCool. So now the convex functions has been deployed, which means that you know our database has been pushed. And this right now is the cool part. So it's
2:05:592 hours, 5 minutes, 59 secondsbuilding all the convex functions in parallel. It's actually building it by the way with u composer 2. So I hope hopefully it's doing a good job of that.
2:06:072 hours, 6 minutes, 7 secondsUm but in this case, it's doing nullable. Okay, this is okay. Dog pizza,
2:06:132 hours, 6 minutes, 13 secondsI'm sure. Okay, that's fine. So, all that's actually okay. List get by ID.
2:06:202 hours, 6 minutes, 20 secondsAnd this is going to be inside of get pizza with URL. So, it's listing all the pizzas. Get by pizza by ID. Create a new pizza. Making sure that we are an admin.
2:06:302 hours, 6 minutes, 30 secondsWell, you're authenticated. Insert pizza. Mutation update pizza. Okay. And this is doing that's pretty pretty big.
2:06:382 hours, 6 minutes, 38 secondsI don't think this is necessary, but I'm not going to go into granular. You can always do a refactoring job afterwards.
2:06:442 hours, 6 minutes, 44 secondsSo, let's see categories. And to be honest, you can either review like this or another trick you can do is if you go into
2:06:522 hours, 6 minutes, 52 secondsthis is in the composer chat. If you click on review. So in the review now what you can see is when new files have
2:07:002 hours, 7 minutesbeen added and then you can scroll down and basically you can kind of like go through uh undo or you know keep
2:07:072 hours, 7 minutes, 7 secondssubmission flow right or you can just go ahead and show the entire file or add to chat and say I want changes made or you can highlight and add to chat. So while
2:07:152 hours, 7 minutes, 15 secondsyou're basically waiting for that to happen typically what I do is I just scan through the entire thing. So I'll go through it and I'll be like okay this is looking kind of good. Typically I'll
2:07:232 hours, 7 minutes, 23 secondsmake it full screen. So I've got more room to view everything. Uh in this case when it's you see you can just see that this is just an addition to creation of
2:07:312 hours, 7 minutes, 31 secondslike you know utility files and these all these functions by the way look list create um even these queries list create
2:07:392 hours, 7 minutes, 39 secondsand so forth. If we go into our functions over here, look, these are all actually cloud functions that effectively get deployed that allow us
2:07:472 hours, 7 minutes, 47 secondsto go ahead and you see that query and you can see even here like mutation,
2:07:512 hours, 7 minutes, 51 secondsright? So these are all effectively cloud functions with the the way that convex works. So it's literally happening in real time. You see every
2:07:592 hours, 7 minutes, 59 secondstime adding it, it's just pushing those functions up. And this is why convex is so cool when you pair it with the things that we're doing right now. Everyone's super locked in. Wow.
2:08:122 hours, 8 minutes, 12 secondsOkay. So, it's going ahead and doing those.
2:08:182 hours, 8 minutes, 18 secondsAnd where we at me, where's my agent at?
2:08:252 hours, 8 minutes, 25 secondsWhere's this one? No. Get rid of that.
2:08:282 hours, 8 minutes, 28 secondsNow, let me use the rem remove the unused doc. main thing that I would say that I would look out for if I was you guys is make sure that you're always
2:08:362 hours, 8 minutes, 36 secondskeeping an eye on if the um if it's basically gone ahead and done what is this one where's that shortcut is
2:08:452 hours, 8 minutes, 45 secondscommand this u okay it's kind of annoying uh in fact okay what you could do is when you actually come to implement it yeah you could click on
2:08:532 hours, 8 minutes, 53 secondsagents window then and have a look am I a fan of this view no not necessarily right I have a few apps that I'm working
2:09:002 hours, 9 minuteson right Now uh let me go ahead and close these right now. So these was ones I was doing before. But in this case
2:09:072 hours, 9 minutes, 7 secondslike you see like this view has been designed in a way where effectively it's more like easy for you to focus on the
2:09:142 hours, 9 minutes, 14 secondschanges right but again it's a whole another like this is no longer using VS code effectively this is now using their
2:09:222 hours, 9 minutes, 22 secondsown like cursor's own basically IDE entirely. So just worth knowing that that there is a difference there, right?
2:09:302 hours, 9 minutes, 30 secondsAnd also because I triggered the build from uh the uh the other uh IDE
2:09:372 hours, 9 minutes, 37 secondseffectively uh the the thought process doesn't come through super clearly.
2:09:412 hours, 9 minutes, 41 secondsRight? So if you trigger it from here, I found it comes through a bit more clearer. But you've got the browser, you can do a bunch of stuff here as well. It really depends on preference, I'll be
2:09:482 hours, 9 minutes, 48 secondshonest. But I still don't fully like doing things in that flow. You see how if I start it here, I can see all of the sub aes being
2:09:572 hours, 9 minutes, 57 secondstriggered here. So that's just something that I've noticed. Okay. Now, while that's happening, I'm going to make it relatively smaller so I can just review
Chapter 24: Clerk + auth refinements
2:10:042 hours, 10 minutes, 4 secondsquicker. So we can kind of see as it's doing things. We're on step four right now. And we can already see that it's done all of our kind of queries, our
2:10:122 hours, 10 minutes, 12 secondsmutations, our backend functions, the orders, and then the seed function. So it actually found a bunch of pictures of pizzas. So in this case, if we click on
2:10:212 hours, 10 minutes, 21 secondsthis, hopefully this is okay. See? Then I said, we got some spinach pizza,
2:10:252 hours, 10 minutes, 25 secondscherry tomato. There you go. Okay. These are kind of cool pictures for us. Veggie Supreme. Okay. I mean, we'll make these work, right? And then you've got like here pepperoni, I guess. Oh, it's a 404.
2:10:362 hours, 10 minutes, 36 secondsOkay. Mushroom,
2:10:382 hours, 10 minutes, 38 secondsright? So, I mean, I guess it's uh we can tell the AI afterwards that that's not going to Some of these didn't work.
2:10:442 hours, 10 minutes, 44 secondsUm, it's going to seed insert the seed data. So, American uh so basically this is just perfectly designed to go ahead
2:10:522 hours, 10 minutes, 52 secondsand set up our seed data. And this is one thing I love about AI which I don't think is honestly used enough is when you're testing create AI generated seed
2:11:022 hours, 11 minutes, 2 secondsdata. It helps so much I can't even explain. It's really going to like save you a bunch of time when you're testing things out. Okay, now it's moving on to
2:11:102 hours, 11 minutes, 10 secondsphase two, the export app and phase three, the admin panel. So, effectively the back end is kind of done right now.
2:11:152 hours, 11 minutes, 15 secondsI started four to-dos. The only concern I have here is it's using composer 2 to do a lot of the actual implementation portion of it.
2:11:262 hours, 11 minutes, 26 secondsUh how do I feel about that is the the main thing create
2:11:362 hours, 11 minutes, 36 secondslike is it using composer 2 or is it using expo? That's the one thing I'm not sure if if they switched quite heavily
2:11:422 hours, 11 minutes, 42 secondson. So if we look inside of our agents, let's see.
2:11:532 hours, 11 minutes, 53 secondsLike it's kind of forcing us to use and I noticed that cursor have been quite aggressive on that lately where they're pushing for the composer model more.
2:12:032 hours, 12 minutes, 3 secondsHey, thank you Tatiana. Look at that. My love sent $5. Appreciate you.
2:12:122 hours, 12 minutes, 12 secondsRight now, we're pretty locked in trying to get this to go and build through. So,
2:12:172 hours, 12 minutes, 17 secondscar context is being built out. Let's have a look. So, car storage key, pop a pizza cart,
2:12:252 hours, 12 minutes, 25 secondsand then uh Oh, it's Kenji. Oh, yeah.
2:12:272 hours, 12 minutes, 27 secondsHey, look at that, guys. She dropped in a little emoji of Kenji. That's so cool.
2:12:342 hours, 12 minutes, 34 secondsIt was so funny cuz I think she uh she tried upgrading everyone to super chat once and uh some reason it didn't work.
2:12:402 hours, 12 minutes, 40 secondsSo, she just donated silently in the background and I didn't even get a notification which is so sad but I appreciate you. Right. So, car context
2:12:482 hours, 12 minutes, 48 secondsover here. You scroll back. These are all four car items. Now, we are using React Native asynchronous storage to go ahead and handle the car.
2:12:572 hours, 12 minutes, 57 secondsYou could even use the stand. I mean, I would have preferred to use the stand,
2:13:012 hours, 13 minutes, 1 secondbut again, not a deal breaker. Like, you can really again like look guys, you can change this up as you wish. But in terms of type safety,
2:13:122 hours, 13 minutes, 12 secondslike it's it's not the nicest code in my opinion what it's done here. It's a little bit like like this if it's not a
2:13:192 hours, 13 minutes, 19 secondstype function. Okay. Very uh interesting approach. But I mean look,
2:13:252 hours, 13 minutes, 25 secondslet's let's see. I actually want to give it a full oneshot attempt and see if it can actually do that. But I'm I'm
2:13:322 hours, 13 minutes, 32 secondswondering why it it felt the need to be delegating everything in parallel like this.
2:13:422 hours, 13 minutes, 42 secondsBut I'm curious though because who knows it could be using um opus to be generating the plan but more
2:13:492 hours, 13 minutes, 49 secondspage one. Although I actually did install a skill. So I want to have a look that cursor settings. Smash the M for two months. Smash like button or 10
2:13:582 hours, 13 minutes, 58 secondsyears of bad luck. Yay. That's it. Tell them, let me know who else is coding alongside as well. Oh no, like who's
2:14:062 hours, 14 minutes, 6 secondscoding alongside when I do these or you more watching, figuring out, learning maybe new things and then kind of doing it afterwards,
2:14:152 hours, 14 minutes, 15 secondsright? So here I want to go down to one of these is parallel. So suggested I believe it was parallel.
2:14:232 hours, 14 minutes, 23 secondsSo here. So I don't know if it was here or if it was the superpower one. I think it was super power because uh we talked about it last time in the live stream.
2:14:322 hours, 14 minutes, 32 secondsUh super powers.
2:14:352 hours, 14 minutes, 35 secondsSo dispatching parallel agents. You see this you delegate task specializations with isolated context but by precisely
2:14:432 hours, 14 minutes, 43 secondscrafting their instructions. So on independent so use when three test case with different causes. So, I guess
2:14:522 hours, 14 minutes, 52 secondsit's done this skill, right? And it's gone ahead and applied this likely to go ahead and do it. Now, am I a fan of composer building out the entire app?
2:15:022 hours, 15 minutes, 2 secondsNo, I'm not. Hey, Tatiana is going ahead and gifting everyone. Look at this. It's It's begun. It's It's begun, guys. Cohen says, "I'm coding, but for work,
2:15:122 hours, 15 minutes, 12 secondsmeanwhile, following you, hoping to learn new things." Awesome stuff, dude. Big shout out to Tatiano for Griffin,
2:15:192 hours, 15 minutes, 19 secondseveryone. It's Christmas over here.
2:15:212 hours, 15 minutes, 21 secondsLet's dispatch multiple for the remaining big task. So yeah, it's it's going cra This is the first time I've had it go this nuts doing uh interesting.
2:15:332 hours, 15 minutes, 33 secondsIt's see it's given specific small tasks. So for triggers icons removed.
2:15:392 hours, 15 minutes, 39 secondsOkay. So I mean I'll be really curious to see if it did this well because remember we're at 35% usage. So I'm always curious to show you guys how that
2:15:472 hours, 15 minutes, 47 secondspans out as well. So, right now we're still at 35% usage. Okay. I mean, that's
2:15:542 hours, 15 minutes, 54 secondsthat's crazy good if it only took like a very very tiny percent of composer
2:16:012 hours, 16 minutes, 1 secondusage. Um, but the qual the real question is the quality of it. So, let's see. So, admin panel authentication setup. Let's have a look how we did the
2:16:092 hours, 16 minutes, 9 secondsadmin panel authentication. So, let's dive into that. So, proxy.ts.
2:16:132 hours, 16 minutes, 13 secondsSo over here it's checking for sign in sign up unauthorized for public routes
2:16:202 hours, 16 minutes, 20 secondsand then if you don't have a metadata row admin sending you to unauthorized or globals.d.ts
2:16:282 hours, 16 minutes, 28 secondswe're saying that custom JWT session metadata row. Okay. And the rows are possible rows are admin. So this is
2:16:352 hours, 16 minutes, 35 secondsbasically extending uh look at that. Uh Mscali says your mastering to short code between apps is amazing. Let's go pop fam. Hey, I appreciate you so much,
2:16:452 hours, 16 minutes, 45 secondsdude. Choke opport. Thank you so much, dude.
2:16:502 hours, 16 minutes, 50 secondsRose, we have a helper function over here. Let's jump down. Fixing the homepage. Uh, revamping the broken server link. Yeah, this was a dummy
2:16:572 hours, 16 minutes, 57 secondsroute as well. An automized page. This is what users will see if they're not an admin. They try to go to the admin route.
2:17:032 hours, 17 minutes, 3 secondsDemo removal done. Okay, so that one's done for that. Now we're on eight. So,
2:17:082 hours, 17 minutes, 8 secondslet me dispatch multiple agents. It's going crazy. Dispatching multiple agents right now. That is nuts. Look at that. So if we look over here,
2:17:172 hours, 17 minutes, 17 secondslet me create that. So you can just see the agents going nuts. So in this case,
2:17:212 hours, 17 minutes, 21 secondshonestly the pizza detail screen. So I want to dive in here and let's see. So using the color scheme, the checkin use router. This is using the correct export
2:17:292 hours, 17 minutes, 29 secondsrouter. The backend convex generated API. Uh likely a small TypeScript config bug, but we can figure that one out.
2:17:402 hours, 17 minutes, 40 secondsAlso, this is happening because these are not getting pulled in. So, that's why we're getting implicit enies. Um,
2:17:482 hours, 17 minutes, 48 secondsPapa's Pizza. Hey, look at that. Uh,
2:17:512 hours, 17 minutes, 51 secondssearch pizza scroll view press balls count. Okay, that list happening pretty good. Rout push. Again, these are not
2:17:582 hours, 17 minutes, 58 secondsgetting pulled in likely because But again, all the good thing is that it's checking the routes and oh no, it's because we hadn't built the screen.
2:18:072 hours, 18 minutes, 7 secondsOkay. I mean the thing I am impressed about is that it's it's managed to do and I the reason why I find this very impressive is because I actually taught
2:18:152 hours, 18 minutes, 15 secondsmy own agent team. So I basically have open claw. I have a bunch of agents running with it. And uh with that set up
2:18:232 hours, 18 minutes, 23 secondsI have it to basically first check if a segment of work is able to be done in parallel and that is determined by
2:18:322 hours, 18 minutes, 32 secondsbasically having linear tickets and then if it is able to do it in parallel then spawn sub agents typically in GPT53
2:18:402 hours, 18 minutes, 40 secondscodeex for the consistent work that need being done and then what they do is they will work in parallel and then typically they do in separate good trees they
2:18:482 hours, 18 minutes, 48 secondscombine the good trees at the end and then they basically will submit a PR for And that basically has been very very good. And I see that this is effectively what is happening here. Right? So this
2:18:572 hours, 18 minutes, 57 secondsis basically what is kind of happening under except it's not doing a get work tree. It's doing it under local. Um so that's interesting. So module resolution
2:19:052 hours, 19 minutes, 5 secondswith back is probably causing to return any. That's correct. Yes. It's cascading any types. Let's see the color type
2:19:132 hours, 19 minutes, 13 secondspath. So I'm wondering if it's going to go ahead and fix that or it's going to just go ahead and as const. I wanted to actually fix that. That's the problem.
2:19:222 hours, 19 minutes, 22 secondsSo yeah, see implicit any. So any issues all cascading once the typescript server fully completes workspace indexes then these resolve.
2:19:322 hours, 19 minutes, 32 secondsOkay. So hopefully yeah understood that that was a correct bug to to be able to sideline for now. But if you do want to know about my AI agentic workflows and
2:19:402 hours, 19 minutes, 40 secondsall that stuff, third link in the description, go ahead and sign up to it right now. That is actually the link to our community where I'll be basically
2:19:482 hours, 19 minutes, 48 secondsteaching all of everything I do about my agentic workflows. It's kind of nuts honestly what we end up doing with that stuff. All screens are built. Let me
2:19:562 hours, 19 minutes, 56 secondsupdate the to-dos and move on to the final admin pages. So at this point,
2:19:592 hours, 19 minutes, 59 secondsyeah, this main issue is around the generated API cannot be found within
2:20:062 hours, 20 minutes, 6 secondsprojects or these directories. Now I'm I'm curious about one thing. I previously had this in a monor repo style setup. So let me have a look at how I did it there. I had my packages
2:20:152 hours, 20 minutes, 15 secondsback in. I had my generated files. Then my native interesting. Yeah. So it was pulling
2:20:222 hours, 20 minutes, 22 secondsalways from the above packages, but the packages might be getting bundled into
2:20:302 hours, 20 minutes, 30 secondsthe the app. I wonder. So if we go to packages.json
2:20:372 hours, 20 minutes, 37 secondsinside of that build and we see packages backend. Ah, okay.
2:20:442 hours, 20 minutes, 44 secondsInteresting. We actually have to wrap it into a package. So, it has to be able to install that. I see. Okay. So, likely
2:20:522 hours, 20 minutes, 52 secondsthat is a big big issues for us. So, if we look inside of our app right now, I can guarantee that is not the case. So,
2:20:582 hours, 20 minutes, 58 secondsif we go to our go to our package.json.
2:21:042 hours, 21 minutes, 4 secondsYeah. Okay. So, ideally, it needs to be something like that.
2:21:102 hours, 21 minutes, 10 secondsOkay. So, that's going to be a big uh task essentially. Well, not big task,
2:21:142 hours, 21 minutes, 14 secondsbut yeah, this it's a task. So, let's let it do what it needs to do for now.
2:21:202 hours, 21 minutes, 20 secondsAnd then I'm going to start lining that one up. So, uh we effectively So, we effectively need to have the backend
2:21:282 hours, 21 minutes, 28 secondspackages be installable into the expo app as well as the admin app. Uh help me implement this.
2:21:372 hours, 21 minutes, 37 secondsSo that's where basically a monor repo would be ideal and that's typically why they call it packages as well instead of
2:21:442 hours, 21 minutes, 44 secondswhat we have here which is just we were to minimize these we've got apps we've got the back end we've got the convex but this is not like an installable
2:21:522 hours, 21 minutes, 52 secondspackage I see okay so that's the difference with that okay so let me
2:21:582 hours, 21 minutes, 58 secondsdon't save that so I'm going to add that to a plan um I'm going Okay,
2:22:072 hours, 22 minutes, 7 secondsthis will resolve all of the implicit any errors that are being experienced throughout the app and uh will allow
2:22:152 hours, 22 minutes, 15 secondsconvex to be used by both uh the app and the admin panel. Adil Aub going to work.
2:22:212 hours, 22 minutes, 21 secondsWe'll see you later. Appreciate it. Um K says, "Hey, I'm away from school since I'm ill and looking for something to watch." Amazing stuff, dude. Awesome
2:22:292 hours, 22 minutes, 29 secondsstuff. Right. So this Yep. Let's send that in. So now these are all doing this in parallel as well. So the admin orders
2:22:382 hours, 22 minutes, 38 secondspage has been built out. Let's have a look at what it did. Uh the only thing again I I think you need to be a bit careful with AI is I find that it goes
2:22:462 hours, 22 minutes, 46 secondsvery aggressively on making everything a clientside rendered page right and you can go ahead and obviously give it rules
2:22:552 hours, 22 minutes, 55 secondsand everything else but just be wary of that. And again even here look type order status. This is not what we want to do like this. For example,
2:23:042 hours, 23 minutes, 4 secondsnever in uh type um manually here,
2:23:112 hours, 23 minutes, 11 secondsright? Uh infer everything from convex.
2:23:172 hours, 23 minutes, 17 secondsSee what it started to do. It started to basically create the type definition.
2:23:212 hours, 23 minutes, 21 secondsThis is wrong. This is not correct. But the thing is, if you didn't know what you're doing, this is this is completely like okay, acceptable, right? But it's not. This is wrong. Basically what it's
2:23:292 hours, 23 minutes, 29 secondsdoing is it's retyping when it so now you have a a drift in sync because now your your back end if it was ever to
2:23:372 hours, 23 minutes, 37 secondschange would be totally wrong because it would not be updated because you've manually typed things over here and I guarantee it's done that throughout the
2:23:432 hours, 23 minutes, 43 secondsapp as well. So we need to figure out that one. So spun up composer. It's very interesting why it's doing that so much.
2:23:512 hours, 23 minutes, 51 secondsUm but let's see how it does YouTube. I mean composer 2 is damn fast. I'll give it that. Uh so I'm not past no pass here. Root package JSON does not exist.
2:24:002 hours, 24 minutesPackage PMPM does not exist to the root. So I'm pack okay so let's have a look.
2:24:072 hours, 24 minutes, 7 secondsWant to repo tooling at root other common orchestrators learner ro so package managers infer tool absent take away the roots repo is a loose multia
2:24:162 hours, 24 minutes, 16 secondslayout without a root package without pmpm and without type repo or similar dependencies managed per app by npm by each package package lock. Okay. So this
2:24:232 hours, 24 minutes, 23 secondsis where typically I can see issues. No mon to typescript can't properly infer.
2:24:282 hours, 24 minutes, 28 secondsLet me set up mpm workspaces and make the packing a shared package. So you could do mpm workspaces or
2:24:362 hours, 24 minutes, 36 secondswe could actually just say you know I'm going to interrupt it and say use turbo to get this working ideally.
2:24:462 hours, 24 minutes, 46 secondsAnd then we revert. So I don't want to do what it was doing. I want to use turbo. If you don't know what turbo is,
2:24:522 hours, 24 minutes, 52 secondsturbo is basically what you know, even the example that I gave earlier. I mean,
2:24:562 hours, 24 minutes, 56 secondsit's funny because I actually was not going to teach all of this today, but I guess we're here now. So, turbo monor repo. So, basically, again, it's
2:25:052 hours, 25 minutes, 5 secondsactually by versel. Um, but if you click on get started, basically you see look when you have different apps like apps web packages shared apps docs for
2:25:122 hours, 25 minutes, 12 secondsexample, uh, monor repo allows you to go ahead and basically build them nicely together. So that means like caching issues, that means building issues, that
2:25:212 hours, 25 minutes, 21 secondsmeans all that kind of stuff. So effectively, yeah, we we want to get this kind of implemented really sleek and nicely. So I'm wondering if Turbo
2:25:282 hours, 25 minutes, 28 secondsrepo has skills cuz that would be very very handy. Skills turbo repo command reference skill. They do have actually
2:25:352 hours, 25 minutes, 35 secondshave a skill. H do not create root task or create package tasks. This is very very good.
2:25:422 hours, 25 minutes, 42 secondsI'm wondering if we can install this skill. So turbo repo skills. Let's have a look. So,
2:25:492 hours, 25 minutes, 49 secondsterrible repost skills marketplace. I don't know what that is. I don't know what this place is. No, we're going to install that from some random place.
2:25:562 hours, 25 minutes, 56 secondsNope, don't do that. Um, skills.
2:26:012 hours, 26 minutes, 1 secondLet's check the documentation. So, using AI with turbo repo agent skills or use Hey, we have it. Turbo repo. Okay. So,
2:26:082 hours, 26 minutes, 8 secondswhat I want to do now is I'm going to go and add that into the main repo.
2:26:132 hours, 26 minutes, 13 secondsActually, what what I like to do here is just pause the the guy here, right? So,
2:26:192 hours, 26 minutes, 19 secondssay execute this command, add the skills
2:26:272 hours, 26 minutes, 27 secondsand use these to implement uh turbo repo correctly.
2:26:372 hours, 26 minutes, 37 secondsRight. So, again, I'm wasting a few tokens, but it's fine. And then you'll get work trees for parallel agents. This is what I was talking about previously, right? Task descriptions and so forth.
2:26:452 hours, 26 minutes, 45 secondsOkay, so the main thing is really the agent skills that best practice for turbo repo configuration monor repo patterns and conventions anti patterns to avoid and this is the main thing that
2:26:532 hours, 26 minutes, 53 secondsyou really want to be kind of you know avo like making sure that that wants to maint.
2:27:052 hours, 27 minutes, 5 secondsOkay, fine.
2:27:082 hours, 27 minutes, 8 secondsAll right, so this is where we really kind of granularly fix things. This is actually turned into a very interesting build.
2:27:162 hours, 27 minutes, 16 secondsAugustine, he goes, "Hello, Sunny. How you doing today, brother?" Doing amazing. Thank you very much, dude. How are you? Uh, also, I just realized I can't see my Oh, there it is. Yeah, my
2:27:252 hours, 27 minutes, 25 secondslive chat. Okay, so it's going to go ahead and export things
2:27:332 hours, 27 minutes, 33 secondsout. So yeah, we have a dilemma now where so this turned into actually a pretty big tutorial because we have
2:27:402 hours, 27 minutes, 40 secondsthree loosely set up apps, right? This isn't the ideal way to do it. We should be having a monor repo structure. So how do you take three apps converted to a
2:27:492 hours, 27 minutes, 49 secondsmonor repo? And the reason why I like these kind of approaches is because look, the reality is when you're coding it gets messy. And the thing is
2:27:562 hours, 27 minutes, 56 secondstutorials don't show that part. they tend to show everything being perfectly smooth and then when you get caught in a mess, you're wondering like maybe you're
Chapter 25: Convex data modeling and backend work
2:28:032 hours, 28 minutes, 3 secondsnot cut out for this and then you start having the self-doubt and everything like that. So, I don't want you guys to experience that. So, I literally put myself in these experiences or live
2:28:122 hours, 28 minutes, 12 secondsstreams where I can show you in real time. Okay, we're in this messed up, messy situation. Uh, how do we fix it?
2:28:192 hours, 28 minutes, 19 secondsRight? So, this is exactly what we're doing right now, right? And and we're going to get through it and I'm going to show you exactly how to solve it. Um, so
2:28:272 hours, 28 minutes, 27 secondsyeah, it's one of those very high stress situations, but it's I think it's super educational in the rawest form. Right.
2:28:362 hours, 28 minutes, 36 secondsSo in this case, like the root package fast. Okay. Okay. There we go. I'm wondering did it actually install the um So it hasn't installed that yet. Okay.
2:28:522 hours, 28 minutes, 52 secondsThat's the continual learning hooks. I'm wondering if we can install it in the background or would that screw things up? Well, let's just be patient and give it a minute. Right.
2:29:032 hours, 29 minutes, 3 secondsAnd imagine if you were to do all of these uh exploratory like exploration steps using your Opus, you will fly
2:29:122 hours, 29 minutes, 12 secondsthrough Opus limits, right? And that's the problem that a lot of people don't realize is what's happening. They're like everything is so expensive with AI.
2:29:192 hours, 29 minutes, 19 secondsIt's not that it's expensive, guys. It's that you're using it wrong, right? like you're absolutely using it in the wrong way and that's the that's a huge
2:29:272 hours, 29 minutes, 27 secondsproblem. Um so this is why I like to show like sub agents that kind of workflow right good now I understand the
2:29:342 hours, 29 minutes, 34 secondscurrent state no mono no no monor repo let me look at this latest turbo repo docs for quicks band but it tends to ignore you as well sometimes which is
2:29:422 hours, 29 minutes, 42 secondskind of frustrating because I did give a command that I said use that let's see so I found the the guide
2:29:542 hours, 29 minutes, 54 secondsBut let's also see any proper monor repo machine. Okay,
2:30:052 hours, 30 minutes, 5 secondsI mean I did give use turbo guess where okay anyway it's starting to execute.
2:30:112 hours, 30 minutes, 11 secondsLet's have a look. So package JSON. So this is the top level now. So we can see look at the top level we have a package JSON. We have pmppm. We have a turbo
2:30:202 hours, 30 minutes, 20 secondsJSON. Okay. And this is where the build kind of settings all get established.
2:30:242 hours, 30 minutes, 24 secondsCaching for dev persistent all that stuff. So let's see pmppm workspace turbo package JSON. Now I'll update the
2:30:322 hours, 30 minutes, 32 secondsbackend package name and add it as a dependency in both consumer apps. So yeah here we have name backend app packages back end. And then you see in
2:30:412 hours, 30 minutes, 41 secondseach individual app. So what basically is happening is you see in each individual app. So let me try and show you guys. So it's confusing if you look
2:30:512 hours, 30 minutes, 51 secondsat it this way but in each individual app. So this one is getting installed as a like a come on this one is getting
2:30:582 hours, 30 minutes, 58 secondsinstalled as a dependency and this one is getting installed as a dependency.
2:31:022 hours, 31 minutes, 2 secondsYou see that right and then in ts config is where you basically have all the wiring to make sure everything is finding each other.
2:31:102 hours, 31 minutes, 10 secondsNow update the export ts config to have a path alias for the back end. So basically this is how we can have a nice kind of we don't have to write every
2:31:172 hours, 31 minutes, 17 secondssingle time you know um dot dot/backend and then everything we can just have app packages back end
2:31:262 hours, 31 minutes, 26 secondsthen clean old node modules install everything from the root with pmppm to be honest pmpp is a better shout it's actually much nicer
2:31:342 hours, 31 minutes, 34 secondsokay so now it's installing everything pmppm is would be much more effect efficient I guess so in the package json you can see that turbo dev dev,
2:31:442 hours, 31 minutes, 44 secondsturbo app, turbo admin, and then you've got turbo dev for the back end. And this will spin up all the apps if you do
2:31:512 hours, 31 minutes, 51 secondsturbo dev. It's really nice UI when you spin it up like that. So, right now, you see how we have these three different ones here. When you do a turbo setup,
2:31:592 hours, 31 minutes, 59 secondsyou can basically just kind of interactively flick through each one,
2:32:022 hours, 32 minutes, 2 secondswhich is actually much nicer. Uh, but this is a cool learning experience. So,
2:32:072 hours, 32 minutes, 7 secondsyeah. I mean, this video is going to be definitely leverage the timestamps because you're going to have to jump around the video a lot to actually see
2:32:142 hours, 32 minutes, 14 secondsthe build part of it. Um, but this is a huge learning value like side of things if you if you know what what's happening
2:32:212 hours, 32 minutes, 21 secondsright now. I can see packages back and linked and let me also check the expo app. Both maps have great link now.
2:32:272 hours, 32 minutes, 27 secondsVerify that the TypeScript can resolve the imports. So, now let's have a look at things. So, let's see for example in
2:32:342 hours, 32 minutes, 34 secondsour orders page. So, so firstly the actual I think it needs to install correctly to
2:32:432 hours, 32 minutes, 43 secondsbe fair. Let's run TypeScript zero TS in the admin app.
2:32:472 hours, 32 minutes, 47 secondsI mean what you might have to do sometimes is TypeScript restart TypeScript server and then see if you still get those.
2:32:542 hours, 32 minutes, 54 secondsYeah, there you go.
2:32:562 hours, 32 minutes, 56 secondsSo a lot of the time if you do command shiftp and type in typescript restart typescript server because what will
2:33:042 hours, 33 minutes, 4 secondshappened right now is we just done a bunch of like highle changes right. So your typescript config everything
2:33:112 hours, 33 minutes, 11 secondschanged like especially our entire repo structure. So sometimes you just force the typescript server to restart otherwise it will show errors which are
2:33:202 hours, 33 minutes, 20 secondsnot real or that old right typescript error. You see that? And now it's resolving our convex backend. Hey, look
2:33:282 hours, 33 minutes, 28 secondsat that. If we click it, boom, it found the data model. That is perfect. So now we have it. This is awesome. Okay, now
2:33:362 hours, 33 minutes, 36 secondswhat I can even do is let's try something. So I'm going to go here and do dot dot and I'm going to do a risky
2:33:432 hours, 33 minutes, 43 secondsmove. I'm going to cut every single server. Okay, I'm going to go to my top level and I'm going to do let's see what
2:33:512 hours, 33 minutes, 51 secondsour package JSON is. So package JSON at the top level is turbo dev. So we basically and we're using pmppm now. So
2:33:582 hours, 33 minutes, 58 secondswe say pmppm dev and now you see this look this is a turbo repo kicking in now. So you can see that packages are basically running.
2:34:102 hours, 34 minutes, 10 secondsSo this is the back end admin dev is running and then we have convex files out run npx convex AI to update. Okay
2:34:192 hours, 34 minutes, 19 secondslet's do that actually. That's pretty good. Um and then the expo app
2:34:262 hours, 34 minutes, 26 secondsinterestingly is not running. So that's an interesting one actually. So app turbo dev f pizza.
2:34:352 hours, 34 minutes, 35 secondsSo likely it's still updating that remote caching disabled. And there's
2:34:442 hours, 34 minutes, 44 secondsactually a selector way that you can do this. So I want to have a look. So um
2:34:502 hours, 34 minutes, 50 secondsinstalling turbo use global turbo cla
2:34:572 hours, 34 minutes, 57 secondsso one chap how do you run to an existing repo
2:35:072 hours, 35 minutes, 7 secondsso I mean yeah ideally we should have given this uh get ignore turbo that's actually a good point so maybe what you also want
2:35:152 hours, 35 minutes, 15 secondsto do sometimes is just copy like look at the documentation yourself and then go ahead
2:35:222 hours, 35 minutes, 22 secondsand then even this you see that's kind of cool. So I would now go ahead and say this check
2:35:302 hours, 35 minutes, 30 secondsyou did all of these. Uh also when I run um what was it?
2:35:412 hours, 35 minutes, 41 secondsPM PM PM PM dev the expo app doesn't start. So that's the interesting one as well.
2:35:502 hours, 35 minutes, 50 secondsSo you can see that the two apps I can see admin dev and I can see backend dev.
2:35:542 hours, 35 minutes, 54 secondsAnd also there is a way that we can run the editor integration is quite cool as well. So
2:36:022 hours, 36 minutes, 2 secondsyour editor so
2:36:102 hours, 36 minutes, 10 secondsnot using Visual Studio Code. So also check
2:36:202 hours, 36 minutes, 20 secondsthis Okay, so here's what's missing and
2:36:282 hours, 36 minutes, 28 secondsthat's fixed. Okay, so it wasn't it didn't have a dev command before on expo. See
2:36:362 hours, 36 minutes, 36 secondsuh but there is a there is a visual way to do it as well. So uh how to run turbo repo
2:36:432 hours, 36 minutes, 43 secondsuh in interactive mode. So watch mode. You must be turbo reaper 2i
2:36:592 hours, 36 minutes, 59 secondsturbo dev. I think you just write turbo dev in a in like a high level way. Yeah,
2:37:052 hours, 37 minutes, 5 secondsI don't think you run it like pmppm. I think you just do turbo dev. So we need to install turbo
2:37:132 hours, 37 minutes, 13 secondsturbo cli. So install turbo CLI and I remember this being a thing as well. So if you install
2:37:222 hours, 37 minutes, 22 secondsturbo global installation brings speed to your local workflows. So let's add globally
2:37:292 hours, 37 minutes, 29 secondsas well. So you can just jump into anything and basically as long as it's got turbo set up correctly, you can now do turbo dev and basically kick into
2:37:382 hours, 37 minutes, 38 secondsgear. So see that pop a pizza dev. So you can see like what's going on there.
2:37:432 hours, 37 minutes, 43 secondsBut I do like it when it's got the So I mean firstly that's a good sign it's working. Um
2:37:512 hours, 37 minutes, 51 secondsbut it has got an interactive way CLI
2:38:012 hours, 38 minutes, 1 secondturbo dev turbo repo turbo dev interactive mode. And if anyone knows
2:38:092 hours, 38 minutes, 9 secondsthe answer to this, let me know because uh I know I'm not going crazy. I know there is definitely a way to switch
2:38:162 hours, 38 minutes, 16 secondsbetween to switch between apps, switch between apps.
2:38:222 hours, 38 minutes, 22 secondsThere's a very nice um way you can do automatic teriy use arrow keys between yeah see to switch between toss on on off.
2:38:362 hours, 38 minutes, 36 secondsSo, this right now is something that I want to do. So,
2:38:452 hours, 38 minutes, 45 secondsright now I'm I don't see the console running in interactive mode.
2:38:582 hours, 38 minutes, 58 secondsLet's have a look.
2:39:022 hours, 39 minutes, 2 secondsTurbo 2. We're on supposed to turbo dev needs the UI flag.
2:39:082 hours, 39 minutes, 8 secondsAh, okay. So, turbo dev UI uh web. Okay, that's good. Yeah. So, it's the turbo UI flag. So, uh trust me guys,
2:39:192 hours, 39 minutes, 19 secondsit's very very cool, right? If you don't add it, you see how it can come up like this. Yeah. But now when we do turbo dev. Hey, that's the one. Look at that.
2:39:282 hours, 39 minutes, 28 secondsSee how much nicer that is? And then when you press I, you can interact. But this is cool because now I can see exactly where the issues are or I can
2:39:372 hours, 39 minutes, 37 secondssee separately and see how nice that is like that. Now I have like an interactive terminal. It's solid, right?
2:39:432 hours, 39 minutes, 43 secondsSo I can debug a lot easier. I can see what's going on. See convex AI files are out of date. MPX convex AI files update.
2:39:502 hours, 39 minutes, 50 secondsSo I'm going to quickly change that as well. Um let me just do that right now.
2:39:542 hours, 39 minutes, 54 secondsOops. Uh Ctrl Z to stop interacting. Oops. Okay. I need to kill that one.
2:40:022 hours, 40 minutes, 2 secondsUh, let's do MPS. So, let's do LS CD apps
2:40:092 hours, 40 minutes, 9 secondsand then CD back end. And that's uh in here. So, MPX Convex AI files update.
2:40:182 hours, 40 minutes, 18 secondsI'm sure it's here.
2:40:212 hours, 40 minutes, 21 secondsI hope I installed that in the right spot.
2:40:252 hours, 40 minutes, 25 secondsAnd then we do turbo dev. Convex step. Yep. There we go.
2:40:342 hours, 40 minutes, 34 secondsHopefully. Yep. So, convex functions are good.
2:40:402 hours, 40 minutes, 40 secondsDevelopment build iOS. Let's do I to interact and then I again. And I believe we probably will get an error or we have
2:40:482 hours, 40 minutes, 48 secondsto do a rebuild. I don't think we will have to re Okay, so we see async storage is no. Nice. So, this is good. Now the app's at least running. So, firstly,
2:40:562 hours, 40 minutes, 56 secondslet's just see uh Uh, let's do local host 3000. Let's open up our agent panel. Sign into Papa
2:41:052 hours, 41 minutes, 5 secondsPizza. So, firstly, that's good. We got a sign in blow. Let's go ahead and see if we sign in now. We should get an unauthorized screen. So, access denied.
2:41:132 hours, 41 minutes, 13 secondsOkay. So, firstly, uh, it's not loading the Tailwind CSS correctly. You need admin privileges to access this
2:41:202 hours, 41 minutes, 20 secondsdashboard. So, um I mean you could fully show an uh unauthorized instead of maybe like showing some of this, but already
2:41:292 hours, 41 minutes, 29 secondsit's not not terrible. I mean to be fair, uh the admin stuff. So, I just want to change up. So, uh the admin wait
2:41:402 hours, 41 minutes, 40 secondsthe admin panel isn't loading tailwind and CSS correctly at the moment. The fonts aren't loading. And this is a typical thing that happens when you set
2:41:472 hours, 41 minutes, 47 secondsup shaden um onto a existing app that I've had the same problem happen before.
2:41:572 hours, 41 minutes, 57 secondsWait, isn't loading Tailwind CSS correctly at the moment? Yeah.
2:42:042 hours, 42 minutes, 4 secondsAnd also I would really go through and you need to do a code review at this point, right? So stuff like this, you see this terrible, right? Never never do
2:42:122 hours, 42 minutes, 12 secondsthis, right? So in this case, never retype uh types uh infer from uh convex always.
2:42:242 hours, 42 minutes, 24 secondsAnd then we're going to say scan through the rest of the app. So in this case, look, scan through the rest of the app.
2:42:312 hours, 42 minutes, 31 secondsScan through the rest of the app to make sure that this is uh not repeated anywhere else.
2:42:402 hours, 42 minutes, 40 secondsand keep an eye on your so in this case 288K. I mean the fact that we built the entire app by 288K of context because it
2:42:502 hours, 42 minutes, 50 secondswas spawning out to sub agents is actually incredible. Um that's actually incredible. That's very very good. Um
2:42:572 hours, 42 minutes, 57 secondsmove this but pizza. So yeah, we need to fix that. Uh async storage. We we'll go through the bugs and we'll fix everything and then we'll get it working.
2:43:062 hours, 43 minutes, 6 secondsSo let's see. Never retail types.
2:43:092 hours, 43 minutes, 9 secondsavailable on the room. Okay. So,
2:43:182 hours, 43 minutes, 18 secondslet's see. Yeah, there we go. So, you see now it's loading
2:43:242 hours, 43 minutes, 24 secondsnow. Yeah, you see this statuses doc order status. There we go. All right.
2:43:312 hours, 43 minutes, 31 secondsNow, that's correct.
2:43:382 hours, 43 minutes, 38 secondsLet me use a scan. Scan the export app files. So now it's checking everywhere else.
2:43:562 hours, 43 minutes, 56 secondsCheck all apps include Check all apps including admin. So we don't manually
2:44:042 hours, 44 minutes, 4 secondstype anything because that's going to break your type safety by the way if you do that right.
2:44:102 hours, 44 minutes, 10 secondsSo also I see how oh these are just labels. These are presentational. Uh even here you see how now Yep. There we go. That's cool. So if I try to do pending one there we go. It won't work.
2:44:202 hours, 44 minutes, 20 secondsThat's correct. All right. But what about the AI agent? AI agent. Right now I'm paying $200 for cursor ultra. Um,
2:44:282 hours, 44 minutes, 28 secondsbut you see, it's more about how you're using your tokens the correct way. Every single match is either.
2:44:382 hours, 44 minutes, 38 secondsOkay. I don't know if it actually checked anything, but say scan the apps.
2:44:442 hours, 44 minutes, 44 secondsWait, scan the apps to check. It did not scan the apps, right? Um
2:44:532 hours, 44 minutes, 53 secondsI mean right now it actually seems to be from what I saw before. Okay. All five files that use not only manually type
2:45:012 hours, 45 minutes, 1 secondalso check other manually types complex documents across the apps. Yeah, that's what it should have done. Okay. Now
2:45:082 hours, 45 minutes, 8 secondslet's debug some more. So uh let's do a refresh by hitting R. And you can see we got async or storage error. So going down to Ctrl Z to stop interacting mode.
2:45:202 hours, 45 minutes, 20 secondsGo into Papa Pizza Development. So here this is where you can actually get the errors. So I to interact and you can't
2:45:272 hours, 45 minutes, 27 secondscopy and paste here. What you can do is you just cop you highlight the error and you press C. Okay. So C and then you can
2:45:362 hours, 45 minutes, 36 secondsbasically copy that way. But it's a bit strange that no one actually tells you that. But uh it tells you at the bottom.
2:45:422 hours, 45 minutes, 42 secondsIt's kind of hard to tell. Uh no she's found. Okay. So that's great. So now what you can do is you can start a new agent to be fair and uh find start
2:45:502 hours, 45 minutes, 50 secondsfixing these things because you don't need the the previous context to be able to do that. We can say go ahead and pop this in says to go ahead and fix it. And also I'm going to spin up another agent.
2:46:002 hours, 46 minutesCommand E. Now let's go into this view.
2:46:022 hours, 46 minutes, 2 secondsUh let's close all of our editor windows.
2:46:062 hours, 46 minutes, 6 secondsAnd I want to spin up agents now. And I want to basically also fix up the or ask it uh how
2:46:132 hours, 46 minutes, 13 secondsmodern efficiency switch to the premium modera premium. Oh no, that's fine for now. How
2:46:202 hours, 46 minutes, 20 secondsto um they're very heavily pushing on that now. So how to uh set clerk role
2:46:282 hours, 46 minutes, 28 secondsfor admin. Run through the steps. So this is fairly easy basically. I believe it's the same way that I told you guys.
2:46:362 hours, 46 minutes, 36 secondsSo basically we go into our clerk dashboard and we go and add in the public metadata
2:46:432 hours, 46 minutes, 43 secondsI believe but I just want to make sure it's also correct. So let that happen. So look we have expo
2:46:512 hours, 46 minutes, 51 secondsmain okay not available in expo go but we're not in expo go are we? So command J let's check it out. So
2:47:002 hours, 47 minutesusing development build. So we have to pre-build likely again because we probably added the async storage and didn't actually install it. So yeah,
2:47:092 hours, 47 minutes, 9 secondsevery time you install a new native dependency, you need to reinstall uh your build, right? So basically like the
2:47:172 hours, 47 minutes, 17 secondswhole development build. So yeah, look at that. AJ saying good stuff, dude.
2:47:222 hours, 47 minutes, 22 secondsRight on time with that. He goes, "You need to start expo with clear cache tag to get rid of the async storage issue."
2:47:272 hours, 47 minutes, 27 secondsThank you so much. So, uh, way that I like to do it is basically go ahead and do cd apps app. So, we're inside the app
2:47:352 hours, 47 minutes, 35 secondsand then we basically do pre-build clean expo run iOS. So, the pre-build clean basically is going to do a pre-build and basically get rid of the old iOS folder.
2:47:472 hours, 47 minutes, 47 secondsSo, basically like it gets rid of the old cache effectively. Um, this is doing a local build. Again, remember I showed you in the beginning how you can build
2:47:542 hours, 47 minutes, 54 secondswith EAS and then you can also tack on a local flag. By the way, if you do use EAS, I recommend you use something called Expo Orbit. It's pretty awesome
2:48:022 hours, 48 minutes, 2 secondsfor installing locally to your phone and stuff and then let that do its thing for a moment.
2:48:102 hours, 48 minutes, 10 secondsAnd then, by the way, if you do want to test a development build on your phone,
2:48:142 hours, 48 minutes, 14 secondsit's pretty easy. You just plug in the wire uh and then you follow a bunch of steps and you can basically Yeah, it's fairly easy to do that. Uh so we done
2:48:222 hours, 48 minutes, 22 secondsthe expo pre-built clean and then you want to run the uh iOS right so in this case we've already done that command I
2:48:302 hours, 48 minutes, 30 secondsmean I just want to run it together to show you guys in one go how that command can do a fresh install and again if you don't if you're tired of running that
2:48:382 hours, 48 minutes, 38 secondscommand every time you could just make a quick script for it like you know you can go ahead and say like a
2:48:442 hours, 48 minutes, 44 secondsdev app clean and then maybe have it run that instead of turbo dev filter operating you can you can do loads of like clean tags instead of doing this,
2:48:542 hours, 48 minutes, 54 secondsright? I've got in my packages every time I find these annoying instances, I will go ahead and do it myself. Um,
2:49:022 hours, 49 minutes, 2 secondsbut now after this is done, you'll see it should kick in.
2:49:092 hours, 49 minutes, 9 secondsAnd this actually runs it by the way afterwards as well. So it'll plan the build, it'll go ahead and run it. And you can see here that it starts doing Clerk Expo, installing a bunch of stuff.
2:49:192 hours, 49 minutes, 19 secondspart of these installs will be for the native module async storage and the reason why it's no is because it didn't install that right so in this case if
2:49:282 hours, 49 minutes, 28 secondsyou're using cocoa pods and iOS run pod install so this is effectively where pod install is going to happen um for in in
2:49:362 hours, 49 minutes, 36 secondsterms of expo development builds so yeah expo has a lot a bit more I mean doing any kind of native development has a bit more understanding to it but yeah expo
2:49:442 hours, 49 minutes, 44 secondsis really really good at helping us out with that look there you go there it is you see that boom that now.
2:49:562 hours, 49 minutes, 56 secondsUh oh yeah. Boom. Command E. Let's see.
2:50:062 hours, 50 minutes, 6 secondsSo find your user. Set public metadata.
2:50:092 hours, 50 minutes, 9 secondsClick on the public metadata. Add the following JSON. So add the following JSON. So for this user, we're going to add in boom row admin.
2:50:192 hours, 50 minutes, 19 secondsSo I'm going to make Sunny an admin. And again, you can programmatically, you know, change that stuff up. Oh, I mean,
2:50:252 hours, 50 minutes, 25 secondswell, firstly, that that loaded, which is a start. Is it ideal yet? No, we're not there yet because I haven't seeded
2:50:322 hours, 50 minutes, 32 secondsthe data. But um that's one thing. The second thing is local host 3000. Oh, we need we haven't
2:50:402 hours, 50 minutes, 40 secondsstarted any of our apps. So firstly the app ran which is a good sign. So now what I want you to do is kill the app.
2:50:472 hours, 50 minutes, 47 secondsSo command C stop the server go to the top level do turbo dev to spin up all three apps.
2:50:542 hours, 50 minutes, 54 secondsCommand J command E sorry command B command I hit I for running it on iOS. As you can
2:51:022 hours, 51 minutes, 2 secondssee this is going to go ahead and log that on. And then for totrl Z go back to
2:51:092 hours, 51 minutes, 9 secondsadmin. And then over here you can see it's running. Go ahead and load up local host access.
2:51:172 hours, 51 minutes, 17 secondsSo now we need to sign out and sign back in because we've upgraded or changed that users uh JWT now. So it should pull
2:51:242 hours, 51 minutes, 24 secondsin that public metadata row. But we need to check if it's implemented correctly.
2:51:282 hours, 51 minutes, 28 secondsSo yeah, here you go. So this is the thing. So now the chances are it's actually has been added. So we did
2:51:372 hours, 51 minutes, 37 secondsactually add it. So if we go to dashboard. So, this user does have public metadata row admin, but chances are we're not accessing it correctly.
2:51:462 hours, 51 minutes, 46 secondsSo, uh apps admin proxy most likely and you can see here redirect to sign
2:51:552 hours, 51 minutes, 55 secondsin. Here we are. So, session claims. So what I would like to do here is go ahead and do
Chapter 26: Admin dashboard progress
2:52:022 hours, 52 minutes, 2 secondsso what you can do is you can do dot dot dot uh rest and you can just console log the rest and I like to say is rest and
2:52:112 hours, 52 minutes, 11 secondsalso session claims right and redirect sign. So let's go ahead and show these inside the admin. So command J and if I
2:52:212 hours, 52 minutes, 21 secondsrefresh that.
2:52:262 hours, 52 minutes, 26 secondsSo let's refresh it. So we can see that here we have it. So you can see I've got my convex
2:52:342 hours, 52 minutes, 34 secondsad. I've got my FFA see session token actor undefined session active
2:52:422 hours, 52 minutes, 42 secondsorganation organization ID is authenticated true.
2:52:462 hours, 52 minutes, 46 secondsUh public metadata. Where is my public
2:52:552 hours, 52 minutes, 55 secondsmetadata? Madata session claims permission meda. So let's have a look. So uh clerk uh access public meta data.
2:53:102 hours, 53 minutes, 10 secondsSo it's available on the back end. Ah public read access on the front end.
2:53:182 hours, 53 minutes, 18 secondsYeah. So good point AJ. He goes try clear your cookies. I believe that's actually a
2:53:272 hours, 53 minutes, 27 secondsgood point on the back end use object to access probably metadata on the back end. So to access the front end is available on the user object when you
2:53:342 hours, 53 minutes, 34 secondsneed to use the hook. So public private so on the back end it's
2:53:442 hours, 53 minutes, 44 secondson the back end user object get user. So get user. So, const user equals wait get user.
2:53:572 hours, 53 minutes, 57 secondsUm,
2:54:002 hours, 54 minutesthat's the JavaScript SDK. We need the XJS SDK. So,
2:54:072 hours, 54 minutes, 7 secondsum, metadata meta data. So,
2:54:262 hours, 54 minutes, 26 secondsattach it to the meditating session token.
2:54:302 hours, 54 minutes, 30 secondsSo just sessions customization. Ah here we have it guys. This is it. Use a
2:54:382 hours, 54 minutes, 38 secondspublic. So yeah. So really we should have done this. So,
2:54:482 hours, 54 minutes, 48 secondsso what we're trying to do is we're and this the good thing with clerk is you can really customize everything. So, if we go to configure and we go to sessions,
2:54:592 hours, 54 minutes, 59 secondsI think it's in our JWT or sessions here claims. So, we've got a session token and we can see the AUD came through
2:55:092 hours, 55 minutes, 9 secondspreview user. Select preview user select user sunny that claims to template a preview. So if we were to go ahead and
2:55:162 hours, 55 minutes, 16 secondsadd in for example the user public metadata. Yeah. So
2:55:242 hours, 55 minutes, 24 secondsokay. So uh you so we can say we can just call this one um
2:55:342 hours, 55 minutes, 34 secondsum public yeah meta data. And then we can pop in this.
2:55:422 hours, 55 minutes, 42 secondsAnd then you can see look there you go.
2:55:442 hours, 55 minutes, 44 secondsPublic metadata row admin. Then we hit save.
2:55:492 hours, 55 minutes, 49 secondsAnd that's how we can preview it now. So if we were to open the preview now,
2:55:592 hours, 55 minutes, 59 secondsSunny probably made it. Although I I hope it doesn't break my previous claim.
2:56:052 hours, 56 minutes, 5 secondsI don't think it will. No. Okay. So this should change that now. So if we go into here, sign out,
2:56:152 hours, 56 minutes, 15 secondsand let's do it again. So continue with Google. And yeah, we if not, we might have to clear our cookies because our JWT might be still old. Yeah, I think it
2:56:232 hours, 56 minutes, 23 secondsis. So JWTs basically last until they expire. So typically we have to clear our site cookies. Refresh. And
2:56:312 hours, 56 minutes, 31 secondsinterestingly enough, they didn't get rid of it. Uh, local storage cookies. Delete all.
2:56:382 hours, 56 minutes, 38 secondsOkay. Refresh.
2:56:482 hours, 56 minutes, 48 secondsClear the cookies. Clear the site data. Kill the entire app.
2:57:012 hours, 57 minutes, 1 secondGo to this and this how it looks. So sign in log in we should get the continue now.
2:57:132 hours, 57 minutes, 13 secondsOkay. So what are we getting inside of this user now? We've got session claims public metadata. Ah yeah there it is. So
2:57:212 hours, 57 minutes, 21 secondsit's actually here. So session claims metadata. Okay. So we just named it different. So I guess we can just to to
2:57:292 hours, 57 minutes, 29 secondsavoid screwing everything else up. Let's go over to our um this one and we just change it to metadata.
2:57:392 hours, 57 minutes, 39 secondsThere we go. And then cuz we changed all our type definitions to be like looking like that. So going back over here now,
2:57:472 hours, 57 minutes, 47 secondssign out. The sign out should actually direct us back over there, but it doesn't. So let's do this.
2:57:592 hours, 57 minutes, 59 secondsHey, look at that. Wait. So um did I sign out though? Let me actually clear the site there.
2:58:052 hours, 58 minutes, 5 secondsSo here we go. Okay. So now if we sign in with the correct user. So in this
2:58:122 hours, 58 minutes, 12 secondscase.com sign in.
2:58:172 hours, 58 minutes, 17 secondsOkay. That's good. That's better. And now you see if I move this button over there. I can sign out. Now let's try and
2:58:252 hours, 58 minutes, 25 secondssign in with a non-admin user. So team and then we should have admin access.
2:58:352 hours, 58 minutes, 35 secondsNo, we shouldn't have admin. This should be unauthorized now. So boom, access on.
2:58:392 hours, 58 minutes, 39 secondsYep, there you go. All right. So there you go. So we've basically gated, right?
2:58:422 hours, 58 minutes, 42 secondsSo I'm not going to do it too fancy, but in short, this is this is working great.
2:58:472 hours, 58 minutes, 47 secondsOkay, so in this case now, continuing forward, there we have it. Dashboard,
2:58:512 hours, 58 minutes, 51 secondswe've got orders, menu. All right, now let's do the cool part. So let's execute a seed. Right. So let's, you know, put that to rest. This one, let's say, um,
2:59:032 hours, 59 minutes, 3 secondseven this MVP, we do it on this one. So,
2:59:072 hours, 59 minutes, 7 secondsuh, I need to go ahead and seed in all of the, um, example data so I can test the app out.
2:59:182 hours, 59 minutes, 18 secondsOkay.
2:59:202 hours, 59 minutes, 20 secondsAnd this is where would effectively, so if we sign in Okay,
2:59:322 hours, 59 minutes, 32 secondsnice and unauthenticated.
2:59:362 hours, 59 minutes, 36 secondsOkay, so orders screen unauthenticated. So I believe my convex is not correctly set
2:59:452 hours, 59 minutes, 45 secondsup with this. And this is the in this is the issue that I think I had previously
2:59:552 hours, 59 minutes, 55 secondswith my sub because firstly as well we should not have to be authenticated to view the order. Okay.
3:00:033 hours, 3 secondsto list orders. Yeah.
3:00:063 hours, 6 secondsRight. For now, I want to do one thing because I have a bug which I don't know if it's I can debug it live completely.
3:00:133 hours, 13 secondsUm but comics orders.
3:00:163 hours, 16 secondsSo here we have firstly again this is not
3:00:243 hours, 24 secondsthis shouldn't be should not be manually typed. uh do not
3:00:313 hours, 31 secondsmanually type these always infer from convex.
3:00:393 hours, 39 secondsOkay, so that's one thing and also two uh what we're typically doing here is the get user identity. Now this is
3:00:473 hours, 47 secondstypically when you've connected them both together should work perfectly. Now my only thing that I can imagine which
3:00:543 hours, 54 secondswhy this might not be working is we have this right but we didn't I noticed that clerk also have
3:01:013 hours, 1 minute, 1 secondthe JWT template side of things here which also has this right so you see like email verified pictures and this kind of
3:01:103 hours, 1 minute, 10 secondsstuff so I'm going to add these in as well and I believe I don't think it will make
3:01:183 hours, 1 minute, 18 secondsa difference to be honest but if you go to our sessions now.
3:01:233 hours, 1 minute, 23 secondsYeah, I don't think it does because the session token is managed by the new integration saying
3:01:323 hours, 1 minute, 32 secondsand also look at that. That's very good way of testing it. Look at that. Awesome.
3:01:373 hours, 1 minute, 37 secondsUm so find yeah so you really want to make sure
3:01:453 hours, 1 minute, 45 secondsthat you're always getting your typings from the the back. So the main thing now is getting that other issue resolved. So
3:01:543 hours, 1 minute, 54 secondsunauthenticated convex orders. So I mean firstly I want to give this to authenticated convex orders.
3:02:053 hours, 2 minutes, 5 secondsWhere's it gone?
3:02:093 hours, 2 minutes, 9 secondsUm we are still this is admin. Sorry Z. Go
3:02:173 hours, 2 minutes, 17 secondsto let's look here. So refresh.
3:02:263 hours, 2 minutes, 26 secondsYeah. So I believe I have a local issue to be honest cuz this happened earlier with me with my authentication flow. My convex and my clerk aren't syncing
3:02:343 hours, 2 minutes, 34 secondscorrectly. I don't believe. But I know this doesn't happen okay with those. But any anyway, this is
3:02:423 hours, 2 minutes, 42 secondsthis already good. This is already good uh test right now. So, first things first is this is nice. So, we can see our pizzas. This is not ideal. These are
3:02:513 hours, 2 minutes, 51 secondssmall. Okay, that's a bug. Uh, we can fix that. But say, for example, we wanted the pepperoni classic. We should be able to click into it. Have a look
3:02:583 hours, 2 minutes, 58 secondsinto it. But say we wanted to add that to our order. Firstly, none of this is clicking through. The orders are not loading. Your cart is has got a bunch of
3:03:073 hours, 3 minutes, 7 secondsstuff inside of it. We can remove place order. I just want to see. So if we were to place an order firstly that should be
3:03:143 hours, 3 minutes, 14 secondsover there uh view details. So we haven't got order details screen but I want to see if the actual admin so
3:03:243 hours, 3 minutes, 24 secondsdashboard recent orders. So now if you were to click into it we can see we got the order confirm. So you can see an
3:03:323 hours, 3 minutes, 32 secondsorder here. You can confirm it. You can start cooking. You can send out.
3:03:383 hours, 3 minutes, 38 secondsSo obviously the UI is not great right now. You can see look cooking and then if you were to go ahead and say
3:03:453 hours, 3 minutes, 45 secondsmove this over here send out. So look on the way and then
3:03:533 hours, 3 minutes, 53 secondswhen they deliver delivered. So the first thing is the wiring is is very nice. Okay. Just the the screens are not
3:04:003 hours, 4 minutesnice at all. Okay. So let's just type in melting cheese. Okay. So, a couple of things in and this is where we get like
3:04:073 hours, 4 minutes, 7 secondsinto the nitty-gritty of things, but and also the payment flow. So, imagine you you added a bunch of things to your your cart. So, I added like these to it. For
3:04:163 hours, 4 minutes, 16 secondsexample, we should be able to select ingredients. There should be like an option there. And also, when we place an order, these icons are missing. That's
3:04:233 hours, 4 minutes, 23 secondsone thing. When we place an order, um that's typically where you'd start a payment intent, right? And you'd have a
3:04:293 hours, 4 minutes, 29 secondspayment intent flow. Okay. So, a few things now and I want to try and get this done in the next hour now. So, um
3:04:373 hours, 4 minutes, 37 secondsstart a new agent, command D, and close these out. And then let's go ahead and do the following. So,
3:04:483 hours, 4 minutes, 48 secondswhen I click on a category inside of the Expo app, the whole UI gets gets pretty big. Uh it's a bug. It needs fixing.
3:04:583 hours, 4 minutes, 58 secondsWe just say bugs.
3:05:003 hours, 5 minutesYeah, needs fixing. Um, when I click on a pizza inside of the home screen, uh,
3:05:083 hours, 5 minutes, 8 secondswe should go to a customization screen. So, we should be able to go ahead and add different
3:05:153 hours, 5 minutes, 15 secondsingredients to the order before we add it to the cart.
3:05:223 hours, 5 minutes, 22 secondsSo, that's another thing. Um, and then you can see the pizza search is actually working. the orders themselves.
3:05:303 hours, 5 minutes, 30 secondsOn the order screen, when I click view details, I should be able to see a full screen uh popup of the order, including a nice uh visual of what the current status of the order is.
3:05:483 hours, 5 minutes, 48 secondsThe profile doesn't need a tab. Instead, in the home screen on the top right,
3:05:533 hours, 5 minutes, 53 secondslet's have the user button. It makes more sense to have it that way. Also,
3:05:593 hours, 5 minutes, 59 secondshome orders and c tabs require icons.
3:06:053 hours, 6 minutes, 5 secondsYeah. So, really, we don't need this tab. We can kind of have it in the typical flow is in the home screen. At the top right, you have a user button
3:06:123 hours, 6 minutes, 12 secondsand then it will be effectively home or I think it'll be home
3:06:193 hours, 6 minutes, 19 secondsorders car. I think car is in the middle maybe or like I don't know. Yeah. Uh,
3:06:253 hours, 6 minutes, 25 secondssomeone goes, I just I I'm only start coding like what you're doing. Yeah. Literally just start talking to it. That's much better. Uh, you can scroll. Scroll is working.
3:06:343 hours, 6 minutes, 34 secondsOkay, that's great. Um,
3:06:373 hours, 6 minutes, 37 secondsokay. Yeah, this let's fix these bugs first. And also on the admin side. So here I'll say uh admin side bugs, right?
3:06:453 hours, 6 minutes, 45 secondsThen we'll say over here, let's go ahead and grab this. So I'll say okay, firstly that's not very good. So,
3:06:543 hours, 6 minutes, 54 secondsit's not mobile responsive. Oops.
3:07:003 hours, 7 minutesThe UI needs to be way more usable for a backend kitchen. So, let's have uh each
3:07:073 hours, 7 minutes, 7 secondsstatus be clearly visible. Uh so, we should be able to see all the statuses and then the active status should be highlighted um for each order. There
3:07:163 hours, 7 minutes, 16 secondsshould be much larger clickable buttons and it should be very clear uh what orders are coming in and what orders are coming out. Right now it's just a table.
3:07:253 hours, 7 minutes, 25 secondsIt looks terrible. Yeah. And then the menu. You can see look menu invalid source prop. We need to add that as well. So I can just highlight that
3:07:333 hours, 7 minutes, 33 secondsaround. So that's just updating the thing. And I'm literally I literally do it like this guys. I I genuinely just run through my app like this.
3:07:423 hours, 7 minutes, 42 secondsIngredients as well is fine. Ingredients is okay. uh categories as well is okay.
3:07:473 hours, 7 minutes, 47 secondsSo we have a few extra categories that I'm seeing here. So here Oh no, that's cool. Yeah. Okay. So sort order is 1 2 3
3:07:553 hours, 7 minutes, 55 seconds4. Uh instead of showing sort order from zero to three, it should just be a drag and drop uh list where you should be
3:08:043 hours, 8 minutes, 4 secondsable to just change which one is at the top of the list. This is not user friendly. And then here the edit flows are good.
3:08:123 hours, 8 minutes, 12 secondsAdd categories is good. Cool. Okay. So now, for example, that we can go ahead and just implement the fixes. Two things you could do here. You can either plan
3:08:193 hours, 8 minutes, 19 secondsmode it or you can just go ahead and execute it. Um I'm just going to go ahead and execute it. I'm being a bit like aggressive now with uh with the
3:08:263 hours, 8 minutes, 26 secondsforward play. So Adam says, "Hello from Turkey. What's up, dude? Your contents are really good and useful. I try and be I'm trying to be a full stack developer following with pleasure." Awesome stuff,
3:08:353 hours, 8 minutes, 35 secondsdude. I'm really happy to hear that. Thank you for your kind words.
3:08:433 hours, 8 minutes, 43 secondsSo, look, pizza app um exploring pizza mono. Okay, so we can go ahead and let that one do its thing now, right? So,
3:08:513 hours, 8 minutes, 51 secondsthat's going to go ahead and try and uh fix a bunch of stuff. We've got the um the token side working. I am logged in
3:08:593 hours, 8 minutes, 59 secondson the correct account. This account was not correctly logged in. So, I believe Yeah, that one's not right. That one's
3:09:073 hours, 9 minutes, 7 secondsnot right. Uh, if I'm logged in and I'm on an unauthorized screen, it should redirect me ideally. That's another bug.
3:09:123 hours, 9 minutes, 12 secondsUm, if I'm on the unauthorized screen on admin panel, but yet I'm logged in and I have the correct metadata, I should be
3:09:203 hours, 9 minutes, 20 secondsredirected to see the correct screen. I should never be stuck on the unauthorized screen unless I genuinely do not have access to the platform.
3:09:313 hours, 9 minutes, 31 secondsAlso, I shouldn't see the sidebar. I should just see a full screen unauthorized view.
3:09:363 hours, 9 minutes, 36 secondsRight now, here's where it gets interesting. Because we're building like we're doing multiple changes. Typically,
3:09:413 hours, 9 minutes, 41 secondsyou'd push it to GitHub and then you' do uh either a cloud or you do get git work trees. So, I'm just saying that that's another thing because right now I'm
3:09:483 hours, 9 minutes, 48 secondschanging a bunch of stuff, but know that they could clash. So, few things to factor in. But already it's kind of cool. So, like we can see orders coming
3:09:563 hours, 9 minutes, 56 secondsin. Uh the dashboard should I mean like you know like this could be way more user friendly like this is not helpful
3:10:033 hours, 10 minutes, 3 secondsto like a back end. This should be like iPad tapable, right? Um, so obviously you can just keep giving feedback here.
3:10:113 hours, 10 minutes, 11 secondsThe UI here is not it's not the nicest UI. So in this case, what I'm going to do is expo have an awesome uh skill and
3:10:193 hours, 10 minutes, 19 secondsI think we've already installed it. So expo skills. So you see here bunx uh skills add expo skills. So put this
3:10:273 hours, 10 minutes, 27 secondsover to the side. Do the following. Say um skills and also save this. Push this in here.
3:10:383 hours, 10 minutes, 38 secondsSay add these skills uh for expo app. And then I'm going to
3:10:453 hours, 10 minutes, 45 secondssay building native UI. So we can say improving native. So building native UI is a cool one. Expo deployment,
3:10:513 hours, 10 minutes, 51 secondsupgrading expo. These are all really handy to go ahead and do stuff for us.
3:10:553 hours, 10 minutes, 55 secondsBy the way, uh you can also set up Tailwind, which is awesome. Native data fetching, building native UI. Uh set up Tailwind setup would be cool, but maybe I want to focus on more important stuff.
3:11:043 hours, 11 minutes, 4 secondsNow, building native UI. So,
3:11:073 hours, 11 minutes, 7 secondsuse the building native UI scale to go ahead and make things way nicer visually,
3:11:143 hours, 11 minutes, 14 secondsright? And let's go into plan mode for that one because it's going to clash with something else. So, now this one is going to start fixing a couple of bugs.
3:11:203 hours, 11 minutes, 20 secondsThis expo app is going to go ahead and it's almost this was the main bugs. This was the unauthorized screen bugs. Uh
3:11:283 hours, 11 minutes, 28 secondsthis was async storage bug which we fixed and that's doing a bunch of changes now. Yeah.
3:11:363 hours, 11 minutes, 36 secondsOh, where did you find these skills? I need to add them as well. Yeah, I told you these skills are awesome, dude. So,
3:11:413 hours, 11 minutes, 41 secondsthese skills are for example an expo skill. I'll drop it in the chat right now, but you can see right there actually. Awesome. So as it should be a
3:11:493 hours, 11 minutes, 49 secondslive stream. Yeah, it's really really handy, right? So very very cool skills. So you see like here like building native UI
3:11:583 hours, 11 minutes, 58 secondsupset ton basically tells AI how to build native UI. Now of course I'm being very very biased towards iOS right now.
3:12:063 hours, 12 minutes, 6 secondsI'll be honest. So chances are if you tried rendering this in Android there'll be some bugs and stuff like that. You have to also factor in Android and you also have to factor in you know uh when
3:12:153 hours, 12 minutes, 15 secondsthings can't support um you know liquid UI like what's the fallback but in this case I'm going to go ahead and show a
3:12:223 hours, 12 minutes, 22 secondsfew things. Yeah, someone goes the bro using Opusport 6 for the most expensive model. We're live guys. I'm not going to risk it by using uh you know a worer
3:12:303 hours, 12 minutes, 30 secondsmodel uh expo. Also, I want to do another thing which was um there is a a nice library that I
3:12:393 hours, 12 minutes, 39 secondsactually like this one skills.sh and it was um max UI. It's a native
3:12:463 hours, 12 minutes, 46 secondsuh it was it's one of these top ones.
3:12:523 hours, 12 minutes, 52 secondsUm UIUX Max Pro. So,
3:12:593 hours, 12 minutes, 59 secondsit wasn't this one pre-built.
3:13:023 hours, 13 minutes, 2 secondsSo, searchable databases designs. This was not This is good for Oh, no. But then, okay.
3:13:123 hours, 13 minutes, 12 secondsYeah, we're not going to do that. It's got It's got bad skill, so ignore I said that. Okay. They have a lot of uh you know,
3:13:203 hours, 13 minutes, 20 secondskind of um prompt injection attack possibilities when you install skills. So, be very
3:13:273 hours, 13 minutes, 27 secondsvery careful what you're doing. add check if they get redirected to immediately case refresh picked up session claims nice
3:13:363 hours, 13 minutes, 36 secondsokay so let's go ahead and see this so if I go to for/ unauthorized
3:13:443 hours, 13 minutes, 44 secondsunauthorized there of course they did it the American way there you go yeah we get it
3:13:513 hours, 13 minutes, 51 secondsredirected nice okay so that's the first thing so it fixed that bug for us so we can resume we can call that one a Okay.
3:13:593 hours, 13 minutes, 59 secondsUm, Expo visual upgrade.
3:14:023 hours, 14 minutes, 2 secondsSo, React and it's also going to add Expo haptics. That's cool. Uh, React reanimated. Okay. We can we could reintroduce it. It's fine. Um, just know
3:14:103 hours, 14 minutes, 10 secondsthat it could have the issues with the other stuff. Each group sets up stack from exp transparent headers. Remove all manual safe areas to like.
3:14:193 hours, 14 minutes, 19 secondsOkay. Stack header handle safe area and titles.
3:14:243 hours, 14 minutes, 24 secondsYou could use stack headers. Yeah, I don't know if I want to use that, but let's let these bugs get fixed first
3:14:323 hours, 14 minutes, 32 secondsbefore we do any major over or on the UI side of things. Um,
3:14:393 hours, 14 minutes, 39 secondsanother thing that I want to focus on is actually Expo SDK 55 uh live activities.
3:14:463 hours, 14 minutes, 46 secondsSo, I thought this was very very cool and I think it'll be awesome for what we're doing right now. So if we see
3:14:553 hours, 14 minutes, 55 secondsthese expo widgets, right? So these are awesome because imagine your pizza is being prepped. So I would love
3:15:043 hours, 15 minutes, 4 secondsto give this a try and let me see where the main documentation is. So
3:15:113 hours, 15 minutes, 11 secondsuh automate the expos widgets using export UI compos
3:15:193 hours, 15 minutes, 19 secondsfor you. Where's the actual documentation? So,
3:15:253 hours, 15 minutes, 25 secondslive activities. So, live activities, export widgets, learn more about expo widgets. Yes, here we are.
3:15:343 hours, 15 minutes, 34 secondsIt's in alpha. So, bear that in mind.
3:15:373 hours, 15 minutes, 37 secondsOkay. Uh, MPX inspo install expo widgets configuration in app config. So, we have
3:15:443 hours, 15 minutes, 44 secondsto do a couple changes here how it will display. Uh and then the main thing is it actually renders out as push
3:15:513 hours, 15 minutes, 51 secondsnotifications. It actually renders out as um literally a component. Start by creating a widget using create widget function and pass to widget widget
3:15:593 hours, 15 minutes, 59 secondsdirective to component received. This would be awesome. Let's do this cuz I actually really want to mess around with this. So a widget as well as maybe a
Chapter 27: Realtime updates and app wiring
3:16:063 hours, 16 minutes, 6 secondslive activity. Okay. So I have never done this before. So I want to see if we can do this really nicely. So, uh
3:16:143 hours, 16 minutes, 14 secondsI want to add in live activities and also a widget for this application while
3:16:223 hours, 16 minutes, 22 secondsa pizza is being, you know, processed through the different statuses until delivered, right? Because it'll be
3:16:293 hours, 16 minutes, 29 secondsreally handy when I order a pizza to be able to see when my order is basically being accepted, cooked, on the way,
3:16:363 hours, 16 minutes, 36 secondsdelivered.
3:16:393 hours, 16 minutes, 39 secondsOkay, I'm going to switch it to plan mode as well. Wero chat says, "Thank you for the live streams. I really enjoy them." Uh, and someone says, "Nice Japan wallpaper." Hey, glad you like it, dude.
3:16:483 hours, 16 minutes, 48 secondsAnd of course, you're absolutely welcome. I'm really glad you enjoy these. Um, Cohen says, "What triggers me so hard lately is Android feels so
3:16:563 hours, 16 minutes, 56 secondsbehind iOS has so many cool features and UIUX. Then it makes life a lot harder to match Android version on top of the app as cool as the iOS." I honestly feel you. I honestly feel you with that one.
3:17:073 hours, 17 minutes, 7 secondsUh, and it's very true. like uh we're blessed that Expo actually handles a lot of the heavy lifting, but you do have to account for if something is um you know
3:17:163 hours, 17 minutes, 16 secondson Android and that is frustrating. I understand that. Yeah. Um so in this case, let the categories
3:17:243 hours, 17 minutes, 24 secondsYeah. page drag and drop. So it's implementing drag and drop now for this.
3:17:283 hours, 17 minutes, 28 secondsBut yeah, it's definitely a thing I've noticed too. Um let's go back over here.
3:17:333 hours, 17 minutes, 33 secondsYou can't have two prior pages on the same path. I believe it's going to fix that before before we do anything. But also see these are in two plan states.
3:17:413 hours, 17 minutes, 41 secondsWe're not going to execute those yet because we've got quite a bit. We can we can actually get rid of the old MVP one.
3:17:463 hours, 17 minutes, 46 secondsUm and let's see, did it get rid of that?
3:17:513 hours, 17 minutes, 51 secondsAnd also, whoa, whoa, whoa. Why is happening here? Why is my CPU flying right now? So, cut that.
3:18:023 hours, 18 minutes, 2 secondsBecause something was going nuts. So, uh, fix this.
3:18:123 hours, 18 minutes, 12 secondsYeah, that was interesting. Something was driving my CPU to crazy levels.
3:18:183 hours, 18 minutes, 18 secondsUm, let's have a look. So,
3:18:233 hours, 18 minutes, 23 secondsokay, let me do a quick admin checks and see the conf.
3:18:343 hours, 18 minutes, 34 secondsOkay,
3:18:353 hours, 18 minutes, 35 secondsI swear to God on these kind of live streams, I could feel like I could sit here for like 5 hours. It's crazy. Um,
3:18:423 hours, 18 minutes, 42 secondsprofile tab removed. All I ask is that you destroy that like button. That is it. Destroy the like button. I'll say it for as long as it takes. Um over orders
3:18:503 hours, 18 minutes, 50 secondspage overhaul. Okay. Mobile responsiveness character drag and drop.
3:18:583 hours, 18 minutes, 58 secondsSo it failed to fetch some of these pictures. Yeah.
3:19:023 hours, 19 minutes, 2 secondsAlso that's another bug. We can fix it afterwards. So fix these and uh see it functions.
3:19:143 hours, 19 minutes, 14 secondsAnd then these are duplicate roots. There's dashboard with it own page and categories page and then separate app.
3:19:233 hours, 19 minutes, 23 secondsSo it's basically duplicated pages that we're trying to render in parallel and that was causing a big issue.
3:19:333 hours, 19 minutes, 33 secondsNow this one over here live activities. This one's actually really interesting.
3:19:373 hours, 19 minutes, 37 secondsLet's see what's going on here. So it's explored everything. Now I have everything I need. Check expo the B expose XP which supports expo widgets.
3:19:463 hours, 19 minutes, 46 secondsCool. Now push token for remote updates.
3:19:543 hours, 19 minutes, 54 secondsSee this is live activities is of course is iOS rights widget instance. Probably have to get
3:20:033 hours, 20 minutes, 3 secondspermission for this as well. So, it typically pops up saying, would you like to, you know, go ahead and use that and
3:20:113 hours, 20 minutes, 11 secondsso forth. Uh, also I'm wondering, can I Oh, yeah. This is cool. Copy markdown. So,
3:20:203 hours, 20 minutes, 20 secondsI always check as well if it read if it actually went and reading the document upload base. So what I do
3:20:293 hours, 20 minutes, 29 secondsis I honestly just shove the whole thing in and I basically just say um doublech check your plan against documentation.
3:20:413 hours, 20 minutes, 41 secondsYeah. And then while that's happening I read through the while it's thinking about it I read through the plan again.
3:20:463 hours, 20 minutes, 46 secondsJ architecture overview convex backend order update status mutation export app order ID use live activity hook widget
3:20:543 hours, 20 minutes, 54 secondssnapshot data iOS surface dynamic island lock screen banner home screen widget nice and then we have install
3:21:013 hours, 21 minutes, 1 seconddependencies expo widgets yes configure expo clip this is it pizza track your pizza order at a glance pizza tracker
3:21:093 hours, 21 minutes, 9 secondslive pizza order tracking doesn't need support family since you use live activity layout system okay create the live activity component component. Okay,
3:21:173 hours, 21 minutes, 17 secondsso it defines lab activ. Okay,
3:21:233 hours, 21 minutes, 23 secondsand then create the home screen widget component and then create the use pizza live activity hook. So here we're basically
3:21:323 hours, 21 minutes, 32 secondsjust going ahead and getting if platform is iOS. So we basically check of course activity reference and where is this
3:21:413 hours, 21 minutes, 41 secondspulling from live activity update snapshot.
3:21:513 hours, 21 minutes, 51 secondsInteresting. Okay. So we have used live pizza activity data. So this basically Okay. So you basically I mean this is
3:22:003 hours, 22 minutesreal time and then it tacks into use pizza live activity. So every time data order changes it pushes that into the
3:22:073 hours, 22 minutes, 7 secondshook and that is what is feeding the live activity. Nice. Okay. So fix applied instance recovery added amount
3:22:153 hours, 22 minutes, 15 secondstime use the cause. Okay. So yeah see what how it fixed one thing there.
3:22:183 hours, 22 minutes, 18 secondsThat's kind of handy. So good catch. I found one meaningful gap. There you go. See.
3:22:273 hours, 22 minutes, 27 secondsOkay. So now that that's done what I do is I click on the new plan just in case it hasn't opened up the new plan. And then we go ahead and build. So let that
3:22:343 hours, 22 minutes, 34 secondsstart building. We can do a re a visual overhaul afterwards. Uh you can rerun the C function. I'm going say you clear
3:22:433 hours, 22 minutes, 43 secondsthe old seed data and rerun for me.
3:22:493 hours, 22 minutes, 49 secondsLet it do it right now. This would be super cool because we're going to get live activities working.
3:22:573 hours, 22 minutes, 57 secondsNow, of course, when it comes to payments, if you did want to do payments, you could do expo stripe.
3:23:043 hours, 23 minutes, 4 secondsSo, this is how we can effectively get a stripe payment flow inside the app. So,
3:23:093 hours, 23 minutes, 9 secondsyou get a native stripe app paying expo go development build. That's fine.
3:23:143 hours, 23 minutes, 14 secondsLocally running. Yeah. So, these are the the commands that we're doing. Mpx expo run, but of course, like I said, you can do it also with the AS build, right? I
3:23:223 hours, 23 minutes, 22 secondshave a pretty powerful computer. I have the M5 max so you can basically it makes sense to do it locally for me but if it takes ages for you then push to ES build
3:23:303 hours, 23 minutes, 30 secondsright um
3:23:403 hours, 23 minutes, 40 secondsso a payment flow would be super interesting here so migrating from
3:23:463 hours, 23 minutes, 46 secondsexpose payment module and existing sport I And obviously you'd want to pay for
3:23:543 hours, 23 minutes, 54 secondsthe pizza, right? So if you're using as build, you can do most of your stripes set up. Config plugin setup. Use a config plug.
3:24:023 hours, 24 minutes, 2 secondsConnect to sn device under the hood. Stripes react native. Great. So stripes.
3:24:083 hours, 24 minutes, 8 secondsSo SDK reference. Oh wow. Okay. Um browser pops not really back to any. We can also give our code base this red native.
3:24:193 hours, 24 minutes, 19 secondsThese are really nice payment flows by the way. uh once it's done. Really,
3:24:243 hours, 24 minutes, 24 secondsreally nice payment sheet. It looks like super native. Um this guy talks about it quite a lot
3:24:323 hours, 24 minutes, 32 secondsthere from Expo. Let me see if I can show the video. So, um the one that I'm
3:24:383 hours, 24 minutes, 38 secondslooking for is so I'm trying to find the point in the
3:24:453 hours, 24 minutes, 45 secondsvideo where Yeah. So you see here you can actually have it like imagine when it comes to payment time for the pizza.
3:24:543 hours, 24 minutes, 54 secondsLook at this.
3:24:563 hours, 24 minutes, 56 secondsIt's kind of cool. Look. So imagining like it comes in. Appreciate it. Very helpful video. So like this is a
3:25:033 hours, 25 minutes, 3 secondsdonation app for example. And you can see look uh open payment sheet.
3:25:103 hours, 25 minutes, 10 secondsAnd look at that. Boom. It'll pop up like that. And I guarantee everyone's played with that at some point. like you might have actually used that without
3:25:173 hours, 25 minutes, 17 secondsrealizing somewhere. Um, so okay, we did that. That's nice. Uh, pizza live activities. Hey, let's go ahead and I want to try that out before we do anything else. I mean, that looks crazy.
3:25:273 hours, 25 minutes, 27 secondsWhat the hell? So, what I like to do is screenshot sometimes. Just go ahead and
3:25:323 hours, 25 minutes, 32 secondspop in a new say fix the categories UI
3:25:403 hours, 25 minutes, 40 secondsway too long. And also you can give like again I'm not going to focus too hard on the um the actual like UI cuz because
3:25:493 hours, 25 minutes, 49 secondsreally you can you can spend like you can do so many things with the UI if you really want to and kind of get to where you want. Oh by the way look at that.
3:25:543 hours, 25 minutes, 54 secondsHey that's kind of clean. All right so orders got my home
3:26:063 hours, 26 minutes, 6 secondsand did we do the right now? Okay. So,
3:26:143 hours, 26 minutes, 14 secondsit's not We should have a thumb here which shows how many items are in the cart.
3:26:193 hours, 26 minutes, 19 secondsAnd also, I can't click on that. Could be because of this though. So,
3:26:283 hours, 26 minutes, 28 secondsOh, we're not running the app. Oh, yeah. Of course. Turbo Dev. Yeah, there we go. Run the app.
3:26:363 hours, 26 minutes, 36 secondsI wasn't running it. I was crazy. Yeah.
3:26:373 hours, 26 minutes, 37 secondsSo, we're running it now. We hit R or no, sorry. Uh let that spin out.
3:26:433 hours, 26 minutes, 43 secondsRemember your back end will still work because it's running actually on cloud.
3:26:463 hours, 26 minutes, 46 secondsNo, it's only if you make changes. So uh I I opening on iOS. Hit a refresh.
3:26:593 hours, 26 minutes, 59 secondsI I Okay. So you see how it said could not
3:27:073 hours, 27 minutes, 7 secondsfind uh native uh widget for uh for the live tracking.
3:27:143 hours, 27 minutes, 14 secondsSo that was because we added in expo widgets. So how did you screenshot and paste it right away? Oh, it's uh command shift4 is what I have mine assigned to.
3:27:263 hours, 27 minutes, 26 secondsBut basically, if you just go to your keyboard shortcuts, you can um inside of Mac OS, there's one for screenshotting an entire screen and it saves it to your
3:27:343 hours, 27 minutes, 34 secondsdesktop and there's one that screenshots and saves to your clipboard. I just made one command shift 4. I also have it on my mouse so I can quickly do it cuz so
3:27:433 hours, 27 minutes, 43 secondsmany times I need to share something with the team and kind of throw it away and you know kind of thing. So pre-build succeeded the widget. Okay, so I actually did a pre-build for me. Um the
3:27:523 hours, 27 minutes, 52 secondswidget extension was created successfully. Well was created with group identifier bund letting me build and run on ours. So I didn't ask it to build but okay it's going to run.
3:28:093 hours, 28 minutes, 9 secondsLet's just see if it So it's bu I mean it's rebuilding which is kind of handy to be fair. So I don't want this I want this to be small. Yeah.
3:28:203 hours, 28 minutes, 20 secondsAnd again, we can fix a lot of these smaller issues,
3:28:263 hours, 28 minutes, 26 secondsbut let's just see in the meantime our order screen. So, okay. So, orders.
3:28:353 hours, 28 minutes, 35 secondsOh, yeah. We cleared all the previous data. Uh also we get the music back
3:28:423 hours, 28 minutes, 42 secondsand um okay signing it script and dependencies
3:28:493 hours, 28 minutes, 49 secondsto fix code build phrases exponent strip local network keys for release. Okay so there's a few things that we would want to probably address. So here it's
3:28:583 hours, 28 minutes, 58 secondsrunning it. Okay so kind of in a messy situation here
3:29:033 hours, 29 minutes, 3 secondsI want to stop it from running now. So
3:29:223 hours, 29 minutes, 22 secondslet me close this for a sec. One second.
3:29:243 hours, 29 minutes, 24 secondsSo no. So this is not the right one. So now we do turbo dev
3:29:313 hours, 29 minutes, 31 secondsdo I I and do home. So sometimes yeah you kind
3:29:383 hours, 29 minutes, 38 secondsof have to force it into a state. So I there we go. Yeah. And now if I do R we should have no apps connected sending reload to react native.
3:29:493 hours, 29 minutes, 49 secondsExpo go quit. Why am I on expo go? Let me do so if you do question mark
3:29:563 hours, 29 minutes, 56 secondson development. No, I'm not on development. Okay. So, when this happens sometimes, it's because it ran it annoyingly itself. Like I run the Oh,
3:30:063 hours, 30 minutes, 6 secondsno. I'm running it from Oh, no.
3:30:113 hours, 30 minutes, 11 secondsDid it do it from No, it didn't. Okay. So,
3:30:223 hours, 30 minutes, 22 secondscommand J. Command I. Let me just clean clean things up. It's a bit kind of hectic right now. Command J. All right. So,
3:30:313 hours, 30 minutes, 31 secondsI want to go ahead and do CD apps app. Every time I say that, it
3:30:403 hours, 30 minutes, 40 secondsannoyingly goes and executes Apple's magic word. Okay, now we're going to do MPX expo pre-build and MPX run.
3:30:543 hours, 30 minutes, 54 secondsSo, this is not running right now. What we can do is we can kill the apps. So, just kill them, right?
3:31:023 hours, 31 minutes, 2 secondsAnd then let that do its build.
3:31:053 hours, 31 minutes, 5 secondsAnd this will install, by the way, now uh the live widgets. There we go. That's fine.
3:31:133 hours, 31 minutes, 13 secondsnew. That's interesting. So, no group identifier, no bundle identifier provided. So, let's have a look at that.
3:31:203 hours, 31 minutes, 20 secondsSo, if we do command I or actually no command E.
3:31:253 hours, 31 minutes, 25 secondsWhile that's building, let's see P activities.
3:31:373 hours, 31 minutes, 37 secondsOkay, let's do the install.
3:31:463 hours, 31 minutes, 46 secondsWe're missing the explicit group identifier. So it falls back to order.
3:31:493 hours, 31 minutes, 49 secondsLet me add them explicitly to silence the warnings. Okay. No, no, no. Stop rebuilding.
3:32:003 hours, 32 minutesSo we have to cancel our build and rebuild.
3:32:043 hours, 32 minutes, 4 secondsSo app.json it added the identifiers now. So build and group identifier. So when you're
3:32:113 hours, 32 minutes, 11 secondsbuilding with like um Expo or anything native, I'd say always
3:32:193 hours, 32 minutes, 19 secondskeep an eye on the terminal. So I typically have it running on a separate screen always the terminal so I can always see what's happening. Uh Damon
3:32:263 hours, 32 minutes, 26 secondsHartnik says, "And what AI package do you have? I currently have VS Code and using GitHub Copilot Pro with the models. Would you say this is good?" I would recommend that you do um for me.
3:32:373 hours, 32 minutes, 37 secondsLook, do I use Cloud Code? Yeah, I do.
3:32:403 hours, 32 minutes, 40 secondsUh, do I use cursor? Yeah, I do. I use them all for different things. That's the thing. So, uh, if I'm away from my desk now, I I also have OpenClaw and I
3:32:483 hours, 32 minutes, 48 secondsuse that to do direct uh, things. The way I have things set up, truly, truth be told, when I'm working on actual like my own projects and stuff like that, I
3:32:563 hours, 32 minutes, 56 secondshave a Mac Mini where I have everything kind of set up on it. So, I have uh, my project set up and I can SSH in from my laptop and do all that stuff. Now my
3:33:043 hours, 33 minutes, 4 secondsclawed code lives on my Mac mini and then basically I can dispatch to it and I can use the remote features always because it's always on. Now I also have
3:33:133 hours, 33 minutes, 13 secondsmy open claw living on a Mac mini and I also have some other one living on a VPS for other stuff and those have access to
3:33:203 hours, 33 minutes, 20 secondsthe same local repos that the clawed code is the is going to be able to affect and change. So you see how like the whole thing can work. So I can
3:33:283 hours, 33 minutes, 28 secondseither talk to my open claw which is great at doing some stuff, my claw code which is great at doing some stuff. And when I personally want to code then I'm using cursor. So uh yeah when I'm trying
3:33:383 hours, 33 minutes, 38 secondsto get my hands into things cursor because I can kind of see like exactly what's going on. I can inspect things. I can debug. I can do a lot more cloud
3:33:463 hours, 33 minutes, 46 secondscode. I don't have that visibility but when I'm away from desk it's awesome.
3:33:503 hours, 33 minutes, 50 secondsYeah you know. So okay. So we're we're inside here. It loads. Okay. Now if I
3:33:583 hours, 33 minutes, 58 secondswas to add a pizza. Okay. So firstly that's annoying. We don't have the pizza detail screen. So
3:34:063 hours, 34 minutes, 6 secondsfeedback time. So when I click on a pizza inside of the home screen, it should show me an order
3:34:143 hours, 34 minutes, 14 secondspizza screen where I can select different ingredients for the pizza and uh go ahead and add to the cart. I
3:34:213 hours, 34 minutes, 21 secondsshould also be able to see a badge on the cart for the number of items in the
3:34:273 hours, 34 minutes, 27 secondscart as well as the orders uh in case there's an active order.
3:34:373 hours, 34 minutes, 37 secondsSo, let's fix that. Um but otherwise, let's go ahead and place an order. So, right now, two melting cheese pizzas,
3:34:433 hours, 34 minutes, 43 secondsright? Let's place that order. So, it's pending right now. Okay. So if I go out of this,
3:34:503 hours, 34 minutes, 50 secondshow can we trigger it is my question. So let's have a look. So caching for linear focus. No. No.
3:35:023 hours, 35 minutes, 2 secondsOkay. So we don't see it rendering yet. View details.
3:35:103 hours, 35 minutes, 10 secondsI mean that's actually already kind of better. So we can actually see already a little bit what's going on.
3:35:173 hours, 35 minutes, 17 secondsBut when we exit, it should be able to go ahead and say, but I wonder if it's because we didn't open it from scratch. So, let's go ahead and do that.
3:35:243 hours, 35 minutes, 24 secondsDownloading fresh. Continue tools. Let's see. So,
3:35:353 hours, 35 minutes, 35 secondsso because it's an alpha feature,
3:35:383 hours, 35 minutes, 38 secondstypically it could be like an experimental toggle that I'm assuming we might have to change. Uh also we can actually just go ahead and do command J.
3:35:453 hours, 35 minutes, 45 secondsWe can stop running this. We can do now do D and then we can do Y um MPM no turbo dev. I use so many different package managers, different projects.
3:35:553 hours, 35 minutes, 55 secondsAll right. So that's going to now build that which means our admin panel should run.
3:36:023 hours, 36 minutes, 2 secondsAll right. So uh okay. Yeah. I mean so order comes in confirm the order. Boom. All right. So we can be like start cooking that order.
3:36:113 hours, 36 minutes, 11 secondsBoom. is cooking. Send it out. If we look in the order screen, dashboard order screen on the way.
3:36:213 hours, 36 minutes, 21 secondsMark delivered. So I guess like if we were to see another order come through,
3:36:253 hours, 36 minutes, 25 secondsplace that order. Let's go and see what happens. So
3:36:323 hours, 36 minutes, 32 secondsis that running? Oh, this is not to restart that one.
3:36:393 hours, 36 minutes, 39 secondsOkay, minute. It still issued it. And then that this is a local bug to me. You guys won't experience that.
3:36:453 hours, 36 minutes, 45 secondsThis is something which I I know when this happened roughly as well and I can't figure out why what I did wrong but I screwed something up on my side.
3:36:543 hours, 36 minutes, 54 secondsSo okay. So we can see a new orders come through. You did not execute the previous plan. Yeah, there's one previous plan which we didn't execute
3:37:033 hours, 37 minutes, 3 secondsthe the theme update but I don't think the theme update was for Oh no, it was. You're right. You're right. It was here.
3:37:123 hours, 37 minutes, 12 secondsYeah. All the detail.
3:37:193 hours, 37 minutes, 19 secondsNo. Was it pizza detail? Yeah. But still, um,
3:37:303 hours, 37 minutes, 30 secondslet's let let's let this one do this bit. But yeah, you the chat is locked in. That is so sick that you guys did that. But even stuff like this, right? I
3:37:383 hours, 37 minutes, 38 secondswouldn't have the view details. I just click it like clickable tabs. And again,
3:37:433 hours, 37 minutes, 43 secondsthe shadow effect right here, not very nice. But the fact that we have this nice little slide up is very good. So this already is quite nice. Again, it's
3:37:503 hours, 37 minutes, 50 secondsa bit of wasted space here. But the good news is if we go over here, you can already see that like look by default
3:37:573 hours, 37 minutes, 57 secondsit's real time. So if I was to be like on the back end, hey, we're going to confirm your order. Confirmed. Right. The question is now is when I exit this,
Chapter 28: Debugging + fixing build issues
3:38:063 hours, 38 minutes, 6 secondsI should be seeing a live widget. No. So this microphone.
3:38:143 hours, 38 minutes, 14 secondsSo if I was to go into this.
3:38:183 hours, 38 minutes, 18 secondsSo okay. So I want to test that because I want to figure out and even this like if I confirm confirm the order.
3:38:303 hours, 38 minutes, 30 secondsSo confirm start cooking.
3:38:383 hours, 38 minutes, 38 secondsThis is very h it's my own bug. Okay.
3:38:423 hours, 38 minutes, 42 secondsAnyway, it's we're doing changes here anyway. So, let's see what's going on. So, update native tab show tabs. Then,
3:38:483 hours, 38 minutes, 48 secondslet me update web tabs to show. We don't care about the web tabs for now. Okay. So, this again like I said won't happen.
3:38:573 hours, 38 minutes, 57 secondsAnd again, if you do want to customize it all, you can still use the JavaScript SDK. So, it's a good starting point to do go and do it now. Uh, apps, tabs,
3:39:063 hours, 39 minutes, 6 secondsweb, we don't need that.
3:39:103 hours, 39 minutes, 10 secondsSo, this should have been removed ideally.
3:39:183 hours, 39 minutes, 18 secondsSo, we shouldn't really show the badge if it's zero. active statuses.
3:39:293 hours, 39 minutes, 29 secondsSo yeah, the the point is you can really kind of keep on going through and through and through. My main thing that I kind of like want to get to is really
3:39:373 hours, 39 minutes, 37 secondsI want to showcase. I mean firstly that's kind of cool. Um but it's just this is not nice. Like this is not a good ros.
3:39:483 hours, 39 minutes, 48 secondsOkay. Uh that's fine. Now I'm going to do where's that other plan we want to do? Visual upgrade plan. So uh
3:39:563 hours, 39 minutes, 56 secondsCan I UI? No. No.
3:40:063 hours, 40 minutes, 6 secondsI mean, this was it. So, archived.
3:40:173 hours, 40 minutes, 17 secondsYou know what? Screw it. I'm just going to build it. There you go. Okay. I can't find everything. So for now, let's just see what happens. Let it build.
3:40:273 hours, 40 minutes, 27 secondsAll right. So, let that install.
3:40:363 hours, 40 minutes, 36 secondsBut you you get the point, right? It's quite quite cool. Uh Damon says, "So far it's been working, but just looking at different methods, it didn't too much credit." Yeah. The main thing you want
3:40:443 hours, 40 minutes, 44 secondsto look for when using any AI coding platform, okay, is really around even this this is not nice. this could be way nicer like you know it could be
3:40:533 hours, 40 minutes, 53 secondsseparated and kind of everything you can really kind of make this clean and clear and also use icons and so forth. Um
3:41:023 hours, 41 minutes, 2 secondsuh so in the admin panel separate each of the
3:41:103 hours, 41 minutes, 10 secondsorders so that so that uh we can clearly see a timeline
3:41:193 hours, 41 minutes, 19 secondsbetween different states and also I can see exactly what's cooking what's on the way to be delivered I can see what's confirmed I should be able to see that
3:41:273 hours, 41 minutes, 27 secondsin a clear g glance sep separated uh with the most important things needing my attention at the top. So like pending
3:41:343 hours, 41 minutes, 34 secondsorders for example. Um yeah, make it make it a lot more user friendly and stop with the random colors. I want to use icons that make sense for the kitchen to be able to use.
3:41:483 hours, 41 minutes, 48 secondsCopy this, paste it over there. Boom.
3:41:513 hours, 41 minutes, 51 secondsAnd again, like look, I'm burning through tokens heavier now because I'm being a bit kind of gung-ho. The way you should be doing this correctly is going ahead and making sure you use, you know,
3:42:003 hours, 42 minutesplan mode and stuff like that. But yeah,
3:42:043 hours, 42 minutes, 4 secondsit's just it's just worth mentioning that now uh X widgets right here. Okay, so we've already configured this.
3:42:123 hours, 42 minutes, 12 secondsSo now I want to go ahead and make sure cuz if I can get widgets working. I'm not too worried about the payment flow.
3:42:173 hours, 42 minutes, 17 secondsLike in the end of the day, the payment flow is there's got lots of repos. I honestly if you've gotten this far, you can get the payments set up pretty quick. But we'd have to set up Stripe
3:42:253 hours, 42 minutes, 25 secondsand a bunch of other stuff. Right now, I would be more inclined to be like show to show you uh and the cart screen. This
3:42:333 hours, 42 minutes, 33 secondsis breaking because we're doing a bunch of changes here. Yeah. So, let's cut the app. But I'd be more inclined to show you uh like just so you know, when you
3:42:433 hours, 42 minutes, 43 secondsplace the order here, you can make it fixed to the bottom as well. When you place the order here, or typically they have the place order at the top as well.
3:42:493 hours, 42 minutes, 49 secondsUm you can have it. So at this point the payment intent pops up you know connects to your API or your back end you can use
3:42:573 hours, 42 minutes, 57 secondsexpo API for them routes as well um all that stuff can be happen at this point and then if it goes through at that point it clears the cart it submits the
3:43:063 hours, 43 minutes, 6 secondsorder and that's when it goes through to the back and then you see the back table or the back office they typically will have that view that I've shown you
3:43:143 hours, 43 minutes, 14 secondspreviously so the the admin we've we've cut off now but the admin panel so structure is correct Now I need to
3:43:213 hours, 43 minutes, 21 secondsupdate the references and and of course in this instance guys what have I not done? Right? So obviously I haven't
3:43:293 hours, 43 minutes, 29 secondsactually done an onboarding flow which says where should the food get delivered to. So right now an order just goes out
3:43:363 hours, 43 minutes, 36 secondsand there's no delivery address. So things like that. Obviously we're in a live stream. We're in a demo right now.
3:43:423 hours, 43 minutes, 42 secondsBut you can easily get that implemented by saying uh I need an onboarding flow where typically we can select an address
3:43:503 hours, 43 minutes, 50 secondsand then we can also go ahead and um you know change our address when it we're inside the cart screen. So I can be able
3:43:583 hours, 43 minutes, 58 secondsto select from previously saved addresses as well as go ahead and um
3:44:083 hours, 44 minutes, 8 secondsselect from my addresses. I should only be able to see my own addresses for a logged in user.
3:44:153 hours, 44 minutes, 15 secondsUm yeah, so you see what I mean? So like these kind of flows you would need to go ahead and build. So of of course on top of this you could have your address
3:44:223 hours, 44 minutes, 22 secondsdelivered to and then you can add in logic for example which could be along the lines of um basically like geoloc.
3:44:313 hours, 44 minutes, 31 secondsSo for example, Papa's Pizza only delivers to people in Dubai, right? So that way if you're in Dubai with a 30 mile radius, you can actually use
3:44:393 hours, 44 minutes, 39 secondssomething like the H have a scene formula. So AI is very good at that. And basically it'll determine if you're close enough within that 30 m radius
3:44:463 hours, 44 minutes, 46 secondsfrom your current location. Um but that those things are all easy to do with expo by the way uh with AI and expo.
3:44:533 hours, 44 minutes, 53 secondsLike you can literally just put this in and uh I can say help design when it help design how this how this would
3:45:013 hours, 45 minutes, 1 secondlook. And basically already this will kind of give you a really good starting point. But I just want to show you because the last build we actually did
3:45:093 hours, 45 minutes, 9 secondsuh the geol location. I think we did go no we didn't do um expo in last build.
3:45:143 hours, 45 minutes, 14 secondsBut yeah it's not hard to do that is the point I'm trying to make. Right. So command E. Let's do the admin panel. So we've got a few things happening. We've got the UI changes being made over here.
3:45:273 hours, 45 minutes, 27 secondsSo these are doing a bunch of UI stuff. Admin panel is being changed as well.
3:45:343 hours, 45 minutes, 34 secondsRedesign kitchen restaurant by says for clear visual hierarchy meaningful icons and again you know like when it comes to these styles like there's certain skills
3:45:433 hours, 45 minutes, 43 secondsthat you can use out there. There's JSON prompts that you can give which are a lot more explanatory. Uh I'm being a bit like again gung-ho with this uh to try
3:45:513 hours, 45 minutes, 51 secondsand get it to a quick point that we can get working. And if you want to make something responsive use something called container queries. They're a lot more better and that's what you want to effectively be using. Okay. Um Oops.
3:46:043 hours, 46 minutes, 4 secondsI've got a I had a phone call come on when I was live that shouldn't have come through.
3:46:093 hours, 46 minutes, 9 secondsIt's very strange. Okay. So now uh let's have a look. So yeah. So order detail page.
3:46:193 hours, 46 minutes, 19 secondsOkay. So that's good. This one is almost done. Or not really.
3:46:263 hours, 46 minutes, 26 secondsthree out of eight. Why was it on debug mode? No, agent mode. Yeah. And also any questions, by the way. So,
3:46:343 hours, 46 minutes, 34 secondslet me know like any questions of what you want me to showcase for this app because my ideal goal right
3:46:413 hours, 46 minutes, 41 secondsnow would be to get the live widgets working.
3:46:453 hours, 46 minutes, 45 secondsThat would be like the awesome awesome outcome from this build to be honest. If I can show you live widgets live on stream. So, let's see. So, I'm just
3:46:543 hours, 46 minutes, 54 secondsgoing to do another one. Say, uh, we set up live widgets. However, they currently aren't showing. Debug why by reading the
3:47:033 hours, 47 minutes, 3 secondsdocumentation and analyzing the codebase. Literally said why debug why um,
3:47:123 hours, 47 minutes, 12 secondsso keep that in plan mode be a bit more effective. Keeping to understand. So, for example, on boarding flow, right? Look, clerk sign in has saved address.
3:47:203 hours, 47 minutes, 20 secondsNo, reaches on boarding screen. Save address. Tab navigator cart screen right tab navigator is what we already have.
3:47:273 hours, 47 minutes, 27 secondsSo then we have the um on the cart screen select existing address picker bottom sheet or change address and add new takes you to the add address form.
3:47:363 hours, 47 minutes, 36 secondsSo this is cool. Yeah. And then of course new addresses table uh all functions authenticate via
3:47:433 hours, 47 minutes, 43 secondscontext or get user identity and filter by user ID token. So users only see their own addresses. Yeah. on boarding
3:47:513 hours, 47 minutes, 51 secondsgate modify to add an onboarding check after sign in. Uh you can also add a I would definitely add in a strict check
3:47:583 hours, 47 minutes, 58 secondshere to make sure no one could ever access someone else's. So you can obviously add that in yourself. Uh a full screen view with welcome header which we deliver to subtitle address
3:48:073 hours, 48 minutes, 7 secondstext input for entering delivery address pill buttons for home work other continue design notes match existing epic text card screen address card and picker.
3:48:183 hours, 48 minutes, 18 secondsNow, of course, you could do, you know,
3:48:203 hours, 48 minutes, 20 secondsat this point, you've also got location stuff. So, you've got like maps, Lego expo maps. Uh, if you type in here,
3:48:273 hours, 48 minutes, 27 secondsyou've got maps. So, this effectively allows you to have maps inside of your app. Um, so in this case, look, Apple Maps for iOS, Google Maps for Android.
3:48:383 hours, 48 minutes, 38 secondsUm,
3:48:403 hours, 48 minutes, 40 secondsand basically, you don't have to configure anything with Apple Maps.
3:48:423 hours, 48 minutes, 42 secondsGoogle Maps you have to go ahead and do uh for exclusive Android. So if you want to use Google on iOS, you can use it for writing your own while Google provides a
3:48:503 hours, 48 minutes, 50 secondsGoogle iOS. Um it's it's simple permissions and then
3:48:573 hours, 48 minutes, 57 secondsit's yeah based on which platform renders out. So you could then implement you know pin drops kind of you know search
3:49:063 hours, 49 minutes, 6 secondsfunctionality all that stuff yourself but I'm not going to get into that. I just want to highlight that that would be something which is obviously
3:49:153 hours, 49 minutes, 15 secondscrucial. So when you then you can basically have it so when you navigate through the uh different statuses it will say okay deliver to this address
3:49:243 hours, 49 minutes, 24 secondsand then you know you can have another segment which delivery drivers maybe log to and then they can have a different row and then they only see them. So you
3:49:323 hours, 49 minutes, 32 secondssee what we've done here like I've I've kind of set up the architecture to go ahead and let you do these things reading upload project related code and
3:49:403 hours, 49 minutes, 40 secondsfetching this projectaneously view let me check where the hook should be consumed whether I tree with the preload so yeah I mean to be honest
3:49:483 hours, 49 minutes, 48 secondsrather than all that I'm going to have a look myself so after widgets um So,
3:50:033 hours, 50 minutes, 3 secondsI want to jump into here and do this one.
3:50:123 hours, 50 minutes, 12 secondsCommand E. Command B.
3:50:163 hours, 50 minutes, 16 secondsSo, command I. All right. So, MPX expport. No, not here. Sorry. So, CD
3:50:223 hours, 50 minutes, 22 secondsapps app. uh MPX export install export widget. So firstly we should have it should have installed that. So I want to make sure that that is installed.
3:50:373 hours, 50 minutes, 37 secondsSo so it looks like some that was very
3:50:453 hours, 50 minutes, 45 secondsinteresting actually package JSON. So package
3:51:043 hours, 51 minutes, 4 secondsI don't think this was added a second ago,
3:51:083 hours, 51 minutes, 8 secondswhich is obviously a big no no. So again, don't trust AI, guys. See, to do your job. Um, app.json. And this is kind
3:51:163 hours, 51 minutes, 16 secondsof why I want to live stream it because you'll see tutorials all over the place where it's like AI did everything for me.
3:51:233 hours, 51 minutes, 23 secondsI will show you firsthand with like 25 I don't know how long it's been now. I'm not very crazy. Like 17 years coding
3:51:323 hours, 51 minutes, 32 secondsexperience. I think it is 17 years. I've been coding for like ages now. I'm telling you. Yeah, I won't do it right. Widgets. Widgets.
3:51:403 hours, 51 minutes, 40 secondsHere we go. Yeah. See that? did not do it inside of expo widgets. No, it did do widgets.
3:51:473 hours, 51 minutes, 47 secondsYeah, my bad. Um, display name description.
3:51:533 hours, 51 minutes, 53 secondsOkay, you configure if you if you use config in your project. This plugin.
3:52:013 hours, 52 minutes, 1 secondOkay,
3:52:023 hours, 52 minutes, 2 secondsfor example, with all options, enable push notifications. True. Bundle identifier.
3:52:133 hours, 52 minutes, 13 secondsOkay. Sport families. Pizza status widget. Detail widget. Pizza order widget. Okay. Typed routes for a compiler.
3:52:243 hours, 52 minutes, 24 secondsPrerequisite creating a widget. Use marked with a widget directory. So is it marking it with a widget
3:52:333 hours, 52 minutes, 33 secondsdirectory? No. You see this is what I mean.
3:52:373 hours, 52 minutes, 37 secondsThis is where it just completely hallucinated that. So like widget, where's our widget? Pizza order widget.
3:52:443 hours, 52 minutes, 44 secondsOkay. Oh, okay. No, I did do it. I'm kind of hating on AI too quickly, aren't I? So in this case, okay, it worked
3:52:523 hours, 52 minutes, 52 secondsthere. Locked in blow state 100%. Widget name my widget must match name basic widget and effective way to update widgets. Use update snapshot method.
3:52:593 hours, 52 minutes, 59 secondsCreate widget line update snapshot. So this is from our hook.
3:53:093 hours, 53 minutes, 9 secondsHow's active order false? So the question is is this firing off is the is the main thing. And also let's just check on what our AI is saying. So um I
3:53:183 hours, 53 minutes, 18 secondshave comprehensive debug expo widget. So use pizza live activity hook is never consumed. What? That is crazy. That's
3:53:273 hours, 53 minutes, 27 secondshow it does everything. Without this hook being called, the widget has zero data to display and live activities in that's okay. That's that's why pizza
3:53:343 hours, 53 minutes, 34 secondsorder activity missing from widget config. Issue three development build required. Yeah. So there you go. Okay.
3:53:443 hours, 53 minutes, 44 secondsBuild that cuz I want to I want to get live activities working. This is like a mission of mine to get live activities working on this on this stream. I will
3:53:533 hours, 53 minutes, 53 secondsnot fail. I will get that done. On boarding flow. The onboarding flow I'm not going to spend tokens on. Like I told you guys how that would work. The modal bottom sheet would be the one that
3:54:013 hours, 54 minutes, 1 secondswipes up from the bottom. You can build that however you want. You can even just have it as separate screens honestly. Um but I would love to actually have the zoom in.
3:54:123 hours, 54 minutes, 12 secondsOkay, let's let this do it first because we've done a bunch of changes. We did a ton of changes to the entire phone visual.
3:54:203 hours, 54 minutes, 20 secondsLook pizza detail explorer image um haptics as well. So, we have haptics for everything, by the way. So, when you tap
3:54:273 hours, 54 minutes, 27 secondsinto different food and everything like that, it will have haptic feedback.
3:54:323 hours, 54 minutes, 32 secondsBut the main thing is this. Let's get this done now to the point running the pre-build. So, I actually want to stop there and I will do the pre-build. So,
3:54:443 hours, 54 minutes, 44 secondslet's do the pre-build ourselves. MPX expo. Oh, cannot read property joined.
3:54:513 hours, 54 minutes, 51 secondsPre-build failed.
3:54:553 hours, 54 minutes, 55 secondsI tried doing myself and got this
3:55:093 hours, 55 minutes, 9 secondsexpo widget stream added to it. It's missing the support families field. I don't really understand reading join. Okay,
3:55:193 hours, 55 minutes, 19 secondsso maybe we should let it do this thing.
3:55:213 hours, 55 minutes, 21 secondsOkay, because supported families in every widget entry and crashes when it's undefined.
3:55:313 hours, 55 minutes, 31 secondsSo it needs supported families. Yeah.
3:55:473 hours, 55 minutes, 47 secondsI mean kind of just do for families can be more hopefully
3:55:543 hours, 55 minutes, 54 secondsall creates swift file for each piece activity shouldn't be in the widgets area at all widget activity.
3:56:043 hours, 56 minutes, 4 secondsSo it's actually diving into the source code looking at need to remove piece of order activity.
3:56:103 hours, 56 minutes, 10 secondsOkay, we need to see if we need this actually needs to go in there because
3:56:213 hours, 56 minutes, 21 secondsyeah, it doesn't. The actual order activity doesn't need to go in there.
3:56:293 hours, 56 minutes, 29 secondsNow, let me do the rebuild again. So,
3:56:323 hours, 56 minutes, 32 secondsthe actual difference, by the way, of the two is a widget is the actual, you know, like a widget that you might see.
3:56:383 hours, 56 minutes, 38 secondsI don't know if you can see one, but those widgets that we see on our phone,
3:56:413 hours, 56 minutes, 41 secondsright? Um, oh, what's this? Updating the pods. Something wrong. Run pods install.
3:56:523 hours, 56 minutes, 52 secondsOkay.
3:56:593 hours, 56 minutes, 59 secondsBuild is the pre-build. The failure is on pod install due to reanimated workless version. This is unrelated to the widget. Let me fix it. So error is reanimated failed to validate work list.
3:57:103 hours, 57 minutes, 10 secondsSo that we saw actually previously.
3:57:143 hours, 57 minutes, 14 secondsSo I'm wondering if that was although it just added the package so
3:57:243 hours, 57 minutes, 24 secondsmaybe that's why. Good. I remember I actually removed them earlier because then Android I know Android apparently had an issue with that but we'll see.
3:57:333 hours, 57 minutes, 33 secondsOkay. So found the issue again.
3:57:433 hours, 57 minutes, 43 secondsSo you see it was here us failed to validate work that's
3:57:553 hours, 57 minutes, 55 secondsanimated. I like how you know what you're doing. Meanwhile, I would have just believed what AI has done and just go with the flow. I appreciate that.
3:58:013 hours, 58 minutes, 1 secondThat's actually uh really helpful. I appreciate that. Trust me, it's just tons and tons of practice. Um because
3:58:093 hours, 58 minutes, 9 secondsthe thing is, you see, like, and this is kind of why I want to show like the the truth behind if you're vibe coding, like yeah, I I I do it all the time, but the
3:58:163 hours, 58 minutes, 16 secondsreality is is like it does not do like you have to call it out on what it's doing. Like even here, look, there is reanimated 421 requires boxes. It just
3:58:243 hours, 58 minutes, 24 secondsallows you to be really fast at like building things out. But sometimes you hit a wall where it creates a lot of
3:58:313 hours, 58 minutes, 31 secondscrap and you have to like fix it the the rubbish which would have may have been quicker just doing it yourself. But ultimately once you get to a good base
3:58:403 hours, 58 minutes, 40 secondsand you have the good rules and skills and everything set up like I'll be honest when I work on my own projects my setup is so locked in. Like it's so good
3:58:473 hours, 58 minutes, 47 secondsand my agents are so like tight with the way that I like to code. So, if you do want to know about all of that, then
3:58:543 hours, 58 minutes, 54 secondsdefinitely I'll pop it in the description. It's the third link in the description. Go ahead and join our community, Zero to AI Agent Hero. So,
3:59:033 hours, 59 minutes, 3 secondsbasically, it's it's how I'm going to show all of that stuff cuz that needs a whole community to be able to teach that. Um, and that's what exactly what
3:59:103 hours, 59 minutes, 10 secondsthat's going to be for. So, uh, the link is in the description, third link. U make sure you go check it out. Um, but that's basically where I'm going to be
3:59:183 hours, 59 minutes, 18 secondsreally helping out with that side of things. So now it's building which is good. Okay, that's awesome. Expo target directory was generated index of swift.
3:59:263 hours, 59 minutes, 26 secondsNow let me ro them. This is good. Okay,
3:59:283 hours, 59 minutes, 28 secondswe we debugged it. We got past it. And to be honest with you, it's kind of crazy that like in look in 4 hours while
3:59:363 hours, 59 minutes, 36 secondsI'm teaching it, while I'm explaining it while there was no prep work at all.
3:59:413 hours, 59 minutes, 41 secondsLike literally the only prep that I might have done is just like tinker with a few things. Um the setup was crazy though. Uh the setup, trust me when I
3:59:503 hours, 59 minutes, 50 secondssay it was more about things which I probably could have done a little bit better like and done a neat slute like kind of setup
3:59:583 hours, 59 minutes, 58 secondssetup approach too. And remember most of the time as well not everyone needs a monor repo right so that's the truth of it. Uh, Cohen says,
4:00:084 hours, 8 seconds"The cool thing is with using AI, first you start blank. Along the way, you create your own skills, repetitive things, UX, UX, UI, UX guidelines, set of guidelines, best practice, and after
4:00:164 hours, 16 secondsa while it's like bam. Yeah, 100%. Like there's a moment when your rules are like really dialed in and then sometimes they can fall off and a few things can
4:00:254 hours, 25 secondshappen like that, but it can be pretty damn awesome when things work. Okay, I think this is looking very good.
4:00:324 hours, 32 secondsLook, executing export widgets pods.
4:00:344 hours, 34 secondsThere we go. This is all for the export widgets. It's taking a little bit longer. I'm happy with this.
4:00:474 hours, 47 secondsBut one thing I definitely will say is that the way um the way that uh Clerk and Expo are moving when it comes to development,
4:00:584 hours, 58 secondsthey guys, they're just so they're ahead of everything. I'm telling you. Like just trust me on that front. I've coded for like 17 plus years. These guys know
4:01:064 hours, 1 minute, 6 secondswhat they're doing. Like they know what they're doing and they're building awesome stuff. So like if you're not using it or you're debating it like oh
4:01:144 hours, 1 minute, 14 secondsyou Oh. Oh nice. That's actually kind of cool. That's actually kind of cool.
4:01:194 hours, 1 minute, 19 secondsYeah. Okay. That was part of the new change. We click into a pizza. O look at that. That is sick. Okay.
4:01:284 hours, 1 minute, 28 secondsOh, that's nice. All right. Look at that. Add to cart. Boom. Did it add to the car? Melting cheese, chicken,
4:01:354 hours, 1 minute, 35 secondsmushroom, pepperoni. Yeah. So, it got rid of the badges, which is kind of annoying. My orders look like like crap.
4:01:404 hours, 1 minute, 40 secondsBut this is a this is a very good design, though. Look at that. Oh, I like this. Like, that's so cool. That's very
4:01:484 hours, 1 minute, 48 secondsnice. Watch my cheese boys. Let's add this to the cart.
4:01:544 hours, 1 minute, 54 secondsOkay. And you should be able to I mean look you can add edit edit uh ed edit flows and all that stuff but if we go into this okay I mean that is I don't
Chapter 29: Polish, cleanup, and final improvements
4:02:014 hours, 2 minutes, 1 secondknow what's going on here. This is just this is where I got a bit confused but the point is that this is kind of cool.
4:02:094 hours, 2 minutes, 9 secondsSo I mean obviously these are dummy right now. Um but still that's kind of slick like I'll be honest it's got weird spacing at the top but you can go ahead and do that.
4:02:174 hours, 2 minutes, 17 secondsHow did you implement the apple like blur and the n bar? This was all the native uh elements that we used. So, this was actually down to the stack. Uh,
4:02:254 hours, 2 minutes, 25 secondsone second. Let me do Let me actually show you guys. Let's Let's firstly test the the um $40 for pizza. Uh, place
4:02:344 hours, 2 minutes, 34 secondsorder. Let's just test this out first cuz I really want to see this. So, right now we have a pending order. Okay. So, his order is pending.
4:02:424 hours, 2 minutes, 42 secondsOkay. Now, okay. Oh, actually, it's a widget,
4:02:474 hours, 2 minutes, 47 secondsright? So maybe I have to add search widgets. Uh I mean is it pizza?
4:02:564 hours, 2 minutes, 56 secondsNo way. No way. Okay. I mean like that's kind of cool.
4:03:034 hours, 3 minutes, 3 secondsSo we have a widget. Wait. Okay. What am I doing right now? Okay. So I mean right now
4:03:124 hours, 3 minutes, 12 secondsit's not styled very good, but like we have a widget and if I click it takes me to that order. So, if I'm out here and I
4:03:194 hours, 3 minutes, 19 secondsgo ahead and do Okay, I mean it didn't take me to the exact page, but you can deep link that. You can actually deep link that nicely.
4:03:274 hours, 3 minutes, 27 secondsSo, firstly, that's good. Okay. Now, if I'm here, let's go into I wonder does a widget up update dynamically. So, if we're This is a very very cool test.
4:03:374 hours, 3 minutes, 37 secondsWow. So,
4:03:394 hours, 3 minutes, 39 secondscommand uh I mean the background show is running. Let's crush it. Let's do dot dot dot dot back. Let's do turbo dev.
4:03:514 hours, 3 minutes, 51 secondsRun it. Okay. Now iOS. Let's just firstly run it up. So iOS.
4:03:594 hours, 3 minutes, 59 secondsHere we have it. Hit refresh. Oh my god, so much stuff happening. Um,
4:04:104 hours, 4 minutes, 10 secondsgo to the orders. Yeah. Okay. Oh, this is cool. Okay, pending cooking. This is nice. We're getting Well, okay. We're getting there. We're getting somewhere,
4:04:194 hours, 4 minutes, 19 secondsright,
4:04:214 hours, 4 minutes, 21 secondsso this is already looking a bit more clean. So, now we're inside the app. Okay. I mean,
4:04:294 hours, 4 minutes, 29 secondsthis weird header is kind of jarring me out, but uh and also some stuff can definitely be improved. But if we're here now, so that I'm pending. Okay. So,
4:04:374 hours, 4 minutes, 37 secondslet's go into here. Confirm the order.
4:04:404 hours, 4 minutes, 40 secondsSo, confirm order. There we go. Now we're in confirm state. Okay. And then cooking. So now it's in cooking. You
4:04:494 hours, 4 minutes, 49 secondscould probably improve this, but now you can see like two orders are cooking. You can see the customer, their number. Um I
4:04:574 hours, 4 minutes, 57 secondsguess if they have customer number, you could probably put their name and details in and maybe phone number and stuff like that. Once you're Yeah, like you can really go in depth with this,
4:05:044 hours, 5 minutes, 4 secondsright? Um but moment of truth.
4:05:084 hours, 5 minutes, 8 secondsSo no way. Okay. So, if I do send for delivery, I don't know if that was the right one, but I think it might have been this one. So, ultimate 41. Okay,
4:05:194 hours, 5 minutes, 19 secondsit's this one. Oh, so oops. So, let's try it. So, send for delivery.
4:05:244 hours, 5 minutes, 24 secondsSo, does it update like in real time or I mean to be fair, I don't know. That might be real with how this thing works.
4:05:314 hours, 5 minutes, 31 secondsSo, if you're here on the way and then you come out. Okay. So, what's happening? This is cool actually. So when you're on the app, there's a
4:05:394 hours, 5 minutes, 39 secondshandler that I remember that basically a setup. So the handler made sense now. So it was use live pizza activity. So this
4:05:474 hours, 5 minutes, 47 secondsone, so this is obviously only mounted when you're um it's mounted when you're you're not in focus, right? So use
4:05:564 hours, 5 minutes, 56 secondseffect is mounted when you're not in focus, but I assume you could also have this on a background activity flow. So like you could have that on the
4:06:034 hours, 6 minutes, 3 secondsbackground activity, but still that's pretty sick. Like I'm pretty happy with that. So like imagine like your again ignore the UI. We can make that look
4:06:114 hours, 6 minutes, 11 secondspretty cool, right? So here like if I was to go ahead and do JSON correction.
4:06:164 hours, 6 minutes, 16 secondsSo we could say uh what I like to do here is I just screenshot this and that is pretty that is awesome. All right. So two things. So two things.
4:06:274 hours, 6 minutes, 27 secondsNumber one I want to improve the UI of the widget. Number two,
4:06:314 hours, 6 minutes, 31 secondsbecause the update snapshot is happening inside of a user effect, it's only when the app is
4:06:384 hours, 6 minutes, 38 secondsopen that the snapshot is updated and that we see a reflection of on the
4:06:454 hours, 6 minutes, 45 secondswidget's activity. Is there a way that we can run even in the background
4:06:524 hours, 6 minutes, 52 secondsso that the snapshot for the widget remains real time even when the app isn't in focus or like in the app is in the background?
4:07:014 hours, 7 minutes, 1 secondSo this is a this is a really nice thing actually to be fair because uh wow I'm I'm proper liking this. This is very
4:07:094 hours, 7 minutes, 9 secondscool. So let's go back over to here.
4:07:154 hours, 7 minutes, 15 secondsOkay. So, first things first is just to showcase the the backend panel because I kind of want to wrap up on the backend panel. I want to showcase a few more of these things which I think is awesome.
4:07:254 hours, 7 minutes, 25 secondsUm, and then the main thing is here. But yeah, I hope everyone can kind of see that the the point of these uh tutorials
4:07:334 hours, 7 minutes, 33 secondsnow is mainly not about like you know in one sitting getting the ultimate perfect app because yeah I could burn through a million tokens and get there like it's
4:07:424 hours, 7 minutes, 42 secondsmainly to kind of showcase to you the process in which we we we did that whole thing. Look at that completing cancelled. Nice. Um that's pretty cool.
4:07:494 hours, 7 minutes, 49 secondsAnd if we click view I can also see oh that see that is nice. That is really cool. Right. That's like a very nice uh
4:07:574 hours, 7 minutes, 57 secondsUI, right? So, and obviously you can make it go back and forth if you wanted to do that, but in this case we're just doing mark delivered. So, order has been delivered. This error fail to fetch us.
4:08:074 hours, 8 minutes, 7 secondsI don't know what that is. But in this case, we do menu. Let's look at the menu.
4:08:124 hours, 8 minutes, 12 secondsEven for these, I don't I'm not sure why this is taking quite long, but
4:08:194 hours, 8 minutes, 19 secondsokay. But in this case, you can see different pizzas. And this is cool. Like if you think about different popular payment platforms out there, like in this case, if I click on edit, so edit a melt and cheese pizza. What is that?
4:08:304 hours, 8 minutes, 30 secondsRight? Melting cheese pizza. Give it a category. Let's just say it's an Italian pizza. It's available. Show it on the customer's menu. Save changes. Right?
4:08:384 hours, 8 minutes, 38 secondsIngredients. So these could be like toppings, I guess, is a better word for it. So toppings for this, you could go ahead and add different ingredients now. So let's just say for example, image.
4:08:474 hours, 8 minutes, 47 secondsYou can go ahead and upload. Upload functionality works. You can have weight, different things also. Is it available? So, let's say you ran out of pepperoni. All they have to do is go to the back end, toggle pepperoni.
4:08:574 hours, 8 minutes, 57 secondsPepperoni is now unavailable. And then over here, if I want to get a melting cheese pizza, I can't believe I'm saying this on a stream. It's kind of crazy.
4:09:054 hours, 9 minutes, 5 secondsUh, see, there's no pepperoni. Kind of cool, right? So, if I go over here now and I toggle pepperonis now available. Look how real I need to show you this.
4:09:144 hours, 9 minutes, 14 secondsThis is too cool. This is sick. I don't even think that the actual I don't even think the vendors that actually give you
4:09:214 hours, 9 minutes, 21 secondsthis services right now in real world app like real world production land right now they don't even offer this right but say for example that pepperoni
4:09:294 hours, 9 minutes, 29 secondsjust quickly got out of stock boom immediately in real time it'll update same with chicken no more no more chicken left in the in the kitchen oh we just ran out of mushrooms cool oh damn
4:09:384 hours, 9 minutes, 38 secondsit someone just came back in delivered pepperonis boom you see like that's pretty cool right you can have obviously some logic around Maybe like if we
4:09:484 hours, 9 minutes, 48 secondsalready added the pepperoni in the cart before you go to check out, you can say,
4:09:514 hours, 9 minutes, 51 seconds"Oh, actually the pepperoni just ran out." The point is, you get the point.
4:09:544 hours, 9 minutes, 54 secondsLike, it's kind of cool. Like, it's quite fun, right? So, we've got this flow working pretty cool. This is admin gated, right? And of course, you can go
4:10:014 hours, 10 minutes, 1 secondahead and add in different items in the in the pizza menu and stuff. So, you can add different pizzas in. So, if I was to go ahead and type in, for example, Papa Fam special and type in the best pizza,
4:10:144 hours, 10 minutes, 14 secondsright? and then go ahead and do like a specialtity. Say it's 19.99.
4:10:204 hours, 10 minutes, 20 secondsPrep time is 90 minutes. Super not like long to make, but it's really worth it.
4:10:244 hours, 10 minutes, 24 seconds1,200 calories cuz it's for it's just worth it. And then click on upload image. And then let's go ahead and just say it was um YouTube watermark. So
4:10:324 hours, 10 minutes, 32 secondsyeah, the Papa Fam logo, right? Create the pizza. Now watch this. So we're creating a pizza. And now is that pizza
4:10:404 hours, 10 minutes, 40 secondsin here? Oh, look. There's a Papa Fam special, guys. Look at that. Wow. Boom. Right. And let's say for example,
4:10:474 hours, 10 minutes, 47 secondsactually the Hawaiian delight, we're no longer serving that. Boom. That's pretty cool. Now, of course, right now, if it's a whole row, it's just going to show
4:10:554 hours, 10 minutes, 55 secondsthat. So, we can make it obviously use only this. But now, I can order a Papa Farm special pizza, a large one,
4:11:014 hours, 11 minutes, 1 secondpepperoni with extra cheese. Go ahead and add it to my cart. Boom. I can buy that. It's kind of cool. Kind of cool.
4:11:084 hours, 11 minutes, 8 secondsRight. Someone's got a good question here. Is convex. This real time update.
4:11:124 hours, 11 minutes, 12 secondsYeah, Convex is doing real time updating. All right, so uh Dippin says,
4:11:164 hours, 11 minutes, 16 seconds"Hey, I want to know how to integrate Clerk in production mode and also payment integration as well. Can you please do it in production mode and other?" So, two things. One, if you want
4:11:234 hours, 11 minutes, 23 secondsto do uh payments, check out Stripe and Expo, right? They have a very good integration. I don't think we're going to cover it today cuz time wise, but if
4:11:304 hours, 11 minutes, 30 secondsyou type in Expo, Stripe pretty much follow this, right? So, do the same thing that we've been doing today for the implementations. Like I said, you need the onboarding for the address and
4:11:384 hours, 11 minutes, 38 secondsall that stuff. But in this case, this will literally run you through the entire thing, right? So, this will take you through the entire flow to get payments setting up set up with Expo,
4:11:474 hours, 11 minutes, 47 secondsright? So, that's one thing. Two, for switching to, let's say, for example, we just built our app. It's it's freaking out right now because we're doing a bunch of changes on the back. So, yeah.
4:11:584 hours, 11 minutes, 58 secondsUm,
4:12:014 hours, 12 minutes, 1 secondyeah. Uh number two is that the once you're finished on um got so many
4:12:084 hours, 12 minutes, 8 secondsthings open once you're finished on clerk for example let's say for example we're ready to go to production then you simply go ahead and click on create production instance clone the
4:12:174 hours, 12 minutes, 17 secondsdevelopment instance click on continue and then you start following through some of the setups right so in this case you would have a domain you have a few
4:12:244 hours, 12 minutes, 24 secondsthings set up and this is where you would go ahead and toggle this and then you'd basically go and uh set things up And they've made it very very simple to
4:12:324 hours, 12 minutes, 32 secondsgo ahead and do that. Okay. So you do that and you basically follow ahead and EAS make it very simple to de uh deploy
4:12:404 hours, 12 minutes, 40 secondsyour app as well. So EAS expo deploy EAS hosting I believe it was you web this is
4:12:474 hours, 12 minutes, 47 secondsfor web projects deploy expo router and react app and they have a this is fairly new
4:12:544 hours, 12 minutes, 54 secondsactually this one. Yes login prepare your project. So single page app this is for uh yes but for deploying the actual
4:13:044 hours, 13 minutes, 4 secondsapp they've got stream oh this is cool submit this is new uh
4:13:124 hours, 13 minutes, 12 secondsrelatively new I believe so upload your app to the play store from the cloud with a single command yeah submit so
4:13:184 hours, 13 minutes, 18 secondsit's very very it's quite nice honestly how it can happen so yeah there's a few things you can do
4:13:264 hours, 13 minutes, 26 secondsbut I think in order to showcase the entire deployment side of things. I should make a dedicated video. So, let me know if that's worth, you know, you
4:13:334 hours, 13 minutes, 33 secondsguys want to know how to do that entire thing. Leave comments right now asking for it. And what I'll do is Jay will screenshot those comments and send it in
4:13:414 hours, 13 minutes, 41 secondsmy chat and then basically we can go ahead and speak to the uh guys over at Expo and we can make a video together for that because I think it'll be handy.
4:13:494 hours, 13 minutes, 49 secondsUh, but I need to I need you guys to voice it up right now so that way I can go ahead and do that for you. So, go ahead and drop a comment if you want me to make a video on that.
4:13:574 hours, 13 minutes, 57 secondsYeah, set enable push true and export widgets. Okay, so uh let's
4:14:034 hours, 14 minutes, 3 secondsgo ahead and do turbo dev now and then I IOS.
4:14:134 hours, 14 minutes, 13 secondsOkay. Um Okay, so we have the app open again. Let's place the order. We have three cheese pizzas. These ones again.
4:14:214 hours, 14 minutes, 21 secondsThat looks horrible right now, but the UI is not the main thing. Papa pizza.
4:14:254 hours, 14 minutes, 25 secondsSo, h okay, that didn't that doesn't look very good. That doesn't do do anything. But
4:14:344 hours, 14 minutes, 34 secondsso, I think either the build didn't build correctly or and also I want to check what it did.
4:14:434 hours, 14 minutes, 43 secondsSo, enable push notifications for live activities. JSON.
4:14:484 hours, 14 minutes, 48 secondsSo, first need to find. So let me just say explain what you so so live activities can receive push
4:14:564 hours, 14 minutes, 56 secondsupdates via APN. Oh okay you have to set up APN. So this is separate. You need to send a push token to instance get to your back end. Send APN to when you
4:15:044 hours, 15 minutes, 4 secondsorder status changes. So okay you'd have to set up push notifications for this to work right. Um makes sense actually cuz
4:15:144 hours, 15 minutes, 14 secondsyou wouldn't be able to just you know insecurely do this. But it's the same way you would update your user with a push notification saying, "Hey, your
4:15:214 hours, 15 minutes, 21 secondsorder is on the way." The same way would happen with your uh live activity being updated. Um it would be the same event
4:15:294 hours, 15 minutes, 29 secondskind of, you know, uh medium or or vehicle. Okay. Now, root level would update.
4:15:384 hours, 15 minutes, 38 secondsI just wonder why maybe that didn't load. That's interesting. Let me try and build that myself. So switch to city apps up.
4:15:504 hours, 15 minutes, 50 secondsAll right. Um Jay to screenshot Dippen's message,
4:15:584 hours, 15 minutes, 58 secondsright? Cuz I think that'll come in uh handy with talking to the guys over at
4:16:054 hours, 16 minutes, 5 secondsuh uh com um expo uh concept. So, even here, I would go ahead and actually again, you know, I'd make sure these are
4:16:134 hours, 16 minutes, 13 secondstype checked just to be a bit more on the good side. Um, but yeah, this Oh,
4:16:184 hours, 16 minutes, 18 secondsactually, maybe it's just cuz we have to reinstall the widget as well. So, if we were to reinstall the widget,
4:16:264 hours, 16 minutes, 26 secondsedit, add widget. Let's see. So, Papa Pizza. Boom. Okay. No. So, maybe it should just update that. So anyway,
4:16:364 hours, 16 minutes, 36 secondswe'll give that a chance to give a build a go. And in the meantime, the final I guess last thing I want to check on
4:16:464 hours, 16 minutes, 46 secondsbefore we come to an end is we did do uh we did actually do um
4:16:544 hours, 16 minutes, 54 secondswhat's it called? Widgets, which is pretty awesome, right? So we got widgets working, which is very very cool. Uh,
4:17:014 hours, 17 minutes, 1 secondand Jay, if you scroll up, there was some pretty cool feedback when we did the widgets. Just screenshot that as well. All right, so it was the widgets
4:17:094 hours, 17 minutes, 9 secondswas very cool. And then I just want to see as well, I think live activities is also here. Live activities.
4:17:164 hours, 17 minutes, 16 secondsI think the main push was actually more around oops
4:17:234 hours, 17 minutes, 23 secondslive. So you can Yeah, export enables live activities using export UI components. So you can in this case we
4:17:324 hours, 17 minutes, 32 secondsdid get it we got it working to a certain point but if we go ahead and see this now I want to see does that does this load.
4:17:404 hours, 17 minutes, 40 secondsLet me see on here. Okay so yeah see look gate closing in 5 minutes.
4:17:474 hours, 17 minutes, 47 secondsSo basically building this up is what I would want to be is what I would want to get to you know. So that looks that
4:17:544 hours, 17 minutes, 54 secondslooks so awesome right? So, you just know that you can get to that point,
4:17:594 hours, 17 minutes, 59 secondsright? Uh, right now, obviously, I'm not going to spend like too long on on kind of getting, you know, to that point, but click on report here. And actually, when
4:18:084 hours, 18 minutes, 8 secondsyou get these kind of issues, by the way, I highly recommend you click on report, you grab all this, you copy it,
4:18:134 hours, 18 minutes, 13 secondsgo over here, and you paste it in and say, and then you pop it in because it tends to happen sometimes. So if we do
4:18:234 hours, 18 minutes, 23 secondsiOS just to see what the issue was. So just reset. Actually, you know what?
4:18:344 hours, 18 minutes, 34 secondsJust wait. Stop that for a sec. So I want to see if Okay, so let's try one more thing now.
4:18:444 hours, 18 minutes, 44 secondsBoom. Boom. Place over here. Place the order. Go over here. View the details.
4:18:504 hours, 18 minutes, 50 secondsas an example of live activity. Oh. Oh. Oh, we have live activity. Okay,
4:18:584 hours, 18 minutes, 58 secondsso it's there. It's just the styles ain't rendering out. Okay, so this is very cool.
4:19:064 hours, 19 minutes, 6 secondsOkay, so the styles for live activity and widget
4:19:134 hours, 19 minutes, 13 secondsare not showing. I have to get this working. I have to get this working.
4:19:214 hours, 19 minutes, 21 secondsin the expo website there's an example live activity. Let's have a look. So, uh, Expo live activity.
4:19:304 hours, 19 minutes, 30 secondsI think it's this one that you're talking about, right? Maybe.
4:19:354 hours, 19 minutes, 35 secondsBut yeah, like effectively this is what we're after, guys. Um,
4:19:454 hours, 19 minutes, 45 secondsI think it's not using maybe the vstack stuff, right? So let's have a look at the code. So
4:19:544 hours, 19 minutes, 54 secondsso right now pizza order widget look. So vstack spacer image
4:20:364 hours, 20 minutes, 36 secondsOkay, it's in the same page as expo widgets at the bottom. Okay, I I'll definitely give that a try. So,
4:20:474 hours, 20 minutes, 47 secondsLet me just give uh this a go. I just want to see maybe I have to remove the widget entirely.
4:20:534 hours, 20 minutes, 53 secondsUh let's let this do a full build.
4:21:014 hours, 21 minutes, 1 secondLet's see. So, it's compiling and building. Hopefully,
4:21:084 hours, 21 minutes, 8 secondswe get this down. But that's awesome if we can do that, right? Because man, if you can get from one code base, just think about that for a second. In one code base to compile down into iOS,
4:21:194 hours, 21 minutes, 19 secondsAndroid, and you start getting these kind of features, like it's it's what I always thought was the missing gap between like that true nice like just
4:21:284 hours, 21 minutes, 28 secondsjust conquering the the native development scene. Uh, and make sure guys when you do sign up to Expo, please just use the link in the description.
4:21:364 hours, 21 minutes, 36 secondsreally helps us out a ton to keep on bringing these videos to you guys so we can all kind of keep on learning together. I can keep on bringing this to you guys for absolutely free. All you
4:21:444 hours, 21 minutes, 44 secondsgot to do is use those links in the description when you're signing up to Clerk and also Expo.
4:21:534 hours, 21 minutes, 53 secondsSo the only other thing Okay, so let's let that build for a sec.
4:22:054 hours, 22 minutes, 5 secondsIt's kind of annoying when it's in here.
4:22:074 hours, 22 minutes, 7 secondsI kind of want to see maybe opening terminal pane. There you go. Let's see that. All right, quick water break.
4:22:164 hours, 22 minutes, 16 secondsI'm still fighting between going with Flutter or React Native, my friend. Do Expo 100 million%.
4:22:254 hours, 22 minutes, 25 secondsUse the second link in description. Sign up to Expo right now and that you will never look back. Like it's so much better. Uh just use it. Trust me,
4:22:324 hours, 22 minutes, 32 secondsbecause flatter, yeah, I'm not saying flut is bad, but Expo is awesome. Like,
4:22:384 hours, 22 minutes, 38 secondsI'm telling you, Expo, their their development team are absolutely on fire right now. You're going to spend a long time doing authentication yourself. Use Clerk, offload that, build the app.
4:22:484 hours, 22 minutes, 48 secondsTrust me, too many people focus on the the the setup portion of that. You really don't want to like, what's the point? Just get you can do so much uh
4:22:584 hours, 22 minutes, 58 secondswith that time that you're saving. If I was you, I would to I would instead focus on uh Expo. You got all the native
4:23:064 hours, 23 minutes, 6 secondsbenefits and the features and then I would focus on um what's this widget update is calling
4:23:124 hours, 23 minutes, 12 secondsupdate snapshot. Ah that's why it's happening coping a god.
4:23:204 hours, 23 minutes, 20 secondsAh that's why it wasn't loading. Okay I know but I million% suggest expo through and through expo and clerk. Expo clerk
4:23:294 hours, 23 minutes, 29 secondsand comx are just like a hack. Like trust me when I say like if you now you have AI you can use this stuff like it's just nuts how fast you can code with it.
4:23:384 hours, 23 minutes, 38 secondsUse it like these three things use them guys. Insane.
4:23:444 hours, 23 minutes, 44 secondsSo it was because of this. So look let's let that do it change to legacy. Look require pet the widget.
4:23:524 hours, 23 minutes, 52 secondsNow revert the widget back to original working version. the one that was confirmed working with the screenshot showing on the way. So
Chapter 30: Final walkthrough and Outro
4:24:134 hours, 24 minutes, 13 secondsOh, but it's got rid of the the design.
4:24:184 hours, 24 minutes, 18 secondsOh, I want the new design with the
4:24:254 hours, 24 minutes, 25 secondsBut just use the fix now instead.
4:24:594 hours, 24 minutes, 59 secondsOkay.
4:25:094 hours, 25 minutes, 9 secondsRight now, let's give it a try. So, pre build.
4:25:154 hours, 25 minutes, 15 secondsOnce we get that working, I'm going to call it on that. The main thing that I would say take away from this guys is like I said, view a few things like let's just kind of cover over them,
4:25:264 hours, 25 minutes, 26 secondsright? A few things like the main thing is clerk or view, right? You guys saw today this was this was just awesome.
4:25:324 hours, 25 minutes, 32 secondsLike quite honestly, one line to get the thing working is it's it's incredible. I would even recommend stack this with
4:25:424 hours, 25 minutes, 42 secondsum expo protected routes. This is what I tend to do protected routes, right? So stack these two together and you have an awesome
4:25:504 hours, 25 minutes, 50 secondsawesome setup, right? So in this case your is logged in check. I would just simply tack it onto this is signed in check and then I would have this at your top level uh your top level section.
4:26:014 hours, 26 minutes, 1 secondRight? So that is uh is is really awesome. The main thing as well, like guys, the fact they're developing this stuff is just it's just so cool. Like
4:26:094 hours, 26 minutes, 9 secondsreally just make sure you you go and leverage it. That's all I can say. Same with Expo, like you guys saw today, all the new features that they've introduced. And by the way, I only
4:26:184 hours, 26 minutes, 18 secondscovered a handful, right? Like hopefully we get this Expo um widget working,
4:26:224 hours, 26 minutes, 22 secondswhich is absolutely awesome. But this was the new template we started off with. If we go down, we can see I actually didn't even show you this, but HS V1 is available. It's a lot faster to
4:26:314 hours, 26 minutes, 31 secondsrender and load things. Um, the main thing as well that I want to show you,
4:26:354 hours, 26 minutes, 35 secondsthey do actually have an MTP this whole time. I just realized I I could have Damn, I maybe I should
4:26:424 hours, 26 minutes, 42 secondshave used that. Okay, anyway, we're here now. Damn.
4:26:484 hours, 26 minutes, 48 secondsTest fire crashes. That's actually if you deploy to EA though still, so it's fine. Agent skills as well. We already in installed.
4:26:564 hours, 26 minutes, 56 secondsAnd then the main thing as well, like native features, but stuff like this. I didn't even cover this, but like you see the the different toolbar thing like
4:27:044 hours, 27 minutes, 4 secondskind of approaches you can get even Apple's zoom transitions. This I really like. So we've seen this before in apps.
4:27:114 hours, 27 minutes, 11 secondsCompletely interruptible zoom transitions. This is so nice. Until it works, we are not leaving the desks. I
4:27:184 hours, 27 minutes, 18 secondslove it. All right. Oh, okay guys. We didn't get a crash.
4:27:224 hours, 27 minutes, 22 secondsLet's Okay. I'll be so happy if this works. Okay. Ready? Let's go ahead and give it a try. So, let's go and order a
4:27:304 hours, 27 minutes, 30 secondsmelting cheese pizza with pepperoni and olives. I don't know why this is like some ASMR right now.
4:27:384 hours, 27 minutes, 38 secondsOlives.
4:27:394 hours, 27 minutes, 39 secondsAll right. So, again, you can read add the badges. I'm not going to get over that. Right. Um, we got three things in the pizza, right? So, um, place order.
4:27:484 hours, 27 minutes, 48 secondsSo, now we've got a pending order over here. Okay. Now, if I go to close it,
4:27:544 hours, 27 minutes, 54 secondslet's go ahead and add in edit widget pop.
4:28:044 hours, 28 minutes, 4 secondsAh, so the this design isn't working. Okay,
4:28:114 hours, 28 minutes, 11 secondsso this design does not work.
4:28:164 hours, 28 minutes, 16 secondsAnd also the yeah you see look when we leave it's not showing this design does not
4:28:244 hours, 28 minutes, 24 secondswork and also it doesn't wait
4:28:344 hours, 28 minutes, 34 secondsthe design doesn't load. So revert back to the old design and also try a very very safe live activity test just so we
4:28:424 hours, 28 minutes, 42 secondscan get the live activity tested. So go back to the working widget and then go play it super safe with the live
4:28:504 hours, 28 minutes, 50 secondsactivity and I think I also screwed up with the
4:28:564 hours, 28 minutes, 56 secondsother thing. So also in addition because we don't have push notifications set up yet revert the changes where we
4:29:054 hours, 29 minutes, 5 secondsmade push notifications on and instead uh remove our hack that we added. So
4:29:124 hours, 29 minutes, 12 secondskeep it keep the update snapshot inside of the use effect. So that's actually the the problem I think that I was trying to jump ahead of. So we saw
4:29:214 hours, 29 minutes, 21 secondspreviously that update snapshot is the thing that basically updates the widget or the live activity, but we haven't set up push notifications. I think it's
4:29:294 hours, 29 minutes, 29 secondsworth making a whole video for that side of things. Expo does support it by the way like they handle all that as well.
4:29:344 hours, 29 minutes, 34 secondsUm but that you can use different lots of different solutions for. There's firebased notifications. There's a lot of stuff as well. Um, yeah. So, it's one
4:29:434 hours, 29 minutes, 43 secondsof those things I would say I'm not going to focus on that, but I want to get this working. So, I really want to uh get this fixed. Robert says, "The Apple zoom transition be really nice and
4:29:524 hours, 29 minutes, 52 secondseasy. It would be perfect to add when clicking on one. The pizza is going to detail screen." I agree with you. Let's do it. Let's 100% do it right now. Um,
4:30:004 hours, 30 minuteslet's do it. So, zoom transitions.
4:30:054 hours, 30 minutes, 5 secondsI need to close a lot of stuff. This is getting crazy. Um, I can't see anything. Close this. Close this.
4:30:134 hours, 30 minutes, 13 secondsClose this. Close this. There you go. Right. This. No. That's the live stream.
4:30:214 hours, 30 minutes, 21 secondsOkay. So, um, SDK 55 Zoom transitions expo.
4:30:314 hours, 30 minutes, 31 secondsSo, here it's actually kind of simple to do it. I think it was just simply inside of a link Apple zoom. Okay. So I want to
4:30:394 hours, 30 minutes, 39 secondsimplement that. So oops,
4:30:454 hours, 30 minutes, 45 secondslet's create a new one. So rid this documentation. When we click on a pizza,
4:30:514 hours, 30 minutes, 51 secondsI want to go ahead and implement a zoom transition, a native zoom transition into the order detail screen.
4:31:214 hours, 31 minutes, 21 secondsOkay.
4:31:234 hours, 31 minutes, 23 secondsSo, use pizza live activity import and hook call already in the order detail screen from the first six. Now, it's going to pre-build. So, let's stop the
4:31:314 hours, 31 minutes, 31 secondspre-build and let's cut that. Let's go into our own pre-build. So, cut that and
4:31:394 hours, 31 minutes, 39 secondslet's do on prebone. Yeah.
4:31:494 hours, 31 minutes, 49 secondsAnd then keep an eye on this plan. So,
4:31:524 hours, 31 minutes, 52 secondsand also by the way, remember I showed you a little trick. So, if we pop this over here,
4:32:004 hours, 32 minutescopy page. Yeah. So,
4:32:064 hours, 32 minutes, 6 secondscheck this docs. Check these docs too to check plan.
4:32:134 hours, 32 minutes, 13 secondsThat's what I honestly do every time. So intro zoom source property. It's very easy. You just literally like uh where
4:32:214 hours, 32 minutes, 21 secondsyou have your link wrapper. You basically just inside of it link apple zoom. And then that should literally do
4:32:294 hours, 32 minutes, 29 secondsit. And that introduces fully by the way uh um what's it called? interruptible
4:32:374 hours, 32 minutes, 37 secondsflows. Uh story and co says the story of coding has gone since the end. Honestly,
4:32:414 hours, 32 minutes, 41 secondsno, dude. Like level up the thing the mindset behind it. That's what I would recommend it. Like you it's I wouldn't say it's gone at all. If anything, I
4:32:494 hours, 32 minutes, 49 secondswould say that if anything, you're actually like Tony Stark level if you know what you're doing. It's it's way more powerful than it's ever been. Uh
4:32:574 hours, 32 minutes, 57 secondsit's just the problem is now people get frustrated because they're just they're just churning out slop slop stop slop
4:33:044 hours, 33 minutes, 4 secondsand it's it's not doing anything like beneficial productive and that is not fun right. So that's the problem. If you
4:33:114 hours, 33 minutes, 11 secondsget good at it and you know what you're doing then yeah it's awesome. Like you saw today in like in just a couple of
4:33:184 hours, 33 minutes, 18 secondshours like we've come together with a full app. Like it's crazy. Uh obviously like payment we can add in these bits and bobs but like obviously I've been
4:33:274 hours, 33 minutes, 27 secondsexplaining a bunch of stuff at the same time like if I just flowed in like truly you get full app done in maybe 2 hours like it's pretty awesome. Um plan is now
4:33:364 hours, 33 minutes, 36 secondsverified. We can go ahead and add in those things. Yep. So I want to add in the zoom transitions. So we'll let that do its thing. The build is done. Oh okay. Let's go ahead and give it a try.
4:33:494 hours, 33 minutes, 49 secondsSo, iOS. Okay, we got a crash. So,
4:33:564 hours, 33 minutes, 56 secondsI'm not going to send it yet cuz I want to see firstly. Oh, it didn't implement the zoom yet. Okay, so melting cheese,
4:34:074 hours, 34 minutes, 7 secondsright? Add that in.
4:34:124 hours, 34 minutes, 12 secondsOh, but we got a hot reload as we just did it, man. Okay.
4:34:184 hours, 34 minutes, 18 secondsI think that's going to screw up the order.
4:34:234 hours, 34 minutes, 23 secondsOkay. Cuz because we're hot reloading as I'm doing stuff. One minute. That's going to break again. Yep. See?
4:34:324 hours, 34 minutes, 32 secondsOkay. Uh give it one second. Let it finish what it's trying to do.
4:35:024 hours, 35 minutes, 2 secondsOkay, now we're inside the app.
4:35:094 hours, 35 minutes, 9 secondsPlace the order. We have our Oh, okay. I mean, well, that that actually it did it to the wrong screen. It did it to the
4:35:184 hours, 35 minutes, 18 secondsorder screen, but if I oops
4:35:284 hours, 35 minutes, 28 secondsOh, I mean, that's kind of cool. It did it to the wrong screen, but I meant it. I wanted it on this screen, to be fair. Um,
4:35:474 hours, 35 minutes, 47 secondsadd it to this screen, too.
4:35:514 hours, 35 minutes, 51 secondsOh, I see. So, it's saying if you're using it inside of a stack, that's what that little kind of strange little noticing is. You see how it kind of it
4:35:594 hours, 35 minutes, 59 secondspops into the stack? But it's kind of just worth mentioning. Oh, look at that.
4:36:044 hours, 36 minutes, 4 secondsLook. Yeah, look at that. We can we can close them. That's cool. Oh, it's doing another change. Okay.
4:36:124 hours, 36 minutes, 12 secondsIs this building?
4:36:154 hours, 36 minutes, 15 secondsOkay. So, we placed an order now. We close it. Yes, guys. Oh, okay. So, the
4:36:234 hours, 36 minutes, 23 secondsexpansion view doesn't work, but that's pretty cool. Okay. Look, we have the pending. All right. And then if we go in here.
4:36:324 hours, 36 minutes, 32 secondsThat's sick.
4:36:344 hours, 36 minutes, 34 secondsThere's genuine excitement from my voice there cuz I was pretty excited that that just worked. All right. So, let me go
4:36:404 hours, 36 minutes, 40 secondsahead and do um Okay, you know what? I'm pretty happy with that. I know. Like,
4:36:464 hours, 36 minutes, 46 secondslook, you can go ahead and just the expansion slider thing. So, I can show it and be like this works. So,
4:36:544 hours, 36 minutes, 54 secondsdo I think it was on was it on the other agent? So, yep, this one.
4:36:594 hours, 36 minutes, 59 secondsSo, this now works. Uh, the only thing we need to change is when I hover over the live activity, I can't see any
4:37:074 hours, 37 minutes, 7 secondsactivity on the zoom transition. It went ahead and added the pizza card change as well.
4:37:204 hours, 37 minutes, 20 secondsSo, we can check here now.
4:37:244 hours, 37 minutes, 24 secondsHey, look at that. And if I go ahead and swipe in and we should also also make this clickable. So this whole thing should become clickable. So not just this button but is it already?
4:37:384 hours, 37 minutes, 38 secondsOh, it is. Yeah. So that's kind of cool. Yeah. So you guys can see. Look at that.
4:37:414 hours, 37 minutes, 41 secondsIt's perfect use case for it. So if we click on that for example. Yep. That's nice. If we go to barbecue chicken.
4:37:474 hours, 37 minutes, 47 secondsBoom. And then you see how you can just like kind of shut it down. kind of a nice I mean remember the visual
4:37:544 hours, 37 minutes, 54 secondsdiscrepancy here is because we're inside of a stack. So if you didn't want the stack and you just made it a kind of a overlay you can kind of have your own button saying dismiss or go back. But
4:38:034 hours, 38 minutes, 3 secondsstill look at that's kind of cool. That is kind of nice. Like I do I like that. Right. So in this case very very clean.
4:38:114 hours, 38 minutes, 11 secondsSo oh so you add in this pizza. Boom.
4:38:144 hours, 38 minutes, 14 secondsBoom. Add the cart. Go ahead and actually you know what I don't think cuz because we got several orders I don't want to screw up. If I was to go
4:38:234 hours, 38 minutes, 23 secondsrun the Java just need to reload the app. So it actually Oh, it forgot to do this bit.
4:38:304 hours, 38 minutes, 30 secondsLook, expanded leaning. So look at this guys. Compact leading, compact trailing,
4:38:354 hours, 38 minutes, 35 secondsminimal expanded leaning. So expanded trailing. So there's different views that you can actually tap into. So
4:38:444 hours, 38 minutes, 44 secondsSo I need to reload the app. So Oh, I stopped the server.
4:38:514 hours, 38 minutes, 51 secondsNo, I don't need that. One minute. Uh D back. And then there's two turbo dev.
4:38:584 hours, 38 minutes, 58 secondsOkay. And now command I I I. Let's open it up.
4:39:054 hours, 39 minutes, 5 secondsOkay. So app's running. Let's go ahead and let's do a full test now. So we are logged in as an admin. There's bunch of
4:39:134 hours, 39 minutes, 13 secondsorders that are yet to be made. Let me log in. So there's bunch of orders over here that come through the kitchen. So that that one got delivered, let's just say, right?
4:39:304 hours, 39 minutes, 30 secondsInteresting. We must have fixed something there with that. So,
4:39:344 hours, 39 minutes, 34 secondsokay, let's go to melting cheese. I want a large pepperoni with olives. I want ultimate cheese bliss with a small.
4:39:454 hours, 39 minutes, 45 secondsAnd I want extra cheese. Let's add that. Okay. I'm going to add those to basket.
4:39:494 hours, 39 minutes, 49 secondsPlace the order. Cool. Now you can see my orders been placed. I say like, you know, as they cook through, you can go ahead and tap through. Boom. Boom. Those ones are getting made. They confirmed.
4:39:594 hours, 39 minutes, 59 secondsThese have been cooking. Again, of like, do you need confirm? I mean, actually,
4:40:044 hours, 40 minutes, 4 secondsno, you do need confirm, but but the point is that yeah, you can you can kind of mess around with these much. So, that was not out for delivery. And you see how you've got some kind of flow here.
4:40:124 hours, 40 minutes, 12 secondsYeah. But now, for example, this is pending. So if I close it. Okay, it's pending. We Oh, look at that. That is
4:40:184 hours, 40 minutes, 18 secondssick. Okay, nice. All right, 3347. I can click into it. Nice. Um, confirm order.
4:40:264 hours, 40 minutes, 26 secondsNice. Okay. Uh, again, like UI. This stuff you can fix yourself. Right now, we go over here. It's confirmed now.
4:40:344 hours, 40 minutes, 34 secondsThat's cool. Okay. Click into it as well. And then we for example if we're here and it starts cooking you see like
4:40:424 hours, 40 minutes, 42 secondsthen imagine like it's cooking it's out for delivery and now for example when you close like let's say you closed your app and you can just see here it's on
4:40:504 hours, 40 minutes, 50 secondsthe way right so when you closed it now as you're scrolling through you can see oh my food's on the way and that is all
4:40:574 hours, 40 minutes, 57 secondsdoable through export which is crazy like I find that so cool and we managed to again this UI like I didn't get the
4:41:054 hours, 41 minutes, 5 secondsorders bit down like you can feel free to do that yourself the main thing thing is is like look, we got a base for the pizza, we got the back end down like uh
4:41:124 hours, 41 minutes, 12 secondsthis stuff is is easy to change. Like you literally can put one quot inside a cursor and you can get that changed up.
4:41:194 hours, 41 minutes, 19 secondsBut we got zoom transitions in flow. And by the way, if you press option and you zoom out like that, that's how you can go ahead and do the double tapping thing. Um and then you've also got this.
4:41:304 hours, 41 minutes, 30 secondsYeah, it's just that's pretty cool. I'm very happy. And look at that native behavior. See that? All of that native behavior with the glass UI. This is
4:41:394 hours, 41 minutes, 39 secondsbeautiful. Right. Even over here, we've got Clark's UI focus. Right. Again, you can tweak that as much as you want. I
4:41:484 hours, 41 minutes, 48 secondswould even have it here where you click manage profile and then remember it triggers that. So, if you did want to do that, you can go ahead and do things like that. Um, but yeah, absolutely
4:41:574 hours, 41 minutes, 57 secondssick, right? I would even like, you know, order history. You can go ahead and put the orders in there if you wanted. Delivered. And now if it's
4:42:044 hours, 42 minutes, 4 secondsdelivered. Yay. Look at that. It's delivered. So there's no active orders now. Wow. Okay. So
4:42:124 hours, 42 minutes, 12 secondsit does. Right now our logic is that it's done the last order. So it finds the last order and then that's what it's going to check, which kind of makes
4:42:204 hours, 42 minutes, 20 secondssense, right? We we're not showing any order after that. Um but yeah, you can obviously improve the logic, make it as cool as you want. That is pretty
4:42:274 hours, 42 minutes, 27 secondsawesome. I think on that note, guys, I think we're pretty good to to call it an end for the demo. Um, pretty awesome
4:42:354 hours, 42 minutes, 35 secondsturnout. Wow, that was insane. I think uh that was one of the most like indepth builds I think because we managed to do monor repo as well which was absolutely
4:42:444 hours, 42 minutes, 44 secondsincredible. And and that's the thing that I kind of want to highlight here when it comes to these kind of builds that it's not always about, you know, um
4:42:534 hours, 42 minutes, 53 secondsI'm going to change the music up. It's not always about kind of, you know,
4:42:574 hours, 42 minutes, 57 secondsperfect preparation and all that kind of stuff. As you saw today, this is the actual flow that you're going to fall into. Things are going to be a bit messy. Things are going to be a bit, you
4:43:054 hours, 43 minutes, 5 secondsknow, like hard to navigate, but you saw here, if you know what you're doing and you kind of know how to navigate and use AI and VIP code the right way, then of
4:43:134 hours, 43 minutes, 13 secondscourse you can go ahead and navigate and get to your end result that you're after. And of course, things like Expo that allow us to write one code base to
4:43:214 hours, 43 minutes, 21 secondscompile down into two iOS, Android, and even web, by the way, it can do. And then, of course, clerk with the authentication just came in absolutely clutch. Like we didn't even have to think about authentication too much.
4:43:304 hours, 43 minutes, 30 secondsLiterally very very simply we were able to go ahead and implement it super super fast. And as I said when you're setting this up guys all I ask is that you go
4:43:384 hours, 43 minutes, 38 secondsahead and you sign up using the links in the description. Please use those links in the description. It helps out more than you can imagine. Like trust me guys
4:43:474 hours, 43 minutes, 47 secondsit helps me keep creating these videos for you guys. So go ahead sign up to those links. Go ahead and check it out.
4:43:524 hours, 43 minutes, 52 secondsAnd as always, if you're interested in joining our community, be sure to go ahead and hit the third link in the description and sign up to our brand new AI community where we're going to be
4:44:014 hours, 44 minutes, 1 seconddiving into all of this kind of crazy stuff that you guys see right here and how I'm able to stay at the top and front of house when it comes to this
4:44:094 hours, 44 minutes, 9 secondsstuff. And as you guys saw, 4 hours 45 minutes. Pretty awesome. We actually have a native app. We have a backend admin app protected so no one can access
4:44:184 hours, 44 minutes, 18 secondsit. Pretty powerful stuff. As always guys, it's your boy Sunny and I will see you in the next video. Nearly a five hour stream. Peace.
/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var conditionNames = ['self', 'other']

var mycondition = conditionNames[condition];  // these two variables are passed by the psiturk server process
// var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// mycondition = 'self';

psiTurk.recordUnstructuredData('trueCondition', mycondition); // record actual condition, which could be different from the one assigned by psiTurk

// All pages to be loaded
var pages = [
	"instructions/instruct.html", // TO DO
	"memory_experiment.html"
];

const init = (async () => {
    await psiTurk.preloadPages(pages);
})()

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var memoryQuestionnaire = function() {

	/* Initialize variables */
  var phase = 1;
  var nPhases = 4;
	var nTrials;
  var curTrial = 1;
  var minCount = 150;
  var startTime;
  var rt;
  var qname;
  var intype;
	var trialData;
	var words;
	var returnedToTrials = [];
	var checkboxes;
	var currentMem;
	var tboxes;
	var words;
	var subTrial = {'emotionA':1, 'emotionB':1, 'wordCloudA':1, 'wordCloudB':1};
	var validKeys = new Array(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 190, 8);
	var numChecked = 0;
	var showError = false;
	var keyPressesMemoryA = {'txt':[], 'time':[]};
	var memStartTime = {};
	var raiseError = false;
	var memID = '';
	var keyPressed = 0;
	var endit = false; // boolean switch to display the end page
	var eventA = '';
	var eventB = '';

	var questionID;
	var questionList;

	var shuffleStart;
	var keepShuffling;

	var memories;
	var csv = "23|||This week, I researched ways to earn money either from home or with my car. Amazon's Mechanical Turk system intrigued me, and I spent a lot of time researching it. I decided that it seemed possible that I could earn a reasonable amount of money doing it with zero risk. It's been fun learning how the system works, and learning the tips and tricks to actually make it profitable. On top of that, the variety of tasks available have been quite engaging!|||I remember my first motorsports event in 1995. It was an autocross that I competed in. I was very nervous about it, and spent some time the night before driving 'brisk' laps around a local bank parking lot in an effort to prepare. As it turns out, I was actually pretty good at it, and it has been my constant hobby for the past 25 years!\n56|||I finished reading a book. This is memorable because quarantine brain has made concentrating very difficult. I read 'Emma' by Jane Austen, for my monthly bookclub. Most of the time I read on my couch in-between working on MTurk. I remember feeling a sense of relief and accomplishment that I'd finished the damn thing.|||I did a bake-along with an online friend. We made a gluten-free chocolate cake, with rice flour and potatoes. It was pretty fun.\n58|||I spoke with my Grandmother who I hadn't spoken to in a couple months. I had missed her sincerely. We had a video chat and I was able to see her. We talked about all the good times we had when I was growing up. My Grandmother is my favorite person.|||I was taken on an exciting date by my boyfriend. He took me to the casino and gave me money to gamble. He gave me $200 to play with. We had a great night of gambling and drinking. I won $100.\n84|||In the last week I remember having to help my son age 6 make a project out of what would be garbage for earth day. He decided what he wanted to make and I helped him find 'trash'. He came up with a good idea and I felt so proud of him. I enjoyed our time together.|||My memory is upsetting as hours have been reduced at my job. The economy is very uncertain now and the trucking market is slowing. The rates for working have significantly dropped and my company is losing revenue. This is upsetting as I may lose my job.\n87|||I went to Walmart to grocery shop. It's about 10 minute drive from my apartment. When I went there, there were so many people at the store. There weren't enough carts available so I had to wait for the next one. As a worker brought in a cart, another worker sprayed it down with disinfectant and then handed it to customers. I thought it was interesting.|||I noticed my laptop was getting hotter and fans were spinning very fast. I opened up the bottom of the laptop and used compressed air to dust it out. As I was going to put it back together I thought to myself, 'Why don't I just leave it open if I'm not going to take it outside anyway?'. So I started using my laptop without the bottom part on.\n138|||I drove to another city to visit my sister and her family this past weekend. It was my niece's birthday and I was invited for a small, family get together. I gifted my niece two silver coins and told her to save them for as long as she can. I had a lot of fun helping my sister bake a cake and lasagna. We all went on a hike and searched for pine cones and cool rocks.|||A specific event in my life that I will never forget is the day I got my first car. It was a hot summer day in Southern California and I had finally saved up $3,000 to buy my neighbor's old car. I rushed home from my job at a bakery and paid my neighbor. After that, I drove to a local apartment complex where all my friends lived so I could show off my new ride. We all went swimming after that.\n165|||I remember the delivery man coming in with my new mattress. This was pretty exciting for me because without a mattress, I had been sleeping on the couch for several months. What made this memory that much more intense was it took 2 1/2 weeks for the mattress to be delivered after I placed the order and paid for it. The delivery time was of course extended due to the nation's pandemic.|||I remember my graduation from nursing school. What an amazing day. With all the hurdles along the way I had finally graduated and was set to begin a life long dream of being a Nurse. My parents were so proud. That day was all really good memories and I still smile when I think about it.\n174|||I was looking for a new show to watch. I found one called The Promised Neverland. I binged it all in one day. It was fantastic and well worth the watch.|||Last year I took a visit to Las Vegas. This was to visit family while I was there. I went and saw a couple shows. Also gambled at the casinos a bit as well.\n238|||I connected with three old college friends on a Zoom call and chatted for a couple of hours. Though we occasionally text, my three friends and I rarely get to connect in any substantive way, having moved around the country and with all three of them now parents. We decided to have a Zoom call like many other people are now doing during the coronavirus pandemic. I thought it would be 30-40 minutes but we ended up talking and joking for 2 hours! They got to meet my boyfriend for the first time and I was able to see their husbands and babies. We ended the call happy and excited to do it again soon (maybe with a virtual board game to be played next time).|||Around five and a half years ago, I came out to my mother and father. It had been a long time coming, but I was about to move in with my boyfriend and couldn't put it off any longer. We went out to dinner after they picked me up at the train station on a trip home to visit them. When we returned home from dinner, I told them I had to tell them something - that I'm seeing someone, and that it is a man. They were not totally surprised but it was a huge relief to have it out in the open and finally get over that hump, despite how terribly awkward it was in the moment. I remember my mother asking 'are you sure?' but otherwise being quick to accept the situation.\n324|||This past week I went on a long hike with my dog. We took a trail that runs for miles through our town. Spent most of the day with him running and playing. I also ate lunch during the hike and just relaxed.|||I remember the birth of my son. It was the single greatest moment in my life. It changed the way I looked at life. That moment everything changed for me.\n327|||I reminded my boss about a job that was due that day. He told me that I should have reminded him sooner, which I had done the week before. This led to a disagreement between us about this job that had to be done that day. I felt that I had done my job. However, he felt that I had not.|||My brother was going to participate in a raft race on the river back in the 1980s or 70s. My father and mother and myself took a bus to go to the location on the river so that we could watch him participate. On the way, the bus' brakes gave out and we we hit a car and went off the road. Luckily we were sitting in the escape row and we were able to open the door get out of the bus.\n368|||Last week I walked to a winery to pick up an order that I had. The trip took about an hour and I wasn't sure at first how to get there. I had to walk across a farm and through a couple construction sites not in use, which was a shortcut. When I arrived the owner was kind and we talked for a bit before I got my order. The trip back was easier since, by that point, I knew I was going the right way.|||I cooked a lobster for the first time ever. I wasn't sure what to do at first but once I found a big enough pot I figured I'd just boil it. I had to watch it constantly to make sure I wasn't over cooking it. In the end I managed to get it just right and it was delicious.\n500|||I helped my grandson make a project for his class in which he does online now. The project was about his family and I really enjoyed finding old pictures that he could print and put on his project board. Some of the pictures made me really think about how long ago they were and how much my grandchildren have grown up since.|||I remember when my daughter had her first child. We were all so nervous during this time and it brought me great job to know that I had become a grandmother. I really cherish the times I get to spend with my children and grandchildren.\n503|||I took a walk in the forest. It was a beautiful day. I was much in need to exercise and loved seeing the new growth springing forth. Everything was changing from darkness to beautiful shades of green.|||I remember my wedding day. It was surreal. When I looked around the church, every important person in my life was there. The sun was shining through the windows.\n651|||I went to pet shop for getting food for my dog. But due to Covid-19 many shops were closed and some shops had no stock. Finally one shop owner brought his dog's food from his home.|||I spoke with my school mate after 14 years. I felt very happy after talking with him. He talked a lot about his personal and working life. We have a plan to meet in the near future after Covid-19\n652|||I did my parents taxes. Due to taking my advice last year, they don't have a mid four figure tax burden they have to payback. Neither did they pay too large of an amount, which would equate to a large refund. The refund was less than $600 dollars.|||I remember when my best friend from high school passed away. It's almost 30 years to the day in three more weeks. I imagine where he'd be now. I wonder what his wife and children would be like, what career path did he choose and where he would call home.\n653|||My wife dislocated her shoulder after falling off the stairs. I had to rush her to the hospital because she was screaming with pain. Getting to the hospital, we had to be extremely careful due to the pandemic. It was a long day.|||I had an argument with my colleague at work after he said something disrespectful to me. I tried my best not to show my displeasure towards him but he just kept on going till i couldn't take it anymore.\n656|||I was in the living room with my roommate and we were speaking about times in our life that were exciting. My friend and I shared our experiences together which I found to be new and refreshing. My fiend mentioned that he went parachute diving which sounded awesome and I mentioned my story of scuba diving in Maui. We both laughed and drank while sharing our stories.|||There was a time in which I was walking home from school and it was raining. I was walking about a mile or so from my school to my home and then a noticed a puddle right next to me as I was walking. As I continued walking, a car passed by in a rush and hit the puddle, which in turn created a wave and splashed me. I thought the moment was memorable because of how comical it was. I was soaked and kept walking home while thinking how unbelievable the day was.\n657|||I remember when I graduated from higher institution. It was a dream comes through. It was a memorable experience because i knew where i come from. I come from a family that has little but still strives to bring out the best in their children.|||I remember when I lost my father last year. It was a painful event that sticks in my memory. I think of all the effort he put into caring for his family.\n658|||Last week, I remember hearing the governor of my state announce his plans to reopen Florida. He said that the state will be opening up in phases. Some parts of the state would start opening on Monday. The place I live will exit lockdown at a later date. I felt concern that the state may be opening too quickly, but I also felt relieved that the lockdowns will be ending soon.|||I remember my graduation from high school. I remember driving with my parents to the stadium where the ceremony was going to take place. I also remember receiving my diploma from the principal. That night, I ate dinner at a restaurant with my family.\n659|||I received a phone call from my mother that my nephew was sick with a high fever. They had tested him for coronavirus. She told me we would have to wait a few days to find out if he had it or not. I was so scared and could not believe what was happening.|||When I was at my daughter's college graduation I could not wait to hear her name called and see her receiving her diploma. The people in front of me stood up just as they called her name and she received it. I yelled at the people and told them to sit down. My daughter had worked so hard and my pocketbook worked hard too and I wanted to enjoy that moment but someone else took it away from me.\n660|||I remember going to my favorite Japanese grocery store for the first time after my state's lockdown orders. I just felt anxious and sad because while most customers were wearing masks, some weren't. The cashiers also did not have partitions to keep them safe.|||I went for a walk and I encountered a puppy that looked exactly like my friend's dog. I then thought about the last time I saw my friend and how we went hiking. The puppy would only walk for a couple of feet and then just plop down on the ground. It was so adorable. Then I thought about adopting a puppy and if I was ready for that.\n661|||I was out walking on a nature trail with family. Near the end of the trail my sister got scared by a snake right next to her. She freaked out and started screaming and running away from it.|||I was at a child's birthday party having a water balloon fight. One of the kids put his arm through a plate glass window, which caused him to massively cut his forearm. I was standing right there when it happened and it was by far the most disgusting thing I have ever seen.\n662|||I discovered my local corner convenience store still sells flavored vapes. I was very excited but skeptical at first. I hate smoking but enjoy vaping but now with the general flavor ban vaping stopped being enjoyable. There were several options so I decided to start with Strawberry Mango.|||I remember my longtime cat passed away. It was very clear he was going to pass the night before; I somewhat expected to wake up and find him gone. However I woke up and that was the moment he began taking his last breaths. It was a tragic moment but a content one knowing he passed in peace by my side.\n663|||It was a Tuesday evening, while I was having a fun time with my wife and kids. We decided to do something very funny just to lighten up the mood of everyone because we were actually so bored of being indoors repeating the same thing over and over again. We decided to get dressed in our favorite cartoon costumes. Just for the laugh, we all came out with a funny look, mimicking our favorite characters.|||It was our wedding anniversary. I was so lost with the work I had to do at my workplace. I had just so many things to do. The day was about to end when my kids and a couple of friends surprised me and my wife with a dinner party. It was one of the nights I would actually never forget, so romantic and special. We had a lot of fun.\n664|||Last week, Tuesday, I was sitting at my desk. My desk is situated in front of a big window that gives a clear view of the creek that runs behind the house. I live on a property that is bordered by woods. While I was working on the computer, I saw something moving out of the corner of my eye. I looked out of the window and there he was. A bull moose in all of it's glory!! He gazed right back at me and for a second I believe we locked eyes. Then he looked away, went into the creek and took his refreshment bath. It was unbelievable!! And I was completely in awe.|||A few years ago one of my friends gave me a very special birthday present. My friend is an air force officer and he he knows how crazy I am about airplane jets and especially the speed they can develop. Not being in the military myself. I just fantasized about experiencing flying in a jet. My friend pulled some strings and I hitched a ride in a fighter jet! It was amazing. It was so much more that I anticipated.\n665|||My husband and I took a long hike on Saturday. It was a very nice day, and we brought our new camera. We hiked a trail that was new to us, and it was the longest hike we've been on so far this year. My husband walked slowly because he wanted to get a picture of a snake, and we did see a little snake by a stream. It moved fast, and he only managed to get a picture of part of its body.|||A few months ago, I noticed signs that we had mice in our kitchen. Our utensils were getting chewed up in the drawers, and there were mouse droppings too. I borrowed a humane trap from my parents, and we caught three mice. I put them upstairs in a cage made from plastic bins. I released them outside once we sealed up all the holes we could find in the house.\n667|||I remember driving to pick up groceries because I hadn't been out of the house in a couple weeks. It felt good to be outside, moving around and to feel the sun. I took my little shih tzu with me and he sat on my lap while I drove. I loved watching his face in the rear view mirror as he dimmed his eyes to thoroughly enjoy the feeling of the breeze through his fur. Overall, it was relaxing and reminded me that it's important to get out from time to time to experience the world a little.|||I remember going with my boyfriend to a buffalo farm. We piled onto the back of a flatbed truck and got towed out to the middle of an empty field. Almost immediately a huge herd of massive dark brown animals began to surround us on all sides of the vehicle and I had never been so happy. They let us hand feed them corn cobs and pet their beautiful, wide noses. It was one experience I will truly never forget.\n670|||I remember mowing the lawn last week. It was a warm, sunny day for late April. My arms were tired afterward from the weedwacker. It takes quite awhile, and I distinctly remember the podcasts I listened to while mowing and weedwacking.|||I remember the moment I popped my Achilles. It was just over a year ago. I still remember going to turn, hearing a pop, and then falling to the ground. I also distinctly remember a lack of pain, which is apparently quite uncommon.\n671|||For Mother's day, I braved over to her house to eat a big meal. It was very indulgent with the amount of food. It was nice to get to play with a dog.|||I thought about the time I went camping at Yellowstone when I was a child. What was interesting was we heard a bear come while we were sleeping. When we woke up in the morning our cooler had been broken into.\n672|||Something that happened last week was that my wife and I went on a trip together. We drove through the country side and talked and shared things that had been bothering us for quite some time. Afterward, we camped out in the wilderness while overlooking a lake. It was a wonderful time and it gave my wife and I time to bond and cherish the moment we had.|||I remember when I first met my wife. We were working on the same team at work and we didn't know each other at all. We both bounced ideas back and forth from each other, but we were also somewhat flirting. Afterwards, we went on a date and I was in awe. She was sweet, courteous and beautiful. We stayed at an amusement park most of the night just getting to know each other.\n674|||Last week I was at home due to this state lock down and stay at home policy. I was with my 4 years old son who made each day a fun day for me at home. I also engaged my 6 hours official work each day. We watched news about the Covid-19 pandemic and some series of movies together just to keep our spirits up and not be depressed.|||I remember when my son turned to me after playing a game together and he said to me 'Dad, I wish we could always have a smiling moment like this together.' I was touched by that single statement. I told him that as long as this stay-at-home order is in effect, every day at home with you will be a happy day.\n675|||I was sitting on the front porch, getting ready to eat dinner for Mother's Day. My brother drove up outside, and came into the house. A few minutes later, his wife and children came in with a puppy. The puppy ran over and jumped up on my leg.|||I was at home putting up a screen door on the house. My mother received a phone call telling her that my grandmother had fallen. She immediately went to my grandma's house. Shortly after, I saw an ambulance drive to her house.\n676|||I went out on my bi-weekly shopping trip. I got out of my car and headed for the store. Something caught my eye and I found a $5 bill on the ground. There was no one else around so I had no idea who lost it. I kept the $5 and completed my shopping in a very happy frame of mind.|||I graduated from Army basic training years ago. The company was on the parade field in front of family and friends. It was a cool but clear day and the bleachers were filled with guests. All of us recruits were so proud to become US soldiers. I gained a new respect for the armed forced and myself that day.\n678|||I remember going to pick out rocks for our yard. It was fun and something fun for us because we have not done anything at all since the lockdown.|||I remember dancing in the yard with my kids and the day was nice and it was 75 degrees for the first time in months. We had fun. People spoke to us and it felt good to get out and talk and see people finally during the lockdown.\n679|||We celebrated mothers day. First we had my mother-in-law over on the patio for a couple of hours. Later we dropped off flowers and food at my mom's house. In the evening we had a Zoom call with my family for about an hour.|||During my senior year of college i got an internship. I was soon to graduate and got to work part time. After graduating i began working full time. I eventually got a salaried position and stayed with the company for 3 years.\n680|||I've been doing a virtual trivia session online over the last few weeks, and last week was the biggest night ever. We had 26 teams and over 160 players. This has previously been going on in bars and restaurants, but with all of them closed due to the virus, it's had to be online. After it was over, the guy who supervised it got in touch and had a conversation about what things are going to look like when everything opens back up. It was good to start planning this out a bit, as I've been wondering what we were going to do with it after businesses start opening again.|||I was dating a girl in college after having a crush on her a few years earlier while we were still in high school. She had been with another guy during high school but she broke up with him at some point. It turns out she had wanted to be with me all along. I found out the guy she was with was kind of an abusive stalker. After dating me for several months she abruptly cut things off - no contact - and went back to him. I never figured out why.\n681|||I remember a Zoom presentation I had to do. It was the first Zoom presentation I have ever done so I was very nervous. I remember stuttering at points, getting within the PowerPoint at other times. I thought I did horribly, and I am relieved that it is over.|||I remember my middle school graduation. I felt incredibly sad as my middle school experience was great, and it was off to a new school, high school. I realized then that some of those people I would never see again, and how right I was. I felt an emptiness within me. To this day I feel nostalgic about that day.\n682|||Last week I had a little argument with my wife. She wanted me to give a look at some planters and I didn't respond to her. When I checked the planters she was talking about, they were sold out. She was very upset with me. I had to find new planters so she could forgive me.|||My yearly bonus meeting was postponed due to the coronavirus pandemic. Last week I got a call from my saying that he is going to do an evaluation next week (meaning this week) and we will get our bonuses pretty soon. The bonus being postponed actually helped me because I could fulfill my highest bonus target. I am very excited to get my bonus check.\n683|||My mom and I went searching for something she wanted for Mother's Day. It was a chimnea that you can usually get at gardening stores. We drove to the usual spots, but they had none. Finally, we tried on last place, but pretty much had decided that they were so out of style no one had them. But we found one!|||We had five cats, which was four too many. I was coming home late one evening. We live in a cul-de-sac, and a cat was meowing incessantly coming across the street. I thought it was my yellow cat. So I opened the door and let him in. It was a brand new kitten, about 4 months old. So now we have six.\n684|||I have been self isolating with my girlfriend for the last few weeks, only going out twice to get groceries. I live several hours away and had to go back to my apartment to pick up mail and check on it. It had been the first time I had been back in over a month. As I was driving the roads were very empty, something that I had never seen before. The sun seemed brighter probably due to the changing seasons and me not being outside in a while. When going through my apartment, everything seemed so still and stale, everything seemed foreign to me. I quickly got my mail, checked to see if anything was broken or needed to be done and got out of there.|||I drove to the supermarket to pick up groceries on Saturday morning at 6 am. I almost never leave the house at this time and never go grocery shopping at this time but I wanted to avoid the crowds. The sun was just rising which was something I wasn't used to. The super market was eerily quiet and there were very few people there. Everything felt fragile, like I had to be careful with my every move. I felt like I had to really efficient and move quickly while also being safe. I got through it and checked out but I remember walking out thinking how weird this all was.\n685|||I got into an argument with my mother about feeling embarrassed by her words spoken to another person. I confronted her and demanded an explanation for her actions. She insisted she had said nothing wrong other than the truth. Her response only inflamed me further and I was not about to let it go. I called her out for her intransigence and walked away to cool down. I spoke with my girlfriend over the phone and she advised me to apologize to my mother and to not go to bed angry. I agreed and, after I hung up the phone, went to apologize to my mother for speaking harshly. I went to bed feeling relieved and better, because I don't like staying mad and holding grudges.|||Over thirty years ago, in May 1989, I graduated from high school. The week that I graduated was the week that my favorite ice hockey team, the Calgary Flames, won the Stanley Cup. I have been a fan of the team since the mid-1980s, and their winning the Cup was the best graduation present I could have ever received. It was a bonus when a couple of my classmates called my house and congratulated me on the Flames winning the Cup. I even returned to my high school a week after the Flames' Cup win and collected on a bet from my economics teacher, who had asserted that Calgary wouldn't win the title. (I collected ten dollars.)\n686|||I remember the day I had my wedding. It was a day to remember and very happy and excited. The atmosphere was superb. All arrangements were perfect. I can't forget the entertainer that made our day colorful and our pastor who passionately conducted the wedding.|||I remember the day I got my first job. Having gone through different screening, out of many candidates that applied for the position, I was very fortunate to be picked among them. And my first day at work was wonderful. Although initially the environment was strange, immediately after my induction, things changed.\n688|||I went to the grocery store. There were very few people there and they were all wearing masks. Everyone seemed so tired and scared that no one was really talking to anyone. Everyone was just there alone getting what they needed and trying to get out of the store as quickly as possible.|||I remember coming home from school and taking out my computer. I was getting my college decision that day from my first-choice college. I sat down on the floor and immediately received an email that the decision was ready. I prepared myself to open it and began navigating to the website.\n689|||I was worried about the deaths that happened in our country due to coronavirus. It made me so sad and daily news kept me so nervous about the situation in our country.||| I thought back about the last year vacation on how much I enjoyed it with my family and how the world was compared to now. Most memorable vacation was last year's trip. I really enjoyed it a lot with my family.\n690|||I was at the grocery store and there was a person who was over-shopping. I was really angry because he took the last package of bottled water from my favorite brand. I called this person out on his behavior and he just ignored me. I was really upset.|||I was going down to the park with my partner and my son. Then we heard a police officer announcing over a speaker that we had to leave. I was shocked because we were alone. We ended up leaving but I understand why the policeman told us to leave.\n691|||On Saturday, I finally graduated with my MA in History. I hadn't realized it was happening this weekend, what with the pandemic and all, but a congrats email from my university reminded me. I didn't get to walk across the stage, which is fine by me, but it was still a big day for me. I celebrated with a bottle of champagne and some ice cream with my partner.|||I remember the day I was accepted to my university (for my undergrad degree). It was a week into my senior year to the day. I had applied to this university in July, when the application opened. I was in my AP Literature class (1st period, so between 7:25 and 8:15am). I was on my phone, which I almost never did in class, as I'd finished the work for that class period. I logged into my account for that university to check my application status - and there was an additional tab under my account interface - 'Student.' I knew this meant I'd been accepted. I ended up spending seven years at that university for my BA and MA.\n692|||I remember playing Dungeons & Dragons with friends via video chat. We've been doing it for a while. Just the story within it seems to be coming to an end.|||I remember going to Brazil for the World Cup in 2014. We didn't have much of a choice in games to go but we chose a good one, Spain vs Netherlands. It was a dream come true to just be at the stadium but watching the game was a whole other thing. Seeing Robin van Persie score that diving header was amazing.\n693|||Last week, it was my daughters birthday. We tried to make it the best day for her despite the no social gathering and lock-down. We made sure to have pure indoor fun. Just the family and no outsider.|||A memory I can never forget is when I had my first child. I felt really happy to be a parent. I was filled with joy. Another mission accomplished out of many to be.\n694|||My dad came up from the valley and we went for a bike ride. It was a gorgeous day on the mountain trail. When we arrived at the lake it was just breathtaking. It was just a spectacular day with my dad.|||I remember the day my spouse and I flew into Punta Islita in Costa Rica. We flew from San Jose to this luxury island on the west coast. As the plan was coming in from a landing it looked like we were going to go right in the ocean. Instead we landed on a dirt landing strip with a little hut that said 'Welcome'.\n695|||We went to Disney World this past year and had an amazing time. We did all four parks in 4 days. It was a magical time and a memory to last a lifetime. I miss the place a lot right now. The magic will always be there.|||We went to Wizarding World in Orlando. It was AMAZING. I felt like I was there. I got to try butterbeer, chocolate frogs and so much candy. I got a wand and proudly display it with my other wands I have.\n696|||My mom and I travelled to another state that we live close to in order to go thrift shopping. The state had just relaxed some of their COVID-19 measures, so the thrift stores just opened. We left in the morning, and were done by noon, but we went to some grocery stores along the way. It was fun; we hadn't gone to that city in that state in years and years, so it was both nostalgic and refreshingly new, as we had never gone to that city's thrift stores in our whole lives. We got a few knick knacks for around the house, and I found a baseball glove for a left-handed thrower like myself. It was fun.|||This past week I mowed the lawn as a kindness to my mother. We have two lawnmowers, so I accidentally grabbed the wrong one first, but switched before starting it. I did it kind of haphazardly; the mower was adjusted to be tall and so I had a hard time knowing where I had mowed previously, but after looking at it from the kitchen window it looked like a good job. My mom thanked me and was grateful. I felt good getting it out of the way.\n697|||There was an event at work when I was walking back to my station after loading a truck. Another co-worker needed a forklift moved and asked me to do so. I didn't have much time to practice on it, so they took about 10 minutes to show me the basics and encouraged me to pick it up when I had the chance. I remember the event because doing it turned out to be quite easy.|||I remember my college graduation. I can remember that it started around 7 o' clock and it was a warm evening. Everyone I knew from my classes was there and it was a fun event seeing everybody dressed up. The speeches were upbeat as usual and it was pretty cool.\n698|||Last week I got into a fight with my partner. They have been stressed with the Covid-19 epidemic lately and wanted me to come over. I said I didn't want to because I strongly believe in sheltering in place for the time being. I do not want to risk our health unnecessarily|||When I was 8 years old I visited Greece for the first time. I have extended family that lives there. I was so excited to finally be able to meet my cousins and aunts and uncles in person. I spent about 2 months there and it was one of the best summers of my life\n699|||In the last week, I received a phone call from a childhood friend this had been a very close friend from childhood. We spent most of the time growing up together in my father's country. He now lives in the same state. I ran into him earlier in the year, but we hadn't been able to see or talk. Last week we were on phone for hours talking and remembering our much adventurous childhood.|||I remember when I represented my school at an interstate competition. It was a fantastic memory. I bagged a second place award and was honored by the university's vice chancellor.\n700|||I went to a Starbucks within a grocery store and ordered a medium iced coffee with extra cream and no sugar. The barista said okay and rung up the order. She then took awhile to make it. When she was done, she handed me a large iced coffee with a regular amount of cream and said she gave me a larger size. I thanked her and took the coffee back to my car. I took a sip and realized the drink had sugar in it.|||I remember when I got accepted into graduate school. I checked my email right before I was going to get in the shower and saw I had been accepted. I got into the shower and cried tears of happiness. I knew my hard work had finally paid off.\n702|||I took part in a virtual happy hour with longtime friends of mine from college. About 15 of us got on Zoom on Thursday evening and proceeded to talk and drink and laugh for about 4 hours. A few people I did not know, but the vast majority of them I did. We discussed what is new with all of us and how we are dealing with the coronavirus situation. We also discussed fun, past events we all remember from years ago. I had a great time.|||I remember the last time I saw my longtime friends from college, which was New Years Eve. Many of us met up to attend a party and have a good time together. We went out for dinner, drank too much, and rung in a new year (and a new decade). That was the last large gathering I was at, pre-coronavirus.\n703|||Last week I worked from home remotely. I spent quality time with my family. I home schooled my child. I had to make video calls to my friends, colleague and family members just to show them I care.|||I had a great time with my wife. We did lots of things together last week. We exercised together at home and we cooked a meal together. We shared more love.\n704|||Earlier this week I meal prepped a few meals for the upcoming days. I had to start the rice in the rice maker, adding and measuring out the water carefully. Then, I browned onions and meat together with some spices to add some protein and flavor to the meals. Lastly, I had dry beans I made the night before by soaking for 24 hours, then cooking on low in the crock pot for about 16 hours. Once everything was done, I had to use a spoon and portion out everything in my to-go containers and then seal them up!|||A few years ago, I spent the summer at my sister's house during my birthday. We were both a little short on spending money at the time, so my sister decided as a birthday treat we would go to different stores that had birthday promotions. We visited Rita's frozen treats and got a small frozen sorbet, then to Panera Bread, where we got a small pastry item, then we headed to Honey Baked Ham where we got a sandwich. After getting our goodies, we went back to her house and shared the treats. It was a fun memory and just a day to spend time together.\n705|||This past week I was surrounded by the people I love -- my grandchildren and my two daughters and their husbands. We shared memories that we love about one another. I let them know how much I truly love them and wished I could have done better.|||It was our final game to go to the Little League state finals and we needed to win this game. I was pitching in the game and had gotten the bases loaded with no outs. I dug down deep and struck out the next two players. Then the next player grounded out to first and we ended up winning the game.\n706|||I figured out how to set up an N64 emulator on my pc. I was able to find old games I hadn't seen since I was a young kid. I was able to set up controllers to play with my girlfriend and friends. We played a lot of games and had a really fun time.|||When I was around 22 years old, I was at my friend's house party hanging out. I was drinking beer and had a little too much to drink. I went outside and got sick. I thought I was just normal sick, but I actually had an episode of atrial fibrillation with my heart. I had to be shocked with paddles and it was a traumatic experience that sticks with me.\n707|||The last memory I could recall was the one I had with my workers. We were at the farm doing some recording, then suddenly one of them came to me and told me about his family and how they can not make ends meet due to the situation of the country. I was sad hearing this, had to follow him home and gave some cash to his family. I met a very little boy who was so brave and took me by the hand and prayed for me. Something I can never forget.|||A specific event that occurred last week was the one between me and my wife. It’s been a long time since we had a conversation. She said she missed those old times together and asked if we could spend more quality time together like the old days. So we walked up the hill beside the house to see the beauty of nature.\n710|||Last week I tried to make Indian food, which came out very well. My family enjoyed it and encouraged me to make more. I felt very happy and proud of myself.|||During my time in college, I went to Florida for vacation with my friends. We took many adventures. We went skydiving with proper safety measures. I really enjoyed it and am proud of myself.\n711|||My youngest daughter experienced her first heartache. Her boyfriend's mother broke up with her because she did not feel her son was making responsible decisions. My daughter is heartbroken. This was her first real boyfriend.|||Our only vehicle broke down. My spouse has not worked since March. The transmission went out and I have no idea what we will do about it. We do not have any savings to get a new vehicle.\n712|||In our state we howl at 8:00 PM for any reason we want. Some howl for healthcare workers, some howl just to blow off steam, and some howl for someone they lost. It's been going on for a while, but kind of slow to catch on in my neighborhood. This past week it really picked up and one night the howling was so loud, and you could hear it back and forth like people answering other's howls. It was really a fun thing to participate in.|||I remember being at Walt Disney World with my grandparents and taking my grandpa to the first aid care center because he got a cut. My grandparents used to bring me to Disney World a lot when I was a kid, and this time I took them and wheeled them around in wheelchairs to experience it with them and my children. My grandpa's arm was bleeding so I took him to the first aid center at the Magic Kingdom and a very nice lady patched him up and gave him some Mickey stickers.\n713|||I needed to go to the grocery store to buy groceries. I bought milk, apples, and regular groceries. I noticed there was only one entrance due to the coronavirus and there was a cart cleaner. I then bought my groceries.|||I remember when I joined the military. I was 19 years old. It was a little scary but I am glad I did it. I ended up staying for many years and retiring. It was a good experience\n714|||I just recently graduated from university, but have been in a weird position since there is a pandemic going on. My older brother, who lives in a different city from me has been helping me out with trying to prepare myself to find work. Last week, we had a Google Hangout meeting where we discussed what kind of jobs I was interested in, what experiences he had, and how the pandemic may affect my prospects. He also spent time evaluating my resume and offered advice on how to improve it.|||I remember when I was very young, possibly less than 5 years old, when I was still living in my family's old home. I was home alone with my mom on some random night. I recall that some group of people were outside my home, messing around and essentially harassing us. They were knocking on our doors and windows and making strange noises, and I remember being incredibly scared. I was so frightened that I puked all over our carpeted floor. I never knew exactly who was doing this, but I always assumed it was these teenage delinquents who lived down the street.\n715|||Last week was the first time I have seen my grandma, cousin, and uncle in a while. We went to my moms house and all had a good time playing card games. This was memorable because we weren't able to see each other since before covid started. We had a fun time and stayed up way past all our bedtimes playing cards.|||Two months ago my mom was in the hospital due to brain swelling. I recall visiting her in the ICU when she was unconscious. Doctors weren't sure if she was going to make it out, and if she did, how she would be mentally. I remember walking down the ICU and seeing and hearing all the machines and noises. There was an old man being wheeled around who looked like he was on the brink of death.\n717|||I made a bunch of money taking pictures for an Amazon Turk requester. I was a bit worried that they were exploiting me but then I noticed they were a reputable requester. They were definitely just doing it for their artificial intelligence research. They paid me $15 which was very cool.|||I purchased an expensive GPU just a while ago. I was going to use it for Bitcoin mining. It was the first time I purchased an expensive GPU. I'm not sure what to do with it. It was somewhat memorable.\n718|||I spoke on the phone to an ex I dated 15 yrs ago. Of all the people I’ve dated, this one was the best. We broke up because back then I was too young and dumb to appreciate what I had. We saw each other the other day for the first time in 15 years and it was like nothing changed. We still have that good chemistry and we had a very nice night just talking and spending time together.|||My ex and I recently hung out a 2nd time since we broke up years ago. We were more affectionate with each other this time around. We took a walk together by a lake, looked at baby alligators and turtles from a pier. We sat down together and just cuddled and talked about our past together and our present life. We ended up kissing before we left.\n719|||We finally filled out marriage licenses. We had been holding off because we didn't want people to really go to our wedding. Now we can do it by Zoom. It has been such a relief to be able to do this. It was nice getting to finally fill it out.|||I was able to finally get a good night sleep. I haven't slept good in years, and finally a few weeks ago I was able to sleep for almost 7 hours. It was refreshing to wake up and not be as tired as I normally am. I usually only get a few hours a night.\n720|||The most significant thing that happened to me in the past week was me purchasing upgrades for my computer. It's been years since I upgraded and it was finally time. I HATE spending money, so I was very anxious about clicking the 'complete order' button. Luckily, after a good nights sleep, I felt confident about my decision.|||A significant memory in my life is when I got married. I remember being nervous and excited. We flew to the east coast to get married on the beach. After the wedding, we all went to a local restaurant that served some of the best food I ever ate. It was a truly remarkable day.\n721|||For Mother's day, I spent it with another family and their friends. I was invited to eat chicken and rice. I watched them play a few games before calling it a night. It was enjoyable.|||I went out of the country for the first time last November. It was a few days before my birthday. It was interesting to see a place that was completely unfamiliar. I considered it a place that I could move to later on down the line.\n722|||I was walking a dog with my older brother and he got attacked by a feral cat. We were walking our usual route when we stopped to pet an orange and white cat. Unprovoked, the cat just latched onto my brothers right leg. It was hilarious, but terrible at the same time. Cats are notoriously filthy with their claws and teeth.|||I can remember probably about 18 years ago, I was riding a push scooter outside with my brother. It was getting cloudy and you could tell it was gonna storm soon. Anyways, we were pushing along at a snails pace and suddenly, a lightning bolt hit the ground maybe 2 feet from us. It was frightening and I thought I was dead due to the flash. It disoriented my senses majorly.\n723|||I spent Mother's Day with my family. We met my sister in a park for a picnic. It had been months since I had seen my sister. After eating we walked around an arboretum. Then we drove home.|||The other day I took my dog for a walk. When we got to the field where I usually play fetch with him, he started acting oddly. He started running away and wasn't listening. Eventually he found a turkey and started chasing it across a ditch. He didn't catch it and eventually came back.\n724|||I stayed at home for most of the time during past month. However, last week, my friend called me about one of his rental property. He wanted to get my ideas on what color to use for the wall since they are getting ready to repaint. I was surprised and asked him why he asked me. He said 'because you are an artist and you have good taste, that's why I thought you will do a good job helping me pick the color! You are in charge!' I was really surprised but I was also happy that someone can see that part of me.|||I remember when I graduated from my MBA program. It wasn't as smooth as I would imagined because some of the courses were really hard for me and I didn't really have much experience in them. However I tried my best to learn online for more case studies etc and I would go to office hours to discuss my thoughts with my professors. I managed to get good grades so I was really happy with that. I didn't really attend the ceremony because for MBA it was really not that necessary and I don't live close to school, but I still felt so excited when I got my degree!\n725|||In the last week, my salary was cut down by 20% due to the effect of the pandemic in the country that really affected my organization. It is unknown to me how where this will lead to in the coming month.|||A memory I will never forget was the time I proposed to my wife and we had our wedding the following month. This event led to many fortunes in my life and things started changing for good.\n726|||I was at the grocery store. There was a women who got way too close to me. I asked her to step back. She did not like that and got mad at me but moved away.|||I remember my last birthday in August. My father was there and we are very close. He has since passed away from an illness. I have fond memories of that day and will never forget them.\n727|||I needed to expand my home office to have enough room to do all the things that I need to do. I found two bookcases online and ordered them. When they arrived I was really happy and took all the time to assemble them. Setting them up was a fun thing to do and they were really worth it. My work area is something that I like now, and I have plenty of room.|||I bought a used GEO Tracker for a very affordable price that got good gas mileage. I originally bought it for the mileage. The thing I remember most was taking the top down and blasting the radio out in the country just to go for a ride. It was fun to get in the sun and the wind on the weekends.\n728|||I remember making my mom chocolate covered strawberries for Mother's Day. I went to the store and bought 2 lbs of strawberries and a milk chocolate and a dark chocolate dipping cup. I then heated up the chocolate and dipped the strawberries. I took them to her house and visited with her on Mother's Day, but it was a little different this year due to social distancing so we just hung out on my parents deck since we had to stay six feet apart.|||With all the talk about graduation I remember my college graduation pretty well. I remember getting dressed and not wanting to wear fancy shoes since no one could see them so I didn't. I remember meeting up with my classmates in the back room and then walking across the stage to get my diploma. My parents and brother were there and we went out to eat/drink after it.\n729|||I got a brand new game that I've been trying to get access to for a while now. All of my friends had it and were learning it. I was putting aside time to learn it and practice without the game, but now that I've got it I can actually play it. I got to play my first game with my friends earlier this week.|||I remember graduating from high school. It was a pretty nice sunny day, so we had the ceremony outside. Everyone in my family showed up to watch me walk and get my degree. I also got to have a graduation party after at my house which was very nice.\n730|||We played truth or dare with my 7 year old great niece and it was so fun. She just gets how life is and understood how to play and really got into how you can come up with crazy dares. We laughed at how she had different questions for different people. For her great grandmother she would ask silly questions. It was a lot of fun and definitely a memorable experience.|||In talking with my niece's boyfriend, who is a med student, it was interesting to hear his perspective on the coronavirus. How stressful it is right now for health care workers and how they are trying to cope. It was sad to hear some of his stories and how they are dealing with this day after day. I really felt sorry for him and listening to someone who's on the front line is eye opening.\n731|||The memory I came up with is Mother's Day. Normally for the holiday we go out somewhere, but because of COVID-19 that didn't seem like a good idea. It ended up just being myself, my mom, and one of my uncles hanging out in a back yard, sitting on lawn chairs six feet apart and talking for a couple of hours. It was low-key and nice, kind of just a pleasant afternoon, but because of the occasion I'll remember it for a long time.|||I remember when I got my first car. I was still in high school, and saved up enough money for a sports car that was significantly better than what most other people were driving. I didn't tell anyone, I just drove it to a party and parked outside, then when I left people noticed me getting in it. My friends surrounded it to the point I couldn't drive off until they'd all had a chance to look at it, sit in it, etc. It was kind of nice to be the center of attention for the evening.\n732|||Something memorable that happened last week was a work project that we had. This was a very important and high profile work project that had a tight deadline. The team was able to work together and help each other out to complete it to the clients satisfactions. I was proud of the team for supporting one another especially because we are all working from home because of the COVID-19 pandemic. The project was very important and to put everything together so quickly and accurately showed how selfless our team was and made last week very memorable for me.|||A memorable event happened with my family. We were playing board games as usual during our weekly family board game nights, but instead of getting into a heated discussion about who was winning we were able to talk it out. This was memorable because our family is usually very competitive and everyone disliked losing. This competitiveness resulted in situations where people would sometimes get heated. To come together and discuss it peacefully was a great step and it showed that our family is growing and becoming closer. This step in our families growth was memorable and something that I'm very proud of."


	/*****************************
  * START FUNCTION DEFINITIONS *
  *****************************/

	function getResponse() {
		if (intype == 'checkbox') {
			qname = "'" + qname + '[]' + "'";
			response = jQuery.makeArray($("input[name=" + qname + "]").filter(':checked').map(function () {return $(this).val();}));
		} else if (intype == 'text') {
			response = $('input[name=' + qname + ']').val();
		} else {
			response = $('input[name=' + qname + ']:checked').val();
		}
	};

	function buttonClicked() {
		showError = false;
		rt = new Date().getTime() - startTime;
		qname = 'responseName_' + questionID;
		intype = $('#' + questionID + ' ' + 'input').attr('type');
		getResponse(); // gets the response value for this annotation trial
		if (response.length == 0) {
			showError = true;
		}
		if (showError) {
			$('.responseError').show();
		} else {
			$('#' + questionID).hide();
			$('.responseError').hide();
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function textSubmitted() {
		if (questionID == 'self_memoryA_generation') {
			if ($('#' + 'responseID_' + questionID).val().length < minCount) {
				raiseError = true;
				$('#count_' + questionID).text('Please enter a minimum of ' + minCount + ' characters. Your current response has ' + $('#' + 'responseID_' + questionID).val().length + ' characters.');
			} else {
				psiTurk.recordUnstructuredData('keyPressesMemoryA', keyPressesMemoryA);
				raiseError = false;
			}
		} else if (questionID == 'other_memory_generation') {
			if ($('#' + 'responseID_' + questionID).val().length < minCount) {
				raiseError = true;
				$('#count_' + questionID).text('Please enter a minimum of ' + minCount + ' characters. Your current response has ' + $('#' + 'responseID_' + questionID).val().length + ' characters.');
			} else {
				raiseError = false;
			}
		} else if ((questionID == 'activityTextA') || (questionID == 'activityTextB')) {
			if ($('#' + 'responseID_' + questionID).val().length == 0) {
				raiseError = true;
				$('.responseError').show();
			} else {
				raiseError = false;
			}
		}
		if (!raiseError) {
			rt = new Date().getTime() - startTime;
			$('#' + questionID).hide();
			$('.responseError').hide();
			// qname = 'q' + phase + '_' + trialOrder[phase-1][curTrial-1];
			$('#' + questionID + '_store').val($('#' + 'responseID_' + questionID).val());
			response = $('#' + 'responseID_' + questionID).val();
			if (questionID == 'self_memoryA_generation') {
				eventA = response;
			}
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function atLeastOneCheck(checkboxes)
	{
			var okay=false;
			for(var i=0,l=checkboxes.length;i<l;i++)
			{
					if(checkboxes[i].checked)
					{
							okay=true;
							break;
					}
			}
			return okay;
	};

	function emotionSubmitted() {
		currentMem = questionID.slice(-1);
		checkboxes = document.getElementsByName('responseName_' + questionID + '[]');
		numChecked = 0;
		if (atLeastOneCheck(checkboxes)) {
			rt = new Date().getTime() - startTime;
			$('#' + questionID).hide();
			$('.emotionError').hide();
			// loop over them all
			response = [];
			for (var i=0; i<checkboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (checkboxes[i].checked) {
					 response.push(checkboxes[i].value);
				 }
			}
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
									 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
		else {
			$('.emotionError').show();
		}
	};

	function submitEmotionRatings() {
		rt = new Date().getTime() - startTime;
		var parent = '#' + questionID;
		var child = '.emotionButton';
		var emotionNames = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).attr('name');}));
		if (emotionNames.length != numChecked) {
			$('.emotionError2').show();
		} else {
			$('#' + questionID).hide();
			$('.emotionError2').hide();
			var selectedEmotions = [];
			for (var i=0; i<emotionNames.length; i++) {
				selectedEmotions.push(emotionNames[i].slice(13, -1));
			}
			var emotionVals = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).val();}));
			response = [selectedEmotions, emotionVals];
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function atLeastOneBox(textboxes) {
			var okay=false;
			for (var i = 0, l = textboxes.length; i < l; i++) {
					if (textboxes[i].value.length > 0) {
							okay=true;
							break;
					}
			}
			return okay;
	};

	function wordSubmitted() {
		currentMem = questionID.slice(-1);
		tboxes = $('#' + questionID + ' input[type=text]');
		words = [];
		if (atLeastOneBox(tboxes)) {
			$('#textbox_' + questionID).hide();
			$('.wordError').hide();
			$('#' + questionID + '_rating').show();
			// loop over them all
			for (var i = 0; i < tboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (tboxes[i].value.length > 0) {
						words.push(tboxes[i].value);
						var wordnum = i + 1;
						$('#word' + currentMem + wordnum).html('<b>' + tboxes[i].value + '</b>');
						$('#wordDiv' + currentMem + wordnum).show();
				 }
			}
			$('#wordSubmit' + currentMem).show();
			subTrial[questionID]++;
		}
		else {
			$('.wordError').show();
		}
	};

	function submitWordRatings() {
		rt = new Date().getTime() - startTime;
		var parent = '#' + questionID;
		var child = '.wordButton';
		var wordVals = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).val();}));
		if (wordVals.length != words.length) {
			$('.wordError2').show();
		} else {
			$('#' + questionID).hide();
			$('.wordError2').hide();
			response = [words, wordVals];
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function shuffle(a) {
			var j, x, i;
			for (i = a.length - 1; i > 0; i--) {
					j = Math.floor(Math.random() * (i + 1));
					x = a[i];
					a[i] = a[j];
					a[j] = x;
			}
			return a;
	};

	function checkShuffleP2(questionList) {
		var consecutiveCount = 1;
		var badShuffle = false;
		var mem1 = '';
		var mem2 = '';
		var mem = '';
		if ($('#' + questionList[0] + ':contains("Memory A")').length > 0) {
			mem1 = 'A';
		} else {
			mem1 = 'B';
		}
		for (var i = 1; i < questionList.length; i++) {
			if ($('#' + questionList[i] + ':contains("Memory A")').length > 0) {
				mem2 = 'A';
			} else {
				mem2 = 'B';
			}
			if (mem1 == mem2) {
				consecutiveCount++;
			} else {
				consecutiveCount = 1;
			}
			/* don't want more than questions for the same memory consecutively */
			if (consecutiveCount > 4) {
				badShuffle = true;
				break;
			}
			mem1 = mem2;
		}
		return badShuffle;
	};

	function checkShuffleP3(questionList) {
		/* a is an array of the type of SAM question. Can't have two of the same type in a row */
		var badShuffle = false;

		for (var i = 1; i < questionList.length; i++) {
			/* don't want two SAM questions of the same type in a row */
			if (questionList[i].slice(0, -1) == questionList[i-1].slice(0, -1)) {
				badShuffle = true;
				break;
			}
		}
		return badShuffle;
	};

	function getQuestionIDs(className) {
		var idArray = [];
		$('.' + className).each(function () {
		    idArray.push(this.id);
		});
		return idArray;
	};

	// function goBack() {
	// 	if ((questionID.slice(0, -1) == 'emotion') && (subTrial[questionID] == 2)) {
	// 		for (var i=0; i<checkboxes.length; i++) {
	// 			 // And stick the checked ones onto an array...
	// 			 if (checkboxes[i].checked) {
	// 				 $('input[name=responseName_' + checkboxes[i].value + currentMem + ']').attr('checked',false);
	// 				 $('#' + checkboxes[i].value + currentMem).hide();
	// 			 }
	// 		}
	// 		$('#emotionSubmit' + currentMem).hide();
	// 		$('#checkbox_' + questionID).show();
	// 		subTrial[questionID]--;
	// 	} else if ((questionID.slice(0, -1) == 'wordCloud') && (subTrial[questionID] == 2)) {
	// 		words = [];
	// 		for (var i = 0; i < tboxes.length; i++) {
	// 			wordnum = i + 1;
	// 			$('input[name=responseName_wordCloud' + currentMem + wordnum + ']').attr('checked',false);
	// 			$('#word' + currentMem + wordnum).text('');
	// 			$('#wordDiv' + currentMem + wordnum).hide();
	// 		}
	// 		$('#' + questionID + '_rating').hide();
	// 		$('#wordSubmit' + currentMem).hide();
	// 		$('#textbox_' + questionID).show();
	// 		subTrial[questionID]--;
	// 	} else {
	// 		$('#' + questionID).hide();
	// 		if (questionID == 'relateAB') {
	// 			$('#responseA').hide();
	// 			$('#responseB').hide();
	// 			$('.columnContainer').css('border-style', 'none');
	// 		} else if (questionID == 'promptA2') {
	// 			$('#backButton').hide();
	// 		}
	// 		previousTrial();
	// 		questionID = questionList[phase-1][curTrial-1];
	// 		$('#' + questionID).show();
	// 		startTime = new Date().getTime();
	// 		returnedToTrials.push(questionID);
	// 	}
	// 	$('.emotionError').hide();
	// 	$('.emotionError2').hide();
	// 	$('.wordError').hide();
	// 	$('.wordError2').hide();
	// 	$('.responseError').hide();
	// };

	function goForward() {
		$('#' + questionID).hide();
		rt = new Date().getTime() - startTime;
		trialData = {'phase':phase,
								 'trial':curTrial,
								 'question':questionID,
								 'rt':rt,
								 'timeStamp':new Date()};
		psiTurk.recordTrialData(trialData);
		nextTrial();
	}

	function recordKeyPresses(e) {
	  memID = this.id;
		keyPressesMemoryA['txt'].push(e.which);
		keyPressesMemoryA['time'].push(new Date().getTime());
  }

	function nextTrial() {
		if (curTrial == nTrials[phase-1]) {
			curTrial = 1;
			if (phase == nPhases) {
				endit = true;
			} else {
				phase++;
				if (phase ==2) {
					$('.rowContainer').show();
				}
			}
		} else {
			curTrial++;
		}

		if (endit) {
			endExperiment();
		} else {
			showNext();
		}
	}

	// function previousTrial() {
	// 	if ((curTrial == 1) && (phase > 1)) {
	// 		// phase--;
	// 		// curTrial = nTrials[phase-1];
	// 		increment = true;
	// 		while (increment) {
	// 			phase--;
	// 			if (phase == 1) {
	// 				increment = false;
	// 			} else {
	// 				if (phase == 2) {
	// 					$('.rowContainer').show();
	// 				}
	// 				if (nTrials[phase-1] != 0) {
	// 					increment = false;
	// 				}
	// 			}
	// 		}
	// 		curTrial = nTrials[phase-1];
	// 	} else {
	// 		curTrial--;
	// 	}
	// }

	function showNext() {
		questionID = questionList[phase-1][curTrial-1];
		$('#' + questionID).show();
		startTime = new Date().getTime();

		if ((questionID == 'self_relateAB') || (questionID == 'other_relateAB')) {
			$('.columnContainer').css('border-style', 'solid');
			$('.columnContainer').css('border-width', '2px');
			memLabelA = "<span style=\"color: green\">Memory A:</span><br>";
			memLabelB = "<span style=\"color: blue\">Memory B:</span><br>";
			// document.getElementById('responseA').innerHTML = '<span style="color: green">Memory A:</span><br>' + $('#promptA2_store').val();
			// document.getElementById('responseB').innerHTML = '<span style="color: blue">Memory B:</span><br>' + $('#promptB2_store').val();
			$('#responseA').html(memLabelA + eventA);
			$('#responseB').html(memLabelB + eventB);
			$('#responseA').show();
			$('#responseB').show();
		}
	}

	function initializeExperiment() {
		//
		// this function initializes the trial orders for the current pair of events being judged
		//

		questionList = globalQuestionList;

		/* shuffle catch trial order */
		questionList[4] = shuffle(questionList[4]);
		questionList[4] = questionList[4].slice(0, 9);

		Papa.parse(csv, {
		 header: false,
		 delimiter: "|||",
		 dynamicTyping: true,
		 complete: function(results) {
			 memories = results;
		 }
		});

		memories = memories.data;
		memories = shuffle(memories);
		memories = memories[0];
		memoryID = memories[0];

		if (mycondition == 'self') {
			memories = shuffle(memories.slice(1, 3));
			eventA = ''; // this will be replaced by what the participant types
			eventB = memories[0];

			questionList[0].splice(questionList[0].indexOf('other_memoryA_prompt'), 2);
			questionList[0].splice(questionList[0].indexOf('other_memoryB_prompt2'), 1);
			questionList[0].splice(questionList[0].indexOf('other_relateAB'), 1);
			questionList[0].splice(questionList[0].indexOf('sharedPeopleAB'), 1);
			questionList[0].splice(questionList[0].indexOf('peopleSimilarityAB'), 1);
			questionList[0].splice(questionList[0].indexOf('causalAB'), 1);
			questionList[2].splice(questionList[2].indexOf('other_memory_prompt'), 2);
			$('#phase1_intermission .innerDiv').html("You will now make a series of judgments about both your own memory that you described and the other person's memory that you just read.<br><br>If the other person's memory is too vague to confidently make a judgment, make your best guess.")
			$('#overallSimilarityAB .innerDiv').html("Overall, how similar are the two memories?<br><br>Disregard the fact that one is your own and the other is someone else's");
		} else {
			questionList[0].splice(questionList[0].indexOf('self_memoryA_prompt'), 2);
			questionList[0].splice(questionList[0].indexOf('other_memoryB_prompt1'), 1);
			questionList[0].splice(questionList[0].indexOf('self_relateAB'), 1);

			eventA = memories[1];
			eventB = memories[2];

			$('#phase1_intermission .innerDiv').html("You will now make a series of judgments about the other person's two memories that you just read.<br><br>If the other person's memory is too vague to confidently make a judgment, make your best guess.")
			$('#overallSimilarityAB .innerDiv').html("Overall, how similar are the two memories?");
		}

		$('#other_memoryA_imagination .innerDiv').html('<em>"' + eventA + '"</em>');
		$('#other_memoryB_imagination .innerDiv').html('<em>"' + eventB + '"</em>');

		questionID = questionList[phase-1][curTrial-1];

		/* shuffle phase 1 trial order after the "overallSimilarityAB" question */
		shuffleStart = questionList[0].indexOf('overallSimilarityAB') + 1;
		questionList[0] = questionList[0].slice(0, shuffleStart).concat(shuffle(questionList[0].slice(shuffleStart)));


		/* remove the word cloud questions before shuffling phase 2 order */
		questionList[1].splice(questionList[1].indexOf('wordCloudA'), 1);
		questionList[1].splice(questionList[1].indexOf('wordCloudB'), 1);

		/* shuffle phase 2 trial order */
		/* check that shuffled phase 2 trial order doesn't have more than four consecutive questions about the same memory */
		keepShuffling = true;
		while (keepShuffling) {
			questionList[1] = shuffle(questionList[1]);
			keepShuffling = checkShuffleP2(questionList[1]);
		}
		/* add the word cloud questions back to the end of phase 2 */
		questionList[1] = questionList[1].concat(['wordCloudA', 'wordCloudB']);


		/* insert catch trials in phases 1 and 2 */

		questionList[0].splice(shuffleStart + 2, 0, questionList[4][0]);
		questionList[0].splice(questionList[0].length, 0, questionList[4][1]);
		questionList[1].splice(10, 0, questionList[4][2]);
		questionList[1].splice(20, 0, questionList[4][3]);
		questionList[1].splice(30, 0, questionList[4][4]);
		questionList[1].splice(40, 0, questionList[4][5]);
		questionList[1].splice(questionList[1].length, 0, questionList[4][6]);
		questionList[2].splice(questionList[2].length, 0, questionList[4][7]);
		questionList[2].splice(questionList[2].length, 0, questionList[4][8]);

	  nTrials = [];
		for (i = 0; i < nPhases; i++) {
			nTrials.push(questionList[i].length);
		}

		/* record order of trials */
		psiTurk.recordTrialData({'trialOrder':questionList});

	  $('#' + questionList[0][0]).show();
		globalStartTime = new Date().getTime();
	  startTime = new Date().getTime();
	}

	function endExperiment() {
		trialData = {'memoryA':eventA,
								 'memoryB':eventB,
								 'participantNumber':memoryID,
								 'condition':mycondition};

		psiTurk.recordTrialData(trialData);
		$('.rowContainer').hide();
		$('#end').show();
		$('#submitButton').show();
	}

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt);
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });


			},
			error: prompt_resubmit
		});
	};

	/***************************
  * END FUNCTION DEFINITIONS *
  ***************************/

	/* show experiment start page */
  psiTurk.showPage('memory_experiment.html');


	/* populate condition-dependent DOMs */
	// $('#promptA1 .innerDiv').html(htmlByCondition[mycondition]['promptA1']);
	// $('#promptB1 .innerDiv').html(htmlByCondition[mycondition]['promptB1']);
	// $('#relateAB .innerDiv').html(htmlByCondition[mycondition]['relateAB']);
	// $('#additionalTextAB .innerDiv').html(htmlByCondition[mycondition]['additionalTextAB']);

	var globalQuestionList = [getQuestionIDs('phase1'), getQuestionIDs('phase2'),
														getQuestionIDs('phase3'), getQuestionIDs('phase4'),
														getQuestionIDs('catch')]; // add question names to this list, separated by phase

	initializeExperiment();

  /* Wait for clicks */
  $('.questionSubmit').click(textSubmitted);
  $('.responseButton').click(buttonClicked);
  $('.feedbackSubmit').click(buttonClicked);
  $('.responseSubmit').click(buttonClicked);
  $('.emotionSubmit').click(emotionSubmitted);
  $('.emotionFinish').click(submitEmotionRatings);
	$('.wordSubmit').click(wordSubmitted);
	$('.wordFinish').click(submitWordRatings);
	// $('#backButton').click(goBack);
	$('.forwardButton').click(goForward);
	// $('#forwardButton').click(goForward);
	// $('.chbox').click(chboxClicked);
	$('#responseID_self_memoryA_generation').keyup(recordKeyPresses);
  $("#finish").click(function () {
		finishData = {'totalElapsedTime':new Date().getTime() - globalStartTime,
									'returnedTo':returnedToTrials};
		psiTurk.recordTrialData(finishData);
    psiTurk.saveData({
    	success: function(){
      	psiTurk.completeHIT();
      },
      error: prompt_resubmit});
	});
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
 // In this example `task.js file, an anonymous async function is bound to `window.on('load')`.
 // The async function `await`s `init` before continuing with calling `psiturk.doInstructions()`.
 // This means that in `init`, you can `await` other Promise-returning code to resolve,
 // if you want it to resolve before your experiment calls `psiturk.doInstructions()`.

 // The reason that `await psiTurk.preloadPages()` is not put directly into the
 // function bound to `window.on('load')` is that this would mean that the pages
 // would not begin to preload until the window had finished loading -- an unnecessary delay.
$(window).on('load', async () => {
    await init;
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new memoryQuestionnaire(); } // what you want to do when you are done with instructions
    );
});

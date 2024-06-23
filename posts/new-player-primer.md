---
title: "Fantasy Premier League Primer"
date: "2024-05-23"
summary: "Guide to all things Fantasy Premier League and Game of Stones!"
---

<style>
body {
    margin-right: 15%; 
}
table, th, td {
    table-layout: fixed;
    border-collapse: collapse;
    border: 1px solid;
    padding: 0.5rem;
    margin-left: auto;
    margin-right: auto;
}
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid;
}
.sidenav {
  width: 12rem;
  position: fixed;
  z-index: 1;
  top: 8rem;
  right: 8rem;
  overflow-x: hidden;
  border: 1px solid;
}
.sidenav a {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  text-decoration: none;
  color: #FFFFFF;
  display: block;
}
.sidenav b {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid;
}
.sidenav a:hover {
  color: #B3B3B3;
}
@media only screen and (max-width: 1100px) {
    #sidenav {
        display: none;
    }
}
</style>

---

<div class="sidenav" id="sidenav">
<b>Quick Access</b>
<a href="#table-of-contents">Table of Contents</a>
<a href="#the-basics">The Basics</a>
<a href="#the-game-of-stones">The Game of Stones</a>
<a href="#help">Help</a>

</div>

**Table of Contents** <a name="table-of-contents"></a>

1. [The Basics](#the-basics)
   1. [Types of Fantasy Premier Leagues](#types-of-fantasy-premier-leagues)
   2. [Picking a Team](#picking-a-team)
   3. [Scoring](#scoring)
      1. [Bonus Points System](#bonus-points-system)
   4. [Transactions](#transactions)
      1. [Waivers](#waivers)
2. [The Game of Stones](#the-game-of-stones)
   1. [League Setup](#league-setup)
   2. [Background](#background)
      1. [Season 1](#season-1)
      2. [Season 2](#season-2)
      3. [Season 3](#season-3)
         1. [Promotion / Relegation](#promotion--relegation)
      4. [Game of Stones Hub](#game-of-stones-hub)
   3. [League Perks](#league-perks)
      1. [Stats](#stats)
      2. [Weekly Updates](#weekly-updates)
      3. [Manager of the Month](#manager-of-the-month)
      4. [Mid-Season Tournaments](#mid-season-tournaments)
      5. [Prizing](#prizing)
3. [Help](#help)
   1. [Navigating the App / Website](#navigating-the-app--website)
      1. [The App](#the-app)
         1. [Home / Status](#home--status)
         2. [Points](#points)
         3. [Pick Team](#pick-team)
         4. [More > Transactions](#more--transactions)
         5. [More > League](#more--league)
         6. [More > Fixtures](#more--fixtures)
         7. [More > Draft Room](#more--draft-room)
         8. [More > Help](#more--help)
   2. [Learning about the Premier League](#learning-about-the-premier-league)
      1. [Following Along](#following-along)
   3. [Who do I draft?](#who-do-i-draft)
      1. [Draft Strategies](#draft-strategies)
         1. [Draft Sheet](#draft-sheet)
         2. [Player Prioritization](#player-prioritization)
         3. [Draft Prioritization](#draft-prioritization)

---

# The Basics <a name="the-basics"></a>

Fantasy Premier League is a fantasy game similar to any other fantasy sport game. There are three ‘modes’ that the Premier League provides via its website- Official Fantasy, Fantasy Challenge, and Fantasy Draft. The following contains a brief description of each of these modes, but we are using Fantasy Draft, so feel free to skip ahead:

### Types of Fantasy Premier Leagues <a name="types-of-fantasy-premier-leagues"></a>

[Official Fantasy Premier League](https://fantasy.premierleague.com/)

In this mode, each player has a flexible cost associated with them and the manager gets a 100 million pound budget to build a team. You can make 1 free transfer per week (carries over for a maximum of 2), with each transfer after that costing points. There are also various boosts you can play a certain number of times a season, and you get a captain, which allows you to score double points on whoever you elect. Typically, players either compete in mini-leagues or larger leagues, while owning just the single team. Oftentimes, people will focus on their ‘Overall Rank’ or rank against all owners of teams.

[Fantasy Challenge](https://fplchallenge.premierleague.com)

This is a new mode where you can change your entire team every week. Each week, there is a new challenge that influences how scoring works. This is typically only played in a smaller size league.

[Fantasy Draft](https://draft.premierleague.com/)

This mode is similar to NFL Fantasy Football, where there is a fixed number of participants and a draft, so everyone has a unique set of players. In this mode, the league admin can choose between a couple of different scoring methods, but usually head-to-head scoring is used. More on this league type later.

### Picking a Team <a name="picking-a-team"></a>

No matter what type of league you’re in, you’ll need a team. A team in Fantasy Premier League consists of 15 players. This set of players is broken down into 4 positions: Goalkeepers, Defenders, Midfielders, and Forwards. In total, you will have 2 goalkeepers, 5 defenders, 5 midfielders, and 3 forwards. 11 of these players will start any given gameweek, with the remaining 4 on the bench. However, there are restrictions on what formation (number of defenders, midfielder, and forwards) you can use. The rules are as follows:

- 11 players on the field
- 4 players on the bench
- 1 Goalkeeper on Field
- 3+ defenders
- 2+ midfielders
- 1+ forward

This means that you must play at least 3 defenders, 2 midfielders, and 1 forward. You can only ever play 1 goalkeeper. Obviously, you won’t be able to field this minimum number in every position because of the 11 players on the field requirement, but you do have some flexibility as to who is on the field. The following are a couple of different formations that I have used:

<Image
src="/images/new-player-primer/picking_a_team_0.jpg"
height={144}
width={144}
/>

As you can see, you’ll need to change your team based on injuries, form, or matchup for that week. However, if a player suddenly gets injured, or falls sick, or does not play for whatever reason, they will be automatically subbed at the conclusion of the gameweek for the leftmost player on your bench who has played, as long as all above formation rules are still followed. This means that if you have two injured defenders on your bench and a defender on the field does not play, a midfielder on the bench will not be subbed on in their place. On the other hand, if you have a defender who played in your 2nd bench slot next to an injured defender and an on-field defender does not play, the 1st bench slot will be skipped and your uninjured defender will be subbed in. This process is all done automatically, so just make sure you have your bench order right!

### Scoring <a name="scoring"></a>

In order to pick the right team, you will first have to predict who on your team will score the most points. Scoring in Fantasy Premier League is, in ways, more and less complicated than scoring in NFL Fantasy Football. Instead of scoring every action, Fantasy Premier League breaks down scoring specific actions. These actions are scored differently for each position. The positional breakdown for scoring is as follows:

Goalkeepers

- Goal Scored
  - 6 points
- Clean Sheet
  - 4 points
- Every 3 Saves
  - 1 point
- Penalty Save
  - 5 points
- 2 Goals Conceded
  - -1 point

Defenders

- Goal Scored
  - 6 points
- Clean Sheet
  - 4 points

Midfielders

- Goal Scored
  - 5 points
- Clean Sheet
  - 1 point

Forwards

- Goal Scored
  - 4 points

All Positions

- Playing up to 60 minutes
  - 1 point
- Playing over 60 minutes
  - 2 points
- Assist
  - 3 points
- Penalty Miss
  - -2 points
- Yellow Card
  - -1 point
- Red Card
  - -3 points
- Own Goal
  - -2 points

Some things to note here include Fantasy assists being more lenient than assists granted by the Premier League. These include things like winning a penalty or free kick, shots saved by the goalkeeper that are scored on the rebound, etc. Additionally, red card negative points include any yellow card deductions (as in, they don’t give -4 points for two yellows, just -3), and the player who has been red carded will be further penalized for any goals conceded by their team after they are sent off.

#### Bonus Points System <a name="bonus-points-system"></a>

The Bonus Points System is an archaic, complicated system that uses a range of statistics to determine a ranking of the best players in a match. The three best performing players in each match are awarded bonus points, regardless if their team won or not. Regarding ties:

- If there is a tie for 1st, Player 1 and Player 2 will receive 3 bonus points and Player 3 will receive 1
- If there is a tie for 2nd, Player 1 will receive 3 bonus points and Player 2 and Player 3 will receive 2
- If there is a tie for 3rd, Player 1 will receive 3 bonus points, Player 2 will receive 2 bonus points, Player 3 and Player 4 will receive 1

Note: The Bonus Points System is a score that determines the number of Bonus Points a player wins. A BPS score will be in the 10s/100s, while any player will only receive up to 3 bonus points. The following table contains BPS scores for various statistics that are taken into account (taken from the [Fantasy Draft Help page](https://draft.premierleague.com/help)).

| Action                                          | Points | Action                                        | Points |
| :---------------------------------------------- | :----- | :-------------------------------------------- | :----- |
| Playing 1 to 60 minutes                         | 3      | Scoring the game winning goal                 | 3      |
| Playing over 60 minutes                         | 6      | 70-79% pass completion (30+ passes attempted) | 2      |
| Goalkeeper / Defender scoring a goal            | 12     | 80-89% pass completion (30+ passes attempted) | 4      |
| Midfielder scoring a goal                       | 18     | 90%+ pass completion (30+ passes attempted)   | 6      |
| Forward scoring a goal                          | 24     | Conceding a penalty                           | -3     |
| Assist                                          | 9      | Missing a penalty                             | -6     |
| Goalkeeper / Defender keeping a clean sheet     | 12     | Yellow card                                   | -3     |
| Saving a penalty                                | 15     | Red card                                      | -9     |
| Save                                            | 2      | Own goal                                      | -6     |
| Successful open play cross                      | 1      | Missing a big chance                          | -3     |
| Creating a big chance                           | 3      | Error that leads to a goal                    | -3     |
| 2 clearances, blocks, and interceptions (total) | 1      | Error that leads to an attempt at goal        | -1     |
| 3 recoveries                                    | 1      | Being tackled                                 | -1     |
| Key pass                                        | 1      | Conceding a foul                              | -1     |
| Successful tackle (net)                         | 2      | Caught offside                                | -1     |
| Successful dribble                              | 1      | Shot off target                               | -1     |

### Transactions <a name="transactions"></a>

Once you have picked your team, you may realize that you have injured players, or players who don’t play, or you may just be generally unhappy with the state of your team. In order to change players, you have two options: creating a transfer request with another manager, or signing a free agent.

Transaction requests with other managers must contain the same number of each position on each side. Unfortunately, uneven trades, i.e. midfielder for forward, are not allowed. The following is an example of a valid, multi-position transaction:

<Image
src="/images/new-player-primer/main_transactions_1.jpg"
height={144}
width={144}
/>

On the other hand, you can also directly exchange a player on your team with a free agent player. You _must_ exchange a player of the same position in order to complete this trade.

<Image
src="/images/new-player-primer/main_transactions_2.jpg"
height={144}
width={144}
/>

Once you have signed this player, one of two things will happen depending on the timing- either this player will be signed immediately or they will be added to your waiver list.

#### Waivers <a name="waivers"></a>

The ‘waiver order’ is a reverse list of the league table, in which each manager receives a turn at choosing a player. Once a manager’s turn comes up, the system will check if the top player on their list is available and take them. Then, the next manager will get their turn, and so on. If the player is not available, the system will go down the list and take the next available player. The following is an example of a waiver list:

<Image
src="/images/new-player-primer/main_waivers_1.jpg"
height={144}
width={144}
/>

Example - I am 8th in waiver order. Martinelli was taken by the manager 4th in the order. Once my turn comes around, I receive Hamer for Kluivert. During the next go-around, I receive Smith for Pinnock.

Waivers are always processed 1 day before the Gameweek deadline - the time your team is locked for the week. The 24 hours between the waivers being processed and the deadline is called Free Agency. During this time, all transactions are immediate and final. All players who leave a team during Free Agency or Waivers are locked until the next gameweek.

---

# The Game of Stones <a name="the-game-of-stones"></a>

### League Setup <a name="league-setup"></a>

The Game of Stones is a Fantasy Premier League Draft League. We use a snake draft that is randomly generated a few hours before the draft time, along with a randomly generated Head to Head schedule. Each manager will face off against every other manager at least twice, depending on league size, for all 38 gameweeks of the season. The 1st place manager at the end of the season is crowned our champion.

We also have a few different non-official tournaments and cups throughout the season. These typically occur to drive interest in the league and give out small prizes to managers throughout the season.

### Background <a name="background"></a>

#### Season 1 <a name="season-1"></a>

The first season of the Game of Stones was a 16 team brawl. **Darryan** was crowned champion with 88 points and a record of 28-4-6, consistently matching up well against **Matthew’s** team, who finished on 79 points, with a record of 26-1-11. **Dylan** and **Jesse** rounded out the top 4, during a hard fought final day in which they triumphed against **Andrew**, **MatthewR**, and **Scott**, who finished in our Europa and Conference League slots.

<Image
src="/images/new-player-primer/season_1.jpg"
height={144}
width={144}
/>

#### Season 2 <a name="season-2"></a>

Game of Stones Season 2 saw 8 returning managers of the 16 alongside 4 brand new managers, adding up to a total of 12 managers. This season, **Matthew** was crowned champion with 82 points and a record of 27-1-10. Newcomers **Luke** and **Gavin** finished 2nd and 3rd on 73 and 66 points, respectively. **Dylan** rounded out the top four, followed closely by **MatthewR**, **Kevin**, and **Scott**.

This season saw the introduction of [mid-season tournaments](#mid-season-tournaments). These are unofficial tournaments run by hand, with a small prize given to the winner. The first of which was the **December Cup**. This cup ran for the 7 gameweeks in December 2023, and consisted of a group stage - 3 groups of 4 - and a single elimination knockout stage. **Matthew** picked up the win in the two-legged final over **Andrew**. The second tournament of this season was the **Champions Cup**, a tournament that ran for 11 gameweeks to close out the season. Unlike the December Cup, the Champions Cup group stage consisted of only 2 groups of 6, which seeded a two-legged, single elimination bracket to crown the winner. **Matthew** defeated **Luke** to take home the trophy of the Champions Cup and a treble on the season.

<Image
src="/images/new-player-primer/season_2.jpg"
height={144}
width={144}
/>

#### Season 3 <a name="season-3"></a>

This is where you come in! Season 3 will see a yet again expanded Game of Stones as we increase player count back up to 16. New players this season include **Matt**, **Coop**, **Rebecca**, and _a mystery manager_. Once again, this season will have [mid-season tournaments](#mid-season-tournaments), [prizes](#prizing), and lots of fun(and stats)!

##### Promotion / Relegation <a name="promotion--relegation"></a>

Pending interest in a Game of Stones Season 4, this season will feature a promotion / relegation system, in which the bottom 4 managers at the end of the season will become the first 4 in an expansion, secondary division. More information on the proposal can be found [here](https://docs.google.com/document/d/1RplpLIs3XZYLPrcWTdnL1-tLr49FxJlqfrejghhKjzE/edit?usp=sharing).

In summary, Season 4 will feature 2 Game of Stones leagues, where the top 2 teams in the second division will be promoted into Season 5 to replace the bottom two teams in the first division. This system will both allow for more managers to become involved with the league(s), while adding additional stakes and prizes for managers in both divisions.

#### Game of Stones Hub <a name="game-of-stones-hub"></a>

[Link here](https://docs.google.com/document/d/1kVKEHS9vLEELDXhDjhhJc0ZREBeaqg66Qdbk0k44_MU/edit?usp=sharing).

### League Perks <a name="league-perks"></a>

The Game of Stones is a _unique_ Fantasy League, in that its administrator is… extra, to say the least. That means, the league benefits in a few unique ways that not all Fantasy Leagues may have.

#### Stats <a name="stats"></a>

Every score for every week is tracked in a spreadsheet, leading to a variety of fun stats to observe as the season progresses. Things like performance, luck, form, league score breakdowns, manager score breakdowns, position and points timelines, etc. are all tracked and shared on a weekly basis. A record book is also kept, consisting of season - and all-time - high scores, low scores, winning streaks, losing streaks, biggest victories, etc. The spreadsheet is continually updated and new stats and suggestions are always welcomed.

#### Weekly Updates <a name="weekly-updates"></a>

Every gameweek, a Weekly Update is released that covers a number of details on what occurred across the past week. This includes key or close matchups and their scores, changes in the overall table or form table, updates in the Manager of the Month race, and what to expect in the coming gameweek. Generally, these are pinged to everyone via the Discord server, but this may change in the future.

#### Manager of the Month <a name="manager-of-the-month"></a>

Every month, we give a small award to the manager who has won the most points. This is generally a percentage of the total prize pool, plus a starter value (more on prizing later). The first tiebreaker after points is points for. This award incentivizes both contributions to the prize pool along with a mini-competition for all managers every month.

#### Mid-Season Tournaments <a name="mid--season-tournaments"></a>

Occasionally, a mid-season tournament will be thrown together. Usually, these will have more modest prizes than the entire campaign, but provide another outlet of competition for those who may be having trouble in the league. The scoring remains the same as in the regular Fantasy League, but matchups will be changed, giving managers two matches in a week rather than just one.

#### Prizing <a name="prizing"></a>

End of season prizes consist of each player in the top X, league size dependent, winning a percentage of the total pot. Then, the leftovers will go into the manager of the month pot, which is aggregated with a starter value and given to each winner of the award. The winner of the league also gets a Premier League jersey of their choice (highly recommended to be a player from their fantasy team). An example prizing breakdown for a $100 total prize pool is as follows:

- 1st
  - Jersey
  - $50
- 2nd
  - $25
- 3rd
  - $15
- Manager of the Month
  - $1 ($10 / 10 months) + $5 = $5.83

---

# Help <a name="help"></a>

### Navigating the App / Website <a name="navigating-the-app--website"></a>

One of the biggest pain points to Fantasy Premier League is navigating the app and website. Both are generally not intuitive and it can be easy to get lost in the maze. The following section will breakdown the various pages, buttons, and information so that you can easily parse it.

#### The App <a name="the-app"></a>

##### Home / Status <a name="home--status"></a>

The main app page is broken down into a couple of different options. The top will be information on your Official Premier League team, but you will have to use the **Fantasy Draft** button to access the Game of Stones league. This is because Fantasy Draft is a different site / API than the Official game mode.

<img src="/images/new-player-primer/home_status_1.jpg" width="264" height="476">

Once in Fantasy Draft, you will see the Status page. _If mid-season, sometimes the app will open to the [Fixtures tab](#more--fixtures), which will be covered later._ This is the main hub of the app, and contains some important information.

<img src="/images/new-player-primer/home_status_0.jpg" width="1056" height="476">

The top section of this page (image 1) will be different depending on the time of the week, but generally, it will contain your score for the current (or most recent) gameweek along with the upcoming Waiver Deadline and Gameweek Deadline.

Further down the page (image 2), you will see a list of players, along with their calculated Form. This is some reflection of their recent scores.

Scrolling further down (image 3), you’ll notice league trades, waivers, and free agent signings. Once the Waiver Deadline has passed, this will be where you can see all waiver requests in the league.

The final information on this page (image 4) are the players of each week, and the Gameweek status. During a gameweek, this status will be moved to the top of this page and will indicate if matches are ongoing and when match points and bonus points have been confirmed. Once the gameweek is over, the league tables section will switch to ‘Updated.’

##### Points <a name="points"></a>

The points page is fairly self-explanatory: it contains the points scored for the most recent (or current) gameweek. If you scroll further down the page, you’ll be able to find information on the current gameweek’s matches and scores, along with additional information regarding your own team. This includes transaction history, team and league details, and more!

<img src="/images/new-player-primer/points_0.jpg" width="792" height="476">

If you’d like more information on a player’s points and stats, you can also click/tap a player and you will receive a breakdown of their points for the gameweek. Click ‘View Information’ and you’ll receive a breakdown of their season stats.

<Image
src="/images/new-player-primer/points_01.jpg"
height={144}
width={144}
/>

##### Pick Team <a name="pick-team"></a>

The Pick Team page allows you to select your team for the upcoming gameweek. Underneath a player, it lists what team that player will play against and if they are home (H) or away (A). In order to swap players, you can select a player, then hit ‘Switch’ to move the player. **Don’t forget to hit ‘Save Your Team’** underneath the lineup graphic to save your lineup. For some reason, it does not automatically save.

<img src="/images/new-player-primer/pick_team_1.jpg" width="264" height="476">

##### More > Transactions <a name="more--transactions"></a>

The ‘More’ tab contains a number of additional pages that are vital to Fantasy Premier League. The first being the Transactions page.

This page contains a Search for any player in the league, a ‘View’ filter that lets you sort by position or team, and a ‘Sort’ filter that will order your results by any number of stats. If you’d like the advanced stats for a player, you can click the i next to their name.

The Transactions tab also allows you to create a Watchlist of any players in the league, as well as showing any ongoing transactions you have initiated.

The ‘Show available’ check box is also very helpful, as it will sort out all owned players and only show free agents who can be signed.

If you would like to sign a free agent or initiate a trade with another player, press the plus sign in the Sign column or the manager Initials.

<img src="/images/new-player-primer/transactions_1.jpg" width="264" height="476">

##### More > League <a name="more--league"></a>

Perhaps the most important tab, the League page contains information regarding the Game of Stones league, including the League Table, upcoming fixtures, and past results.

<img src="/images/new-player-primer/league_0.jpg" width="792" height="476">

Important to note on these pages, if you click on a manager it will take you to either their most recent or current gameweek Points page, or the corresponding Points page if on the Results tab. The Fixtures and Results tab will also let you filter by team, so you can see upcoming fixtures or recent results for a specific team.

##### More > Fixtures <a name="more--fixtures"></a>

The Fixtures tab contains information about the gameweek scores in the Premier League. Usually, this defaults to the upcoming gameweek, so if you want to look at the current week’s scores, you’ll have to hit the Previous button.

If you select a fixture that has already been played or is in progress, you will be shown all point altering statistics related to the game. Most importantly, this also shows the current Bonus Point System scores, so not only can you quickly look and see who will be gaining bonus points mid-gameweek, you’ll also have a quick way of checking who performed well in a match.

<Image
src="/images/new-player-primer/fixtures_1.jpg"
height={144}
width={144}
/>

##### More > Draft Room <a name="more--draft-room"></a>

This is the Draft Hub for the league. Before the league starts, you will be able to add players to your Watchlist to quickly and easily make your picks, or allow the system to choose players for you if you were to miss the draft. Players are by default listed in order of ‘Draft Rank’ or an arbitrary ranking created by the Fantasy Premier League creators. If you don’t make a pick and don’t have any valid players on your Watchlist, you will select based on the highest available ‘Draft Rank.’

Generally, they do an okay job at ranking players, but they are known to miss both high and low on their evaluations. Some additional draft information is located in the '[Who do I draft?](#who-do-i-draft)' section.

<Image
src="/images/new-player-primer/draft_room_1.jpg"
height={144}
width={144}
/>

##### More > Help <a name="more--help"></a>

Lastly, the Help page is useful for miscellaneous information regarding technical issues, player data and bonus point questions, and - most importantly - contains the list of BPS statistics under the Rules tab.

### Learning about the Premier League <a name="learning-about-the-premier-league"></a>

Fortunately, the Premier League is very easy to watch in the US, as long as you are willing to wake up early enough for it. All matches are either streamed on Peacock or USA Network, and the NBC Youtube channel uploads highlights for all matches.

My recommendation would be to watch a wide variety of teams and matches, figuring out teams you like watching and learning names of players. It’s easy to get attached to a team who scores a lot of goals or plays exciting soccer, so I recommend finding those teams (or just choosing a team with a cool mascot/name). If you need any suggestions, feel free to ask! I watch _a lot_ of soccer.

#### Following Along <a name="following-along"></a>

If you’re like me, you might want an app to use to quickly check scores, lineups, and get notification reminders for matches. I highly recommend Fotmob, but I’ve heard of people using the Premier League app, Sofascore, Flashscore, and others.

If you’re interested in more advanced stats, here are some sites you may be interested in:

- https://www.transfermarkt.us/
  - For transfer rumors, market values, transfer history of players, etc.
- https://www.whoscored.com/
  - General soccer statistics
- https://fbref.com/en/
  - More soccer statistics
- https://optaplayerstats.statsperform.com/
  - More soccer statistics; backer for the Fantasy Premier League BPS system

### Who do I draft? <a name="who-do-i-draft"></a>

So you probably just read through all of this and maybe kinda understand how the league and app and process works, but you are new to Fantasy Premier League (or the Premier League in general) and don’t really know who to draft. In this section, I’ll outline a few commonly used draft strategies and resources that can help you prep for a draft!

#### Draft Strategies <a name="draft-strategies"></a>

Some people who are more familiar with the Premier League may be comfortable not having a draft strategy or just ‘winging it’ when the day comes to put together your team. This doc is generally not going to be for that person.

##### Draft Sheet <a name="draft-sheet"></a>

At the very least, you may want to put together a Draft Sheet. This is a piece of paper/doc/note/scribble that you can use on the day of drafting to quickly find your next player. [This](https://docs.google.com/document/d/13j6_0emWLaBTDBcFPnAkbbuiu8_xxuotWd0zhoX3Asg/edit?usp=sharing) is my _very_ rough version of a Draft Sheet that I used for the 2023/2024 season draft. Usually, I split this up by position so I can get a quick glance at players I have been thinking about before the draft. On top of this, I use the Watchlist functionality to add various players I want to quickly decide between on draft day.

##### Player Prioritization <a name="player-prioritization"></a>

Because of Fantasy Premier League’s [scoring system](#scoring), you should prioritize players who will get **returns**. Returns are when a player gets more than ~3 points in a week, and will make up the bulk of your scoring that gameweek. Returns will most often come from goals, assists, and clean sheets, so pick players who get lots of those!

Well, this is easier said than done and there are always players who come out of nowhere over the course of a season. But to start the season, there are some general rules that I follow when deciding if I want to draft (or consider drafting) a player. Generally, I like to have a number of safe picks on my team, complimented by a few players who have high potential.

Positives:

- Plays for a ‘big team’
  - Usually, ‘big teams’ have more resources, will do better over the course of the season, keep more clean sheets, and score more goals.
  - Usually, this is most important for Defenders and Goalkeepers, who will be getting points from clean sheets.
- Plays out of position or multiple positions
  - Oftentimes, Fantasy Premier League doesn’t quite allocate players to the correct position.
  - If a player is labeled as a more defensive position than they actually play on the pitch, this can result in more points for things like goals and clean sheets.
  - This often manifests as Midfielders playing striker or winger, or Defenders playing wingback or occasionally winger. A good example of the former would be Richarlison (MID) playing Striker for Spurs
- Historical scores
  - If the players has put up a lot of points in Fantasy Premier League in the past, there is a good chance they can do it again
  - Generally, the more seasons they have produced at a high level, the more likely they will continue with that trend
- Plays lots of minutes

  - Generally, the longer a player is on the field, the more opportunity they have to score and assist
  - This means you should prioritize players who start games. Most substitutions are not made before 60 minutes, meaning starters are almost always eligible for clean sheets points and their 2nd playing time point

  The following list contains some information I like to consider about a player when drafting them or transferring them in that can result in higher (or lower) than expected scores. Usually, I like to keep a couple of these players on my team in case they run into good form.

Risks:

- New Manager
  - Oftentimes, a team in the Premier League will have the most question marks around its performances when it hires a new manager
  - You can gleam a lot of information on how a team will play based on how the manager played at past clubs, but it is never a certainty
  - Team morale and on-the-field chemistry is often an uncertainty at this point in time
- New Player to the league
  - Transfers into the Premier League are always risky. The player may feel homesick, have trouble adapting, or just not be a good fit for their new team
  - Often, new players are slowly eased into their new team, playing less minutes than players who they may replace over time
  - However, there is a very high potential for these players if they were to do well (there’s a reason they were bought, right?)
- Newly Promoted Teams
  - Players from these teams are typically a lot riskier than not.
  - Typically, I would steer clear of all Defenders from these teams as they are unlikely to keep a lot of clean sheets
  - Depending on their playstyle, attackers from these clubs can be worth picking up

##### Draft Prioritization <a name="draft-prioritization"></a>

Now, you may be wondering how to sort through a list of hundreds of players and decide who to draft. To start, let’s look at some strategies over the 15 rounds.

**Attacking Focus**

Generally, Forwards and Midfielders score more points. They get goals/assists, and midfielders gather clean sheet points. This means that logically, you should draft the majority of your Forwards and Midfielders in the early rounds.

Going a step forward, it is important to note that due to there being much fewer Forwards than Midfielders, the competition for the few good players who play in the Forward position will be high. You may wish to prioritize picking up your 3 Forwards in the early rounds. For example, in the 23/24 season, my first 4 picks were:

1. Ollie Watkins (FWD)
2. Alexander Isak (FWD)
3. James Maddison (MID)
4. Nicolas Jackson (FWD)

I decided to take this route for 2 reasons: the extra time changes for the 23/24 season increasing the number of goals per game and the relative lack of good Forward options in the Fantasy Premier League pool. These 3 Forwards netted me 542 points over the course of the season.

**Balanced Focus**

The other method I can recommend is more of a balanced approach. This means taking the player you think is the best available, regardless of position. Usually, this results in filling up your midfield slots and 1 or 2 of your defender slots before the later rounds hit. This method works especially well if there are players who you feel like you cannot pass up on.

With the majority of top scorers being midfielders, this can be a beneficial tactic. Let’s look at the beginning of Dylan’s draft from the 23/24 season as an example.

1. Mohamed Salah (MID)
2. Darwin Nunez (FWD)
3. Fabian Schar (DEF)
4. Eberechi Eze (MID)

Dylan decided to take Mo Salah at #2 overall for good reason: he’s scored over 200 in all 7 of his Liverpool seasons and has the only 300+ point season in Fantasy Premier League history. Then, he followed it up with a late 2nd round, high value Forward pick, then a ‘best available’ defender pick in Fabian Schar. These three picks picked up 466 points over the season, each running into stretches of poor form and injury.

**Later Rounds**

Something to note here is that a lot more players will go off the board faster than you think, and you may start running thin on your draft sheet. This is when managers pick up the hidden gems: players who will get you 150 points over the season and be considered “steals.” This is when you should refer to the [Player Prioritization](#player-prioritization) section. Consider these when picking up players in the later rounds:

- Playing time
  - You want players who will start the match on the field, able to earn clean sheet points and an extra playing time point for playing over 60 minutes
- Position
  - Goalkeepers
    - Generally, goalkeepers are a later round pickup(usually starting in round 8/9). They do not earn you a ton of points over the course of the season
      - The highest scoring GKP of 23/24 had 153 points
    - Prioritize Clean Sheets (think “big teams”) and when in doubt, “saves”
    - The worse the team is, the more saves and goals conceded the goalkeeper will have
- Defenders
  - You will generally want fullbacks or wingbacks, because they will be getting further forward and have higher opportunity for goals/assists
  - There are a small number of center backs with attacking threat on set pieces who are also valuable
- Midfielders
  - You do not want defensive midfielders
  - You will generally want Wingers, Attacking Midfielders (‘10s’), or Strikers (out of position); the further forward a midfielder plays, the better
- Set pieces
  - If a player takes set pieces (corners, free kicks, penalties), they are much more valuable
- Team
  - Defenders from teams who concede less / keep more clean sheets (historically) or “big teams”
    - Outside of teams who generally finish near the top of the table: Everton, Fulham, Aston Villa, Brentford are generally good picks [not exhaustive]
  - Attackers from teams who score lots of goals
    - Outside of teams who generally finish near the top of the table: Newcastle, Aston Villa, West Ham/Brentford/Brighton (historically) [not exhaustive]
- New players
  - Sometimes, you may come across pieces of information other managers have not seen. Feel free to share it, or keep it for yourself and pick up Destiny Udogie (starting LB for Tottenham) in the 13th round, like me in 23/24

**Draft Rank**

Draft Rank is something you can follow to approximate how good a player will be, but do not take too much stock into it. The highest scoring player of 23/24 was DR 283 and hadn’t even been transferred to the team he scored 244 points on yet. The DR 5 player had 108 points total. It can be a good guide to see what highly rated players are available when your clock is ticking, but I would recommend doing some research and coming up with your own list.

---

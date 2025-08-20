import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";

function GetWinterGroups() {
  return (
    <div>
      <h3 className={utilStyles.main}>Group A</h3>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Manager</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link href={`/history/manager/matthew`}>Matthew</Link>
            </td>
            <td>2</td>
            <td>0</td>
            <td>1</td>
            <td>108</td>
            <td>6</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/luke`}>Luke</Link>
            </td>
            <td>2</td>
            <td>0</td>
            <td>1</td>
            <td>101</td>
            <td>6</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/darryan`}>Darryan</Link>
            </td>
            <td>1</td>
            <td>0</td>
            <td>2</td>
            <td>106</td>
            <td>3</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthewr`}>MatthewR</Link>
            </td>
            <td>1</td>
            <td>0</td>
            <td>2</td>
            <td>81</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className={utilStyles.extendedHistoryTable}>
        <tbody>
          <tr>
            <th>Gameweek 1</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthew`}>Matthew</Link>
            </td>
            <td>42</td>
            <td>40</td>
            <td>
              <Link href={`/history/manager/darryan`}>Darryan</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthewr`}>MatthewR</Link>
            </td>
            <td>47</td>
            <td>14</td>
            <td>
              <Link href={`/history/manager/luke`}>Luke</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 2</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthew`}>Matthew</Link>
            </td>
            <td>40</td>
            <td>53</td>
            <td>
              <Link href={`/history/manager/luke`}>Luke</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthewr`}>MatthewR</Link>
            </td>
            <td>12</td>
            <td>36</td>
            <td>
              <Link href={`/history/manager/darryan`}>Darryan</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 3</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/matthew`}>Matthew</Link>
            </td>
            <td>26</td>
            <td>22</td>
            <td>
              <Link href={`/history/manager/matthewr`}>MatthewR</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/luke`}>Luke</Link>
            </td>
            <td>34</td>
            <td>30</td>
            <td>
              <Link href={`/history/manager/darryan`}>Darryan</Link>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className={utilStyles.main}>Group B</h3>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Manager</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link href={`/history/manager/gavin`}>Gavin</Link>
            </td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>129</td>
            <td>9</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/zach`}>Zach</Link>
            </td>
            <td>2</td>
            <td>0</td>
            <td>1</td>
            <td>104</td>
            <td>6</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/scott`}>Scott</Link>
            </td>
            <td>1</td>
            <td>0</td>
            <td>2</td>
            <td>76</td>
            <td>3</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/jesse`}>Jesse</Link>
            </td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>64</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className={utilStyles.extendedHistoryTable}>
        <tbody>
          <tr>
            <th>Gameweek 1</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/gavin`}>Gavin</Link>
            </td>
            <td>45</td>
            <td>33</td>
            <td>
              <Link href={`/history/manager/zach`}>Zach</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/jesse`}>Jesse</Link>
            </td>
            <td>16</td>
            <td>29</td>
            <td>
              <Link href={`/history/manager/scott`}>Scott</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 2</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/gavin`}>Gavin</Link>
            </td>
            <td>45</td>
            <td>21</td>
            <td>
              <Link href={`/history/manager/jesse`}>Jesse</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/scott`}>Scott</Link>
            </td>
            <td>12</td>
            <td>43</td>
            <td>
              <Link href={`/history/manager/zach`}>Zach</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 3</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/gavin`}>Gavin</Link>
            </td>
            <td>39</td>
            <td>36</td>
            <td>
              <Link href={`/history/manager/scott`}>Scott</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/jesse`}>Jesse</Link>
            </td>
            <td>26</td>
            <td>28</td>
            <td>
              <Link href={`/history/manager/zach`}>Zach</Link>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className={utilStyles.main}>Group C</h3>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Manager</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link href={`/history/manager/dylan`}>Dylan</Link>
            </td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>126</td>
            <td>9</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/kevin`}>Kevin</Link>
            </td>
            <td>2</td>
            <td>0</td>
            <td>1</td>
            <td>115</td>
            <td>6</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/andrew`}>Andrew</Link>
            </td>
            <td>1</td>
            <td>0</td>
            <td>2</td>
            <td>101</td>
            <td>3</td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/morgan`}>Morgan</Link>
            </td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>72</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className={utilStyles.extendedHistoryTable}>
        <tbody>
          <tr>
            <th>Gameweek 1</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/dylan`}>Dylan</Link>
            </td>
            <td>38</td>
            <td>25</td>
            <td>
              <Link href={`/history/manager/morgan`}>Morgan</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/andrew`}>Andrew</Link>
            </td>
            <td>30</td>
            <td>34</td>
            <td>
              <Link href={`/history/manager/kevin`}>Kevin</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 2</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/dylan`}>Dylan</Link>
            </td>
            <td>46</td>
            <td>43</td>
            <td>
              <Link href={`/history/manager/kevin`}>Kevin</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/andrew`}>Andrew</Link>
            </td>
            <td>39</td>
            <td>29</td>
            <td>
              <Link href={`/history/manager/morgan`}>Morgan</Link>
            </td>
          </tr>
          <tr>
            <th>Gameweek 3</th>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/dylan`}>Dylan</Link>
            </td>
            <td>42</td>
            <td>32</td>
            <td>
              <Link href={`/history/manager/andrew`}>Andrew</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/history/manager/kevin`}>Kevin</Link>
            </td>
            <td>38</td>
            <td>18</td>
            <td>
              <Link href={`/history/manager/morgan`}>Morgan</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function GetWinterBracket() {
  return (
    <section id="bracket">
      <div className={utilStyles.bracket}>
        <div className={utilStyles.roundOneDiv}>
          <ul className={utilStyles.roundOne}>
            <li>
              Gavin<span className={utilStyles.score}>31</span>
            </li>
            <li>
              Andrew<span className={utilStyles.score}>50</span>
            </li>
          </ul>
          <ul className={utilStyles.roundOne}>
            <li>
              Kevin<span className={utilStyles.score}>23</span>
            </li>
            <li>
              Luke<span className={utilStyles.score}>30</span>
            </li>
          </ul>
        </div>
        <div className={utilStyles.roundTwoDiv}>
          <ul className={utilStyles.roundTwo}>
            <li>
              Andrew<span className={utilStyles.score}>41</span>
            </li>
            <li>
              Luke<span className={utilStyles.score}>24</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={utilStyles.wrapper}>
        <div className={utilStyles.r1}>Round 1</div>
        <div className={utilStyles.r2}>Round 2</div>
      </div>
      <div className={utilStyles.r1}>Round 1</div>
      <div className={utilStyles.r2}>Round 2</div>
      <div className={utilStyles.bracket}>
        <div className={utilStyles.roundOneDiv}>
          <ul className={utilStyles.roundOne}>
            <li>
              Gavin<span className={utilStyles.score}>31</span>
            </li>
            <li>
              Andrew<span className={utilStyles.score}>50</span>
              <ul className={utilStyles.roundOne}>
                <li>
                  Andrew<span className={utilStyles.score}>41</span>
                </li>
                <li>
                  Luke<span className={utilStyles.score}>24</span>
                </li>
              </ul>
            </li>
          </ul>
          <ul className={utilStyles.roundOne}>
            <li>
              Kevin<span className={utilStyles.score}>23</span>
            </li>
            <li>
              Luke<span className={utilStyles.score}>30</span>
            </li>
          </ul>
          <ul className={utilStyles.final}>
            <li classname={utilStyles.final}>
              Andrew<span className={utilStyles.score}>19</span>
            </li>
            <li classname={utilStyles.final}>
              Matthew<span className={utilStyles.score}>33</span>
            </li>
          </ul>
          <ul className={utilStyles.roundOne}>
            <li>
              Dylan<span className={utilStyles.score}>34</span>
            </li>
            <li>
              Darryan<span className={utilStyles.score}>42</span>
              <ul className={utilStyles.roundOne}>
                <li>
                  Darryan<span className={utilStyles.score}>19</span>
                </li>
                <li>
                  Matthew<span className={utilStyles.score}>33</span>
                </li>
              </ul>
            </li>
          </ul>
          <ul className={utilStyles.roundOne}>
            <li>
              Matthew<span className={utilStyles.score}>70</span>
            </li>
            <li>
              Zach<span className={utilStyles.score}>30</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Season_23_24({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 2 - Game of Stones</title>
        </Head>
        <h1>Season 2 - 2023/2024</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
        <Link href={`/history/season_25_26`}>Season 4 - 2025/2026</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br></br>
        <h2>League Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!L1:V13" />
        </div>
        <p>
          PPW (Points Per Week) is calculated by dividing PF (Points For) by the
          number of gameweeks played. PPG (Points Per Game) is calculated by
          dividing P (Points) by the number of gameweeks played.
        </p>
      </div>
      <div>
        <div className={utilStyles.main}>
          <br />
          {/* <h2>December Cup</h2> */}
          <div>{/* <GetWinterGroups /> */}</div>
          <br />
        </div>
        <div>{/* <GetWinterBracket /> */}</div>
      </div>
    </Layout>
  );
}

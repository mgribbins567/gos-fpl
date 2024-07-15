import React from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";

export default function Accolades({}) {
  return (
    <Layout accolades>
      <div className={utilStyles.accolades}>
        <Head>
          <title>Accolades - Game of Stones</title>
        </Head>
        <h1>The Trophy Cabinet</h1>
        <div className={utilStyles.accoladesBody}>
          <p>
            <strong>Matthew</strong>
            <ul>
              <li>League Champion (S2)</li>
              <li>December Cup (S2)</li>
              <li>Champions Cup (S2)</li>
              <li>2x Manager of the Month (S2)</li>
              <li>2x CL Finish (S1, S2)</li>
            </ul>
          </p>
          <p>
            <strong>Darryan</strong>
            <ul>
              <li>League Champion (S1)</li>
              <li>1x CL Finish (S1)</li>
            </ul>
          </p>
          <p>
            <strong>Gavin</strong>
            <ul>
              <li>3x Manager of the Month (S2)</li>
              <li>1x CL Finish (S2)</li>
            </ul>
          </p>
          <p>
            <strong>Dylan</strong>
            <ul>
              <li>1x CL Finish (S1)</li>
              <li>1x EL Finish (S2)</li>
              <li>1x Manager of the Month (S2)</li>
            </ul>
          </p>
          <p>
            <strong>MatthewR</strong>
            <ul>
              <li>2x EL Finish (S1, S2)</li>
              <li>1x Manager of the Month (S2)</li>
            </ul>
          </p>
          <p>
            <strong>Zach</strong>
            <ul>
              <li>Euros 2024 Champion</li>
              <li>1x Manager of the Month (S2)</li>
            </ul>
          </p>
          <p>
            <strong>Luke</strong>
            <ul>
              <li>1x CL Finish (S2)</li>
              <li>1x Manager of the Month (S2)</li>
            </ul>
          </p>
          <p>
            <strong>Kevin</strong>
            <ul>
              <li>1x ECL Finish (S2)</li>
            </ul>
          </p>
          <p>
            <strong>Jesse</strong>
            <ul>
              <li>1x CL Finish (S1)</li>
            </ul>
          </p>
          <p>
            <strong>Andrew</strong>
            <ul>
              <li>1x EL Finish (S1)</li>
            </ul>
          </p>
          <p>
            <strong>Scott</strong>
            <ul>
              <li>1x ECL Finish (S1)</li>
            </ul>
          </p>
          <br></br>
          <br></br>
          <p>
            *CL = Champions League EL = Europa League ECL = Europa Conference
            League
          </p>
          <p>**Season 1: CL top 4, EL 5-6, ECL 7</p>
          <p>***Season 2: CL top 3, EL 4-5, ECL 6</p>
          <p>****There were no MotM awards or mid-season tournaments in S1</p>
        </div>
      </div>
    </Layout>
  );
}

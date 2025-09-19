import React from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";

export function MatthewAccolades() {
  return (
    <ul>
      <li>League Champion (S2)</li>
      <li>December Cup (S2)</li>
      <li>Champions Cup (S2)</li>
      <li>2x CL Finish (S1, S2)</li>
      <li>1x EL Finish (S3)</li>
      <li>2x Manager of the Month (S2)</li>
      <li>1x Manager of the Month (S3)</li>
    </ul>
  );
}

export function MatthewRAccolades() {
  return (
    <ul>
      <li>League Champion (S3)</li>
      <li>1x CL Finish (S3)</li>
      <li>2x EL Finish (S1, S2)</li>
      <li>1x Manager of the Month (S2)</li>
      <li>3x Manager of the Month (S3)</li>
    </ul>
  );
}

export function DarryanAccolades() {
  return (
    <ul>
      <li>League Champion (S1)</li>
      <li>1x CL Finish (S1)</li>
    </ul>
  );
}

export function LukeAccolades() {
  return (
    <ul>
      <li>Champions Cup (S3)</li>
      <li>2x CL Finish (S2, S3)</li>
      <li>1x Manager of the Month (S2)</li>
      <li>2x Manager of the Month (S3)</li>
    </ul>
  );
}

export function GavinAccolades() {
  return (
    <ul>
      <li>1x CL Finish (S2)</li>
      <li>1x EL Finish (S3)</li>
      <li>3x Manager of the Month (S2)</li>
    </ul>
  );
}

export function KevinAccolades() {
  return (
    <ul>
      <li>1x CL Finish (S3)</li>
      <li>1x ECL Finish (S2)</li>
      <li>3x Manager of the Month (S3)</li>
    </ul>
  );
}

export function DylanAccolades() {
  return (
    <ul>
      <li>1x CL Finish (S1)</li>
      <li>1x EL Finish (S2)</li>
      <li>1x Manager of the Month (S2)</li>
    </ul>
  );
}

export function MattAccolades() {
  return (
    <ul>
      <li>Short n' Sweet Cup (S3)</li>
      <li>1x CL Finish (S3)</li>
      <li>1x Manager of the Month (S3)</li>
    </ul>
  );
}

export function ZachAccolades() {
  return (
    <ul>
      <li>Euros 2024 Champion</li>
      <li>1x Manager of the Month (S2)</li>
    </ul>
  );
}

export function ScottAccolades() {
  return (
    <ul>
      <li>Kickoff Cup (S3)</li>
      <li>1x ECL Finish (S1)</li>
    </ul>
  );
}

export function JesseAccolades() {
  return (
    <ul>
      <li>1x CL Finish (S1)</li>
    </ul>
  );
}

export function AndrewAccolades() {
  return (
    <ul>
      <li>1x EL Finish (S1)</li>
      <li>1x Relegation (S3)</li>
    </ul>
  );
}

export function RebeccaAccolades() {
  return (
    <ul>
      <li>1x ECL Finish (S3)</li>
    </ul>
  );
}

export function EmilyAccolades() {
  return (
    <ul>
      <li>1x Manager of the Month (S3)</li>
      <li>1x Relegation (S3)</li>
    </ul>
  );
}

export function CoopAccolades() {
  return (
    <ul>
      <li>1x Relegation (S3)</li>
    </ul>
  );
}

export function SophAccolades() {
  return (
    <ul>
      <li>1x Relegation (S3)</li>
    </ul>
  );
}

export default function Accolades({}) {
  return (
    <Layout accolades>
      <div className={utilStyles.accolades}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <title>Accolades - Game of Stones</title>
        </Head>
        <h1>The Trophy Cabinet</h1>
        <div className={utilStyles.accoladesBody}>
          <strong>
            <Link href={`/history/manager/matthew`}>Matthew</Link>
          </strong>
          <MatthewAccolades />
          <strong>
            <Link href={`/history/manager/matthewr`}>MatthewR</Link>
          </strong>
          <MatthewRAccolades />
          <strong>
            <Link href={`/history/manager/darryan`}>Darryan</Link>
          </strong>
          <DarryanAccolades />
          <strong>
            <Link href={`/history/manager/luke`}>Luke</Link>
          </strong>
          <LukeAccolades />
          <strong>
            <Link href={`/history/manager/gavin`}>Gavin</Link>
          </strong>
          <GavinAccolades />
          <strong>
            <Link href={`/history/manager/kevin`}>Kevin</Link>
          </strong>
          <KevinAccolades />
          <strong>
            <Link href={`/history/manager/dylan`}>Dylan</Link>
          </strong>
          <DylanAccolades />
          <strong>
            <Link href={`/history/manager/matt`}>Matt</Link>
          </strong>
          <MattAccolades />
          <strong>
            <Link href={`/history/manager/zach`}>Zach</Link>
          </strong>
          <ZachAccolades />
          <strong>
            <Link href={`/history/manager/scott`}>Scott</Link>
          </strong>
          <ScottAccolades />
          <strong>
            <Link href={`/history/manager/jesse`}>Jesse</Link>
          </strong>
          <JesseAccolades />
          <strong>
            <Link href={`/history/manager/andrew`}>Andrew</Link>
          </strong>
          <AndrewAccolades />
          <strong>
            <Link href={`/history/manager/rebecca`}>Rebecca</Link>
          </strong>
          <RebeccaAccolades />
          <strong>
            <Link href={`/history/manager/emily`}>Emily</Link>
          </strong>
          <EmilyAccolades />
          <strong>
            <Link href={`/history/manager/coop`}>Coop</Link>
          </strong>
          <CoopAccolades />
          <strong>
            <Link href={`/history/manager/soph`}>Soph</Link>
          </strong>
          <SophAccolades />
          <br></br>
          <br></br>
          <p>
            *CL = Champions League EL = Europa League ECL = Europa Conference
            League
          </p>
          <p>**Season 1 and 3: CL top 4, EL 5-6, ECL 7</p>
          <p>***Season 2: CL top 3, EL 4-5, ECL 6</p>
          <p>****There were no MotM awards or mid-season tournaments in S1</p>
        </div>
      </div>
    </Layout>
  );
}

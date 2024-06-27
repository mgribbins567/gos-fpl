import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

const rows = [1, 2, 3, 4];
const columns = ["a", "b", "c", "d"];

export default function History({}) {
  return (
    <Layout history>
      <Head>
        <title>History - Game of Stones</title>
      </Head>
      <h1>History of the Game of Stones</h1>
      <small className={utilStyles.subtitle}>
        Historical data and stats of all past seasons!
      </small>
      <Table aria-label="Example table with dynamic content">
        <TableHeader>
          <TableColumn>Place</TableColumn>
          <TableColumn>Manager</TableColumn>
          <TableColumn>W</TableColumn>
          <TableColumn>D</TableColumn>
          <TableColumn>L</TableColumn>
          <TableColumn>PF</TableColumn>
          <TableColumn>PA</TableColumn>
          <TableColumn>PD</TableColumn>
          <TableColumn>P</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>1</TableCell>
            <TableCell>Darryan</TableCell>
            <TableCell>28</TableCell>
            <TableCell>4</TableCell>
            <TableCell>6</TableCell>
            <TableCell>1589</TableCell>
            <TableCell>1276</TableCell>
            <TableCell>+313</TableCell>
            <TableCell>88</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>2</TableCell>
            <TableCell>Matthew</TableCell>
            <TableCell>26</TableCell>
            <TableCell>1</TableCell>
            <TableCell>11</TableCell>
            <TableCell>1621</TableCell>
            <TableCell>1272</TableCell>
            <TableCell>+349</TableCell>
            <TableCell>79</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Layout>
  );
}

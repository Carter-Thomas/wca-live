import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { times } from '../../../logic/utils';
import { resultToClockFormat } from '../../../logic/results';
import { best, average } from '../../../logic/calculations';

const statsToDisplay = (format, eventId) => {
  const { solveCount, sortBy } = format;
  const computeAverage = [3, 5].includes(solveCount) && eventId !== '333mbf';
  if (!computeAverage) return [{ name: 'Best', fn: best }];
  const stats = [
    { name: 'Best', fn: best },
    { name: solveCount === 3 ? 'Mean' : 'Average', fn: average },
  ];
  return sortBy === 'best' ? stats : stats.reverse();
};

const ResultsTable = ({ results, format, eventId }) => {
  const stats = statsToDisplay(format, eventId);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell align="right">#</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Country</TableCell>
          {times(format.solveCount, index => (
            <TableCell key={index} align="right">
              {index + 1}
            </TableCell>
          ))}
          {stats.map(({ name }) => (
            <TableCell key={name} align="right">
              {name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map(result => (
          <TableRow key={result.person.id} hover style={{ whiteSpace: 'nowrap' }}>
            <TableCell
              align="right"
              style={result.advancable ? { backgroundColor: 'lightgreen' } : {}}
            >
              {result.ranking}
            </TableCell>
            <TableCell>{result.person.name}</TableCell>
            <TableCell>{result.person.country.name}</TableCell>
            {result.attempts.map((attempt, index) => (
              <TableCell key={index} align="right">
                {resultToClockFormat(attempt, eventId)}
              </TableCell>
            ))}
            {stats.map(({ name, type, fn }, index) => (
              <TableCell key={name} align="right" style={index === 0 ? { fontWeight: 600 } : {}}>
                {resultToClockFormat(fn(result.attempts, eventId), eventId, fn === average)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;

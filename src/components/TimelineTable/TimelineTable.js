import React from 'react';
import styled from 'styled-components';
import games from '../../data/games.json'
import GameBadge from '../GameBadge';

// Years
const listOfYears = Object.keys(games);
const numberOfYears = listOfYears.length;

// Styles
const TableWrapper = styled.div`
    position: relative;
    width: 100vw;
    
    &::before,
    &::after {
        position: absolute;
        z-index: 200;
        bottom: 0;
        left: 0;
        background-color: var(--border-color);
        content: "";
    }
    &::before {
        width: 1px;
        height: 100%;
    }
    &::after {
        width: 100%;
        height: 1px;
    }
`;
const Table = styled.div`
    display: grid;
    grid-template-columns: var(--genre-width) repeat(${numberOfYears * 4}, 1fr);
    grid-template-rows: var(--year-height) auto;
    max-height: calc(100vh - var(--bar-height));
    overflow: auto;
    
    > div {
        padding: var(--cell-padding);
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        
        &[data-annual-quarter]:not([data-annual-quarter='Q4']) {
            border-right-style: dashed;
        }
        &[data-annual-quarter]::before {
            display: block;
            margin-bottom: var(--cell-padding);
            color: #ccc;
            content: attr(data-annual-quarter);
            font-size: 9px;
            text-align: right;
        }
    }
`;

const Captions = styled.div`
    position: sticky;
    z-index: 101;
    top: 0;
    left: 0;
    padding: var(--cell-padding);
    background-color: #fcfcfc;
    
    > span {
        position: absolute;
        color: #ccc;
        font-size: 9px;
        
        &:nth-of-type(1) {
            top: 4px;
            right: 6px;
        }
        &:nth-of-type(2) {
            bottom: 4px;
            left: 6px;
        }
    }
`;

const Genre = styled.div`
    position: sticky;
    z-index: 100;
    left: 0;
    background-color: #fcfcfc;
    text-align: center;
    
    > span {
        position: sticky;
        top: calc(var(--year-height) + var(--cell-padding));
        font-weight: var(--font-weight-title);
        text-transform: uppercase;
        white-space: nowrap;
    }
`;

const Year = styled(Genre)`
    grid-column: auto / span 4;
    top: 0;
    left: unset;
    
    > span {
        top: unset;
        left: calc(var(--genre-width) + var(--cell-padding));
    }
`;

const GamesBadgesList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    grid-gap: 8px;
`;
const GamesBadgesItem = styled.li`
    &.release-date-unknown {
        flex: 0 0 100%;
    }
`;

// Component
class TimelineTable extends React.Component {
    matchQuarter (index, year, release) {
        if (!release) return true;

        let date = new Date(release);

        if (!date.getDate()) {
            date = new Date(`${year} ${release}`);
        }

        const monthIndex = date.getMonth() + 1;

        if (index === 1 && monthIndex > 0 && monthIndex <= 3) return true;
        if (index === 2 && monthIndex > 3 && monthIndex <= 6) return true;
        if (index === 3 && monthIndex > 6 && monthIndex <= 9) return true;

        return index === 4 && monthIndex > 9 && monthIndex <= 12;
    }

    get listOfGenres () {
        const listOfGenres = [];

        Object.values(games).forEach(games => {
            for (const game of games) {
                if (listOfGenres.includes(game.genre)) continue;
                listOfGenres.push(game.genre);
            }
        });

        listOfGenres.sort((a, b) => a.localeCompare(b));

        return listOfGenres;
    }

    get captions () {
        return (
            <Captions>
                <span key='year'>Year</span>
                <span key='genre'>Genre</span>
            </Captions>
        )
    }

    get years () {
        return listOfYears.map((year, index) => {
            return (
                <Year key={index}>
                    <span>{year}</span>
                </Year>
            )
        });
    }

    get genres () {
        return this.listOfGenres.map((genre, index) => {
            return ([
                <Genre key={index}>
                    <span>{genre}</span>
                </Genre>,

                listOfYears.map(year => {
                    let result = [];

                    for (let index = 1; index <= 4; index++) {
                        let GamesBadgesItems = [];

                        if (games[year]) {
                            for (const game of games[year]) {
                                if (genre === game.genre && this.matchQuarter(index, year, game.release)) {
                                    GamesBadgesItems.push(
                                        <GamesBadgesItem key={game.title} className={!game.release ? 'release-date-unknown' : ''}>
                                            <GameBadge key={game.title} game={game}/>
                                        </GamesBadgesItem>
                                    );
                                }
                            }
                        }

                        result.push(
                            <div key={index} data-annual-quarter={`Q${index}`}>
                                <GamesBadgesList>
                                    {GamesBadgesItems}
                                </GamesBadgesList>
                            </div>
                        );
                    }

                    return result
                })
            ])
        });
    }

    render () {
        return (
            <TableWrapper>
                <Table>
                    {this.captions}
                    {this.years}
                    {this.genres}
                </Table>
            </TableWrapper>
        )
    }
}

export default TimelineTable;

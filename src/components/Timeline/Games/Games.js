import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import games from '../../../data/games';
import Game from '../Game';

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: .8rem;
`;

const Item = styled.li`
  &.full-width {
    flex-basis: 100%;
  }
`;

const matchGameToQuarter = (index, year, release) => {
    if (!release) return true;

    let date = new Date(release);

    if (!date.getDate()) {
        date = new Date(`${year} ${release}`);
    }

    const monthIndex = date.getMonth() + 1;

    if ((index === 1 && monthIndex > 0 && monthIndex <= 3) ||
        (index === 2 && monthIndex > 3 && monthIndex <= 6) ||
        (index === 3 && monthIndex > 6 && monthIndex <= 9)) return true;
    
    return index === 4 && monthIndex > 9 && monthIndex <= 12;
}

const gamesByQuarters = (genreName) => {
    const listOfYears = Object.keys(games);

    return listOfYears.map(year => {
        let result = [];

        for (let index = 1; index <= 4; index++) {
            let gamesList = [];
            let gamesItems = [];

            if (games[year]) {
                for (const game of games[year]) {
                    const {title, genre, release} = game;

                    if (genreName === genre && matchGameToQuarter(index, year, release)) {
                        gamesItems.push(
                            <Item
                                key={title}
                                className={!release ? 'full-width' : ''}
                            >
                                <Game
                                    key={title}
                                    game={game}
                                    placeholder={!release && index !== 1}
                                />
                            </Item>
                        );
                    }
                }
            }

            if (gamesItems.length) {
                gamesList.push(
                    <List key={index}>
                        {gamesItems}
                    </List>
                );
            }

            result.push(
                <div
                    key={index}
                    data-quarter={`Q${index}`}
                >
                    {gamesList}
                </div>
            );
        }

        return result;
    });
}

const TimelineGames = ({genreName}) => gamesByQuarters(genreName);

TimelineGames.propTypes = {
    genreName: PropTypes.string.isRequired
}

export default TimelineGames;

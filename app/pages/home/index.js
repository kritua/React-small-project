import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { gamesToStore } from './actions';
import { connect } from 'react-redux';

import Button from 'block/button';
import Loader from 'block/loader';

import style from './style';

const cx = classnames.bind(style);

@connect((state) => {
    if(state.gameList) {
        return {
            games: state.gameList.games,
            user1: state.gameList.user1,
            user2: state.gameList.user2
        }
    } else {
        return {}
    }
})
class Home extends Component {

    static displayName = '[page] home';

    static contextTypes = {
        store: PropTypes.object
    };

    static propTypes = {
        games: PropTypes.array,
        user1: PropTypes.string,
        user2: PropTypes.string
    };

    state = {
        value: {
            user1: '',
            user2: ''
        },
        error    : null,
        validForm: false,
        pending  : false,
        requested: false
    };

    onChange = (e) => {
        e && e.preventDefault();

        const value = e.target.value.replace('https://steamcommunity.com/id/', '');
        const name = e.target.name;

        this.setState({
            value: {
                ...this.state.value,
                [name]: value
            }
        }, () => {
            this.setState({ validForm: Object.values(this.state.value).every((item) => item) })
        });
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        const { validForm, pending } = this.state;

        if(validForm && !pending) {
            this.fetchSteam();
        }
    };

    errHandler = (data) => {
        if(data.code === 500) {
            throw new Error('These two users has too many intersections');
        }
    };

    fetchSteam = async () => {
        this.setState({
            pending  : true,
            requested: true
        });

        const { user1, user2 } = this.state.value;

        try {
            const response = await fetch(`/steam/${user1}/${user2}`);
            const data = await response.json();

            await this.errHandler(data);
            await this.context.store.dispatch(gamesToStore(data));
            await this.setState({ pending: false });
        } catch(error) {
            this.setState({
                error,
                pending: false
            });
        }
    };

    get elButton() {
        const props = {
            tagName  : 'button',
            type     : 'submit',
            className: cx('home__button'),
            disabled : !this.state.validForm || this.state.pending,
            children : 'Check games'
        };

        return <Button {...props} />
    }

    get elGameList() {
        const { requested, pending } = this.state;
        const { games, user1, user2 } = this.props;

        if(requested && !pending) {
            if(games && games.length && user1 && user2) {
                return (
                    <div className={cx('home__gamelist-block')}>
                        <h3 className={cx('home__gamelist-header')}>Result for users: <span>{user1}</span> and <span>{user2}</span></h3>
                        <div className={cx('home__gamelist')}>
                            {games.map(({ name, id }, i) => (
                                <a href={`https://store.steampowered.com/app/${id}`} key={i} className={cx('home__game')} target="_blank">
                                    <p className={cx('home__text', 'home__text_game')}>{name}</p>
                                    <img className={cx('home__image')} src={`https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`} />
                                </a>
                            ))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={cx('home__gamelist-block')}>
                        <p className={cx('home__no-games')}>No multiplayer games intersection</p>
                    </div>
                )
            }
        }
    }

    get elPending() {
        const { pending, error } = this.state;

        if(pending && !error) {
            return (
                <div className={cx('home__pending')}>
                    <Loader className={cx('home__loader')} />
                    <p className={cx('home__text', 'home__text_nomargin')}>Data pending</p>
                </div>
            )
        }
    }

    get elError() {
        const { pending, error } = this.state;

        if(!pending && error) {
            return (
                <div className={cx('home__error')}>
                    <span className={cx('home__error-icon')}>!</span>
                    <p className={cx('home__text', 'home__text_nomargin')}>{error.message}</p>
                </div>
            )
        }
    }

    render() {
        console.log(this.state)
        return (
            <div className={cx('home')}>
                <div className={cx('home__wrapper')}>
                    <div className={cx('home__header')}>
                        <div className={cx('home__wrapper', 'home__wrapper_header')}>
                            <img src="https://steamstore-a.akamaihd.net/public/shared/images/header/globalheader_logo.png?t=962016" className={cx('home__image')} />
                            <h1 className={cx('home__heading')}>Steam API Service</h1>
                        </div>
                    </div>
                    <div className={cx('home__form-wrapper')}>
                        <h2 className={cx('home__form-heading')}>Request Multiplayer games</h2>
                        <p className={cx('home__text')}>On this page you can check two players to have the same multiplayer games on Steam</p>
                        <p className={cx('home__text')}>Test user 1: thiopentalum</p>
                        <p className={cx('home__text')}>Test user 2: Tryr</p>
                        <form className={cx('home__form')} onSubmit={this.onSubmit}>
                            <div className={cx('home__inputs')}>
                                <label className={cx('home__label')}>
                                    <span className={cx('home__title')}>First player</span>
                                    <input type="text" name="user1" className={cx('home__input')} onChange={this.onChange} value={this.state.value.user1} />
                                </label>
                                <label className={cx('home__label')}>
                                    <span className={cx('home__title')}>Second player</span>
                                    <input type="text" name="user2" className={cx('home__input')} onChange={this.onChange} value={this.state.value.user2} />
                                </label>
                            </div>
                            {this.elPending}
                            {this.elError}
                            {this.elButton}
                        </form>
                    </div>
                    {this.elGameList}
                </div>
            </div>
        )
    }

}

export default {
    path  : '/',
    action: () => Home
}

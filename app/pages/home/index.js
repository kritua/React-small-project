import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { gamesToStore } from './actions';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import { Transition, TransitionGroup } from 'react-transition-group';

import Button from 'block/button';
import Loader from 'block/loader';

import style from './style';

const cx = classnames.bind(style);

@connect((state) => ({
    games : state.gameList && state.gameList.games,
    user1 : state.gameList && state.gameList.user1,
    user2 : state.gameList && state.gameList.user2,
    router: state.router
}))
class Home extends Component {

    static displayName = '[page] home';

    static contextTypes = {
        store : PropTypes.object,
        router: PropTypes.object
    };

    static propTypes = {
        games : PropTypes.array,
        user1 : PropTypes.string,
        user2 : PropTypes.string,
        router: PropTypes.object
    };

    constructor() {
        super(...arguments);

        this.startFrom = 0;
        this.elementsCount = this.totalElems = 12;
        this.scroll = 0;
        this.wrapperHeight = null;
        this.requestCount = 0;
        this.iteration = 0;

        this.state = {
            searchValue   : this.props.router.location.query.room || '',
            error         : null,
            validForm     : false,
            pending       : false,
            scrollHeight  : 0,
            elemHeight    : 0,
            renderElements: [],
            requested     : false,
            focused       : '',
            value         : {
                user1: 'thiopentalum',
                user2: 'Tryr',
                user3: 'Borodach'
            }
        }
    }

    componentDidMount() {
        this.calculateSize();
        this.checkValidity();
        this.$scrollContainer && this.$scrollContainer.addEventListener('scroll', this.onScrollThrottled);
        const observer = new MutationObserver(this.observerCallback);
        const config = {
            childList: true
        };

        observer.observe(this.$gameListBlock, config);
    }

    componentWillUnmount() {
        this.$scrollContainer.removeEventListener('scroll', this.onScrollThrottled);
    }

    componentWillReceiveProps() {
        this.calculateSize();
    }

    observerCallback = (list) => {
        for(let mutation of list) {
            if(mutation.type === 'childList') {
                this.calculateSize();
            }
        }
    };

    onScroll = (e) => {
        const scrollPosition = e.target.scrollTop;
        const containerHeight = this.$scrollContainer.offsetHeight;
        const childNode = this.$scrollContainer.childNodes[0].offsetHeight;

        if((scrollPosition > this.scroll) && (this.totalElems < this.props.games.length)) {
            if(!this.wrapperHeight) {
                this.wrapperHeight = containerHeight + 100; // предзагрузка контента при скролле на 100 пикселей раньше конца блока
            } else if(!this.requestStep) {
                this.requestStep = childNode - this.wrapperHeight;
            } else if(!this.state.pending && (scrollPosition > this.requestStep)) {
                this.requestStep = childNode - this.wrapperHeight;
                if(this.totalElems + this.elementsCount >= this.props.games.length) {
                    this.totalElems = this.props.games.length;
                } else {
                    this.totalElems += this.elementsCount;
                }

                this.addMoreItems();
            }
        }

        this.scroll = scrollPosition;
    };

    onScrollThrottled = throttle(this.onScroll, 30);

    calculateSize = () => {
        const scrollHeight = this.$scrollContainer && (window.innerHeight - this.$scrollContainer.offsetTop);
        const elemHeight = this.$elem && this.$elem.offsetHeight;

        this.setState({
            scrollHeight,
            elemHeight
        })
    };

    checkValidity = () => {
        this.setState({ validForm: Object.values(this.state.value).every((item) => item) })
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
        }, this.checkValidity);
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        const { validForm, pending } = this.state;

        if(validForm && !pending) {
            this.fetchSteam();
        }
    };

    onChangeSearch = (e) => {
        e && e.preventDefault();

        const value = e.target.value;

        this.setState({ value }, this.onSubmit);
    };

    onSubmitSearch = (e) => {
        e && e.preventDefault();

        const currentPath = this.props.router.location.pathname;
        const searchString = this.state.value ? `?room=${this.state.value}` : '';
        const targetPath = `${currentPath}${searchString}`;

        this.setState({ error: null });
        this.context.router.push(targetPath);
    };

    errHandler = (data) => {
        if(data.code === 500) {
            throw new Error('These two users has too many intersections');
        }
    };

    addMoreItems = async (games = this.props.games, start = this.startFrom, end = this.props.games.length) => {
        try {
            const steps = await games.slice(start, end);
            const renderElements = [];

            await steps.reduce((prev, next) => {
                return prev.then(() => {
                    if(renderElements.length < this.elementsCount) {
                        this.getMultiplayerGames(next).then((data) => {
                            if(Object.keys(data).length) {
                                this.iteration++;

                                return renderElements.push(data);
                            }
                        })
                    }
                });
            }, Promise.resolve()).then(() => renderElements);

            await this.setState({
                renderElements,
                requested: true,
                pending  : false
            });

            this.requestCount++;

            console.log(this.requestCount)
        } catch(error) {
            console.error(error)
        }
    };

    getMultiplayerGames = (game) => {
        console.log('DATA SENDING')
        this.setState({ pending: true });

        return fetch(`/multiplayer/${game}`)
            .then((response) => response.json())
            .then((data) => data)
    };

    dispatchToStore = (data) => {
        return new Promise((resolve, reject) => {
            resolve(this.context.store.dispatch(gamesToStore(data)));
            reject(new Error('Dispatch failed'))
        })
            .then(() => {
                // this.setState({ pending: false });
            })
            .then(() => {
                this.addMoreItems();
            })
    };

    fetchSteam = async () => {
        this.setState({
            pending: true
        });

        const { user1, user2 } = this.state.value;

        try {
            const response = await fetch(`/steam/${user1}/${user2}`);
            const data = await response.json();

            await this.errHandler(data);
            await this.dispatchToStore(data);
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
        const { requested, pending, renderElements, scrollHeight } = this.state;
        const { games, user1, user2 } = this.props;

        const showUsers = user1 && user2 && requested;
        const showElements = requested && renderElements && renderElements.length > 0;
        const showEmpty = requested && !pending && games && !games.length;

        return (
            <div className={cx('home__gamelist-block')} ref={(node) => { this.$gameListBlock = node }}>
                {showUsers && <h3 className={cx('home__gamelist-header')}>Result for users: <span>{user1}</span> and <span>{user2}</span></h3>}
                <div className={cx('home__gamelist')} style={{ height: scrollHeight }} ref={(node) => { this.$scrollContainer = node }}>
                    <div className={cx('home__gamelist-wrapper')}>
                        {showElements && renderElements.map(({ name, id }, i) => (
                            <a ref={(node) => { this.$elem = node }} href={`https://store.steampowered.com/app/${id}`} key={i} className={cx('home__game')} target="_blank">
                                <p className={cx('home__text', 'home__text_game')}>{name}</p>
                                <img className={cx('home__image')} src={`https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`} />
                            </a>
                        ))}
                        {showEmpty && (
                            <div className={cx('home__gamelist-block')}>
                                <p className={cx('home__no-games')}>No multiplayer games intersection</p>
                            </div>
                        )}
                        {this.elPending}
                    </div>
                </div>
            </div>
        )
    }

    get elPending() {
        const { pending, error } = this.state;

        if(pending && !error) {
            return (
                <div className={cx('home__pending-wrapper')}>
                    <div className={cx('home__pending')}>
                        <Loader className={cx('home__loader')} />
                        <p className={cx('home__text', 'home__text_nomargin')}>Data pending</p>
                    </div>
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

    get elInputs() {
        const items = [
            {
                name : 'user1',
                value: this.state.value.user1
            },
            {
                name : 'user2',
                value: this.state.value.user2
            },
            {
                name : 'user3',
                value: this.state.value.user3
            }
        ];

        return (
            <div className={cx('home__inputs')}>
                {items.map((item, index) => {
                    const isFocused = !this.state.focused || this.state.focused === item.name;
                    const className = cx('home__label', {
                        ['home__label_focused']    : this.state.focused === item.name,
                        ['home__label_not-focused']: this.state.focused && this.state.focused !== item.name
                    });
                    const props = {
                        in           : isFocused,
                        unmountOnExit: true,
                        mountOnEnter : true,
                        timeout      : {
                            enter: 300,
                            exit : 200
                        }
                    };

                    return (
                        <Transition {...props} key={`user-${index}`}>
                            <label className={className} onFocus={this.onFocus} onBlur={this.onBlur}>
                                <span className={cx('home__title')}>First player</span>
                                <input type="text" name={item.name} className={cx('home__input')} onChange={this.onChange} value={item.value} />
                            </label>
                        </Transition>
                    )
                })}
            </div>
        )
    }

    onFocus = (e) => {
        this.setState({
            focused: e.target.name
        })
    };

    onBlur = () => {
        this.setState({ focused: '' })
    };

    render() {
        console.log(this.state.focused)
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
                        <p className={cx('home__text')}>On this page you can check two players to have the same multiplayer games on Steam. Test:
                            <strong> thiopentalum</strong>
                            <strong> Tryr</strong>
                        </p>
                        <form className={cx('home__form')} onSubmit={this.onSubmit}>
                            {this.elInputs}
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

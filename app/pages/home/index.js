import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { roomsToStore, roomsError } from './actions';
import { connect } from 'react-redux';
import fetch from 'node-fetch';

import Loader from 'block/loader';
import Search from 'block/icons/search';
import Button from 'block/button';

import style from './style';

const cx = classnames.bind(style);

@connect((state) => ({
    rooms : state.roomList.rooms,
    error : state.roomList.error,
    router: state.router
}))
class Home extends Component {

    static displayName = '[page] home';

    static contextTypes = {
        store : PropTypes.object,
        router: PropTypes.object
    };

    static propTypes = {
        error: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
            PropTypes.string
        ]),
        rooms: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        router: PropTypes.object
    };

    constructor() {
        super(...arguments);

        this.state = {
            value    : this.props.router.location.query.room || '',
            error    : null,
            validForm: false,
            pending  : false
        }
    }

    onChange = (e) => {
        e && e.preventDefault();

        const value = e.target.value;

        this.setState({ value });
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        const currentPath = this.props.router.location.pathname;
        const searchString = this.state.value ? `?room=${this.state.value}` : '';
        const targetPath = `${currentPath}${searchString}`;

        console.log('SUBMIT')
        this.context.router.push(targetPath, null, null, true);
    };

    // fetchSteam = async () => {
    //     this.setState({
    //         pending  : true,
    //         requested: true
    //     });
    //
    //     const { user1, user2 } = this.state.value;
    //
    //     try {
    //         const response = await fetch(`/steam/${user1}/${user2}`);
    //         const data = await response.json();
    //
    //         await this.context.store.dispatch(roomsToStore(data));
    //         await this.setState({ pending: false });
    //     } catch(error) {
    //         console.error(error);
    //         this.setState({
    //             error,
    //             pending: false
    //         });
    //     }
    // };

    get elRoomList() {
        const { pending } = this.state;
        const { rooms } = this.props;

        if(!pending) {
            console.log('ROOMS', rooms);
            if(rooms) {
                return (
                    <div className={cx('home__roomlist-block')}>
                        <div className={cx('home__roomheader')}>
                            <p className={cx('home__roomheader-item', 'home__roomheader-item_number')}>Номер</p>
                            <p className={cx('home__roomheader-item', 'home__roomheader-item_status')}>Статус</p>
                            <p className={cx('home__roomheader-item', 'home__roomheader-item_buy')}>Покупки</p>
                            <p className={cx('home__roomheader-item', 'home__roomheader-item_stop')}>Запрет на покупки</p>
                        </div>
                        <div className={cx('home__roomlist')}>
                            {Array.isArray(rooms) && rooms.length ? (
                                rooms.map(({ userId, id }, i) => {
                                    const isFree = Math.floor(Math.random() * rooms.length) > rooms.length / 2;
                                    const isChecked = Math.floor(Math.random() * rooms.length) > rooms.length / 2;
                                    const price = Math.floor(Math.random() * 100 + userId);

                                    return (
                                        <div key={i} className={cx('home__room')}>
                                            <p className={cx('home__room-item', 'home__room-item_number')}>{id}</p>
                                            <p className={cx('home__room-item', 'home__room-item_status', `home__room-item_status-${isFree}`)}>{isFree ? 'Свободен' : 'Занят'}</p>
                                            <p className={cx('home__room-item', 'home__room-item_buy')}>{`${price} ₽`}</p>
                                            <div className={cx('home__room-item', 'home__room-item_stop')}>
                                                <input type="checkbox" defaultChecked={isChecked} />
                                            </div>
                                        </div>
                                    )
                                })) : (
                                <div className={cx('home__room')}>123</div>
                            )}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={cx('home__roomlist-block')}>
                        <p className={cx('home__no-rooms')}>Нет таких комнат</p>
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
                    <p className={cx('home__text', 'home__text_nomargin')}>Ожидание данных</p>
                </div>
            )
        }
    }

    get elError() {
        const { pending } = this.state;
        const { error } = this.props;

        if(!pending && error && error.length) {
            return (
                <div className={cx('home__error')}>
                    <span className={cx('home__error-icon')}>!</span>
                    <p className={cx('home__text', 'home__text_nomargin')}>{error}</p>
                </div>
            )
        }
    }

    render() {
        console.log(this.state);

        return (
            <div className={cx('home')}>
                <div className={cx('home__wrapper')}>
                    <div className={cx('home__form-wrapper')}>
                        <h2 className={cx('home__form-heading')}>Номерной фонд</h2>
                        <form className={cx('home__form')} onSubmit={this.onSubmit}>
                            <label className={cx('home__label')}>
                                <Search className={cx('home__search')} />
                                <input
                                    value={this.state.value}
                                    onChange={this.onChange}
                                    type="search"
                                    className={cx('home__input')}
                                    placeholder="Введите номер комнаты или имя гостя"
                                />
                            </label>
                        </form>
                        {this.elPending}
                        {this.elError}
                    </div>
                    {this.elRoomList}
                </div>
            </div>
        )
    }

}

export default {
    path   : '/rooms',
    action : () => Home,
    fetcher: [{
        promise: ({ location, helpers: { store: { dispatch } } }) => {
            const filterParam = location.query.room;
            const reqestUrl = filterParam ? `https://jsonplaceholder.typicode.com/posts/${filterParam}` : 'https://jsonplaceholder.typicode.com/posts';

            console.log('PARAMS', location.query.room, reqestUrl);

            return fetch(reqestUrl)
                .then((result) => {
                    if(!result.ok) {
                        throw new Error(`${result.status} ${result.statusText}`);
                    }

                    return result.json()
                })
                .then((data) => dispatch(roomsToStore(data)))
                .catch((error) => dispatch(roomsError(error.message)))
        }
    }]
}

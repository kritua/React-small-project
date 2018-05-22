import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { roomsToStore, roomsError } from './actions';
import { connect } from 'react-redux';
import fetch from 'node-fetch';
import throttle from 'lodash.throttle';

import Loader from 'block/loader';
import Search from 'block/icons/search';

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

        this.elementsCount = 15;
        this.totalElems = 15;
        this.scroll = 0;
        this.wrapperHeight = null;

        this.state = {
            value         : this.props.router.location.query.room || '',
            error         : null,
            validForm     : false,
            pending       : false,
            scrollHeight  : 0,
            elemHeight    : 0,
            renderElements: this.props.rooms.slice(0, this.elementsCount)
        }
    }

    componentDidMount() {
        this.$scrollContainer.addEventListener('scroll', this.onScrollThrottled);
        setTimeout(this.calculateSize, 0);
    }

    componentWillUnmount() {
        this.$scrollContainer.removeEventListener('scroll', this.onScrollThrottled);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.rooms) {
            this.addMoreItems()
        }
    }

    addMoreItems = (props = this.props) => {
        this.setState({ renderElements: props.rooms.slice(0, this.totalElems) })
    };

    onScroll = (e) => {
        const scrollPosition = e.target.scrollTop;
        const containerHeight = this.$scrollContainer.offsetHeight;
        const childNode = this.$scrollContainer.childNodes[0].offsetHeight;

        if((scrollPosition > this.scroll) && (this.totalElems < this.props.rooms.length)) {
            if(!this.wrapperHeight) {
                this.wrapperHeight = containerHeight + 200; // предзагрузка контента при скролле на 200 пикселей раньше конца блока
            } else if(!this.requestStep) {
                this.requestStep = childNode - this.wrapperHeight;
            } else if(!this.state.pending && (scrollPosition > this.requestStep)) {
                this.requestStep = childNode - this.wrapperHeight;
                if(this.totalElems + this.elementsCount >= this.props.rooms.length) {
                    this.totalElems = this.props.rooms.length;
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

    onChange = (e) => {
        e && e.preventDefault();

        const value = e.target.value;

        this.setState({ value }, this.onSubmit);
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        const currentPath = this.props.router.location.pathname;
        const searchString = this.state.value ? `?room=${this.state.value}` : '';
        const targetPath = `${currentPath}${searchString}`;

        this.setState({ error: null });
        this.context.router.push(targetPath);
    };

    get elRoomList() {
        const { pending, value, renderElements } = this.state;
        const { rooms } = this.props;

        if(!pending) {
            return (
                <div className={cx('home__roomlist-block')}>
                    <div className={cx('home__roomheader')}>
                        <p className={cx('home__roomheader-item', 'home__roomheader-item_number')}>Номер</p>
                        <p className={cx('home__roomheader-item', 'home__roomheader-item_status')}>Статус</p>
                        <p className={cx('home__roomheader-item', 'home__roomheader-item_buy')}>Покупки</p>
                        <p className={cx('home__roomheader-item', 'home__roomheader-item_stop')}>Запрет на покупки</p>
                    </div>
                    <div className={cx('home__roomlist')} ref={(node) => { this.$scrollContainer = node }} style={{ height: this.state.scrollHeight }}>
                        <div className={cx('home__roomlist-wrapper')}>
                            {Array.isArray(rooms) && rooms.length ? (
                                renderElements.map(({ id, price }, i) => {
                                    const isChecked = price > 52620;
                                    const isFree = price > 231111;

                                    return (
                                        <div key={i} className={cx('home__room')} ref={(node) => { this.$elem = node }}>
                                            <p className={cx('home__room-item', 'home__room-item_number')}>{id}</p>
                                            <p className={cx('home__room-item', 'home__room-item_status', `home__room-item_status-${isFree}`)}>{isFree ? 'Свободен' : 'Занят'}</p>
                                            <p className={cx('home__room-item', 'home__room-item_buy')}>{`${price} ₽`}</p>
                                            <div className={cx('home__room-item', 'home__room-item_stop')}>
                                                <input type="checkbox" defaultChecked={isChecked} />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className={cx('home__error')}>
                                    <span className={cx('home__error-icon')}>!</span>
                                    <p className={cx('home__text')}>{`Комната с номером или именем гостя ${value} не найдена`}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
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

        if(!pending && error) {
            return (
                <div className={cx('home__error')}>
                    <span className={cx('home__error-icon')}>!</span>
                    <p className={cx('home__text')}>{error}</p>
                </div>
            )
        }
    }

    render() {
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

            return fetch('http://localhost:3000/data')
                .then((result) => {
                    if(!result.ok) {
                        throw new Error(`${result.status} ${result.statusText}`);
                    }

                    return result.json()
                })
                .then((data) => {
                    if(filterParam) {
                        const filtered = data.filter((item) => filterParam === item.id.toString() || item.guestname.indexOf(filterParam) !== -1);

                        return dispatch(roomsToStore(filtered))
                    }

                    return dispatch(roomsToStore(data))
                })
                .catch((error) => dispatch(roomsError(error.message)))
        }
    }]
}

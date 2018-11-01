import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { roomsToStore, roomsError } from './actions';
import { connect } from 'react-redux';
import fetch from 'node-fetch';
import throttle from 'lodash.throttle';

import Loader from 'block/loader';

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

        this.elementsCount = 8;
        this.totalElems = 8;
        this.scroll = 0;
        this.wrapperHeight = null;

        this.state = {
            error         : null,
            validForm     : false,
            pending       : false,
            scrollHeight  : 0,
            elemHeight    : 0,
            renderElements: this.props.rooms.slice(0, this.elementsCount),
            params        : this.props.router.location.query || {}
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

    onChangeCheckbox = (e) => {
        const { name, checked } = e.target;
        const params = { ...this.state.params };

        if(checked) {
            params[name] = checked;
        } else {
            delete params[name];
        }

        this.setState({ params }, this.onSubmit)
    };

    onChangeRooms = (e) => {
        const { name, value, checked } = e.target;
        const arr = this.state.params.rooms_count ? [...this.state.params.rooms_count] : [];

        if(arr.indexOf(value) === -1 && checked) {
            arr.push(value)
        } else {
            const itemToRemove = arr.findIndex((item) => item === value);

            arr.splice(itemToRemove, 1);
        }

        this.setState({
            params: {
                ...this.state.params,
                [name]: arr.sort((a, b) => a - b)
            }
        }, this.onSubmit)
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        const { pathname } = this.props.router.location;
        const { params } = this.state;

        this.context.router.push({
            pathname,
            query: params
        });
    };

    get elRoomList() {
        const { pending } = this.state;

        if(pending) {
            return;
        }

        return (
            <div className={cx('home__roomlist-block')}>
                <div
                    className={cx('home__roomlist')}
                    ref={(node) => { this.$scrollContainer = node }}
                    style={{ height: this.state.scrollHeight }}
                >
                    {this.elRoomListInner}
                </div>
            </div>
        )
    }

    get elRoomListInner() {
        const { rooms } = this.props;
        const { renderElements } = this.state;

        if(!Array.isArray(rooms) || !rooms.length) {
            return (
                <div className={cx('home__error')}>
                    <span className={cx('home__error-icon')}>!</span>
                    <p className={cx('home__text')}>Результатов с такими параметрами не найдено</p>
                </div>
            )
        }

        return (
            <div className={cx('home__roomlist-wrapper')}>
                {renderElements.map((item, i) => {
                    const {
                        price, square, seller, phone,
                        address: { city, street, suite },
                        is_mortgage: isMortgage,
                        rooms_count: roomsCount,
                        is_installment: isInstallment
                    } = item;
                    const src = {
                        1: 'https://media.ongrad.ru/api/images/16.31.jpg',
                        2: 'https://media.ongrad.ru/api/images/63.9_y51RuUF.jpg',
                        3: 'https://media.ongrad.ru/api/images/3kk_79.0.jpg'
                    };

                    return (
                        <div key={i} className={cx('home__room')} ref={(node) => { this.$elem = node }}>
                            <div className={cx('home__room-image')}>
                                <img src={src[roomsCount]} className={cx('home__room-img')} />
                            </div>
                            <div className={cx('home__room-content')}>
                                <div className={cx('home__room-row')}>
                                    <p className={cx('home__room-item', 'home__room-item_type')}>
                                        {`${roomsCount}-комнатная квартира, ${square} m`}&sup2;
                                    </p>
                                    <p className={cx('home__room-item', 'home__room-item_price')}>
                                        {`${price} ₽`}
                                    </p>
                                </div>
                                <div className={cx('home__room-row')}>
                                    <p className={cx('home__room-item', 'home__room-item_address')}>
                                        {`${city}, ${street}, ${suite}`}
                                    </p>
                                </div>
                                <div className={cx('home__room-row', 'home__room-row_features')}>
                                    <p className={cx('home__room-item', 'home__room-item_features')}>
                                        Ипотека: {isMortgage ? 'Да' : 'Нет' }
                                    </p>
                                    <p className={cx('home__room-item', 'home__room-item_features')}>
                                        Рассрочка: {isInstallment ? 'Да' : 'Нет' }
                                    </p>
                                </div>
                                <div className={cx('home__room-row')}>
                                    <p className={cx('home__room-item', 'home__room-item_seller')}>
                                        Продавец: {seller}
                                    </p>
                                    <p className={cx('home__room-item', 'home__room-item_seller')}>
                                        Телефон: {phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
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

    get elControls() {
        const { params } = this.state;
        const mortgageChecked = typeof params.is_mortgage === 'string' ? JSON.parse(params.is_mortgage) : params.is_mortgage;
        const installmentChecked = typeof params.is_installment === 'string' ? JSON.parse(params.is_installment) : params.is_installment;

        return (
            <div className={cx('home__form-controls')}>
                <div className={cx('home__form-inner')}>
                    <h2 className={cx('home__form-heading')}>Купить квартиру</h2>
                    <form className={cx('home__form')} onSubmit={this.onSubmit}>
                        <fieldset className={cx('home__fieldset', 'home__fieldset_checkbox')}>
                            <div className={cx('home__checkbox-wrapper')}>
                                <input
                                    type="checkbox"
                                    name="is_mortgage"
                                    id="mortgage"
                                    className={cx('home__checkbox-input')}
                                    onChange={this.onChangeCheckbox}
                                    checked={mortgageChecked || false}
                                />
                                <label htmlFor="mortgage" className={cx('home__checkbox-label')}>
                                    Ипотека
                                </label>
                            </div>
                        </fieldset>
                        <fieldset className={cx('home__fieldset', 'home__fieldset_checkbox')}>
                            <div className={cx('home__checkbox-wrapper')}>
                                <input
                                    type="checkbox"
                                    name="is_installment"
                                    id="installment"
                                    className={cx('home__checkbox-input')}
                                    onChange={this.onChangeCheckbox}
                                    checked={installmentChecked || false}
                                />
                                <label htmlFor="installment" className={cx('home__checkbox-label')}>
                                    Рассрочка
                                </label>
                            </div>
                        </fieldset>
                        {this.renderRoomsInput}
                    </form>
                </div>
            </div>
        )
    }

    get renderRoomsInput() {
        const roomsCount = ['1', '2', '3'];

        return roomsCount.map((item) => {
            const checked = this.state.params.rooms_count && this.state.params.rooms_count.includes(item);

            return (
                <fieldset key={`rooms-${item}`} className={cx('home__fieldset', 'home__fieldset_checkbox')}>
                    <div className={cx('home__checkbox-wrapper')}>
                        <input
                            type="checkbox"
                            name={`rooms_count`}
                            value={item}
                            id={`rooms-count-${item}`}
                            className={cx('home__checkbox-input')}
                            onChange={this.onChangeRooms}
                            checked={checked || false}
                        />
                        <label htmlFor={`rooms-count-${item}`} className={cx('home__checkbox-label')}>
                            {`${item}-комнатная квартира`}
                        </label>
                    </div>
                </fieldset>
            )
        });
    }

    render() {
        return (
            <div className={cx('home')}>
                <div className={cx('home__header')}>
                    <div className={cx('home__header-inner')}>
                        <div className={cx('home__image')} />
                    </div>
                </div>
                {this.elControls}
                <div className={cx('home__result-block')}>
                    <div className={cx('home__wrapper')}>
                        <div className={cx('home__form-wrapper')}>
                            {this.elPending}
                            {this.elError}
                        </div>
                        {this.elRoomList}
                    </div>
                </div>
            </div>
        )
    }

}

export default {
    path   : '/',
    action : () => Home,
    fetcher: [{
        promise: ({ location, helpers: { store: { dispatch } } }) => {
            const fetchUrl = `http://localhost:18080/data${location.search}`;

            return fetch(fetchUrl)
                .then((result) => result.ok && result.json())
                .then((data) => dispatch(roomsToStore(data)))
                .catch((error) => dispatch(roomsError(error.message)))
        }
    }]
}

import React, { Component } from 'react';
import classnames from 'classnames/bind';

import Button from 'block/button';
import Loader from 'block/loader';

import style from './style';

const cx = classnames.bind(style);

class Home extends Component {

    static displayName = '[page] home';

    state = {
        value: {
            user1: 'thiopentalum',
            user2: 'Tryr'
        },
        error    : null,
        validForm: false,
        pending  : false,
        valid    : {
            user1: false,
            user2: false
        }
    };

    onChange = (e) => {
        e && e.preventDefault();

        const value = e.target.value.replace('https://steamcommunity.com/id/', '');
        const name = e.target.name;

        this.setState({
            value: {
                ...this.state.value,
                [name]: value
            },
            valid: {
                ...this.state.valid,
                [name]: e.target.validity.valid
            }
        }, () => {
            this.setState({ validForm: Object.values(this.state.valid).every((item) => item) })
        });
    };

    onSubmit = (e) => {
        e && e.preventDefault();

        // if(this.state.valid) {
            this.fetchSteam();
        // }
    };

    fetchSteam = async () => {
        this.setState({ pending: true });

        try {
            const response = await fetch(`/steam/${this.state.value.user1}/${this.state.value.user2}`);
            const data = await response.json();

            await this.setState({ pending: false });

            console.log('ASYNC DATA', data);
        } catch(err) {
            console.error(err);
        }
    };

    get elButton() {
        const props = {
            tagName : 'button',
            type    : 'submit',
            // disabled: !this.state.validForm,
            children: 'Check games'
        };

        return <Button {...props} />
    }

    render() {
        console.log(this.state);

        return (
            <div className={cx('home')}>
                <h1 className={cx('home__header')}>Request Multiplayer games</h1>
                <p className={cx('home__text')}>On this page you can check two players to have the same multiplayer games on Steam</p>
                <p className={cx('home__text')}>https://steamcommunity.com/id/thiopentalum</p>
                <p className={cx('home__text')}>https://steamcommunity.com/id/Tryr</p>
                <form className={cx('home__form')} onSubmit={this.onSubmit}>
                    <label className={cx('home__label')}>
                        <input type="text" name="user1" className={cx('home__input')} onChange={this.onChange} value='https://steamcommunity.com/id/Tryr' />
                    </label>
                    <label className={cx('home__label')}>
                        <input type="text" name="user2" className={cx('home__input')} onChange={this.onChange} value='https://steamcommunity.com/id/Ditrix789' />
                    </label>
                    {!this.state.pending && (
                        <div className={cx('home__pending')}>
                            <Loader className={cx('home__loader')} />
                            <p className={cx('home__text')}>Data pending</p>
                        </div>
                    )}
                    {this.elButton}
                </form>
            </div>
        )
    }

}

export default {
    path  : '/',
    action: () => Home
}

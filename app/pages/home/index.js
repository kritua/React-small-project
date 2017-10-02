import React, { Component } from 'react';
import classnames from 'classnames/bind';

import style from './style';

const cx = classnames.bind(style);

class Home extends Component {

    static displayName = '[page] home';

    render() {
        return (
            <main className={cx('home', 'home_index')}>
                <section className={cx('page-headers page-headers--index')}>
                    <div className={cx('main-container')}>
                        <button className={cx('slider slider--previous')} type="button" id="header-previous" />
                        <button className={cx('slider slider--next')} type="button" id="header-next" />
                        <div className={cx('page-headers__wrapper')}>
                            <div className={cx('page-headers__headers')}>
                                <h1 className={cx('page-headers__h1')}>Автосервис <br /><span>Asmoscow</span></h1>
                                <h2 className={cx('page-headers__h2')}>Мы решаем любые проблемы c Volvo</h2>
                                <p className={cx('page-headers__text')} />
                            </div>
                            <div className={cx('page-header__buttons')}>
                                <a className={cx('standart-button standart-button--header standart-button--index modal-window__click')}>Заказать
                                    звонок</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

}

export default {
    path  : '/',
    action: () => Home
}

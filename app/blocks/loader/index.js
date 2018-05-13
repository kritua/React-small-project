import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';

import style from './style';
const cx = classNames.bind(style);

class Loader extends PureComponent {

    static displayName = '[block] loader';

    static propTypes = {
        className: PropTypes.string
    };

    render() {
        return (
            <svg className={cx('loader', this.props.className)} width="30" height="30" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <circle className={cx('loader__circle')} cx="18" cy="18" r="16" />
                    <path d="M34 20c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        )
    }

}

export default Loader;

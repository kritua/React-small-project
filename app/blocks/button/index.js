import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames/bind'
import { Link } from 'react-router-async'

import style from './style'

const cx = classnames.bind(style);

class Button extends PureComponent {

    static displayName = '[block] button';

    static propTypes = {
        className: PropTypes.string,
        tagName  : PropTypes.string
    };

    get elButton() {
        const props = {
            className: cx('button', this.props.className),
            tagName  : '',
            to       : ''
        };

        return <a {...props} />
    }

    render() {
        return this.elButton
    }

}

export default Button
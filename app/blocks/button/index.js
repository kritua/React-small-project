import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';

import { Link } from 'react-router-async';

import style from './style';

const cx = classNames.bind(style);

class Button extends PureComponent {

    static displayName = '[component] button';

    static defaultProps = {
        disabled: false,
        linkTo  : '#anchor'
    };

    static propTypes = {
        disabled : PropTypes.bool,
        className: PropTypes.string,
        children : PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]).isRequired,
        tagName   : PropTypes.string,
        linkTo    : PropTypes.string,
        type      : PropTypes.string,
        onClick   : PropTypes.func,
        target    : PropTypes.string,
        attributes: PropTypes.object
    };

    render() {
        let props = {
            ...this.props.attributes,
            onClick  : this.props.onClick,
            className: cx('button', this.props.className),
            children : this.props.children
        };

        if(typeof this.props.tagName === 'string') {
            props.type = this.props.type;
            props.disabled = this.props.disabled;

            return <this.props.tagName {...props} />
        } else {
            props.to = this.props.linkTo;
            props.target = this.props.target;

            return <Link {...props} />
        }
    }

}

export default Button;

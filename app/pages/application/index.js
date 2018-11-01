import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import './style';

/* eslint-disable no-multi-spaces */
@connect((state) => ({
    path        : state.router.path,
    isTransition: state.router.isTransition
}))
/* eslint-enable no-multi-spaces */
class Application extends PureComponent {

    static displayName = '[page] application';

    static propTypes = {
        children    : PropTypes.element,
        isTransition: PropTypes.bool,  // eslint-disable-line react/no-unused-prop-types
        path        : PropTypes.string // eslint-disable-line react/no-unused-prop-types
    };

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return this.props.children;
    }

}

export { Application as default };

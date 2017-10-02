import PropTypes from 'prop-types';
import React, { Component, createFactory } from 'react';
import config from 'config';

class Html extends Component {

    static displayName = '[page] html';

    static propTypes = {
        markup: PropTypes.string,
        state : PropTypes.object,
        assets: PropTypes.shape({
            styles    : PropTypes.object,
            javascript: PropTypes.object
        }),
        helmet: PropTypes.shape({
            htmlAttributes: PropTypes.object,
            title         : PropTypes.object,
            meta          : PropTypes.object
        })
    };

    get style() {
        if(process.env.NODE_ENV === 'production') {
            return <link rel="stylesheet" href={this.props.assets.styles.main} />
        }
    }

    get runtime() {
        // TODO: inline in html
        if(process.env.NODE_ENV === 'production') {
            return <script src={this.props.assets.javascript.runtime} defer={true} />
        }
    }

    get vendors() {
        if(process.env.NODE_ENV === 'production') {
            return <script src={this.props.assets.javascript.vendors} defer={true} />
        }
    }

    render() {
        const attrs = this.props.helmet.htmlAttributes.toComponent();
        const app = {
            __html: this.props.markup
        };
        const script = {
            __html: `window.__data=${JSON.stringify(this.props.state)};`
        };

        return (
            <html {...attrs}>
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    {this.props.helmet.title.toComponent()}
                    {this.props.helmet.meta.toComponent()}
                    <script dangerouslySetInnerHTML={{ __html: `window.__config=${JSON.stringify(config)}` }} />
                    {this.style}
                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={app} />
                    <script id="__data" dangerouslySetInnerHTML={script} />
                    {this.runtime}
                    {this.vendors}
                    <script src={this.props.assets.javascript.main} defer={true} />
                </body>
            </html>
        )
    }

}

export default createFactory(Html);

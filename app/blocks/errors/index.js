// @flow
import NotFound from 'block/not-found'
import Forbidden from 'block/forbidden'

const error: {
    [code: string | number]: *
} = {
    // $FlowFixMe
    404: NotFound,
    // $FlowFixMe
    403: Forbidden
};

export default error

/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './AnimatedItem.css';

class AnimatedItem extends React.Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
        this.item1Ref = React.createRef();
        this.item2Ref = React.createRef();

        this.state = { };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.item !== this.props.item;
    }

    static getDerivedStateFromProps(props, state) {
        const { item } = props;
        const { to, prevItem } = state;

        if (item !== prevItem) {
            return {
                prevItem: item,
                from: to,
                to: item,
                scrollDown: item > to
            };
        }

        return null;
    }

    componentDidMount() {
        const { scrollDown } = this.props;
        const { to } = this.state;

        this.animate('', to, scrollDown);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { item, scrollDown } = this.props;
        const { from, to } = this.state;

        if (prevProps.item !== item) {
            this.animate(from, to, scrollDown);
        }
    }

    animate = (from, to, scrollDown) => {
        const { height } = this.props;

        const container = this.containerRef.current;
        const item1 = this.item1Ref.current;
        const item2 = this.item2Ref.current;

        if (!container || !item1 || !item2) return;

        const duration = '250ms';
        const timingFunction = 'ease-in-out';

        if (scrollDown) {
            container.style.cssText = `transform: translateY(-${height}px)`;
            item1.style.cssText = 'opacity: 0';
            item2.style.cssText = 'opacity: 1';
            requestAnimationFrame(() => {
                container.style.cssText = `transform: translateY(0); transition: transform ${duration} ${timingFunction}`;
                item1.style.cssText = `opacity: 1; transition: opacity ${duration} ${timingFunction}; height: ${height}px`;
                item2.style.cssText = `opacity: 0; transition: opacity ${duration} ${timingFunction}; height: ${height}px`;
            });
        } else {
            container.style.cssText = 'transform: translateY(0px)';
            item1.style.cssText = 'opacity: 1';
            item2.style.cssText = 'opacity: 0';
            requestAnimationFrame(() => {
                container.style.cssText = `transform: translateY(-${height}px); transition: transform ${duration} ${timingFunction}`;
                item1.style.cssText = `opacity: 0; transition: opacity ${duration} ${timingFunction}; height: ${height}px`;
                item2.style.cssText = `opacity: 1; transition: opacity ${duration} ${timingFunction}; height: ${height}px`;
            });
        }
    };

    render() {
        const { scrollDown, height } = this.props;
        const { from, to } = this.state;

        // console.log('[c] render', [from, to, scrollDown]);

        return (
            <div className='animated-item' style={{ height }}>
                <div className='animated-item-placeholder'>{to}</div>
                <div ref={this.containerRef} className='animated-item-wrapper'>
                    <div ref={this.item1Ref} className='animated-item-1' style={{ height }}>{scrollDown ? to : from }</div>
                    <div ref={this.item2Ref} className='animated-item-2' style={{ height }}>{scrollDown ? from : to }</div>
                </div>
            </div>
        );
    }
}

AnimatedItem.propTypes = {
    item: PropTypes.number,
    scrollDown: PropTypes.bool,
    height: PropTypes.number
};

AnimatedItem.defaultProps = {
    item: null,
    scrollDown: true,
    height: 21
}

export default AnimatedItem;
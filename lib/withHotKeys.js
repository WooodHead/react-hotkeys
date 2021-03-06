import React, {PureComponent} from 'react';
import HotKeys from './HotKeys';

/**
 * withHotKeys is an HOC that provides the wrappedComponent with the ability to implement keyboard actions
 * without the user wrapping every component with a <HotKeys> component individually
 *
 * See examples/master/HOCWrappedNode.js for an example implementation
 * Follow the steps below to use the HOC:
 *
 * @example <caption>Example usage of withHotKeys.</caption>
 * // Returns the HOC-wrapped component.
 * // 1. Declared a key map that with the actionName as key and keyboardKeys as values
 * const ACTION_KEY_MAP = {
 *     'logConsole' : 'down',
 * };
 *
 * class BasicBox extends React.Component {
 *
 * // 2. declare 'hotKeyHandlers' within the Component's class definition
 *   hotKeyHandlers: {
 *     'logConsole': this.logConsole.bind(this),
 *   }
 *
 *   logConsole() {
 *     console.log('a hotkey is pressed');
 *   }
 *
 *   render() {
 *     return (
 *         <div tabIndex="0">
 *             Press the down arrow
 *         </div>
 *     );
 *   }
 * }
 *
 * // 3. Wrap the Component with withHotKeys
 * export default withHotKeys(ACTION_KEY_MAP)(BasicBox);
 * @returns {function} Returns the HOC-wrapped component.
 *
 * @param {Object} keyMap an action-to-keyboard-key mapping
 * @param {Object} componentProps parameters to pass in as props to the HotKeys component
 * @summary An HOC that provides the wrappedComponent with the ability to implement
 *        keyboard actions
 */
const withHotKeys = (keyMap, componentProps) => ((Component) =>
    class HotKeysWrapper extends PureComponent {
      constructor(props) {
        super(props);
        this._setRef = this._setRef.bind(this);
        this.state = {
          handlers: {}
        };
      }

      componentDidMount() {
        this.setState({handlers: this._ref.hotKeyHandlers});
      }

      _setRef(node) {
        this._ref = node;
      }

      render() {
        const { handlers } = this.state;

        const props = {
          keyMap,
          handlers,
          component: "document-fragment",
          ...componentProps
        };

        /**
         * Setting component as document-fragment to avoid unexpected stylistic
         * changes to the wrapped component
         */
        return (
          <HotKeys {...props}>
            <Component
              ref={this._setRef}
              {...this.props}
            />
          </HotKeys>
        );
      }
    }
);

export default withHotKeys;

// @flow
import React from 'react';
import invariant from 'invariant';
import { path as ramdaPath } from 'ramda';
import { resetFields, setField } from './actions';
import isReactNative from '../../app/isReactNative';

type Path = string | Array<string> | ((props: Object) => Array<string>);

type Options = {
  path: Path,
  fields: Array<string>,
  getInitialState?: (props: Object) => Object,
};

// Higher order component for huge fast dynamic deeply nested universal forms.
const fields = (options: Options) =>
  (WrappedComponent: Function) => {
    const {
      path = '',
      fields = [],
      getInitialState,
    } = options;

    invariant(Array.isArray(fields), 'Fields must be an array.');
    invariant(
      typeof path === 'string' ||
        typeof path === 'function' ||
        Array.isArray(path),
      'Path must be a string, function, or an array.',
    );

    return class Fields extends React.Component {
      static contextTypes = {
        store: React.PropTypes.object, // Redux store.
      };

      static getNormalizePath(props) {
        switch (typeof path) {
          case 'function':
            return path(props);
          case 'string':
            return [path];
          default:
            return path;
        }
      }

      static getFieldValue(field, model, initialState) {
        if (model && {}.hasOwnProperty.call(model, field)) {
          return model[field];
        }
        if (initialState && {}.hasOwnProperty.call(initialState, field)) {
          return initialState[field];
        }
        return '';
      }

      static lazyJsonValuesOf(model, props) {
        const initialState = getInitialState && getInitialState(props);
        // http://www.devthought.com/2012/01/18/an-object-is-not-a-hash
        return options.fields.reduce(
          (fields, field) => ({
            ...fields,
            [field]: Fields.getFieldValue(field, model, initialState),
          }),
          Object.create(null),
        );
      }

      static createFieldObject(field, onChange) {
        if (isReactNative) {
          return {
            onChangeText: text => {
              onChange(field, text);
            },
          };
        }
        return {
          name: field,
          onChange: event => {
            // Some custom components like react-select pass the target directly.
            const target = event.target || event;
            const { type, checked, value } = target;
            const isCheckbox = type && type.toLowerCase() === 'checkbox';
            onChange(field, isCheckbox ? checked : value);
          },
        };
      }

      state = {
        model: null,
      };

      fields: Object;
      values: any;
      unsubscribe: () => void;

      onFieldChange = (field: any, value: any) => {
        const normalizedPath = Fields.getNormalizePath(this.props).concat(
          field,
        );
        this.context.store.dispatch(setField(normalizedPath, value));
      };

      createFields() {
        const formFields = options.fields.reduce(
          (fields, field) => ({
            ...fields,
            [field]: Fields.createFieldObject(field, this.onFieldChange),
          }),
          {},
        );

        this.fields = {
          ...formFields,
          $values: () => this.values,
          $setValue: (field, value) => this.onFieldChange(field, value),
          $reset: () => {
            const normalizedPath = Fields.getNormalizePath(this.props);
            this.context.store.dispatch(resetFields(normalizedPath));
          },
        };
      }

      getModelFromState() {
        const normalizedPath = Fields.getNormalizePath(this.props);
        return ramdaPath(normalizedPath, this.context.store.getState().fields);
      }

      setModel(model: any) {
        this.values = Fields.lazyJsonValuesOf(model, this.props);
        options.fields.forEach(field => {
          this.fields[field].value = this.values[field];
        });
        this.fields = { ...this.fields }; // Ensure rerender for pure components.
        this.setState({ model });
      }

      componentWillMount() {
        this.createFields();
        this.setModel(this.getModelFromState());
      }

      componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {
          const newModel = this.getModelFromState();
          if (newModel === this.state.model) return;
          this.setModel(newModel);
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return <WrappedComponent {...this.props} fields={this.fields} />;
      }
    };
  };

export default fields;

import React from "react";
import { isEqual } from "./utils";
/**
 * This is a HOC (Higher Order Component).
 * It can be used to log which properties of a component changed when it re-rerenders.
 * Use it by wrapping the exported component function, similarly to connect() or injectIntl().
 * For Debugging use only.
 * @param WrappedComponent
 */
export default function withPropsChecker<P>(
  WrappedComponent: React.FunctionComponent<P>,
): React.ComponentClass<P> {
  return class PropsChecker extends React.Component<P> {
    // eslint-disable-next-line camelcase
    public UNSAFE_componentWillReceiveProps(nextProps: P): void {
      if (process.env.NODE_ENV === "development") {
        this.logChanges(nextProps);
      }
    }

    private logChanges(nextProps: P): void {
      Object.keys(nextProps)
        // @ts-ignore
        .filter((key): boolean => !isEqual(nextProps[key], this.props[key]))
        .forEach((key): void => {
          // eslint-disable-next-line no-console
          console.log(
            WrappedComponent.name,
            "changed property:",
            key,
            "from",
            // @ts-ignore
            this.props[key],
            "to",
            // @ts-ignore
            nextProps[key],
          );
        });
    }

    public render(): React.ReactElement {
      return <WrappedComponent {...this.props} />;
    }
  };
}

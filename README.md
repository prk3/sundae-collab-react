<h1 align="center"><a href="https://github.com/prk3/sundae-collab-server">sundae-collab</a></h1>
<p align="center">Delicious collaboration framework</p>

sundae-collab-react enables you to add sundae collaboration to a React application. It uses [sundae-collab-client](https://github.com/prk3/sundae-collab-client) under the hood.

## What's inside?

### `Provider` component

Wraps your pages. Adds collaboration client context to the React element tree.

Props:
- url - url string of the [sundae-collab-server](https://github.com/prk3/sundae-collab-server) instance. Probably starts with `ws://` or `wss://`.
- identity - Identity used for client authentication. Data of any JSON compatible shape.

### `Resource` component

Wraps form fields of a resource. Starts or joins a collaboration session, syncs changes between clients.

Props:
- id - a string containing the id of a resource
- type - a string containing the type of a resource
- value - initial value of a resource, probable read from an API
- fallback - optional element to be displayed while session is being established

### `Field` components

A family of components that bridge session data and input fields.

Props:
- path - String, JSON pointer specifying which field is edited by an input component.
- children - A function component taking data specific to the field type.

### `ReplaceField` component

The simplest field component. Simply overrides value with another value. Useful for synchronizing discrete values, like true/false or small/medium/large.

Child props:
- value - The current value.
- onChange - A function taking a new value and sending it to the session.

### `NumberField` component

Field operating on numbers and applying math operations. Useful for number fields, counters etc.

Child props:
- value - The current number.
- onChange - A function taking operation type (e.g. add or mult) and a second number to apply operation on resource.

### `TextField` component

Field component that allows concurrent text editing with intention preservation.

Child props:
- value - The current string value.
- onChange - A function taking a text change in form of an object with 3 properties
  - index (position in the text at which the change started)
  - removed (the length of a removed section)
  - inserted (a string that was inserted or an empty string)
- cursors - an object associating participant id with their cursor data (start and end position)
- userCursor - id of a cursor belonging to the current user
- onSelectionChange - A function taking new a selection passing it to the session. It accepts a null (when deleting selection) or an object with start and end numbers.

Because building a custom text component with multi cursor support is difficult, this package includes one, ready to use text component.
You must import `style.css` file in your project if you use `MultiCursorText`.

### `MultiCursorText`

Text input component that accepts props from `TextField` and shows synchronizing text and cursors.

It accepts data injected by `TextField` and two additional props:
- colors - An array of color strings (in css color format) used by cursors
- fallbackColor - Fallback color string used when session uses more colors than provided by the colors prop.

### Hooks

This package offers a few hooks that developers can use to access collaboration data. These are:

- `useValue` - Takes a path (JSON pointer to a field in a resource) and returns value under that path plus onChange function accepting jot update that modifies that value. This hooks is a base of all field components.
- `useSelections` - Extracts selections of a field under a path string. Used by `TextField` component.
- `useParticipants` - Returns a list of session participants. Useful for showing who else is working on a resource.
- `useClientId` - returns the current client id.

## Example?

Check out [sundae-collab-demo-client](https://github.com/prk3/sundae-collab-demo-client) to see how the components and hooks can be used in a simple React CMS.

## Useful commands

In the project directory, you can run:

### `npm run build`

Builds client code to `dist` directory.

### `npm run dev`

Builds client code to `dist` directory. Runs compiler again if the code changes.

### `npm run list`

Lints source files.

## Learn more

To learn more about sundae-collab project, visit [sundae-collab-server page](http://github.com/prk3/sundae-collab-server).

If you want to add a new field or input components, check out [jot library](https://github.com/prk3/jot) and see what operations you can use to manipulate resource data.

Not using React? Check out [sundae-collab-client](http://github.com/prk3/sundae-collab-client) - framework-agnostic tools for sundae collaboration.

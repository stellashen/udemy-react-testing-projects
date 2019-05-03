# udemy-react-testing-projects

Code for projects presented in Udemy "React Testing with Jest and Enzyme" course

## Project READMEs

See individual project READMEs (in their directories) for more information.

-   [Click Counter](https://github.com/flyrightsister/udemy-react-testing-projects/blob/master/click-counter/README.md)
-   [Jotto](https://github.com/flyrightsister/udemy-react-testing-projects/blob/master/jotto/README.md)
-   [Random Word Server](https://github.com/flyrightsister/udemy-react-testing-projects/blob/master/random-word-server/README.md)

## Course Resources: React Testing with Jest and Enzyme

Note: These are in the order they are presented in the course, with the exception of putting the course repo first.

GitHub Repository for the course
https://github.com/flyrightsister/udemy-react-testing-projects

Creating a React app from scratch
https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658

https://jestjs.io/docs/en/webpack.html#handling-static-assets

Configuring Jest
https://facebook.github.io/jest/docs/en/configuration.html

Enzyme shallow wrapper documentation
http://airbnb.io/enzyme/docs/api/shallow.html

Enzyme shallow wrapper .find() documentation
http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html

Enzyme shallow wrapper selector documentation
http://airbnb.io/enzyme/docs/api/selector.html

Enzyme shallow wrapper state documentation
http://airbnb.io/enzyme/docs/api/ShallowWrapper/setState.html
http://airbnb.io/enzyme/docs/api/ShallowWrapper/state.html

Jest expect API
https://facebook.github.io/jest/docs/en/expect.html

Bootstrap 4 “get started” docs
https://getbootstrap.com/docs/4.0/getting-started/introduction/

Enzyme shallow wrapper .prop() method
http://airbnb.io/enzyme/docs/api/ShallowWrapper/prop.html

## My Notes

1. check React props

-   testUtils.js

```js
export const checkProps = (component, conformingProps) => {
	const propError = checkPropTypes(
		component.propTypes,
		conformingProps,
		'prop',
		component.name
	);
	expect(propError).toBeUndefined();
};
```

-   Example in jotto/Congrats.test.js

```js
test('does not throw warning with expected props', () => {
	const expectedProps = { success: false };
	checkProps(Congrats, expectedProps);
});
```

-   put props types in Congrats.js component:

```js
Congrats.propTypes = {
	success: PropTypes.bool.isRequired
};
```

for array:

```js
GuessedWords.propTypes = {
	guessedWords: PropTypes.arrayOf(
		PropTypes.shape({
			guessedWord: PropTypes.string.isRequired,
			letterMatchCount: PropTypes.number.isRequired
		})
	).isRequired
};
```

Runtime type checking for React props and similar objects
https://github.com/facebook/prop-types

checkPropTypes (get the error returned to us rather than thrown as a warning)
https://www.npmjs.com/package/check-prop-types

2. configure Enzyme in setupTests.js
   create-react-app is looking for setupTests.js, and if it finds it, it will run this before every test

If you are not using create-react-app, you need to add the file path to jest.config.js:

```js
module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/test/setupTests.js',
  moduleNameMapper: ...
}
```

3. Abstractions

-   put storeFactory(), findByTestAttr(), checkProps() in '/test/testUtils' so we can reuse them in different test files
-   Factory function setup() in each test file
-   storeFactory() creates a store for testing that uses the reducers from the actual app.

4. reuse `wrapper` and use `beforeEach`

```js
describe('if there are no words guessed', () => {
	let wrapper;
	beforeEach(() => {
		wrapper = setup({ guessedWords: [] });
	});
	test('renders without error', () => {
		const component = findByTestAttr(wrapper, 'component-guessed-words');
		expect(component.length).toBe(1);
	});
	test('renders instructions to guess a word', () => {
		const instructions = findByTestAttr(wrapper, 'guess-instructions');
		expect(instructions.text().length).not.toBe(0);
	});
});
```

5. expect(obj1).toEqual(obj2)

-   it's a deep equal and compares content
-   toBe compares `===`, so we should use toBe to compare immutable data types and use toEqual to compare mutable data types

6. test reducer
   example: jotto/src/reducers/successReducer.test.js

```js
import { actionTypes } from '../actions';
import successReducer from './successReducer';

test('returns default initial state of `false` when no action is passed', () => {
	const newState = successReducer(undefined, {});
	expect(newState).toBe(false);
});
test('returns state of true upon receiving an action of type `CORRECT_GUESS`', () => {
	const newState = successReducer(undefined, {
		type: actionTypes.CORRECT_GUESS
	});
	expect(newState).toBe(true);
});
```

7. dive()

-   `shallow` doesn't show what's inside Input component
-   `dive()` is going to show us the contents of the Input component itself

```js
const wrapper = shallow(<Input store={store} />).dive();
```

8. Thunk test

    We are testing actions and reducer, so it's in `integration.test.js`

9. use `moxios` to test without running the server

routes axios calls to moxios instead of http

10. test redux props

    example: Input.test.js

11. use `ref` to change input box value

in component file:
```js
  constructor(props) {
    super(props);

    this.inputBox = React.createRef();
  }
```
```js
	<input
		data-test="input-box"
		ref={this.inputBox} />
```

in test file:

```js
wrapper.instance().inputBox.current = { value: guessedWord };
```

12. test React life cycle methods
in setupTests.js:
```js
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true, 
  // this will keep life cycle methods from running when whenever we create an app shallow wrapper.
});
```

```js
test('`getSecretWord` runs on App mount', () => {
  const getSecretWordMock = jest.fn();

  const props = {
    getSecretWord: getSecretWordMock,
    success: false,
    guessedWords: [],
  };

  // set up app component with getSecretWordMock as the getSecretWord prop
  const wrapper = shallow(<UnconnectedApp {...props} />);

  // run lifecycle method
  wrapper.instance().componentDidMount();

  // check to see if mock ran
  const getSecretWordCallCount = getSecretWordMock.mock.calls.length;

  expect(getSecretWordCallCount).toBe(1);

});
```
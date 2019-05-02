import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true, 
  // this will keep life cycle methods from running when whenever we create an app shallow wrapper.
});

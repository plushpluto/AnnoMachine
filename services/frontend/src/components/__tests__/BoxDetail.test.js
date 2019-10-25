import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BoxDetail from '../BoxDetail';
import '../../setupTests';

const box = {
  id: 1,
  label: 'dog',
  x_min: 10,
  y_min: 10,
  x_max: 20,
  y_max: 20
};

describe('Not in edit mode', () => {
  const component = (
    <BoxDetail
      box={ box }
      onInputChange={ jest.fn() }
      onEyeIconClick={ jest.fn() }
      onCheckIconClick={ jest.fn() }
      onTrashIconClick={ jest.fn() }
    />
  );
  
  it('BoxDetail renders properly', () => {
    const wrapper = shallow(component);
    const grid = wrapper.find('.grid');
    expect(grid.length).toBe(1);
    const rows = grid.find('.row');
    expect(rows.length).toBe(2);
    const columns = rows.at(0).find('.column');
    expect(columns.length).toBe(2);
    const buttons = columns.find('button');
    expect(buttons.length).toBe(3);
    expect(buttons.at(0).find('i').get(0).props.className).toBe('eye icon');
    expect(buttons.at(1).find('i').get(0).props.className).toBe('edit icon');
    expect(buttons.at(2).find('i').get(0).props.className).toBe('trash alternate icon');
    expect(component.props.onEyeIconClick).toHaveBeenCalledTimes(0);
    expect(component.props.onTrashIconClick).toHaveBeenCalledTimes(0);
    buttons.at(0).simulate('click');
    expect(component.props.onEyeIconClick).toHaveBeenCalledTimes(1);
    buttons.at(2).simulate('click');
    expect(component.props.onTrashIconClick).toHaveBeenCalledTimes(1);
  });
  
  it('BoxDetail renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('In edit mode', () => {
  const component = (
    <BoxDetail
      editMode={ true }
      box={ box }
      onInputChange={ jest.fn() }
      onEyeIconClick={ jest.fn() }
      onCheckIconClick={ jest.fn() }
      onTrashIconClick={ jest.fn() }
    />
  );
  
  it('BoxDetail renders properly', () => {
    const wrapper = shallow(component);
    const instance = wrapper.instance();
    const grid = wrapper.find('.grid');
    expect(grid.length).toBe(1);
    const rows = grid.find('.row');
    expect(rows.length).toBe(2);
    const columns = rows.at(0).find('.column');
    expect(columns.length).toBe(2);
    const buttons = columns.find('button');
    expect(buttons.length).toBe(3);
    expect(buttons.at(0).find('i').get(0).props.className).toBe('eye icon');
    expect(buttons.at(1).find('i').get(0).props.className).toBe('check icon');
    expect(buttons.at(2).find('i').get(0).props.className).toBe('trash alternate icon');
    expect(component.props.onEyeIconClick).toHaveBeenCalledTimes(0);
    expect(component.props.onCheckIconClick).toHaveBeenCalledTimes(0);
    expect(component.props.onTrashIconClick).toHaveBeenCalledTimes(0);
    instance.handleInputChange({
      target: {
        name: 'x_min',
        value: 20
      }
    });
    instance.handleInputChange({
      target: {
        name: 'label',
        value: 'cat'
      }
    });
    expect(wrapper.state()).toEqual({
      boxIsDrawn: true,
      editMode: true,
      coords: { ...box, x_min: 20, label: 'cat' }
    });
    buttons.at(0).simulate('click');
    expect(component.props.onEyeIconClick).toHaveBeenCalledTimes(1);
    buttons.at(1).simulate('click');
    expect(component.props.onCheckIconClick).toHaveBeenCalledTimes(1);
    buttons.at(2).simulate('click');
    expect(component.props.onTrashIconClick).toHaveBeenCalledTimes(1);
  });
  
  it('BoxDetail renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
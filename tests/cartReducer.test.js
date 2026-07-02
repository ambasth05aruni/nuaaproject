import { describe, it, expect } from 'vitest';
import { cartReducer } from '../src/store/CartContext';

describe('Cart Reducer Tests', () => {
  const initialItem = {
    id: 1,
    title: 'Test Product',
    price: 50,
    variant: 'Black / M',
    variantKey: '1__Black__M',
    maxQty: 3,
    qty: 1
  };

  it('should add a new item to empty cart', () => {
    const action = { type: 'ADD', item: initialItem, qty: 1 };
    const nextState = cartReducer([], action);

    expect(nextState).toHaveLength(1);
    expect(nextState[0].variantKey).toBe('1__Black__M');
    expect(nextState[0].qty).toBe(1);
  });

  it('should increment quantity of existing item up to maxQty', () => {
    const action = { type: 'ADD', item: initialItem, qty: 1 };
    
    // Initial state: already has 1 item of qty 1
    const nextState = cartReducer([initialItem], action);
    expect(nextState[0].qty).toBe(2);

    // Add 2 more: 2 + 2 = 4 but maxQty = 3
    const actionAddTwo = { type: 'ADD', item: initialItem, qty: 2 };
    const cappedState = cartReducer([initialItem], actionAddTwo);
    expect(cappedState[0].qty).toBe(3);
  });

  it('should update quantity when UPDATE_QTY is dispatched', () => {
    const actionUpdate = { type: 'UPDATE_QTY', variantKey: '1__Black__M', qty: 2 };
    const nextState = cartReducer([initialItem], actionUpdate);
    expect(nextState[0].qty).toBe(2);
  });

  it('should respect quantity cap on UPDATE_QTY', () => {
    const actionUpdateOverLimit = { type: 'UPDATE_QTY', variantKey: '1__Black__M', qty: 10 };
    const nextState = cartReducer([initialItem], actionUpdateOverLimit);
    expect(nextState[0].qty).toBe(3); //  maxQty = 3
  });

  it('should remove item when quantity is updated below 1', () => {
    const actionRemove = { type: 'UPDATE_QTY', variantKey: '1__Black__M', qty: 0 };
    const nextState = cartReducer([initialItem], actionRemove);
    expect(nextState).toHaveLength(0);
  });

  it('should remove item on REMOVE dispatch', () => {
    const actionRemove = { type: 'REMOVE', variantKey: '1__Black__M' };
    const nextState = cartReducer([initialItem], actionRemove);
    expect(nextState).toHaveLength(0);
  });

  it('should clear all items on CLEAR dispatch', () => {
    const actionClear = { type: 'CLEAR' };
    const nextState = cartReducer([initialItem], actionClear);
    expect(nextState).toHaveLength(0);
  });
});

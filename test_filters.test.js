/**
 * Unit tests for product filtering logic in ProductPageHome.
 * These tests verify that the price, back support, hours, and capacity
 * filters behave as expected when applied together.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';

// Helper to mimic the filteredProducts logic from the component
function getFilteredProducts({products, selectedCategory, selectedBackSupport, selectedHours, selectedCapacity, maxPrice}) {
  return products.filter(product => {
    if (selectedCategory && selectedCategory !== 'All Products' && product.category !== selectedCategory) return false;
    if (selectedBackSupport && product.backSupport !== selectedBackSupport) return false;
    if (selectedHours && product.hours !== selectedHours) return false;
    if (selectedCapacity && product.capacity !== selectedCapacity) return false;
    if (product.price > maxPrice) return false;
    return true;
  });
}

describe('Product filtering', () => {
  const sampleProducts = [
    {id:1, category:'Office Chair', backSupport:'High Back', hours:'8+ Hours', capacity:'150 kg', price:20000},
    {id:2, category:'Gaming Chair', backSupport:'Low Back', hours:'6-8 Hours', capacity:'120 kg', price:15000},
    {id:3, category:'Office Chair', backSupport:'High Back', hours:'6-8 Hours', capacity:'120 kg', price:26000},
  ];

  test('price filter works', () => {
    const result = getFilteredProducts({
      products: sampleProducts,
      selectedCategory: 'All Products',
      selectedBackSupport: null,
      selectedHours: null,
      selectedCapacity: null,
      maxPrice: 25000,
    });
    expect(result).toHaveLength(2); // product id 3 exceeds 25000
  });

  test('back support filter works', () => {
    const result = getFilteredProducts({
      products: sampleProducts,
      selectedCategory: 'All Products',
      selectedBackSupport: 'High Back',
      selectedHours: null,
      selectedCapacity: null,
      maxPrice: 30000,
    });
    expect(result.map(p=>p.id)).toEqual([1,3]);
  });

  test('hours filter works', () => {
    const result = getFilteredProducts({
      products: sampleProducts,
      selectedCategory: 'All Products',
      selectedBackSupport: null,
      selectedHours: '8+ Hours',
      selectedCapacity: null,
      maxPrice: 30000,
    });
    expect(result.map(p=>p.id)).toEqual([1]);
  });

  test('capacity filter works', () => {
    const result = getFilteredProducts({
      products: sampleProducts,
      selectedCategory: 'All Products',
      selectedBackSupport: null,
      selectedHours: null,
      selectedCapacity: '120 kg',
      maxPrice: 30000,
    });
    expect(result.map(p=>p.id)).toEqual([2,3]);
  });

  test('combined filters work together', () => {
    const result = getFilteredProducts({
      products: sampleProducts,
      selectedCategory: 'Office Chair',
      selectedBackSupport: 'High Back',
      selectedHours: '8+ Hours',
      selectedCapacity: '150 kg',
      maxPrice: 25000,
    });
    expect(result.map(p=>p.id)).toEqual([1]);
  });
});

import { useCustomUtilHook } from './useCustomUtilHook';

test('customUtilHook value', () => {
  const { key } = useCustomUtilHook();

  expect(key).toBe('value');
});

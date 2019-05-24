import getName from '../src/lib/name_formater';

const url = 'https://ru.hexlet.io/courses';
const expectedFile = 'ru-hexlet-io-courses.html';
const expectedFolder = 'ru-hexlet-io-courses_files';
const link = '/assets/icons/default/favicon.ico';
const fullLink = 'https://ru.hexlet.io/assets/icons/default/favicon.ico';
const expectedResourceFile = 'assets-icons-default-favicon.ico';
const expectedLocalLink = 'ru-hexlet-io-courses_files/assets-icons-default-favicon.ico';

test('Test names', () => {
  expect(getName('getPageName', url)).toBe(expectedFile);
  expect(getName('getFolderName', url)).toBe(expectedFolder);
  expect(getName('getFileName', fullLink)).toBe(expectedResourceFile);
  expect(getName('getFullLink', url, link)).toBe(fullLink);
  expect(getName('getLocalLink', expectedFolder, link)).toBe(expectedLocalLink);
});

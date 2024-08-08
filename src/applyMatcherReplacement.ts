import os from 'node:os';
import { snakeCase } from 'lodash-es';
import type { ApplyPathMatcherOptions, PathMatcher } from './types';
import {
  compilePathMatcherRegExp,
  getRealTemporaryDirectory,
  splitPathString,
} from './utils';

export function applyPathMatcher(
  matcher: PathMatcher,
  str: string,
  options: ApplyPathMatcherOptions = {},
) {
  const regex = compilePathMatcherRegExp(matcher.match);
  const replacer = (substring: string, ...args: any[]): string => {
    if (
      options.minPartials &&
      splitPathString(substring).length < options.minPartials
    ) {
      return substring;
    }
    const ret =
      typeof matcher.mark === 'string'
        ? matcher.mark
        : matcher.mark(substring, ...args);
    return `<${snakeCase(ret).toUpperCase()}>`;
  };
  return str.replace(regex, replacer);
}

export function applyMatcherReplacement(
  matchers: PathMatcher[],
  str: string,
  options: ApplyPathMatcherOptions = {},
) {
  return matchers.reduce((ret, matcher) => {
    return applyPathMatcher(matcher, ret, options);
  }, str);
}

export const createDefaultPathMatchers = () => {
  const ret: PathMatcher[] = [
    {
      match: /(?<=\/)(\.pnpm\/.+?\/node_modules)(?=\/)/,
      mark: 'pnpmInner',
    },
  ];
  const tmpdir = getRealTemporaryDirectory();
  tmpdir && ret.push({ match: tmpdir, mark: 'temp' });
  ret.push({ match: os.tmpdir(), mark: 'temp' });
  ret.push({ match: os.homedir(), mark: 'home' });
  return ret;
};

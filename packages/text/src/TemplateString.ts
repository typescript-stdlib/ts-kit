import { EMPTY_STRING } from './Strings';
import { ToString } from '@monument/core';
import {
  ArrayList,
  CollectionUtils,
  LinkedMap,
  ReadOnlyList,
  ReadOnlyMap
} from '@monument/collections';
import { MissingKeyException } from '@monument/exceptions';
import { RegExpUtils } from './RegExpUtils';
import { ParsingException } from './parser/ParsingException';

const NORMAL_ENTRY_PATTERN: RegExp = /{(\w+)}/g;
const ESCAPED_ENTRY_PATTERN: RegExp = /\\{(\w+)\\}/g;

/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class TemplateString implements ToString {
  private readonly _template: string;
  private readonly _allEntries: ReadOnlyList<string>;
  private readonly _uniqueEntries: ReadOnlyList<string>;
  private readonly _extractionPattern: RegExp;

  get uniqueEntries(): ReadOnlyList<string> {
    return this._uniqueEntries;
  }

  constructor(template: string) {
    this._template = template;
    this._allEntries = this.getAllEntries();
    this._uniqueEntries = this.getUniqueEntries();
    this._extractionPattern = this.createExtractingPattern();
  }

  extractValues(source: string): ReadOnlyMap<string, string> {
    const values: LinkedMap<string, string> = new LinkedMap();
    const match: RegExpExecArray | null = this._extractionPattern.exec(source);

    if (!match) {
      throw new ParsingException(`Source string does not match the pattern.`);
    }

    match.slice(1).forEach((entryValue: string, index: number) => {
      const entryKey: string | undefined = this._allEntries.getAt(index);

      if (entryKey != null) {
        values.put(entryKey, entryValue);
      }
    });

    return values;
  }

  fillByKeys(values: ReadOnlyMap<string, string>): string {
    return this.fillEntries((key: string): string => {
      if (values.containsKey(key)) {
        return values.get(key) + EMPTY_STRING;
      } else {
        throw new MissingKeyException(`Entry "${key}" is not defined.`);
      }
    });
  }

  fillByPositions(values: ToString[]): string {
    return this.fillEntries((key: string): string => {
      const index: number = parseInt(key, 10);

      CollectionUtils.validateIndexBounds(values, index);

      return values[index].toString();
    });
  }

  toString(): string {
    return this._template;
  }

  tryExtractValues(source: string): ReadOnlyMap<string, string> | undefined {
    try {
      return this.extractValues(source);
    } catch (ex) {
      return;
    }
  }

  tryFillByKeys(values: ReadOnlyMap<string, string>): string {
    return this.fillEntries((key: string): string => {
      const value = values.get(key);

      if (value == null) {
        return EMPTY_STRING;
      }

      return value + EMPTY_STRING;
    });
  }

  tryFillByPositions(values: ToString[]): string {
    return this.fillEntries((key: string): string => {
      const index: number = parseInt(key, 10);

      if (index >= 0 && index < values.length) {
        return values[index].toString();
      } else {
        return EMPTY_STRING;
      }
    });
  }

  private createExtractingPattern(): RegExp {
    let pattern: string = RegExpUtils.escape(this._template);

    pattern = pattern.replace(ESCAPED_ENTRY_PATTERN, (): string => {
      return `(.+)`;
    });

    return new RegExp(`^${pattern}$`);
  }

  private fillEntries(selector: (key: string) => string): string {
    return this._template.replace(NORMAL_ENTRY_PATTERN, (substring: string, ...groups: string[]): string => {
      return selector(groups[0]);
    });
  }

  private getAllEntries(): ReadOnlyList<string> {
    const entries: ArrayList<string> = new ArrayList();
    let match: RegExpExecArray | null;

    do {
      match = NORMAL_ENTRY_PATTERN.exec(this._template);

      if (match != null) {
        entries.add(match[1]);
      }
    } while (match != null);

    return entries;
  }

  private getUniqueEntries(): ReadOnlyList<string> {
    const entries: ArrayList<string> = new ArrayList();
    let match: RegExpExecArray | null;

    do {
      match = NORMAL_ENTRY_PATTERN.exec(this._template);

      if (match != null) {
        if (!entries.contains(match[1])) {
          entries.add(match[1]);
        }
      }
    } while (match != null);

    return entries;
  }
}

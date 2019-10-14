import isPlainObject from 'is-plain-object'
import { Path, Text } from '..'

/**
 * `Mark` objects represent formatting that is applied to text in a Slate
 * document. They appear in leaf text nodes in the document, as well as in
 * annotations on the root value object.
 */

interface Mark {}

/**
 * `MarkEntry` tuples are returned when iterating through the marks in a text
 * node. They include the index of the mark in the text node's marks array, as
 * well as the text node and its path in the root node.
 */

type MarkEntry = [Mark, number, Text, Path]

namespace Mark {
  /**
   * Check if a mark exists in a set of marks.
   */

  export const exists = (mark: Mark, marks: Mark[]): boolean => {
    return !!marks.find(f => Mark.matches(f, mark))
  }

  /**
   * Check if a value implements the `Mark` interface.
   */

  export const isMark = (value: any): value is Mark => {
    return (
      isPlainObject(value) &&
      value.key == null && // not an `Annotation`
      (value.anchor == null && value.focus == null) && // not a `Decoration`
      typeof value.type === 'string'
    )
  }

  /**
   * Check if a value is an array of `Mark` objects.
   */

  export const isMarkList = (value: any): value is Mark[] => {
    return Array.isArray(value) && (value.length === 0 || Mark.isMark(value[0]))
  }

  /**
   * Check if a mark matches set of properties.
   */

  export const matches = (mark: Mark, props: Partial<Mark>): boolean => {
    for (const key in props) {
      if (mark[key] !== props[key]) {
        return false
      }
    }

    return true
  }
}

export { Mark, MarkEntry }
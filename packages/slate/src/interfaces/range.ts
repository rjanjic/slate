import { produce } from 'immer'
import isPlainObject from 'is-plain-object'
import { Operation, Path, Point } from '..'

/**
 * `Range` objects are a set of points that refer to a specific span of a Slate
 * document. They can define a span inside a single node or a can span across
 * multiple nodes.
 */

interface Range {
  anchor: Point
  focus: Point
}

namespace Range {
  /**
   * Check if a range is exactly equal to another.
   */

  export const equals = (range: Range, another: Range): boolean => {
    return (
      Point.equals(range.anchor, another.anchor) &&
      Point.equals(range.focus, another.focus)
    )
  }

  /**
   * Check if a range includes a path or a point.
   */

  export const includes = (range: Range, target: Path | Point): boolean => {
    const [start, end] = Range.points(range)

    if (Point.isPoint(target)) {
      return (
        (Point.equals(target, start) || Point.isAfter(target, start)) &&
        (Point.equals(target, end) || Point.isBefore(target, end))
      )
    } else {
      return (
        (Path.equals(target, start.path) || Path.isAfter(target, start.path)) &&
        (Path.equals(target, end.path) || Path.isBefore(target, end.path))
      )
    }
  }

  /**
   * Check if a range is backward, meaning that its anchor point appears in the
   * document _after_ its focus point.
   */

  export const isBackward = (range: Range): boolean => {
    const { anchor, focus } = range
    return Point.isAfter(anchor, focus)
  }

  /**
   * Check if a range is collapsed, meaning that both its anchor and focus
   * points refer to the exact same position in the document.
   */

  export const isCollapsed = (range: Range): boolean => {
    const { anchor, focus } = range
    return Point.equals(anchor, focus)
  }

  /**
   * Check if a range is expanded.
   *
   * This is the opposite of [[Range.isCollapsed]] and is provided for legibility.
   */

  export const isExpanded = (range: Range): boolean => {
    return !isCollapsed(range)
  }

  /**
   * Check if a range is forward.
   *
   * This is the opposite of [[Range.isBackward]] and is provided for legibility.
   */

  export const isForward = (range: Range): boolean => {
    return !isBackward(range)
  }

  /**
   * Check if a value implements the [[Range]] interface.
   */

  export const isRange = (value: any): value is Range => {
    return (
      isPlainObject(value) &&
      Point.isPoint(value.anchor) &&
      Point.isPoint(value.focus)
    )
  }

  /**
   * Get the start and end points of a range, in the order in which they appear
   * in the document.
   */

  export const points = (range: Range): [Point, Point] => {
    const { anchor, focus } = range
    return Range.isBackward(range) ? [focus, anchor] : [anchor, focus]
  }

  /**
   * Transform a range by an operation.
   */

  export const transform = (
    range: Range,
    op: Operation,
    options: { stick: 'forward' | 'backward' | 'outward' | 'inward' | null }
  ): Range | null => {
    const { stick = 'inward' } = options
    let stickAnchor: 'forward' | 'backward' | null
    let stickFocus: 'forward' | 'backward' | null

    if (stick === 'inward') {
      if (Range.isForward(range)) {
        stickAnchor = 'forward'
        stickFocus = 'backward'
      } else {
        stickAnchor = 'backward'
        stickFocus = 'forward'
      }
    } else if (stick === 'outward') {
      if (Range.isForward(range)) {
        stickAnchor = 'backward'
        stickFocus = 'forward'
      } else {
        stickAnchor = 'forward'
        stickFocus = 'backward'
      }
    } else {
      stickAnchor = stick
      stickFocus = stick
    }

    return produce(range, r => {
      const anchor = Point.transform(r.anchor, op, { stick: stickAnchor })
      const focus = Point.transform(r.focus, op, { stick: stickFocus })

      if (!anchor || !focus) {
        return null
      }

      r.anchor = anchor
      r.focus = focus
    })
  }
}

export { Range }
import pick from 'lodash/pick'
import Annotation from '../models/annotation'
import Value from '../models/value'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Set `properties` on the value.
 *
 * @param {Object|Value} properties
 */

Commands.setData = (fn, editor) => (data = {}) => {
  const { value } = editor
  const newProperties = Value.createProperties({ data })
  const prevProperties = pick(value, Object.keys(newProperties))

  editor.applyOperation({
    type: 'set_value',
    properties: prevProperties,
    newProperties,
  })
}

Commands.addAnnotation = (fn, editor) => annotation => {
  annotation = Annotation.create(annotation)

  editor.applyOperation({
    type: 'add_annotation',
    annotation,
  })
}

Commands.removeAnnotation = (fn, editor) => annotation => {
  annotation = Annotation.create(annotation)

  editor.applyOperation({
    type: 'remove_annotation',
    annotation,
  })
}

Commands.setAnnotation = (fn, editor) => (annotation, newProperties) => {
  annotation = Annotation.create(annotation)
  newProperties = Annotation.createProperties(newProperties)

  editor.applyOperation({
    type: 'set_annotation',
    properties: annotation,
    newProperties,
  })
}

Commands.setAnnotations = (editor, annotations = []) => {
  const { value } = editor
  const newProperties = Value.createProperties({ annotations })
  const prevProperties = pick(value, Object.keys(newProperties))

  editor.applyOperation({
    type: 'set_value',
    properties: prevProperties,
    newProperties,
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands

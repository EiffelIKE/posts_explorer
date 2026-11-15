import { describe, expect, it } from 'vitest'
import { newPostSchema, validateNewPost } from './newPostSchema'

describe('new post rules', () => {
  it('requires a title and a body', () => {
    expect(validateNewPost({ title: '', body: '' })).toEqual({
      title: 'Add a title.',
      body: 'Write something in the body.',
    })
  })

  it('treats whitespace-only fields as empty', () => {
    expect(validateNewPost({ title: '   ', body: '\n\t ' })).toEqual({
      title: 'Add a title.',
      body: 'Write something in the body.',
    })
  })

  it('needs at least 2 characters in the title, counted after trimming', () => {
    expect(validateNewPost({ title: ' a ', body: 'Body' })).toEqual({
      title: 'Use at least 2 characters for the title.',
    })
    expect(validateNewPost({ title: 'ab', body: 'Body' })).toEqual({})
  })

  it('has no maximum length', () => {
    expect(
      validateNewPost({ title: 'x'.repeat(5000), body: 'y'.repeat(50000) }),
    ).toEqual({})
  })

  it('publishes the trimmed values', () => {
    expect(
      newPostSchema.parse({ title: '  Hello  ', body: '\n World \n' }),
    ).toEqual({ title: 'Hello', body: 'World' })
  })
})

import Vue from 'vue'

describe('Options lifecyce hooks', () => {
  let spy
  beforeEach(() => {
    spy = jasmine.createSpy('hook')
  })

  describe('init', () => {
    it('should allow modifying options', () => {
      const vm = new Vue({
        data: {
          a: 1
        },
        init () {
          spy()
          expect(this.a).toBeUndefined()
          this.$options.computed = {
            b () {
              return this.a + 1
            }
          }
        }
      })
      expect(spy).toHaveBeenCalled()
      expect(vm.b).toBe(2)
    })
  })

  describe('created', () => {
    it('should have completed observation', () => {
      new Vue({
        data: {
          a: 1
        },
        created () {
          expect(this.a).toBe(1)
          spy()
        }
      })
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('beforeMount', () => {
    it('should not have mounted', () => {
      const vm = new Vue({
        beforeMount () {
          spy()
          expect(this._isMounted).toBe(false)
          expect(this.$el).toBeUndefined() // due to empty mount
          expect(this._vnode).toBeNull()
          expect(this._watcher).toBeNull()
        }
      })
      expect(spy).not.toHaveBeenCalled()
      vm.$mount()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('mounted', () => {
    it('should have mounted', () => {
      const vm = new Vue({
        template: '<div></div>',
        mounted () {
          spy()
          expect(this._isMounted).toBe(true)
          expect(this.$el.tagName).toBe('DIV')
          expect(this._vnode.tag).toBe('div')
        }
      })
      expect(spy).not.toHaveBeenCalled()
      vm.$mount()
      expect(spy).toHaveBeenCalled()
    })

    it('should mount child parent in correct order', () => {
      const calls = []
      new Vue({
        template: '<test></test>',
        mounted () {
          calls.push('parent')
        },
        components: {
          test: {
            template: '<div></div>',
            mounted () {
              calls.push('child')
            }
          }
        }
      }).$mount()
      expect(calls).toEqual(['child', 'parent'])
    })
  })

  describe('beforeUpdate', () => {
    it('should be called before update', done => {
      const vm = new Vue({
        template: '<div>{{ msg }}</div>',
        data: { msg: 'foo' },
        beforeUpdate () {
          spy()
          expect(this.$el.textContent).toBe('foo')
        }
      }).$mount()
      expect(spy).not.toHaveBeenCalled()
      vm.msg = 'bar'
      expect(spy).not.toHaveBeenCalled() // should be async
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalled()
      }).then(done)
    })
  })

  describe('updated', () => {
    it('should be called after update', done => {
      const vm = new Vue({
        template: '<div>{{ msg }}</div>',
        data: { msg: 'foo' },
        updated () {
          spy()
          expect(this.$el.textContent).toBe('bar')
        }
      }).$mount()
      expect(spy).not.toHaveBeenCalled()
      vm.msg = 'bar'
      expect(spy).not.toHaveBeenCalled() // should be async
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalled()
      }).then(done)
    })
  })

  describe('beforeDestroy', () => {
    it('should be called before destroy', () => {
      const vm = new Vue({
        beforeDestroy () {
          spy()
          expect(this._isBeingDestroyed).toBe(false)
          expect(this._isDestroyed).toBe(false)
        }
      }).$mount()
      expect(spy).not.toHaveBeenCalled()
      vm.$destroy()
      vm.$destroy()
      expect(spy).toHaveBeenCalled()
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('destroyed', () => {
    it('should be called after destroy', () => {
      const vm = new Vue({
        destroyed () {
          spy()
          expect(this._isBeingDestroyed).toBe(true)
          expect(this._isDestroyed).toBe(true)
        }
      }).$mount()
      expect(spy).not.toHaveBeenCalled()
      vm.$destroy()
      vm.$destroy()
      expect(spy).toHaveBeenCalled()
      expect(spy.calls.count()).toBe(1)
    })
  })
})
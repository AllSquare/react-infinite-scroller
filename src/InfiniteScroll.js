import React from 'react'
import PropTypes from 'prop-types'

export default class InfiniteScroll extends React.Component {
  static propTypes = {
    element: PropTypes.string,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool,
    children: PropTypes.array.isRequired,
    loader: PropTypes.object
  }

  static defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: false,
    isReverse: false,
    useCapture: false,
    loader: null
  }

  componentDidMount() {
    // console.log('COMPONENT DID MOUNT')
    this.pageLoaded = this.props.pageStart
  }

  componentDidUpdate() {
    if (this.props.isReverse && this.pageLoaded === this.props.pageStart) {
      this.bottomNode.scrollIntoView()
    }
    if (this.props.isReverse && this.scrollComponent.parentNode.scrollTop < this.props.threshold) {
      // console.log('JE DOIS DESCENDRE CAR TROP HAUT')
      this.topNode.scrollIntoView()
    }
    this.attachScrollListener()
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  handleRef = (node) => { this.scrollComponent = node }
  handleTopRef = (node) => { this.topNode = node }
  handleBottomRef = (node) => { this.bottomNode = node }

  detachScrollListener() {
    const scrollEl = this.props.useWindow ? window : this.scrollComponent.parentNode

    scrollEl.removeEventListener('scroll', this.scrollListener, this.props.useCapture)
    scrollEl.removeEventListener('resize', this.scrollListener, this.props.useCapture)
  }

  attachScrollListener() {
    if (!this.props.hasMore) { return }

    const scrollEl = this.props.useWindow ? window : this.scrollComponent.parentNode

    scrollEl.addEventListener('scroll', this.scrollListener, this.props.useCapture)
    scrollEl.addEventListener('resize', this.scrollListener, this.props.useCapture)

    if (this.props.initialLoad) {
      this.scrollListener()
    }
  }

  scrollListener = () => {
    const el = this.scrollComponent
    const scrollEl = window

    let offset
    if (this.props.useWindow) {
      const scrollTop = (scrollEl.pageYOffset !== undefined) ?
      scrollEl.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop
      if (this.props.isReverse) {
        offset = scrollTop
      } else {
        offset = this.calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight)
      }
    } else if (this.props.isReverse) {
      offset = el.parentNode.scrollTop
    } else {
      offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight
    }

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener()
        // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (this.props.loadMore) {
        this.props.loadMore(this.pageLoaded += 1)
      }
    }
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent)
  }

  addRefPropToLastKeyChild(childrenArray) {
    // console.log('ADDREF LAST KEY IS:', this.lastKey)
    const lastKey = this.lastKey
    this.lastKey = this.props.children[0].key
    // console.log('ADDREF NEW LAST KEY IS:', this.lastKey)
    const childIndex = this.props.children.findIndex((_child) => _child.key === lastKey)
    // console.log('ADDREF CHILD:', childIndex)
    if (childIndex === -1) {
      return childrenArray
    }
    childrenArray.splice(childIndex, 1, {
      ...childrenArray[childIndex],
      ref: this.handleTopRef
    })
    return childrenArray
  }

  render() {
    let childrenArray = this.props.isReverse ? this.props.children.reverse() : this.props.children

    if (this.props.isReverse && this.props.children.length) {
      // console.log('RENDER: UPDATE CHILDREN ARRAY')
      childrenArray = this.addRefPropToLastKeyChild(childrenArray)
      // console.log('RENDER: LE CHILD ARRAY:', childrenArray)
      childrenArray.push(<div ref={this.handleBottomRef} />)
    }
    if (this.props.hasMore) {
      childrenArray[this.props.isReverse ? 'unshift' : 'shift'](this.props.loader || this.defaultLoader)
    }
    return React.createElement(this.props.element, { ref: this.handleRef }, ...childrenArray)
  }
}

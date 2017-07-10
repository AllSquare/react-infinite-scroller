import React from 'react'
import style from './style'
import InfiniteScroll from '../src/InfiniteScroll'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = { items: [], hasMore: false }
  }

  componentDidMount = async () => {
    const url = 'https://jsonplaceholder.typicode.com/todos'
    const res = await fetch(url)
    const datas = await res.json()

    this.datas = datas
    this.setState({ items: this.datas.slice(0, 20), hasMore: true })
  }

  loadMore = (page) => {
    console.log('I LOAD MORE')
    const items = this.state.items.concat(this.datas.slice(page * 20, (page * 20) + 20))
    this.setState({ items, hasMore: items.length < 200 })
  }

  render() {
    const loader = <div className="loader">Loading ...</div>

    const items = this.state.items.map((item, i) => (
      <div className="track" key={i}>
        {i}
        <br />
        {item.title}
      </div>
    ))

    return (
      <div>
        <style global jsx>{style}</style>
        <div className="header">Total: {items.length}</div>
        <div className="scrollContainer">
          <InfiniteScroll
            page={1}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={loader}>
            {items}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default `
  body {
    margin: 0;
  }
  .scrollContainer {
    width: 100%;
    height: calc(100vh - 100px);
    margin-top: 100px;
    overflow-y: scroll;
  }
  .header {
    position: fixed;
    width: 100%;
    height: 100px;
    background: #111;
    color: #ddd;
    text-align: center;
    top: 0;
  }
  .track {
    width: 100%;
    height: 50px;
  }
`

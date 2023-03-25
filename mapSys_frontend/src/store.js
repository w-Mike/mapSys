export default {
  // showView:false,
  state:{
    _tileMap:'vector_map'
  },
  get tileMap(){
    return this.state._tileMap
  },
  set tileMap(newVal){
    this.state._tileMap = newVal
  }
}

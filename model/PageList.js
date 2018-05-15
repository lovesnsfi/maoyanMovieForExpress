class PageList{
  constructor(pageIndex,sumCount,data){
    this.pageIndex=pageIndex;
    this.sumCount=sumCount;
    this.data=data;
    this.pageCount=Math.ceil(this.sumCount/10);
  }
}

module.exports=PageList
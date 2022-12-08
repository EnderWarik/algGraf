import Matrix from "@/composition/Matrix";

class OperationsFromMatrix {
    private adjacencyMatrix: Matrix;
    private readonly countOfVertices: number
    private recordsStep: [number,number,number,number,number,number[][]][]
    private countOfEdges: number


    constructor(countOfVertices:number,countOfEdges:number) {
        if(countOfEdges > countOfVertices*countOfVertices - countOfVertices) throw new Error("wrong size")
        const resultArr: number[][] = []

        for(let i=0; i<countOfVertices;i++){
            const rowArr: number[] = []

            for(let j=0; j<countOfVertices;j++){
                rowArr.push(0)
            }

            resultArr.push(rowArr)
        }
        this.adjacencyMatrix = new Matrix(resultArr)
        this.countOfVertices = countOfVertices
        this.recordsStep = [[0,0,0,0,0,[[0]]]]
        this.countOfEdges = countOfEdges

    }

    public createNonOrientedAdjacencyMatrix(){
        if(this.recordsStep.length !==0){
            for(let i=0;i < this.recordsStep.length;i++)
            {
                this.recordsStep.pop();
            }
        }

        for(let i =0;i< this.countOfEdges;i++){
        const randomPosition = Math.floor(Math.pow(this.countOfVertices,2) * Math.random())+1
        const [row, column] = this.getCorrectPosition(randomPosition)
        if(row !== column){
            const test = this.adjacencyMatrix.setNumberTo(row,column,1)
           // console.log(test);
            if(!test){
                this.countOfEdges++
            }

        }
        else{
           // console.log('row=column')
            this.countOfEdges++
        }

        this.recordStep(i,randomPosition,row,column,this.countOfEdges,this.adjacencyMatrix.getValue())
       // console.log(row, column,this.adjacencyMatrix.getValue(),this.countOfEdges)
        }
    }

    public getCorrectPosition(numberEdge:number):[number,number]{
        let counter = 0;

        for(let i=0; i<this.countOfVertices;i++){
            for(let j=0; j<this.countOfVertices;j++){
                counter++
              if(counter === numberEdge ){
                  return [i,j]
              }
            }


        }
        return [0,0]
    }

    private recordStep(countStep:number,randomPosition:number,row:number,column:number,currentStep:number,matrix:number[][]){
        const unrefMatrix = JSON.parse(JSON.stringify(matrix))
        this.recordsStep.push([countStep,randomPosition,row,column,currentStep,unrefMatrix])
    }

    public getRecordStep(){
        return this.recordsStep
    }
    public getAdjacencyMatrix(){
        return this.adjacencyMatrix
    }
}
export default OperationsFromMatrix



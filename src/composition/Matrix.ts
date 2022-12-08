
class Matrix {
    private value: number[][];

    constructor(array: number[][]) {

        let matrixSize  =array[0].length
        for (let i=1;i < array.length;i++){
            if (array[i].length != matrixSize) throw new Error("wrong size")
        }
        this.value = array;
    };

    public getValue(){
        return this.value;
    }
    public setValue(array:number[][]){
        let matrixSize  =array[0].length
        for (let i=1;i < array.length;i++){
            if (array[i].length != matrixSize) throw new Error("wrong size")
        }
        this.value = array;
    }
    public copyFrom(obj:Matrix){
        this.value = obj.getValue();
    }

    public setNumberTo(row:number,column:number,value:number):boolean{
        if(this.value[row][column] === 1){
            return false
        }else{
            this.value[row][column] = value;
            return true
        }

    }
    public getLength(){
        return this.value.length;
    }
}

export default Matrix;
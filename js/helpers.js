export function searchVariable(array, name){
    return array.some(variable => variable.name === name)
}

export function showErrors(array)
{  
    if(array.length === 0 ){
        console.log("No errors were round.")
        return;
    }
    for(let i = 0; i < array.length; i++){
        if(array[i] != undefined){
            console.log(`In line ${i + 1}: ${array[i]}`)
        }
    }
    
}

export function clearBeginEnd(obj) {
    for (let key in obj) {
      if (key === 'begin' || key === 'end') {
        obj[key] = 0;
      }
    }
    return obj;
  }
export function searchVariable(array, name){
    return array.some(variable => variable.name === name)
}

export function clearBeginEnd(obj) {
    for (let key in obj) {
      if (key === 'begin' || key === 'end') {
        obj[key] = 0;
      }
    }
    return obj;
  }
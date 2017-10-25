// 递归求解最小编辑距离
function recursion(a, b, i, j) {
  if(i === 0) {
    return j
  } else if(j === 0) {
    return j
  } else if(a[i - 1] === b[j - 1]) {
    return recursion(a, b, i - 1, j - 1)
  } else {
    let m1 = recursion(a, b, i - 1, j - 1) + 1
    let m2 = recursion(a, b, i - 1, j) + 1
    let m3 = recursion(a, b, i, j - 1) + 1
    return Math.min(m1, m2, m3)
  }
}

console.log(recursion('abdf', 'abc', 4, 3))

// 动态规划求编辑距离
function editInstance(a, b) {
  let lengthA = a.length
  let lengthB = b.length

  let d = []
  d[0] = []

  for(let j = 0; j <= lengthB; j++) {
      d[0].push(j);
  }

  for(let i = 0; i <= lengthA; i++) {
    if(d[i]) {
        d[i][0] = i;
    } else {
        d[i] = [];
        d[i][0] = i;
    }
  }

  for(let i = 1; i <= lengthA; i++) {
    for(let j = 1; j <= lengthB; j++) {
      if(a[i - 1] === b[j - 1]) {
        d[i][j] = d[i - 1][j -1]
      } else {
        let m1 = d[i -1][j] + 1
        let m2 = d[i][j -1] + 1
        let m3 = d[i -1][j - 1] + 1
        d[i][j] = Math.min(m1, m2, m3)
      }
    }
  }

  return d[lengthA][lengthB]
}


{
  keyIndex: {
  item2: 0,
  item1: 1,
  item5: 2,
  item4: 3
  },
  free: []
}


// console.log(editInstance('abdf', 'abc'))

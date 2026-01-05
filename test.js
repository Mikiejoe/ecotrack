const te = [
  { name: "joe", marks: 10 },
  { name: "joe2", marks: 20 },
  { name: "joe3", marks: 30 },
];
let total = 0;
const sum = te.reduce((prev, curr, index) => {
    total+=curr.marks
},te[0]);

console.log(sum);

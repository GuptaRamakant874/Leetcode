const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem,getProblemForAdminEdit,getUserProfileStats} = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleware');

const problemRouter = express.Router();


// Create
// verify karna padega
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.patch('/update/:id',adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);
problemRouter.get("/admin/problemById/:id",adminMiddleware,getProblemForAdminEdit);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get('/getAllProblem',userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);
problemRouter.get("/profileStats",userMiddleware,getUserProfileStats);

// Fetch
// Update
// Delete


module.exports = problemRouter;






// const json ={
//     "title": "Add Two Numbers",
//     "description": "Write a program that takes two integers as input and returns their sum.",
//     "difficulty": "easy",
//     "tags": "array",
//     "visibleTestCases": [
//         {
//         "input": "2 3",
//         "output": "5",
//         "explanation": "2 + 3 equals 5"
//         },
//         {
//         "input": "-1 5",
//         "output": "4",
//         "explanation": "-1 + 5 equals 4"
//         }
//     ],
//     "hiddenTestCases": [
//         {
//         "input": "10 20",
//         "output": "30"

//         },
//         {

//         "input": "100 250",
//         "output": "350"
//         }
//     ],
//     "startCode": [
//         {
//             "language": "C++",
//             "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "code": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        scanner.close();\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "code": "const readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nrl.on('line', (input) => {\n    // Write your code here\n    rl.close();\n});"
//         },
//         {
//             "language": "Python",
//             "code": "# Read input\n# Write your code here"
//         }
//     ],
//     "referenceSolution": [
//         {
//             "language": "C++",
//             "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(a + b);\n        scanner.close();\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "completeCode": "const readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nrl.on('line', (input) => {\n    const numbers = input.split(' ').map(Number);\n    const sum = numbers[0] + numbers[1];\n    console.log(sum);\n    rl.close();\n});"
//         }
//     ]
// }

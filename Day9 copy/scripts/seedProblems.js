require("dotenv").config();
const mongoose = require("mongoose");

const Problem = require("../src/models/problem");
const User = require("../src/models/user");

const problems = [
    {
        title: "Maximum Subarray Sum",
        description: "Given an integer array, find the contiguous subarray with the largest sum and print that maximum sum.",
        difficulty: "medium",
        tags: ["array", "DP"],
        visibleTestCases: [
            {
                input: "8\n-2 -3 4 -1 -2 1 5 -3",
                output: "7",
                explanation: "The subarray 4 -1 -2 1 5 has the maximum sum 7."
            },
            {
                input: "5\n1 2 3 4 5",
                output: "15",
                explanation: "Using the whole array gives the maximum sum."
            }
        ],
        hiddenTestCases: [
            {
                input: "4\n-5 -1 -8 -9",
                output: "-1"
            },
            {
                input: "6\n3 -2 5 -1 6 -3",
                output: "11"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\n\nfunction maxSubarraySum(arr) {\n    // Write your code here\n}\n\nconsole.log(maxSubarraySum(arr));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint maxSubarraySum(const vector<int>& arr) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    cout << maxSubarraySum(arr);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int maxSubarraySum(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(maxSubarraySum(arr));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\n\nlet best = arr[0];\nlet current = arr[0];\nfor (let i = 1; i < arr.length; i++) {\n    current = Math.max(arr[i], current + arr[i]);\n    best = Math.max(best, current);\n}\n\nconsole.log(best);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int best = arr[0];\n    int current = arr[0];\n    for (int i = 1; i < n; i++) {\n        current = max(arr[i], current + arr[i]);\n        best = max(best, current);\n    }\n    cout << best;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int best = arr[0];\n        int current = arr[0];\n        for (int i = 1; i < n; i++) {\n            current = Math.max(arr[i], current + arr[i]);\n            best = Math.max(best, current);\n        }\n        System.out.println(best);\n    }\n}"
            }
        ]
    },
    {
        title: "Reverse a Linked List",
        description: "Given a singly linked list represented as space separated values, print the list in reversed order.",
        difficulty: "easy",
        tags: ["LinkedList"],
        visibleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "5 4 3 2 1",
                explanation: "Reversing the list changes the order of nodes."
            },
            {
                input: "1\n42",
                output: "42",
                explanation: "A single node remains the same after reversal."
            }
        ],
        hiddenTestCases: [
            {
                input: "4\n9 8 7 6",
                output: "6 7 8 9"
            },
            {
                input: "3\n10 20 30",
                output: "30 20 10"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nconst values = tokens.slice(1, n + 1);\n\nfunction reverseValues(values) {\n    // Write your code here\n}\n\nconsole.log(reverseValues(values).join(' '));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> reverseValues(vector<int> values) {\n    // Write your code here\n    return values;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n);\n    for (int i = 0; i < n; i++) cin >> values[i];\n    vector<int> ans = reverseValues(values);\n    for (int i = 0; i < ans.size(); i++) {\n        if (i) cout << ' ';\n        cout << ans[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int[] reverseValues(int[] values) {\n        // Write your code here\n        return values;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) values[i] = sc.nextInt();\n        int[] ans = reverseValues(values);\n        for (int i = 0; i < ans.length; i++) {\n            if (i > 0) System.out.print(\" \");\n            System.out.print(ans[i]);\n        }\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nconst values = tokens.slice(1, n + 1);\nconsole.log(values.reverse().join(' '));"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n);\n    for (int i = 0; i < n; i++) cin >> values[i];\n    reverse(values.begin(), values.end());\n    for (int i = 0; i < values.size(); i++) {\n        if (i) cout << ' ';\n        cout << values[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) values[i] = sc.nextInt();\n        for (int i = n - 1; i >= 0; i--) {\n            if (i != n - 1) System.out.print(\" \");\n            System.out.print(values[i]);\n        }\n    }\n}"
            }
        ]
    },
    {
        title: "Count Connected Components",
        description: "Given an undirected graph with n nodes and m edges, count how many connected components are present.",
        difficulty: "medium",
        tags: ["graph"],
        visibleTestCases: [
            {
                input: "5 3\n1 2\n2 3\n4 5",
                output: "2",
                explanation: "There are two connected groups: {1,2,3} and {4,5}."
            },
            {
                input: "4 0",
                output: "4",
                explanation: "With no edges, every node is its own component."
            }
        ],
        hiddenTestCases: [
            {
                input: "6 3\n1 2\n3 4\n5 6",
                output: "3"
            },
            {
                input: "7 6\n1 2\n2 3\n3 4\n4 5\n5 6\n6 7",
                output: "1"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst m = input[idx++];\nconst edges = [];\nfor (let i = 0; i < m; i++) {\n    edges.push([input[idx++], input[idx++]]);\n}\n\nfunction countComponents(n, edges) {\n    // Write your code here\n}\n\nconsole.log(countComponents(n, edges));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint countComponents(int n, const vector<pair<int, int>>& edges) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<pair<int, int>> edges;\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        edges.push_back({u, v});\n    }\n    cout << countComponents(n, edges);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int countComponents(int n, int[][] edges) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n        }\n        System.out.println(countComponents(n, edges));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst raw = fs.readFileSync(0, 'utf8').trim();\nif (!raw) {\n    process.exit(0);\n}\nconst input = raw.split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst m = input[idx++];\nconst graph = Array.from({ length: n + 1 }, () => []);\nfor (let i = 0; i < m; i++) {\n    const u = input[idx++];\n    const v = input[idx++];\n    graph[u].push(v);\n    graph[v].push(u);\n}\nconst visited = new Array(n + 1).fill(false);\nlet components = 0;\nfor (let node = 1; node <= n; node++) {\n    if (visited[node]) continue;\n    components++;\n    const stack = [node];\n    visited[node] = true;\n    while (stack.length) {\n        const current = stack.pop();\n        for (const next of graph[current]) {\n            if (!visited[next]) {\n                visited[next] = true;\n                stack.push(next);\n            }\n        }\n    }\n}\nconsole.log(components);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> graph(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    vector<bool> visited(n + 1, false);\n    int components = 0;\n    for (int node = 1; node <= n; node++) {\n        if (visited[node]) continue;\n        components++;\n        stack<int> st;\n        st.push(node);\n        visited[node] = true;\n        while (!st.empty()) {\n            int current = st.top();\n            st.pop();\n            for (int next : graph[current]) {\n                if (!visited[next]) {\n                    visited[next] = true;\n                    st.push(next);\n                }\n            }\n        }\n    }\n    cout << components;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        List<Integer>[] graph = new ArrayList[n + 1];\n        for (int i = 0; i <= n; i++) graph[i] = new ArrayList<>();\n        for (int i = 0; i < m; i++) {\n            int u = sc.nextInt();\n            int v = sc.nextInt();\n            graph[u].add(v);\n            graph[v].add(u);\n        }\n        boolean[] visited = new boolean[n + 1];\n        int components = 0;\n        for (int node = 1; node <= n; node++) {\n            if (visited[node]) continue;\n            components++;\n            Deque<Integer> stack = new ArrayDeque<>();\n            stack.push(node);\n            visited[node] = true;\n            while (!stack.isEmpty()) {\n                int current = stack.pop();\n                for (int next : graph[current]) {\n                    if (!visited[next]) {\n                        visited[next] = true;\n                        stack.push(next);\n                    }\n                }\n            }\n        }\n        System.out.println(components);\n    }\n}"
            }
        ]
    },
    {
        title: "Climbing Stairs",
        description: "You are given n stairs. You can climb either 1 or 2 stairs at a time. Print the total number of distinct ways to reach the top.",
        difficulty: "easy",
        tags: ["DP"],
        visibleTestCases: [
            {
                input: "2",
                output: "2",
                explanation: "The two ways are (1+1) and (2)."
            },
            {
                input: "5",
                output: "8",
                explanation: "The count follows the Fibonacci pattern."
            }
        ],
        hiddenTestCases: [
            {
                input: "1",
                output: "1"
            },
            {
                input: "7",
                output: "21"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst n = Number(fs.readFileSync(0, 'utf8').trim());\n\nfunction climbStairs(n) {\n    // Write your code here\n}\n\nconsole.log(climbStairs(n));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\nusing namespace std;\n\nint climbStairs(int n) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << climbStairs(n);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(climbStairs(n));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst n = Number(fs.readFileSync(0, 'utf8').trim());\nif (n <= 2) {\n    console.log(n);\n} else {\n    let a = 1;\n    let b = 2;\n    for (let i = 3; i <= n; i++) {\n        const c = a + b;\n        a = b;\n        b = c;\n    }\n    console.log(b);\n}"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n <= 2) {\n        cout << n;\n        return 0;\n    }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    cout << b;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n <= 2) {\n            System.out.println(n);\n            return;\n        }\n        int a = 1;\n        int b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n    }\n}"
            }
        ]
    },
    {
        title: "Two Sum Pair Exists",
        description: "Given an array and a target, print YES if there exists a pair whose sum equals the target, otherwise print NO.",
        difficulty: "easy",
        tags: ["array"],
        visibleTestCases: [
            {
                input: "5 9\n2 7 11 15 1",
                output: "YES",
                explanation: "2 + 7 equals 9."
            },
            {
                input: "4 20\n1 2 3 4",
                output: "NO",
                explanation: "No pair forms the target sum."
            }
        ],
        hiddenTestCases: [
            {
                input: "6 10\n8 2 6 4 1 9",
                output: "YES"
            },
            {
                input: "3 8\n1 1 1",
                output: "NO"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst target = input[idx++];\nconst arr = input.slice(idx, idx + n);\n\nfunction hasPair(arr, target) {\n    // Write your code here\n}\n\nconsole.log(hasPair(arr, target) ? 'YES' : 'NO');"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nbool hasPair(const vector<int>& arr, int target) {\n    // Write your code here\n    return false;\n}\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    cout << (hasPair(arr, target) ? \"YES\" : \"NO\");\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static boolean hasPair(int[] arr, int target) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(hasPair(arr, target) ? \"YES\" : \"NO\");\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst target = input[idx++];\nconst arr = input.slice(idx, idx + n);\nconst seen = new Set();\nlet found = false;\nfor (const value of arr) {\n    if (seen.has(target - value)) {\n        found = true;\n        break;\n    }\n    seen.add(value);\n}\nconsole.log(found ? 'YES' : 'NO');"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    unordered_set<int> seen;\n    bool found = false;\n    for (int i = 0; i < n; i++) {\n        int value;\n        cin >> value;\n        if (seen.count(target - value)) found = true;\n        seen.insert(value);\n    }\n    cout << (found ? \"YES\" : \"NO\");\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        Set<Integer> seen = new HashSet<>();\n        boolean found = false;\n        for (int i = 0; i < n; i++) {\n            int value = sc.nextInt();\n            if (seen.contains(target - value)) found = true;\n            seen.add(value);\n        }\n        System.out.println(found ? \"YES\" : \"NO\");\n    }\n}"
            }
        ]
    },
    {
        title: "Best Time to Buy and Sell Stock",
        description: "Given stock prices where prices[i] is the price on day i, print the maximum profit from one buy and one sell. If no profit is possible, print 0.",
        difficulty: "easy",
        tags: ["array"],
        visibleTestCases: [
            {
                input: "6\n7 1 5 3 6 4",
                output: "5",
                explanation: "Buy at 1 and sell at 6."
            },
            {
                input: "5\n7 6 4 3 1",
                output: "0",
                explanation: "The prices never increase after buying."
            }
        ],
        hiddenTestCases: [
            {
                input: "6\n2 4 1 7 5 3",
                output: "6"
            },
            {
                input: "4\n1 2 3 4",
                output: "3"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst prices = input.slice(1, n + 1);\n\nfunction maxProfit(prices) {\n    // Write your code here\n}\n\nconsole.log(maxProfit(prices));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint maxProfit(const vector<int>& prices) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> prices(n);\n    for (int i = 0; i < n; i++) cin >> prices[i];\n    cout << maxProfit(prices);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] prices = new int[n];\n        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();\n        System.out.println(maxProfit(prices));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst prices = input.slice(1, n + 1);\nlet minPrice = Infinity;\nlet profit = 0;\nfor (const price of prices) {\n    minPrice = Math.min(minPrice, price);\n    profit = Math.max(profit, price - minPrice);\n}\nconsole.log(profit);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> prices(n);\n    for (int i = 0; i < n; i++) cin >> prices[i];\n    int minPrice = prices[0];\n    int profit = 0;\n    for (int price : prices) {\n        minPrice = min(minPrice, price);\n        profit = max(profit, price - minPrice);\n    }\n    cout << profit;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] prices = new int[n];\n        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();\n        int minPrice = prices[0];\n        int profit = 0;\n        for (int price : prices) {\n            minPrice = Math.min(minPrice, price);\n            profit = Math.max(profit, price - minPrice);\n        }\n        System.out.println(profit);\n    }\n}"
            }
        ]
    },
    {
        title: "Move Zeroes",
        description: "Given an array, move all zeroes to the end while keeping the relative order of non-zero elements the same.",
        difficulty: "easy",
        tags: ["array"],
        visibleTestCases: [
            {
                input: "5\n0 1 0 3 12",
                output: "1 3 12 0 0",
                explanation: "All non-zero values stay in order and zeroes move to the end."
            },
            {
                input: "4\n1 2 3 4",
                output: "1 2 3 4",
                explanation: "There are no zeroes to move."
            }
        ],
        hiddenTestCases: [
            {
                input: "6\n0 0 1 0 2 3",
                output: "1 2 3 0 0 0"
            },
            {
                input: "3\n0 0 0",
                output: "0 0 0"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\n\nfunction moveZeroes(arr) {\n    // Write your code here\n}\n\nconsole.log(moveZeroes(arr).join(' '));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> moveZeroes(vector<int> arr) {\n    // Write your code here\n    return arr;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    vector<int> ans = moveZeroes(arr);\n    for (int i = 0; i < ans.size(); i++) {\n        if (i) cout << ' ';\n        cout << ans[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int[] moveZeroes(int[] arr) {\n        // Write your code here\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int[] ans = moveZeroes(arr);\n        for (int i = 0; i < ans.length; i++) {\n            if (i > 0) System.out.print(\" \");\n            System.out.print(ans[i]);\n        }\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\nconst ans = [];\nlet zeroCount = 0;\nfor (const value of arr) {\n    if (value === 0) zeroCount++;\n    else ans.push(value);\n}\nwhile (zeroCount--) ans.push(0);\nconsole.log(ans.join(' '));"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> ans;\n    int zeroCount = 0;\n    for (int i = 0; i < n; i++) {\n        int value;\n        cin >> value;\n        if (value == 0) zeroCount++;\n        else ans.push_back(value);\n    }\n    while (zeroCount--) ans.push_back(0);\n    for (int i = 0; i < ans.size(); i++) {\n        if (i) cout << ' ';\n        cout << ans[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<Integer> ans = new ArrayList<>();\n        int zeroCount = 0;\n        for (int i = 0; i < n; i++) {\n            int value = sc.nextInt();\n            if (value == 0) zeroCount++;\n            else ans.add(value);\n        }\n        while (zeroCount-- > 0) ans.add(0);\n        for (int i = 0; i < ans.size(); i++) {\n            if (i > 0) System.out.print(\" \");\n            System.out.print(ans.get(i));\n        }\n    }\n}"
            }
        ]
    },
    {
        title: "Middle of Linked List",
        description: "Given a linked list as space separated values, print the middle node value. If there are two middle nodes, print the second one.",
        difficulty: "easy",
        tags: ["LinkedList"],
        visibleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "3",
                explanation: "The middle node is 3."
            },
            {
                input: "6\n1 2 3 4 5 6",
                output: "4",
                explanation: "For even length, print the second middle node."
            }
        ],
        hiddenTestCases: [
            {
                input: "1\n99",
                output: "99"
            },
            {
                input: "4\n7 8 9 10",
                output: "9"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst values = input.slice(1, n + 1);\n\nfunction middleValue(values) {\n    // Write your code here\n}\n\nconsole.log(middleValue(values));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint middleValue(const vector<int>& values) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n);\n    for (int i = 0; i < n; i++) cin >> values[i];\n    cout << middleValue(values);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int middleValue(int[] values) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) values[i] = sc.nextInt();\n        System.out.println(middleValue(values));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst values = input.slice(1, n + 1);\nconsole.log(values[Math.floor(n / 2)]);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n);\n    for (int i = 0; i < n; i++) cin >> values[i];\n    cout << values[n / 2];\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) values[i] = sc.nextInt();\n        System.out.println(values[n / 2]);\n    }\n}"
            }
        ]
    },
    {
        title: "Remove Duplicates from Sorted Linked List",
        description: "Given a sorted linked list represented as space separated values, remove duplicates and print the resulting list.",
        difficulty: "easy",
        tags: ["LinkedList"],
        visibleTestCases: [
            {
                input: "6\n1 1 2 3 3 4",
                output: "1 2 3 4",
                explanation: "Duplicate adjacent values are removed."
            },
            {
                input: "4\n5 5 5 5",
                output: "5",
                explanation: "Only one copy of 5 remains."
            }
        ],
        hiddenTestCases: [
            {
                input: "7\n1 2 2 2 3 4 4",
                output: "1 2 3 4"
            },
            {
                input: "5\n2 3 4 5 6",
                output: "2 3 4 5 6"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst values = input.slice(1, n + 1);\n\nfunction removeDuplicates(values) {\n    // Write your code here\n}\n\nconsole.log(removeDuplicates(values).join(' '));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> removeDuplicates(const vector<int>& values) {\n    // Write your code here\n    return values;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n);\n    for (int i = 0; i < n; i++) cin >> values[i];\n    vector<int> ans = removeDuplicates(values);\n    for (int i = 0; i < ans.size(); i++) {\n        if (i) cout << ' ';\n        cout << ans[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int[] removeDuplicates(int[] values) {\n        // Write your code here\n        return values;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) values[i] = sc.nextInt();\n        int[] ans = removeDuplicates(values);\n        for (int i = 0; i < ans.length; i++) {\n            if (i > 0) System.out.print(\" \");\n            System.out.print(ans[i]);\n        }\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst values = input.slice(1, n + 1);\nconst ans = [];\nfor (const value of values) {\n    if (ans.length === 0 || ans[ans.length - 1] !== value) ans.push(value);\n}\nconsole.log(ans.join(' '));"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> values(n), ans;\n    for (int i = 0; i < n; i++) cin >> values[i];\n    for (int value : values) {\n        if (ans.empty() || ans.back() != value) ans.push_back(value);\n    }\n    for (int i = 0; i < ans.size(); i++) {\n        if (i) cout << ' ';\n        cout << ans[i];\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<Integer> ans = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            int value = sc.nextInt();\n            if (ans.isEmpty() || ans.get(ans.size() - 1) != value) ans.add(value);\n        }\n        for (int i = 0; i < ans.size(); i++) {\n            if (i > 0) System.out.print(\" \");\n            System.out.print(ans.get(i));\n        }\n    }\n}"
            }
        ]
    },
    {
        title: "Count Islands in Grid",
        description: "Given a grid of 0s and 1s, count how many islands are present. Cells are connected horizontally and vertically.",
        difficulty: "medium",
        tags: ["graph"],
        visibleTestCases: [
            {
                input: "3 4\n1 1 0 0\n0 1 0 1\n1 0 0 1",
                output: "3",
                explanation: "There are three separate islands."
            },
            {
                input: "2 2\n0 0\n0 0",
                output: "0",
                explanation: "There is no land in the grid."
            }
        ],
        hiddenTestCases: [
            {
                input: "3 3\n1 0 1\n0 1 0\n1 0 1",
                output: "5"
            },
            {
                input: "2 3\n1 1 1\n1 1 1",
                output: "1"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst rows = input[idx++];\nconst cols = input[idx++];\nconst grid = [];\nfor (let r = 0; r < rows; r++) {\n    grid.push(input.slice(idx, idx + cols));\n    idx += cols;\n}\n\nfunction countIslands(grid) {\n    // Write your code here\n}\n\nconsole.log(countIslands(grid));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint countIslands(vector<vector<int>>& grid) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int rows, cols;\n    cin >> rows >> cols;\n    vector<vector<int>> grid(rows, vector<int>(cols));\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) cin >> grid[r][c];\n    }\n    cout << countIslands(grid);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int countIslands(int[][] grid) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) grid[r][c] = sc.nextInt();\n        }\n        System.out.println(countIslands(grid));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst rows = input[idx++];\nconst cols = input[idx++];\nconst grid = [];\nfor (let r = 0; r < rows; r++) {\n    grid.push(input.slice(idx, idx + cols));\n    idx += cols;\n}\nconst dirs = [[1,0],[-1,0],[0,1],[0,-1]];\nlet count = 0;\nfor (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n        if (grid[r][c] !== 1) continue;\n        count++;\n        const stack = [[r, c]];\n        grid[r][c] = 0;\n        while (stack.length) {\n            const [x, y] = stack.pop();\n            for (const [dx, dy] of dirs) {\n                const nx = x + dx;\n                const ny = y + dy;\n                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === 1) {\n                    grid[nx][ny] = 0;\n                    stack.push([nx, ny]);\n                }\n            }\n        }\n    }\n}\nconsole.log(count);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int rows, cols;\n    cin >> rows >> cols;\n    vector<vector<int>> grid(rows, vector<int>(cols));\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) cin >> grid[r][c];\n    }\n    int count = 0;\n    int dr[4] = {1, -1, 0, 0};\n    int dc[4] = {0, 0, 1, -1};\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            if (grid[r][c] != 1) continue;\n            count++;\n            stack<pair<int, int>> st;\n            st.push({r, c});\n            grid[r][c] = 0;\n            while (!st.empty()) {\n                auto cell = st.top();\n                st.pop();\n                int x = cell.first;\n                int y = cell.second;\n                for (int k = 0; k < 4; k++) {\n                    int nx = x + dr[k];\n                    int ny = y + dc[k];\n                    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] == 1) {\n                        grid[nx][ny] = 0;\n                        st.push({nx, ny});\n                    }\n                }\n            }\n        }\n    }\n    cout << count;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) grid[r][c] = sc.nextInt();\n        }\n        int count = 0;\n        int[] dr = {1, -1, 0, 0};\n        int[] dc = {0, 0, 1, -1};\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] != 1) continue;\n                count++;\n                Deque<int[]> stack = new ArrayDeque<>();\n                stack.push(new int[]{r, c});\n                grid[r][c] = 0;\n                while (!stack.isEmpty()) {\n                    int[] cell = stack.pop();\n                    for (int k = 0; k < 4; k++) {\n                        int nr = cell[0] + dr[k];\n                        int nc = cell[1] + dc[k];\n                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {\n                            grid[nr][nc] = 0;\n                            stack.push(new int[]{nr, nc});\n                        }\n                    }\n                }\n            }\n        }\n        System.out.println(count);\n    }\n}"
            }
        ]
    },
    {
        title: "Shortest Path in Unweighted Graph",
        description: "Given an undirected unweighted graph, print the shortest distance from source to destination. If no path exists, print -1.",
        difficulty: "medium",
        tags: ["graph"],
        visibleTestCases: [
            {
                input: "5 5\n1 2\n2 3\n3 4\n4 5\n1 5\n1 4",
                output: "2",
                explanation: "The shortest path from 1 to 4 is 1 -> 5 -> 4."
            },
            {
                input: "4 2\n1 2\n3 4\n1 4",
                output: "-1",
                explanation: "Nodes 1 and 4 are disconnected."
            }
        ],
        hiddenTestCases: [
            {
                input: "6 6\n1 2\n2 3\n3 6\n1 4\n4 5\n5 6\n1 6",
                output: "3"
            },
            {
                input: "3 2\n1 2\n2 3\n2 2",
                output: "0"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst m = input[idx++];\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push([input[idx++], input[idx++]]);\nconst src = input[idx++];\nconst dest = input[idx++];\n\nfunction shortestPath(n, edges, src, dest) {\n    // Write your code here\n}\n\nconsole.log(shortestPath(n, edges, src, dest));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint shortestPath(int n, const vector<pair<int, int>>& edges, int src, int dest) {\n    // Write your code here\n    return -1;\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<pair<int, int>> edges;\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        edges.push_back({u, v});\n    }\n    int src, dest;\n    cin >> src >> dest;\n    cout << shortestPath(n, edges, src, dest);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int shortestPath(int n, int[][] edges, int src, int dest) {\n        // Write your code here\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n        }\n        int src = sc.nextInt();\n        int dest = sc.nextInt();\n        System.out.println(shortestPath(n, edges, src, dest));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst m = input[idx++];\nconst graph = Array.from({ length: n + 1 }, () => []);\nfor (let i = 0; i < m; i++) {\n    const u = input[idx++];\n    const v = input[idx++];\n    graph[u].push(v);\n    graph[v].push(u);\n}\nconst src = input[idx++];\nconst dest = input[idx++];\nconst dist = new Array(n + 1).fill(-1);\nconst queue = [src];\ndist[src] = 0;\nfor (let head = 0; head < queue.length; head++) {\n    const node = queue[head];\n    for (const next of graph[node]) {\n        if (dist[next] === -1) {\n            dist[next] = dist[node] + 1;\n            queue.push(next);\n        }\n    }\n}\nconsole.log(dist[dest]);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> graph(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    int src, dest;\n    cin >> src >> dest;\n    vector<int> dist(n + 1, -1);\n    queue<int> q;\n    q.push(src);\n    dist[src] = 0;\n    while (!q.empty()) {\n        int node = q.front();\n        q.pop();\n        for (int next : graph[node]) {\n            if (dist[next] == -1) {\n                dist[next] = dist[node] + 1;\n                q.push(next);\n            }\n        }\n    }\n    cout << dist[dest];\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        List<Integer>[] graph = new ArrayList[n + 1];\n        for (int i = 0; i <= n; i++) graph[i] = new ArrayList<>();\n        for (int i = 0; i < m; i++) {\n            int u = sc.nextInt();\n            int v = sc.nextInt();\n            graph[u].add(v);\n            graph[v].add(u);\n        }\n        int src = sc.nextInt();\n        int dest = sc.nextInt();\n        int[] dist = new int[n + 1];\n        Arrays.fill(dist, -1);\n        Queue<Integer> queue = new ArrayDeque<>();\n        queue.offer(src);\n        dist[src] = 0;\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            for (int next : graph[node]) {\n                if (dist[next] == -1) {\n                    dist[next] = dist[node] + 1;\n                    queue.offer(next);\n                }\n            }\n        }\n        System.out.println(dist[dest]);\n    }\n}"
            }
        ]
    },
    {
        title: "House Robber",
        description: "Given money in each house arranged in a line, print the maximum amount you can rob without robbing two adjacent houses.",
        difficulty: "medium",
        tags: ["DP"],
        visibleTestCases: [
            {
                input: "4\n1 2 3 1",
                output: "4",
                explanation: "Rob houses with values 1 and 3."
            },
            {
                input: "5\n2 7 9 3 1",
                output: "12",
                explanation: "Rob houses with values 2, 9, and 1."
            }
        ],
        hiddenTestCases: [
            {
                input: "3\n2 1 1",
                output: "3"
            },
            {
                input: "1\n10",
                output: "10"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst nums = input.slice(1, n + 1);\n\nfunction rob(nums) {\n    // Write your code here\n}\n\nconsole.log(rob(nums));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint rob(const vector<int>& nums) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << rob(nums);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int rob(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(rob(nums));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst nums = input.slice(1, n + 1);\nlet prev2 = 0;\nlet prev1 = 0;\nfor (const value of nums) {\n    const current = Math.max(prev1, prev2 + value);\n    prev2 = prev1;\n    prev1 = current;\n}\nconsole.log(prev1);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int prev2 = 0, prev1 = 0;\n    for (int value : nums) {\n        int current = max(prev1, prev2 + value);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    cout << prev1;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int prev2 = 0, prev1 = 0;\n        for (int i = 0; i < n; i++) {\n            int value = sc.nextInt();\n            int current = Math.max(prev1, prev2 + value);\n            prev2 = prev1;\n            prev1 = current;\n        }\n        System.out.println(prev1);\n    }\n}"
            }
        ]
    },
    {
        title: "Minimum Cost Climbing Stairs",
        description: "You are given the cost of each stair. You can start from stair 0 or 1 and climb one or two stairs. Print the minimum cost to reach the top.",
        difficulty: "medium",
        tags: ["DP"],
        visibleTestCases: [
            {
                input: "3\n10 15 20",
                output: "15",
                explanation: "Start at stair 1 and pay 15."
            },
            {
                input: "10\n1 100 1 1 1 100 1 1 100 1",
                output: "6",
                explanation: "Take the cheaper path by skipping expensive stairs."
            }
        ],
        hiddenTestCases: [
            {
                input: "2\n5 6",
                output: "5"
            },
            {
                input: "4\n1 2 3 4",
                output: "4"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst cost = input.slice(1, n + 1);\n\nfunction minCost(cost) {\n    // Write your code here\n}\n\nconsole.log(minCost(cost));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint minCost(const vector<int>& cost) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> cost(n);\n    for (int i = 0; i < n; i++) cin >> cost[i];\n    cout << minCost(cost);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int minCost(int[] cost) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] cost = new int[n];\n        for (int i = 0; i < n; i++) cost[i] = sc.nextInt();\n        System.out.println(minCost(cost));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst cost = input.slice(1, n + 1);\nlet prev2 = 0;\nlet prev1 = 0;\nfor (let i = 2; i <= n; i++) {\n    const current = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);\n    prev2 = prev1;\n    prev1 = current;\n}\nconsole.log(prev1);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> cost(n);\n    for (int i = 0; i < n; i++) cin >> cost[i];\n    int prev2 = 0, prev1 = 0;\n    for (int i = 2; i <= n; i++) {\n        int current = min(prev1 + cost[i - 1], prev2 + cost[i - 2]);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    cout << prev1;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] cost = new int[n];\n        for (int i = 0; i < n; i++) cost[i] = sc.nextInt();\n        int prev2 = 0, prev1 = 0;\n        for (int i = 2; i <= n; i++) {\n            int current = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);\n            prev2 = prev1;\n            prev1 = current;\n        }\n        System.out.println(prev1);\n    }\n}"
            }
        ]
    },
    {
        title: "Coin Change Minimum Coins",
        description: "Given coin denominations and a target amount, print the minimum number of coins needed to make the amount. If it is not possible, print -1.",
        difficulty: "hard",
        tags: ["DP"],
        visibleTestCases: [
            {
                input: "3 11\n1 2 5",
                output: "3",
                explanation: "11 can be formed using 5 + 5 + 1."
            },
            {
                input: "1 3\n2",
                output: "-1",
                explanation: "Amount 3 cannot be formed using only coin 2."
            }
        ],
        hiddenTestCases: [
            {
                input: "4 6\n1 3 4 5",
                output: "2"
            },
            {
                input: "2 0\n2 5",
                output: "0"
            }
        ],
        startCode: [
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst amount = input[1];\nconst coins = input.slice(2, 2 + n);\n\nfunction minCoins(coins, amount) {\n    // Write your code here\n}\n\nconsole.log(minCoins(coins, amount));"
            },
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint minCoins(const vector<int>& coins, int amount) {\n    // Write your code here\n    return -1;\n}\n\nint main() {\n    int n, amount;\n    cin >> n >> amount;\n    vector<int> coins(n);\n    for (int i = 0; i < n; i++) cin >> coins[i];\n    cout << minCoins(coins, amount);\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Main {\n    static int minCoins(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int amount = sc.nextInt();\n        int[] coins = new int[n];\n        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n        System.out.println(minCoins(coins, amount));\n    }\n}"
            }
        ],
        referenceSolution: [
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst amount = input[1];\nconst coins = input.slice(2, 2 + n);\nconst dp = new Array(amount + 1).fill(Infinity);\ndp[0] = 0;\nfor (const coin of coins) {\n    for (let value = coin; value <= amount; value++) {\n        dp[value] = Math.min(dp[value], dp[value - coin] + 1);\n    }\n}\nconsole.log(dp[amount] === Infinity ? -1 : dp[amount]);"
            },
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, amount;\n    cin >> n >> amount;\n    vector<int> coins(n);\n    for (int i = 0; i < n; i++) cin >> coins[i];\n    const int INF = 1000000000;\n    vector<int> dp(amount + 1, INF);\n    dp[0] = 0;\n    for (int coin : coins) {\n        for (int value = coin; value <= amount; value++) {\n            dp[value] = min(dp[value], dp[value - coin] + 1);\n        }\n    }\n    cout << (dp[amount] == INF ? -1 : dp[amount]);\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int amount = sc.nextInt();\n        int[] coins = new int[n];\n        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n        int inf = 1_000_000_000;\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, inf);\n        dp[0] = 0;\n        for (int coin : coins) {\n            for (int value = coin; value <= amount; value++) {\n                dp[value] = Math.min(dp[value], dp[value - coin] + 1);\n            }\n        }\n        System.out.println(dp[amount] == inf ? -1 : dp[amount]);\n    }\n}"
            }
        ]
    }
];

async function connectDb() {
    if (!process.env.DB_CONNECT_STRING) {
        throw new Error("DB_CONNECT_STRING is missing in .env");
    }

    await mongoose.connect(process.env.DB_CONNECT_STRING);
}

async function getProblemCreator() {
    const preferredEmail = process.argv[2]?.trim().toLowerCase();

    if (preferredEmail) {
        const byEmail = await User.findOne({ emailID: preferredEmail });
        if (!byEmail) {
            throw new Error(`No user found with email ${preferredEmail}`);
        }
        return byEmail;
    }

    const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
    if (admin) {
        return admin;
    }

    const anyUser = await User.findOne({}).sort({ createdAt: 1 });
    if (anyUser) {
        return anyUser;
    }

    throw new Error("No users found. Create at least one user/admin first.");
}

async function seedProblems() {
    await connectDb();

    const creator = await getProblemCreator();
    const titles = problems.map((problem) => problem.title);
    const existingProblems = await Problem.find({ title: { $in: titles } }).select("title");
    const existingTitles = new Set(existingProblems.map((problem) => problem.title));

    const docsToInsert = problems
        .filter((problem) => !existingTitles.has(problem.title))
        .map((problem) => ({
            ...problem,
            problemCreator: creator._id
        }));

    if (docsToInsert.length === 0) {
        console.log("No new problems inserted. All sample titles already exist.");
        console.log(`Problem creator used: ${creator.emailID}`);
        return;
    }

    const inserted = await Problem.insertMany(docsToInsert, { ordered: false });
    console.log(`Inserted ${inserted.length} problems.`);
    console.log(`Problem creator used: ${creator.emailID}`);
    console.log("Inserted titles:");
    for (const problem of inserted) {
        console.log(`- ${problem.title}`);
    }
}

seedProblems()
    .catch((error) => {
        console.error("Failed to seed problems:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });

-- Insert Sample Data for AI Learning Assistant
-- Run this in your Supabase SQL Editor after running the main database_blueprint.sql

-- First, let's create a test user profile (you'll need to replace the UUID with an actual user ID from auth.users)
-- You can get your user ID from the Supabase Auth dashboard or by running: SELECT id FROM auth.users LIMIT 1;

-- Insert sample courses
INSERT INTO courses (id, title, description, short_description, duration, difficulty_level, estimated_hours, tags, is_published, created_by) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'React Hooks Fundamentals',
  'Learn about React Hooks and how to use them effectively in your applications. This comprehensive course covers useState, useEffect, custom hooks, and advanced patterns.',
  'Master React Hooks from basics to advanced patterns',
  '4 weeks',
  'Intermediate',
  12,
  ARRAY['react', 'javascript', 'frontend', 'hooks'],
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'JavaScript Fundamentals',
  'Master the fundamentals of JavaScript programming including ES6+ features, async programming, and modern development practices.',
  'Complete JavaScript course for beginners to intermediate',
  '6 weeks',
  'Beginner',
  18,
  ARRAY['javascript', 'programming', 'fundamentals', 'es6'],
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Advanced Data Structures',
  'Deep dive into advanced data structures and algorithms including trees, graphs, dynamic programming, and complexity analysis.',
  'Advanced algorithms and data structures',
  '8 weeks',
  'Advanced',
  24,
  ARRAY['algorithms', 'data-structures', 'programming', 'computer-science'],
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'TypeScript for React Developers',
  'Learn TypeScript fundamentals and how to use it effectively with React for building type-safe applications.',
  'TypeScript with React development',
  '3 weeks',
  'Intermediate',
  9,
  ARRAY['typescript', 'react', 'frontend', 'types'],
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- Insert sample lessons for React Hooks course
INSERT INTO lessons (id, course_id, title, content, explanation, code_example, key_points, duration, difficulty, order_index, is_published) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'Introduction to React Hooks',
  'React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.',
  'React Hooks allow you to use state and other React features in functional components. The useState hook manages component state, while useEffect handles side effects like API calls or DOM updates. Hooks can only be called at the top level of React functions, not inside loops, conditions, or nested functions.',
  'import React, { useState, useEffect } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}',
  ARRAY[
    'Hooks can only be called at the top level of React functions',
    'useState returns a state value and a setter function',
    'useEffect runs after every render by default',
    'Custom hooks allow you to extract component logic into reusable functions'
  ],
  '45 min',
  'Intermediate',
  1,
  true
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'useState Hook Deep Dive',
  'The useState hook is the most fundamental hook in React. It allows functional components to have state variables.',
  'useState is a React Hook that lets you add a state variable to your component. It returns an array with exactly two values: the current state and a function that lets you update it. You can call this function from an event handler or somewhere else to update the state.',
  'import React, { useState } from ''react'';

function Form() {
  const [name, setName] = useState('''');
  const [email, setEmail] = useState('''');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}',
  ARRAY[
    'useState returns an array with current state and setter function',
    'State updates are asynchronous',
    'You can pass a function to setState for updates based on previous state',
    'State updates trigger re-renders'
  ],
  '50 min',
  'Intermediate',
  2,
  true
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  'useEffect Hook Patterns',
  'The useEffect hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.',
  'useEffect is a React Hook that lets you synchronize a component with an external system. It accepts two arguments: a setup function and an optional dependency array. The setup function runs after every render, and the cleanup function (if returned) runs before the next effect or when the component unmounts.',
  'import React, { useState, useEffect } from ''react'';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(''Error fetching user:'', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]); // Only run when userId changes
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}',
  ARRAY[
    'useEffect runs after every render by default',
    'Dependency array controls when the effect runs',
    'Empty dependency array means effect runs only once',
    'Cleanup functions prevent memory leaks'
  ],
  '55 min',
  'Intermediate',
  3,
  true
);

-- Insert sample lessons for JavaScript course
INSERT INTO lessons (id, course_id, title, content, explanation, code_example, key_points, duration, difficulty, order_index, is_published) VALUES
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  'Variables and Data Types',
  'Learn about JavaScript variables, data types, and how to work with them effectively.',
  'JavaScript is a dynamically typed language, which means you don''t need to specify the data type when declaring a variable. The data type is determined automatically based on the value assigned to the variable.',
  '// Variable declarations
let name = "John";
const age = 25;
var city = "New York";

// Data types
let stringVar = "Hello World";
let numberVar = 42;
let booleanVar = true;
let arrayVar = [1, 2, 3];
let objectVar = { name: "John", age: 25 };
let nullVar = null;
let undefinedVar = undefined;

console.log(typeof stringVar); // "string"
console.log(typeof numberVar); // "number"
console.log(typeof booleanVar); // "boolean"',
  ARRAY[
    'Use let and const instead of var',
    'const variables cannot be reassigned',
    'JavaScript has 7 primitive data types',
    'typeof operator helps identify data types'
  ],
  '30 min',
  'Beginner',
  1,
  true
),
(
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440002',
  'Functions and Scope',
  'Understanding JavaScript functions, different ways to declare them, and how scope works.',
  'Functions are reusable blocks of code that perform a specific task. In JavaScript, functions are first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions.',
  '// Function declarations
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expressions
const greetArrow = (name) => {
  return `Hello, ${name}!`;
};

// Arrow functions (shorthand)
const greetShort = name => `Hello, ${name}!`;

// Scope example
function outerFunction() {
  const outerVar = "I''m outside";
  
  function innerFunction() {
    const innerVar = "I''m inside";
    console.log(outerVar); // Can access outer scope
    console.log(innerVar); // Can access inner scope
  }
  
  innerFunction();
  // console.log(innerVar); // Error: innerVar is not defined
}',
  ARRAY[
    'Functions can be declared in multiple ways',
    'Arrow functions have lexical this binding',
    'Inner functions can access outer scope',
    'Variables are function-scoped or block-scoped'
  ],
  '40 min',
  'Beginner',
  2,
  true
);

-- Insert sample assessments
INSERT INTO assessments (id, title, description, difficulty, time_limit, instructions, starter_code, test_cases, expected_output, course_id, is_published, created_by) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  'React Component Challenge',
  'Create a reusable React component with search functionality',
  'Intermediate',
  30,
  'Build a searchable list component using React hooks. The component should filter items based on user input and display results in real-time. The component should be reusable and accept props for the list of items.',
  'import React, { useState } from ''react'';

function SearchableList({ items, placeholder = "Search..." }) {
  // Your code here
  return (
    <div>
      {/* Search input */}
      {/* Filtered list */}
    </div>
  );
}

export default SearchableList;',
  '[
    {
      "input": { "items": ["apple", "banana", "cherry"], "placeholder": "Search fruits..." },
      "expected": "Component renders with search input and list of items"
    },
    {
      "input": { "items": ["react", "vue", "angular"], "placeholder": "Search frameworks..." },
      "expected": "Component filters items based on search input"
    }
  ]',
  'A functional searchable list component that filters items in real-time',
  '550e8400-e29b-41d4-a716-446655440001',
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  'JavaScript Fundamentals Quiz',
  'Test your knowledge of JavaScript basics and ES6 features',
  'Beginner',
  20,
  'Complete the following JavaScript functions. Each function should work correctly with the provided test cases.',
  '// 1. Create a function that returns the sum of two numbers
function add(a, b) {
  // Your code here
}

// 2. Create a function that returns the largest number in an array
function findLargest(numbers) {
  // Your code here
}

// 3. Create a function that checks if a string is a palindrome
function isPalindrome(str) {
  // Your code here
}',
  '[
    {
      "input": { "a": 5, "b": 3 },
      "expected": 8,
      "function": "add"
    },
    {
      "input": { "numbers": [1, 5, 3, 9, 2] },
      "expected": 9,
      "function": "findLargest"
    },
    {
      "input": { "str": "racecar" },
      "expected": true,
      "function": "isPalindrome"
    }
  ]',
  'All functions should return correct results for the test cases',
  '550e8400-e29b-41d4-a716-446655440002',
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  '770e8400-e29b-41d4-a716-446655440003',
  'Data Structures Implementation',
  'Implement common data structures like linked lists and trees',
  'Advanced',
  45,
  'Implement a binary search tree with insert, search, and delete operations. The tree should maintain the binary search property.',
  'class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    // Your code here
  }
  
  search(value) {
    // Your code here
  }
  
  delete(value) {
    // Your code here
  }
}',
  '[
    {
      "input": { "operation": "insert", "value": 5 },
      "expected": "Value 5 inserted successfully"
    },
    {
      "input": { "operation": "search", "value": 5 },
      "expected": true
    },
    {
      "input": { "operation": "delete", "value": 5 },
      "expected": "Value 5 deleted successfully"
    }
  ]',
  'A fully functional binary search tree implementation',
  '550e8400-e29b-41d4-a716-446655440003',
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- Insert course enrollments for the test user
INSERT INTO course_enrollments (id, user_id, course_id, enrollment_date, progress_percentage, status, last_accessed) VALUES
(
  '880e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440001',
  NOW() - INTERVAL '7 days',
  60,
  'active',
  NOW() - INTERVAL '1 day'
),
(
  '880e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440002',
  NOW() - INTERVAL '14 days',
  100,
  'completed',
  NOW() - INTERVAL '2 days'
),
(
  '880e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440003',
  NOW() - INTERVAL '3 days',
  25,
  'active',
  NOW() - INTERVAL '1 hour'
);

-- Insert user progress for lessons
INSERT INTO user_progress (id, user_id, lesson_id, course_id, completed, time_spent, last_position, completed_at) VALUES
(
  '990e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  true,
  2700, -- 45 minutes in seconds
  100,
  NOW() - INTERVAL '5 days'
),
(
  '990e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  true,
  3000, -- 50 minutes in seconds
  100,
  NOW() - INTERVAL '3 days'
),
(
  '990e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  false,
  1200, -- 20 minutes in seconds
  40,
  NULL
),
(
  '990e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM auth.users LIMIT 1),
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  true,
  1800, -- 30 minutes in seconds
  100,
  NOW() - INTERVAL '10 days'
),
(
  '990e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM auth.users LIMIT 1),
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440002',
  true,
  2400, -- 40 minutes in seconds
  100,
  NOW() - INTERVAL '8 days'
);

-- Insert assessment attempts
INSERT INTO assessment_attempts (id, user_id, assessment_id, status, score, submitted_code, time_spent, started_at, completed_at) VALUES
(
  'aa0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '770e8400-e29b-41d4-a716-446655440001',
  'completed',
  85,
  'import React, { useState } from ''react'';

function SearchableList({ items, placeholder = "Search..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;',
  1800, -- 30 minutes
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'aa0e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '770e8400-e29b-41d4-a716-446655440002',
  'completed',
  92,
  'function add(a, b) {
  return a + b;
}

function findLargest(numbers) {
  return Math.max(...numbers);
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}',
  1200, -- 20 minutes
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week'
),
(
  'aa0e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  '770e8400-e29b-41d4-a716-446655440003',
  'in-progress',
  NULL,
  'class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    // Working on this...
  }
  
  search(value) {
    // Working on this...
  }
  
  delete(value) {
    // Working on this...
  }
}',
  900, -- 15 minutes
  NOW() - INTERVAL '1 hour',
  NULL
);

-- Insert learning analytics
INSERT INTO learning_analytics (id, user_id, course_id, session_duration, lessons_completed, assessments_completed, total_score, session_date) VALUES
(
  'bb0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440001',
  3600, -- 1 hour
  2,
  0,
  0,
  CURRENT_DATE - INTERVAL '1 day'
),
(
  'bb0e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440002',
  5400, -- 1.5 hours
  2,
  1,
  92,
  CURRENT_DATE - INTERVAL '2 days'
),
(
  'bb0e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440003',
  1800, -- 30 minutes
  0,
  0,
  0,
  CURRENT_DATE
);

-- Insert achievements
INSERT INTO achievements (id, user_id, title, description, type, icon_url, points, earned_at, metadata) VALUES
(
  'cc0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  'First Steps',
  'Completed your first lesson',
  'milestone',
  'https://example.com/icons/first-steps.png',
  10,
  NOW() - INTERVAL '10 days',
  '{"lesson_id": "660e8400-e29b-41d4-a716-446655440004"}'
),
(
  'cc0e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  'Course Master',
  'Completed your first course',
  'course_completion',
  'https://example.com/icons/course-master.png',
  50,
  NOW() - INTERVAL '8 days',
  '{"course_id": "550e8400-e29b-41d4-a716-446655440002"}'
),
(
  'cc0e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  'Assessment Ace',
  'Scored 90% or higher on an assessment',
  'assessment_score',
  'https://example.com/icons/assessment-ace.png',
  25,
  NOW() - INTERVAL '1 week',
  '{"assessment_id": "770e8400-e29b-41d4-a716-446655440002", "score": 92}'
);

-- Insert user streak
INSERT INTO user_streaks (id, user_id, current_streak, longest_streak, last_activity_date, streak_type) VALUES
(
  'dd0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  5,
  12,
  CURRENT_DATE,
  'daily'
);

-- Insert some chat history
INSERT INTO chat_history (id, user_id, course_id, lesson_id, context, question, answer, message_type, created_at) VALUES
(
  'ee0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'lesson_chat',
  'What is the difference between useState and useEffect?',
  'useState is used for managing component state, while useEffect is used for handling side effects. useState returns a state value and a setter function, while useEffect runs after every render and can perform operations like API calls, subscriptions, or DOM updates.',
  'explanation',
  NOW() - INTERVAL '2 days'
),
(
  'ee0e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440002',
  'lesson_chat',
  'Can you show me an example of controlled components?',
  'Sure! Here''s an example of a controlled component using useState:

```jsx
function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

In this example, the input value is controlled by React state, making it a controlled component.',
  'code',
  NOW() - INTERVAL '1 day'
);

-- Insert notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url, created_at) VALUES
(
  'ff0e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  'New Assessment Available',
  'A new React Component Challenge assessment is now available for you to take.',
  'assessment_available',
  false,
  '/assessment/770e8400-e29b-41d4-a716-446655440001',
  NOW() - INTERVAL '1 day'
),
(
  'ff0e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  'Course Completed!',
  'Congratulations! You have completed the JavaScript Fundamentals course.',
  'course_update',
  true,
  '/courses',
  NOW() - INTERVAL '8 days'
);

-- Verify the data was inserted
SELECT 'Courses' as table_name, COUNT(*) as count FROM courses
UNION ALL
SELECT 'Lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'Assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'Course Enrollments', COUNT(*) FROM course_enrollments
UNION ALL
SELECT 'User Progress', COUNT(*) FROM user_progress
UNION ALL
SELECT 'Assessment Attempts', COUNT(*) FROM assessment_attempts
UNION ALL
SELECT 'Learning Analytics', COUNT(*) FROM learning_analytics
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'User Streaks', COUNT(*) FROM user_streaks
UNION ALL
SELECT 'Chat History', COUNT(*) FROM chat_history
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

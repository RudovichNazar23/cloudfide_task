# Architectural Decisions – MainPage Component

## 1. Component Responsibility

The `MainPage` component acts as the **entry point of the application**, responsible for:

* Accepting user input (JSON file upload)
* Validating and parsing data
* Persisting data locally
* Controlling navigation flow to the tree view

## 2. State Management Strategy

The component uses **local React state (`useState`)** for:

* `errorMessage` → transient UI feedback
* `data` → presence of persisted tree data

### Decision rationale:

* Local state is sufficient because the data is only needed within this component
* Avoids unnecessary complexity (e.g. global state like Redux or Context)

## 3. Persistence Layer (localStorage)

The application uses:

```ts
localStorage
```

to store the uploaded JSON (`treeData`).

### Why this approach:

* Enables **data persistence across page reloads**
* Allows navigation without passing large objects through props or routing
* Simple and sufficient for a client-side tool

## 4. File Handling Architecture

File input is handled using:

```ts
<input type="file" />
FileReader API
```

### Flow:

1. User selects a file
2. File type is validated (`application/json`)
3. File is read asynchronously via `FileReader`
4. JSON is parsed and stored

### Design decisions:

* Use **browser-native FileReader** instead of external libraries
* Perform **early validation** (file type + JSON parsing)
* Keep parsing logic inside the event handler for simplicity

## 5. Error Handling Strategy

Errors are handled via a **single string state (`errorMessage`)**:

* Invalid file type
* Invalid JSON structure
* Missing file on submission

### Why:

* Centralized error messaging simplifies UI logic
* Immediate feedback improves UX

## 6. Navigation Strategy

Routing is handled using:

```ts
useNavigate()
```

### Behavior:

* Navigation to `/tree` occurs only if:

  * valid JSON exists in `localStorage`
  * no validation errors are present

### Design reasoning:

* Prevents navigation to invalid application states
* Ensures `/tree` always has data to render

## 7. Conditional Rendering

The navbar is conditionally rendered:

```ts
data && (...)
```

### Purpose:

* Show navigation only when data exists
* Avoids broken navigation paths

## 8. Separation of UI Concerns

The component delegates UI elements to:

* `FormHeader`
* `FormButton`

### Benefits:

* Improves readability
* Encourages reusability
* Keeps business logic separate from presentation

## 9. Data Flow Design

```
File Input → FileReader → JSON.parse → localStorage → navigation → /tree
```

### Key idea:

* `localStorage` acts as a **shared data bridge** between pages

## 10. Reset Mechanism

```ts
localStorage.clear();
window.location.reload();
```

#  Architectural Decisions – FormButton Component

## 1. Component Responsibility

The `FormButton` component is a **reusable UI abstraction** for rendering styled buttons.

Its responsibilities are intentionally minimal:

* Render a button with configurable text and style
* Handle click events passed from parent components
* Maintain consistent layout and styling

## 2. Reusability and Abstraction

```ts
interface FormButtonProps {
  buttonText: string;
  textPlace: "start" | "end";
  buttonColor: "success" | "danger";
  onClickEvent: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Design decision:

* Encapsulate button behavior and styling into a reusable component

### Benefits:

* Avoids duplication across the app
* Ensures consistent UI
* Simplifies parent components

## 3. Strong Typing with TypeScript

### Props typing enforces:

* `buttonText` → required label
* `textPlace` → constrained alignment options
* `buttonColor` → limited styling variants
* `onClickEvent` → strictly typed event handler

### Benefit:

* Prevents invalid usage
* Improves developer experience
* Enables autocomplete and static checks


## 4. Styling Strategy (Bootstrap Integration)

```ts
className={`col-12 btn btn-${buttonColor}`}
```

### Decision:

* Use **Bootstrap utility classes**

### Dynamic styling:

* `btn-${buttonColor}` → determines button appearance
* `text-${textPlace}` → controls alignment

### Benefit:

* Fast UI development
* Consistent styling across components

## 5. Layout Responsibility

```tsx
<div className={`col-3 text-${textPlace}`}>
```

### Decision:

* Component controls its own layout (grid + alignment)

### Benefit:

* Reduces layout responsibility in parent components
  
## 6. Event Handling Delegation

```tsx
onClick={onClickEvent}
```

### Design:

* Event logic is **fully delegated to parent**

### Principle:

* **Inversion of control**

### Benefit:

* Component remains stateless
* Highly reusable in different contexts

## 7. Button Behavior

```tsx
type="submit"
```

### Decision:

* Button acts as a form submit trigger

## 8. Stateless Design

The component does not use:

* `useState`
* `useEffect`

### Implication:

* Pure function of props → UI

### Benefit:

* Predictable behavior
* Easy to test
* No side effects

---

## 9. Separation of Concerns

| Responsibility | Location         |
| -------------- | ---------------- |
| Styling        | FormButton       |
| Layout         | FormButton       |
| Behavior       | Parent component |

### Benefit:

* Clear boundaries
* Easier maintenance


# Architectural Decisions – FormHeader Component

## 1. Component Responsibility

The `FormHeader` component is a **pure presentational component** responsible for:

* Displaying a static header (`JSON Parser`)
* Providing a consistent visual entry point for the form section

It has **no logic, state, or side effects**, making it the simplest type of component in the architecture.


## 2. Stateless Design

```ts
export default function FormHeader(): JSX.Element
```

### Decision:

* Implement as a **stateless functional component**

### Benefits:

* Predictable behavior
* No re-renders caused by internal state
* Easy to test and reuse

## 3. Single Responsibility Principle

The component does exactly one thing:

> Render a header

### Why:

* Keeps components small and focused
* Improves readability and maintainability
* Encourages composition over complexity

## 4. Styling Strategy

```ts
className={"col-12 text-center"}
```

### Decision:

* Use **Bootstrap utility classes**

### Purpose:

* `col-12` → full-width layout
* `text-center` → center alignment

### Benefit:

* Consistent styling with rest of the app
* Minimal custom CSS required

## 5. Data Flow

```id="flow6"
Parent → renders FormHeader → static UI output
```

### Characteristics:

* No props
* No state
* No events

#  Architectural Decisions – FileTree Component

## 1. Component Responsibility

The `FileTree` component serves as the **core visualization layer** of the application. Its responsibilities include:

* Loading and managing tree data
* Rendering the hierarchical file structure
* Integrating search functionality
* Displaying search results

It acts as a **container component**, orchestrating child components:

* `TreeNode` → recursive tree rendering
* `SearchForm` → search input and logic trigger

## 2. State Management Strategy

The component uses **local React state (`useState`)** for:

* `data` → the full file tree structure
* `searchResults` → list of matched nodes (as paths/strings)

### Design reasoning:

* State is scoped to this view → no need for global state
* Keeps logic simple and localized
* Enables independent updates (tree vs search results)

## 3. Data Source (localStorage)

Data is initialized from:

```ts id="l3n2vk"
localStorage.getItem("treeData")
```
Search results are also persisted:

```ts id="n6j1xa"
localStorage.getItem("searchResults")
```
### Why:

* Allows **state persistence across page reloads**
* Keeps `FileTree` decoupled from `MainPage`
* Avoids prop drilling between routes

## 4. Side Effects Handling

```ts id="2s7mqp"
useEffect(() => { ... }, []);
```

### Purpose:

* Load persisted data once on mount

### Architectural choice:

* Treat `localStorage` as an **external data source**
* Use `useEffect` to separate side effects from rendering

## 5. Conditional Rendering Strategy

```tsx id="9kz2ra"
if (!data) return <p>No data</p>;
```

### Reasoning:

* Prevents rendering tree without valid data
* Acts as a simple **guard clause**
* Improves robustness

## 6. Recursive Tree Rendering

```tsx id="w4p1qs"
<TreeNode node={data} path="" />
```

### Design decision:

* Delegate tree rendering to a **recursive component (`TreeNode`)**

### Benefits:

* Handles arbitrarily deep structures
* Keeps `FileTree` clean and focused
* Promotes reusability and separation of concerns

## 7. Search Architecture

Search logic is delegated to:

```tsx id="c8m5yt"
<SearchForm loadedData={data} setSearchResults={setSearchResults} />
```

### Key design choices:

* **Lift state up** → `FileTree` owns `searchResults`
* `SearchForm` acts as a **controlled input + trigger**
* Results are passed back via `setSearchResults`

### Why:

* Keeps search logic decoupled from rendering
* Enables reuse of search functionality
* Maintains unidirectional data flow

## 8. Search Results Representation

```ts id="7nq4zx"
Array<string>
```

### Meaning:

* Each string represents a **path or identifier** of a node


## 9. Layout Strategy

The component uses a **grid-based layout (Bootstrap classes)**:

```ts id="g5x2pl"
row / col-6 / col-4
```

### Structure:

* Left → Tree view
* Right → Search results
* Top → Search form

### Reasoning:

* Clear visual separation of concerns
* Scalable for additional panels (e.g. details view)

## 10. Rendering Search Results

```tsx
searchResults.map((item: string) => <li key={item}>{item}</li>)
```

### Design:

* Simple list rendering
* Uses `item` as key (assuming uniqueness)

## 11. Separation of Concerns

| Responsibility  | Component  |
| --------------- | ---------- |
| Data loading    | FileTree   |
| Tree rendering  | TreeNode   |
| Search input    | SearchForm |
| Results display | FileTree   |

### Benefit:

* Improves maintainability
* Enables independent testing
* Reduces complexity per component

## 12. Error Handling

Minimal error handling:

* Missing data → fallback UI (`No data`)

#  Architectural Decisions – TreeNode Component

## 1. Component Responsibility

The `TreeNode` component is responsible for **rendering a single node** in the file tree and, if applicable, its children.

It serves as a **recursive building block** of the entire tree structure:

* Displays file or folder
* Handles expand/collapse for folders
* Generates navigation links for node details

This follows a **compositional architecture**, where complex UI (tree) is built from repeated simple units.

## 2. Recursive Rendering Strategy

The most important architectural decision is the use of **recursion**:

```tsx
<TreeNode node={child} path={currentPath} />
```

### Why recursion:

* The tree structure is **arbitrarily deep**
* Recursion naturally maps to hierarchical data
* Avoids complex iterative logic

### Benefit:

* Scales automatically with nesting depth
* Keeps implementation clean and intuitive

## 3. State Management (Local UI State)

```ts
const [expanded, setExpanded] = useState(false);
```

### Purpose:

* Controls whether a folder’s children are visible

### Design reasoning:

* State is **local to each node instance**
* Avoids global state complexity
* Each node manages its own UI independently

## 4. Path Construction Strategy

```ts
const currentPath = path ? `${path}/${node.name}` : node.name;
```

### Purpose:

* Builds a **unique hierarchical path** for each node

### Why:

* Enables:

  * routing (`/tree/...`)
  * identification of nodes
  * navigation consistency

### Design choice:

* Path is passed down recursively rather than recomputed globally

## 5. Conditional Rendering (File vs Folder)

```ts
if (node.type === "file") { ... }
```

### Decision:

* Use **type-based branching** to render different UI

### Behavior:

* Files:

  * clickable link
  * no children
* Folders:

  * expandable
  * show children recursively

### Benefit:

* Clear separation of responsibilities per node type
* Improves readability and maintainability

## 6. Navigation Design (React Router)

```tsx
<Link to={`/tree/${currentPath}`} state={{ node, fullPath: currentPath }}>
```

### Key decisions:

* Use **dynamic routing with path-based URLs**
* Pass additional data via `state`

### Benefits:

* Fast navigation (no recomputation needed)
* Clean URLs representing structure
* Enables deep linking

## 7. Expand/Collapse Interaction

```tsx
<button onClick={() => setExpanded(prev => !prev)}>
```

### Design:

* Toggle-based UI interaction
* Simple boolean state

### Why:

* Minimal complexity
* Immediate feedback to user

## 8. Separation of Concerns

| Responsibility           | Location         |
| ------------------------ | ---------------- |
| Tree structure traversal | TreeNode         |
| Navigation               | Link             |
| State (expanded)         | local            |
| Data source              | external (props) |

### Benefit:

* High reusability
* Easy to test in isolation


#  Architectural Decisions – NodeDetails Component

## 1. Component Responsibility

The `NodeDetails` component is responsible for displaying **detailed information about a selected node** (file or folder).

Its responsibilities include:

* Rendering metadata of a node
* Differentiating between file and folder views
* Providing navigation back to the tree
* Enabling navigation to child nodes

## 2. Data Access Strategy (Routing State)

```ts
const location = useLocation();
const state: LocationState = location.state;
```

### Key decision:

* Use **React Router `state`** to pass node data between routes

### Benefits:

* Avoids recomputation (no need to traverse tree again)
* Improves performance
* Keeps component simple and focused

### Trade-off:

* `location.state` is **not persistent**
* Data is lost on page refresh or direct URL access

## 3. Type-Safe State Modeling

```ts
interface LocationState {
  node: FileNode | FolderNode;
  fullPath: string;
}
```

### Purpose:

* Strong typing for navigation state
* Ensures safe access to node properties

### Benefit:

* Reduces runtime errors
* Improves developer experience

## 4. Conditional Rendering (File vs Folder)

```ts
state.node.type === "file" ? (...) : (...)
```

### Decision:

* Use **type-based branching** for UI rendering

### File view:

* Name
* Size (formatted)
* Full path

### Folder view:

* Name
* Number of children
* Total folder size
* List of child links

### Benefit:

* Clear separation of logic
* Tailored UI per node type

## 5. Utility Function Abstraction

```ts
formatSize(state.node.size)
countFolderSize(state.node)
```

### Decision:

* Move logic into **utility functions**

### Why:

* Separation of concerns
* Reusability across components
* Cleaner JSX

### Examples:

* `formatSize` → presentation logic
* `countFolderSize` → business logic (recursive computation)

## 6. Children Navigation Design

```tsx
<Link to={`${childPath}`} state={{ node: child, fullPath: childPath }}>
```

### Key decisions:

* Generate links dynamically based on `fullPath`
* Pass child node via `state`

### Benefits:

* Enables **deep navigation**
* Reuses routing mechanism consistently
* Avoids recomputation in child views


## 7. Path Construction Strategy

```ts
const childPath = `${state.fullPath}/${child.name}`;
```

### Purpose:

* Maintain consistent hierarchical navigation
* Ensure URLs reflect tree structure

### Benefit:

* Predictable and human-readable URLs


## 8. Navigation UX

```tsx
<Link to={"/tree"}>Back to tree explorer</Link>
```

### Decision:

* Provide explicit navigation back to main tree

### Benefit:

* Improves usability
* Prevents user from getting stuck in deep views

## 9. Conditional Rendering for Data Availability

```tsx
state ? (...) : <p>No data can be provided...</p>
```

### Purpose:

* Guard against missing `location.state`

### Why:

* Handles edge cases (e.g. direct URL access)

## 10. Rendering Lists

```tsx
state.node.children.map(...)
```

### Design:

* Iterate over children to render links

### Key:

```tsx
key={child.name}
```

## 11. Separation of Concerns

| Responsibility   | Location    |
| ---------------- | ----------- |
| Data retrieval   | useLocation |
| Presentation     | JSX         |
| Size calculation | utils       |
| Navigation       | Link        |

### Benefit:

* Clean and modular architecture
* Easy to maintain and extend

#  Architectural Decisions – SearchForm Component

## 1. Component Responsibility

The `SearchForm` component is responsible for:

* Capturing user input for search queries
* Triggering search logic across the file tree
* Persisting search input and results
* Communicating results back to the parent (`FileTree`)

It acts as a **controlled input + action trigger**, separating user interaction from data rendering.

## 2. Controlled Input Strategy

```ts
const [inputValue, setInputValue] = useState<string>("");
```

### Decision:

* Use a **controlled component** for the input field

### Benefits:

* React is the single source of truth
* Enables validation, persistence, and side effects
* Keeps UI in sync with state

## 3. Persistence Layer (localStorage)

```ts
localStorage.setItem("inputValue", JSON.stringify(e.target.value))
```

```ts
const savedInputValue = localStorage.getItem("inputValue");
```

### Purpose:

* Persist search input across reloads

### Design reasoning:

* Improves UX (user doesn’t lose query)
* Keeps behavior consistent with stored `searchResults`

## 4. Side Effects Handling

```ts
useEffect(() => {
  const savedInputValue = localStorage.getItem("inputValue");
  if (savedInputValue) setInputValue(JSON.parse(savedInputValue));
}, []);
```

### Decision:

* Load persisted input **once on mount**

### Benefit:

* Clean separation between rendering and side effects
* Avoids re-running logic unnecessarily

## 5. Event Handling Design

### Input change:

```ts
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

* Updates local state
* Persists value in `localStorage`

### Search trigger:

```ts
const onClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => { ... }
```

* Prevents default form submission
* Executes search function
* Updates parent state

## 6. Search Logic Delegation

```ts
searchAllNames(inputValue, loadedData)
```

### Decision:

* Delegate search to a **utility function**

### Why:

* Separation of concerns
* Reusable logic
* Keeps component lightweight

### Benefit:

* Component focuses only on UI + orchestration

## 7. Parent-Child Communication

```ts
setSearchResults(searchedNames);
```

### Design:

* Lift state up to parent (`FileTree`)

### Pattern:

* **Unidirectional data flow**

```id="flow3"
SearchForm → setSearchResults → FileTree → render results
```

### Benefit:

* Centralized state management
* Easier to maintain and debug

## 8. Search Results Persistence

```ts
localStorage.setItem("searchResults", JSON.stringify(searchedNames));
```

### Purpose:

* Preserve results across reload

# What would be done with more time

### UI/UX Improvements

    1) Editing file tree by dragging file or folder from one layer to another
    2) Track tree expanding, save the expanded tree state -> It lets user to open a specific file detail and come back to general tree view with the same expanded state.
    3) Replace static images with icon library (e.g. Lucide)
    4) Add loading states
    5) Make responsive UI for all devices

### JSON structure validator
    
    1) Validate uploaded JSON file content.

### Advanced Search System
Enhancements:
  
    1) Debounced live search (no button needed)
    2) Highlight matches in tree

### Backend integration

    1) User sessions
    2) Export/import tree













/*  
    ** Why react?
    
    1 - React is Composable: Components are the building blocks of any React
    application, and a single app usually consists of multiple components.

    2 - Faster performance: React uses Virtual DOM, thereby creating web
    applications faster. Virtual DOM compares the components’ previous states
    and updates only the items in the Real DOM that were changed, instead of
    updating all of the components again, as conventional web applications do.

    3 - React is Declarative: React is easy to learn, mostly combining basic HTML
    and JavaScript concepts with some beneficial additions. Still, as is the case
    with other tools and frameworks, you have to spend some time to get a proper
    understanding of React’s library.

    4 - Dedicated tools for easy debugging: Facebook has released a Chrome
    extension that can be used to debug React applications. This makes the
    process of debugging React web applications faster and easier.


    ** Types of components - 
        1 - Class Based components
        2 - Function based components. Function based components can be declared as normal function based and as arrow based function
    

    ** How JSX is converted to HTML for rendering?
        1 - React uses a library called babel for the conversion of JSX to render form.

    
    ** Why JSX ?
        1 - React embraces the fact that rensering logic should be coupled with UI Logic.
        2 - React seperates concerns instead of seperating technologies.
        3 - It allows react to show more useful errors and warning messages.


    **Rendering Arrays and Objects
        1 - use map function
            {arr.map((num) => <h2>{num}</h2>)}

        2 - Loops do not return any value. So they are not valid expressions and cannot be used to render JSX. Objects are not
            valid as a react child. We cannot directly render them inside JSX.    

        3 - Array Filter example
            const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
             {numbers.filter((arr) => 
            	arr%2 === 0
            ).map((arr) => 
            	<h1>{arr}</h1>
            )}


        4 - Assigning Unique Keys in React
            {cars.map((car, index) => (
                <li key = {index}> {car} </li>
            ))}
        
        5 - In javascript except - 0, null, "", false, undefined everything is true.

        

*/

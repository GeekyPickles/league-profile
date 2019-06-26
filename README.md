# Creative Project 4 Project Specification
## Overview
For your fourth Creative Project, you will create your own PHP web service available for use
with AJAX and fetch. Once again, as a Creative Project, you have
freedom to have more ownership in your work, as long as you meet the requirements listed below.

## Ideas for CP4
As a Creative Project, we encourage you to explore the new material covered in class, as well as related (but optional) content we may link to along the way, as long as you follow the CSE 154 Code Quality Guidelines and adhere to Academic Integrity policies. In past quarters, some students have built upon their Creative Project each week. You may choose to do a new website for each CP, or build on the existing project from previous CP's.

As long as you meet the requirements outlined below, you have freedom in what kind of website you create. Here are some ideas for Spring 2019 (you can also check out Autumn 2018's CP4 Showcase to see other creative ways students used APIs in their websites!):

* The code from lecture, section and lab are always good places to start. However,
if you choose to use course materials as "starter" code you **must**:
  1. cite that you are using the course code as a starting point and
  2. you must substantively change the resulting output/webpage.
* Recall that one of the benefits of writing functions in PHP instead of code you
can write in JS is that you can quickly process data with file I/O. While you are
not required to use file I/O in this CP, it can help create a pretty useful API.
As an idea, consider writing your own folders and files to process and
return data in JSON format in your API (e.g. see the random recipe generator
exercise from section, where we created a small collection of `txt` files to process
in the response).
* We've primarily practiced processing txt files and directory contents, but
depending on your own interests and project focus, you can process other files
like `.csv`, `.gcode` (3D coordinate files for
[3D Printing models](https://benjaminjurke.com/content/articles/2015/gcode-primer/)), `.pdb`
(protein code [encodings](https://en.wikipedia.org/wiki/Protein_Data_Bank_(file_format))), etc.
* This CP is designed to give you an opportunity to practice writing both client (JS) and server-side (PHP)
  code on your website. This is a great chance to think about how your project could showcase what
  you've learned so far in web programming for your own code portfolio after the quarter ends, so
  we encourage you to explore implementing different features of your web service!


## External Requirements
* Your project must include the following five files at a minimum:
  * `index.html` - main page of your website
  * `styles.css` - file to style your `.html` file
  * `main.js` - containing your JavaScript code
  * **new:** a `.php` web service your .js file fetches from with at least two different GET requests.
  * **new:** a `APIDOC.md` file to document your `.php` web service.

* Similar to HW4, you will be writing both JS and PHP to incorporate in your website, where your JS
  makes AJAX requests to **your** PHP web service which responds with information.
* JavaScript: Your website must somehow dynamically load information from the web API you've chosen and
present information from that response on the page. This requires that you must:
    * Respond to some event (whether it's the window `load` event, any UI event, or , a timer event)
    to determine when to fetch the data, and
    * Dynamically integrate the data returned from the API into the page by
    manipulating the DOM elements of the page in some non-trivial way using
    `element.appendChild`, `element.removeChild`, or
    `element.replaceChild`, and
    * Handle any errors caused in the fetch request/response process by displaying a helpful message
    to the user on the page (i.e. without using alert or console.log). To do so, you should define
    a function to implement the message displaying and pass that function as an argument in the
    fetch call chain's catch statement (see apod.js example, but your error-handling
    function should be your own).


* PHP: Your PHP web service should handle at least two **different** GET requests, one of
which outputs JSON and one which outputs plain text.
  * Details: You may choose to return your results in different formats based on the value of a  
  query parameter (e.g. `mode` or `format`), or it may include supporting different types of GET
  query parameters and returning different data in the responses as a result. You may also choose
  to have multiple GET parameters (optional or required) per query to support each of your requests
  (refer to different request parameters supported by other public APIs for ideas!)
  * Your PHP must handle at least one invalid request with a 400 error header (with content type set
    as plain text or JSON) and a descriptive
  message as demonstrated in lecture (although you are encouraged to handle more than one type of invalid request). Possible
  errors include missing required GET parameters and passing in invalid values for
   supported GET parameters.
  * You may implement other types of PHP responses for more practice before HW4. In particular, we
    encourage you to practice with file/directory processing (see lectures and sections for examples).
  * Document your API in [`APIDOC.md`](APIDOC.md).  A sample of what your documentation should look like is in [`APIDOC-sample.md`](APIDOC-sample.md). A `.md` file is written in Markdown, documentation on which
  is [here](https://docs.gitlab.com/ce/user/markdown.html).


## Internal Requirements
**Requirements continuing from previous CP/HW assignments**:
  * Your `main.js` file should be linked to your `index.html` or other `.html` files using
     `<script src="...">` in the HTML `<head>`.
  * Your `styles.css` file should be linked to your `index.html` or other `.html` files using
     `<link href="...">` in the HTML `<head>`.
  * Links to your `.html`,  `.css` and `.js` files should be **relative links**, not absolute.
  * All file names and links in your project must be lowercased (e.g. `img/puppy.jpg` but not
    `img/puppy.JPG` or `img/Puppy.jpg`).
  * You should not have any JS code in your HTML.
  * You should not have any HTML tags as strings in your JavaScript code (e.g. `el.innerHTML = "<p>Foo</p>";`).
  * Minimize styling in JS - prefer adding/removing classes to DOM elements instead, and style the
  classes in your CSS.
  * Any `.js` code you use must use the module-global pattern (recall the module-global template) and
  `"use strict";`.
  * Your page should have a `window.addEventListener("load", functionName)` as shown in
  lecture/section (use an appropriate `functionName`).
  * Any requests in your JS code must use the Fetch API template with the provided `checkStatus`
  function (which you should define in your program - you do not need to cite
    this required function). You can find a documented template for reference
    [here](https://courses.cs.washington.edu/courses/cse154/19sp/resources/assets/templates/js/ajax-template-documented.js)
    (replace all comments with your own, and add your own function names as appropriate).
  * Do not make unnecessary requests to the API. That is, there should be no code in your JS that
  requests from an API and **never** does anything with the response. Furthermore, be mindful
  about how frequently you are making requests to a web service. You will want to make sure you
  aren't making redundant requests in loops/timers (it is normal for many pages to make one or
  few more requests to get the data needed).
* Localize your JS variables as much as possible - do not use any global variables, and minimize the use of module-global variables. Do not store DOM element objects, such as those returned by the
 `document.getElementById` function, as module-global variables.  
* Limit your use of anonymous functions - meaningful behavior should be factored out with a named function

**CP4-Specific Requirements** (in addition to following the PHP section of the Code Quality Guide):
* Your PHP web service should use `isset` to check for required GET parameters before using them.
* Your PHP web service should specify the correct content type with the `header` function **before**
  outputting any response (including 400 errors), and should only set this when necessary (it's
  common for students to set this multiple times in their first PHP programs)
* Your PHP code should not generate any HTML (though you may check with instructors for
  exceptions to this rule depending on the context of your project)
* Decompose your PHP (and continue to do so for JS) by writing smaller, more generic functions that complete one task rather
than a few larger "do-everything" functions - no function should be more than 30 lines of code, and your PHP should have at least one function defined and used. Consider factoring out important behavior for your different GET requests into PHP functions.
* Limit global variables in PHP and do not use the `$GLOBAL` array.
* Similar to JS, use `===` over `==` in PHP for strict equality checks.

## Style and Documentation
**Requirements continuing from previous CP/HW assignments**:
* Your HTML, CSS, JavaScript, and PHP should demonstrate consistent and readable source code aesthetics as demonstrated in class
and detailed in the [CSE 154 Code Quality Guidelines](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/). Part of your grade will come from using consistent indentation, proper
naming conventions, curly brace locations, etc.
* Place a comment header in each file with your name, section, and a brief description of the file
 (examples have been given on previous assignments)
* Define program constants with `UPPER_CASED` naming conventions (using `const` instead of `let` in JS). Examples of common program constants include a  file path to your images if you are working with many images in your JS or an API base url as
   demonstrated in class).
* Use [JSDoc](http://usejsdoc.org/) to document your JS functions with `@param`, `@returns` as
discussed in the Code Quality Guide.
* HTML and CSS files must be well-formed and pass W3C validation.
* Your JS code must pass [JSLint](https://oxford.cs.washington.edu/cse154/jslint/) with no errors.
* To keep line lengths manageable, do not place more than one block element on the same line or begin a block element past the 100th character on a line.

**CP4-Specific Requirements** (in addition to following the PHP section of the Code Quality Guide):
* Document your PHP functions in a similar manner to our JSDoc requirements (e.g. `@param` and `@returns`). You may also use official [PHPDoc](https://en.wikipedia.org/wiki/PHPDoc) if you'd like.
* Include a brief description of your PHP web service and the parameters/responses that
  would be important for you/other developers to understand the program. See the
  [Code Quality Guide](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/php/#comments-header) for an example. Use your `APIDOC.md` for a more descriptive public documentation of your API (used by clients).
* Use proper `under_score` naming conventions for PHP variables and functions, as specified in the
  [Code Quality
  Guide](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/php/#naming-conventions).

## Grading
This CP will be out of 8 points and will likely be distributed as:
* External Correctness (4 pts) - The External Requirements listed in this document are met.
* Internal Correctness (2.5 pts) - The Internal Requirements listed in this document are met.
* Style and Documentation (1.5 pts) - The Style and Documentation requirements in this document are met.  

## Late Day Challenge
You can earn one extra late day for successfully adding a form (in a `<form>` tag) to your site that
includes a way to "submit" the information to the server. Upon submit, the form uses
the `FormData` object (as shown in [Lecture 16, slide 5](https://courses.cs.washington.edu/courses/cse154/19sp/lectures/lec16-form-requests/index.html#/5)
and AJAX Fetch with a POST request to retrieve, then modify the site in a "non trivial way."
Our definition of "non-trivial" is that it must dynamically integrate the data returned from the API
into the page by manipulating the DOM elements (similar to the base assignment using `element.appendChild`, `element.removeChild`, or
`element.replaceChild`), and you must appropriately handle errors. *Note* that we are not
expecting you to make any changes *to* the file system on the server as a result of this POST request.
You should, however, think about the types of data that could be sent via this POST request
for this challenge (as opposed to sent with a GET request).

## Academic Integrity
Creative Projects are unique in that students may look for outside resources for inspiration or assistance
in accomplishing their goals. On occasion students may wish to use portions of sample code that has been
obtained on our course website or others. In order to avoid academic misconduct for a Creative Project
in CSE 154 you must:
1. Ensure that substantive original work is submitted that can be evaluated by the course staff.
2. Cite the ideas or materials of others that are used. The citation format is not that important - as
long as the source material can be located and the citation verified (a url in a comment is generally
fine), it's OK.
3. Clearly indicate (e.g. with comments) which portions of your code are completely original and
which are used or modified from external sources, if any code is used that builds off of/is
inspired by external sources (e.g. adaption of an example CSE 154 exercise, online tutorial
you find on Bootstrap or a JS library, etc.). We will only grade your original work. Note
 that solely changing identifier names or rearranging other source material is not considered
 your original work - see the examples of appropriate use below for details.

A good analogy to this is if you were writing a history paper: You can use quotes in your paper as
long as you give attribution to the sources of the quote, but you can not write a history paper
out of the quotes of others (particularly with no citations).

Some examples of appropriate use:

* A student closely follows a tutorial to understand a new concept in web development (e.g. CSS3 animations).
The student cites the tutorial they used in the file header then substantially modifies the tutorial code to
include what is specified for the Creative Project assignment, documenting which portions of the code are
their own so TAs know which portions to grade (and to determine whether the material cited as being learned
from the tutorial is sufficiently adapted to be considered the student’s own work).
* A student is having difficulty styling their website. They look for a solution and find one on a site
such as Stack Overflow. The student uses the code they find in their solution, documents that small
piece of code was not their own with a comment that includes where it was found. The TAs will not
use that portion of the code in grading.

Students with questions about any specific situation should ask the instructors for clarification.

More information on the CSE 154 course policy is here, the Paul G Allen School also has an entire page on
[Academic Misconduct](https://www.cs.washington.edu/academics/misconduct) within the context of
Computer Science, and the University of Washington has an entire page on how
[Academic Misconduct](https://www.washington.edu/cssc/for-students/academic-misconduct/) is
handled on their [Community Standards and Student Conduct](https://www.washington.edu/cssc/).
Please acquaint yourself with both of those pages, and in particular how academic misconduct will
be reported to the University.

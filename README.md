# Yolean Backbone

To make our Backbone based code more maintainable we need:
 1. A `.mixin` as complement to `.extend`. Subclassing works for specialization but not for composition.
 2. A separation between the jQuery and browser dependent View/Router/sync stuff and the data structures Model/Controller. The latter is used server side.
 3. We don't need a default `.sync` at all.
 4. Ways to use the same backbone instance across modules, or alternatively override the default _isModel in the upcoming Backbone release. Basically anything with a `.attributes` can be considered a model and shouldn't be wrapped at `.add`.
 5. Complement Collection `.filter` and `.where` with `.subset` that returns a _connected_ Collection

This implies that the lib must extend default functionality of backbone. That goes for the re-export in bullet (4).
It should not however modify any existing functionality,
but it can export mixins that do so.

## element.all(locator)

ElementArrayFinder is used for operations on an array of elements (as opposed
to a single element).

    var listItems = element.all(by.css('.list-item'));
    var thirdItem = listItems.get(3);

As protractor use promises, this function returns a promise, which is thenable.

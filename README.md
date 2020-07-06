# weekCounter

[7/6/2020]

This application can create, edit and delete students and vacation data.
It can also fetch the current database from mongodb atlas.
Regarding creating students, the user will enter student's name and date of birth(to differentiate those with the same full name, if any),
    followed by start date and the number of weeks. And then the end date will be calculated based on the input.

    When creating and deleting students, all fields are required.
    When editing students' data, only one of their start date and end date is required as well as their name.
    
    The actual data might look weird, but that's because the insight is based on the fact:
        that the input dates will always be Mondays and that the end dates will always be Fridays.
    
        The count includes the week of the starting day, so if the input is 7/6/2020 and 2 weeks, the end date will be 7/24/2020.

    If the user adds vacation period data, then this program has to skip counting those dates
        Using the same example, if the input is 7/6/2020, 2 weeks but there is a vacation period that is 7/13/2020 - 7/17/2020 (1 week),
            the end date is 7/31/2020.
        ** This part has not been implemented yet **


    My first full stack web app, which guarantees its being error prone. But thankfully, I'm always open to suggestions
        and any type of feedback is welcome (only if given politely and reasonably). I will keep working on this to its perfection.

[Agamotto All-Seeing]

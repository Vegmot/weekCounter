// Connected. Checked.

function createData() {

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    let firstName = $("#create-student-fName").val().toLowerCase();
    let lastName = $("#create-student-lName").val().toLowerCase();

    firstName = capitalizeFirstLetter(firstName);
    lastName = capitalizeFirstLetter(lastName);

    let fullName = firstName + " " + lastName;
    let numWeeks = Number($("#number-of-weeks").val());

    // keeping original data
    const originalSMonth = Number($("#starting-month").val());
    const originalSDay = Number($("#starting-day").val());
    const originalSYear = Number($("#starting-year").val());

    // the actual data that is going to be used
    let sMonth = Number($("#starting-month").val());
    let sDay = Number($("#starting-day").val());
    let sYear = Number($("#starting-year").val());

    sDay += 4;
    sDay += (numWeeks - 1) * 7;

    for (let i = 0; i < (numWeeks - 1) * 7; i++) {
        if ((sMonth === 1 || sMonth === 3 || sMonth === 5 || sMonth === 7 || sMonth === 8 ||
                sMonth === 10 || sMonth === 12) && sDay > 31) {
            sMonth += 1;
            sDay -= 31;

        } else if ((sMonth === 4 || sMonth === 6 || sMonth === 9 || sMonth === 11) && sDay > 30) {
            sMonth += 1;
            sDay -= 30;

        } else if (sMonth === 2) {

            if (((sYear % 4 === 0 && sYear % 100 !== 0) || sYear % 400 === 0) && sDay > 29) {
                sMonth += 1;
                sDay -= 29;

            } else if (sDay > 28) {
                sMonth += 1;
                sDay -= 28;
            }

        } else if (sMonth > 12) {
            sYear += 1;
            sMonth = 1;
        }
    }

}

// Weekcounter algorithm copied from the original one I wrote in C++
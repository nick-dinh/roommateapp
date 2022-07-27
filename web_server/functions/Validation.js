// input validation (only numbers, letters, spaces, underscores, and periods are allowed in input)
function validate(input) {
    return /^[a-zA-Z0-9_. ]+$/.test(input)
}
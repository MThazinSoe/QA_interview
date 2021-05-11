function sum(a, b) {
    return a + b;
}

test("add 1 + 2 to equals to 3", () => {
    expect(sum(1, 2)).toBe(3);
});

class Solution {
    public int fib(int n) {
        if (n < 2) return n;                 // F(0) = 0, F(1) = 1
        return fib(n - 1) + fib(n - 2);
    }
}
